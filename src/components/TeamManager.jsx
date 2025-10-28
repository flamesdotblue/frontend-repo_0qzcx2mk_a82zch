import { useEffect, useMemo, useState } from 'react';
import { Users, PlusCircle, UserPlus, CheckCircle2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

async function api(path, { method = 'GET', body, token, query } = {}) {
  const url = new URL(`${API_BASE}${path}`);
  if (query) Object.entries(query).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

function useSession() {
  const [user, setUser] = useState(() => {
    try { const s = localStorage.getItem('session_user'); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  useEffect(() => {
    const onStorage = (e) => { if (e.key === 'session_user') { try { setUser(e.newValue ? JSON.parse(e.newValue) : null); } catch {} } };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return [user, (val) => { setUser(val); try { localStorage.setItem('session_user', JSON.stringify(val)); } catch {} }];
}

export default function TeamManager() {
  const [user, setUser] = useSession();
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const teamId = user?.team_id;

  useEffect(() => {
    const loadMembers = async () => {
      if (!user?.token || !user?.team_id) { setMembers([]); return; }
      try {
        // Approximate member list by collecting unique user_emails from team interactions
        const interactions = await api('/interactions', { query: { team_id: user.team_id }, token: user.token });
        const uniq = Array.from(new Set(interactions.map((i) => i.user_email).filter(Boolean)));
        setMembers(uniq);
      } catch {
        setMembers([]);
      }
    };
    loadMembers();
  }, [user?.team_id, user?.token]);

  const createTeam = async (e) => {
    e.preventDefault();
    if (!user?.token) { alert('Please login first.'); return; }
    setLoading(true);
    try {
      const team = await api('/teams', { method: 'POST', body: { name: teamName }, token: user.token });
      const joined = await api('/teams/join', { method: 'POST', body: { team_id: team.id, user_email: user.email }, token: user.token });
      const next = { ...user, team_id: joined.team_id };
      setUser(next);
      alert('Team created and joined successfully.');
    } catch (err) {
      alert('Error creating team: ' + String(err.message || err));
    } finally {
      setLoading(false);
      setTeamName('');
    }
  };

  const joinTeam = async (e) => {
    e.preventDefault();
    if (!user?.token) { alert('Please login first.'); return; }
    setLoading(true);
    try {
      const joined = await api('/teams/join', { method: 'POST', body: { team_id: teamCode, user_email: user.email }, token: user.token });
      const next = { ...user, team_id: joined.team_id };
      setUser(next);
      alert('Joined team successfully.');
    } catch (err) {
      alert('Error joining team: ' + String(err.message || err));
    } finally {
      setLoading(false);
      setTeamCode('');
    }
  };

  return (
    <section id="teams" className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Team Management</h2>
            <p className="text-gray-600 mt-1">Create a team or join an existing one to collaborate on flags and exercises.</p>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-gray-700">
            <Users className="h-5 w-5 text-purple-600" />
            {teamId ? (<span>Team: <span className="font-medium">{teamId}</span></span>) : (<span>No team yet</span>)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={createTeam} className="rounded-xl border border-gray-200 p-4 bg-white space-y-3">
            <div className="font-semibold flex items-center gap-2"><PlusCircle className="h-4 w-4 text-purple-600" /> Create Team</div>
            <input className="w-full px-3 py-2 rounded-md border border-gray-300" placeholder="Team name" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-black" disabled={loading}>
              <CheckCircle2 className="h-4 w-4" /> Create & Join
            </button>
            <div className="text-xs text-gray-600">Your team ID will be generated; share it with teammates to join.</div>
          </form>

          <form onSubmit={joinTeam} className="rounded-xl border border-gray-200 p-4 bg-white space-y-3">
            <div className="font-semibold flex items-center gap-2"><UserPlus className="h-4 w-4 text-purple-600" /> Join Team</div>
            <input className="w-full px-3 py-2 rounded-md border border-gray-300" placeholder="Team ID" value={teamCode} onChange={(e) => setTeamCode(e.target.value)} required />
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-black" disabled={loading}>
              <CheckCircle2 className="h-4 w-4" /> Join Team
            </button>
            <div className="text-xs text-gray-600">Enter the team ID shared by your teammate or admin.</div>
          </form>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 p-4 bg-white">
          <div className="font-semibold">Team Members</div>
          {teamId ? (
            <div className="mt-2 grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {members.length === 0 && <div className="text-sm text-gray-600">No members discovered yet. Once teammates generate or flag, they will appear here.</div>}
              {members.map((m) => (
                <div key={m} className="rounded-md border border-gray-200 p-2 text-sm">{m}</div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600 mt-2">Join or create a team to see members.</div>
          )}
        </div>
      </div>
    </section>
  );
}
