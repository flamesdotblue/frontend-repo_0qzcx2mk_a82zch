import { useEffect, useMemo, useState } from 'react';
import { Filter, CalendarDays, Target, Bolt, CheckCircle2 } from 'lucide-react';

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
  return user;
}

export default function ExerciseFilter() {
  const user = useSession();
  const [exercises, setExercises] = useState([]);
  const [status, setStatus] = useState('all');
  const [endBy, setEndBy] = useState('');
  const [selected, setSelected] = useState(() => {
    try { const s = localStorage.getItem('selected_exercise'); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [seedStatus, setSeedStatus] = useState('idle');
  const [seedMsg, setSeedMsg] = useState('');

  useEffect(() => { localStorage.setItem('selected_exercise', JSON.stringify(selected)); }, [selected]);

  useEffect(() => {
    const load = async () => {
      try { const data = await api('/exercises'); setExercises(data || []); } catch {}
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const now = endBy ? new Date(endBy) : null;
    return exercises.filter(ex => {
      const okStatus = status === 'all' || (status === 'active' ? !ex.end_date || new Date(ex.end_date) >= new Date() : (ex.end_date && new Date(ex.end_date) < new Date()));
      const okEnd = now ? (ex.end_date && new Date(ex.end_date) <= now) : true;
      return okStatus && okEnd;
    });
  }, [exercises, status, endBy]);

  const seedMappings = async () => {
    setSeedStatus('loading'); setSeedMsg('');
    try {
      const existing = await api('/model-mappings');
      const blinds = new Set((existing || []).map(m => m.blind));
      const toCreate = [];
      if (!blinds.has('alpha')) toCreate.push({ blind: 'alpha', provider: 'OpenAI', model: 'gpt-4o-mini', api_key_env: 'OPENAI_API_KEY' });
      if (!blinds.has('beta')) toCreate.push({ blind: 'beta', provider: 'Anthropic', model: 'claude-3-haiku-20240307', api_key_env: 'ANTHROPIC_API_KEY' });
      for (const m of toCreate) { await api('/model-mappings', { method: 'POST', body: m, token: user?.token }); }
      setSeedStatus('done'); setSeedMsg(toCreate.length ? 'Default mappings created.' : 'Mappings already present.');
    } catch (err) {
      setSeedStatus('error'); setSeedMsg(String(err.message || err));
    }
  };

  return (
    <section id="exercises" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Exercises</h2>
            <p className="text-gray-600 mt-1">Pick an exercise to focus your red-teaming. Your selection is saved for the playground.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={seedMappings} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-sm">
              <Bolt className="h-4 w-4 text-purple-600" /> Seed models
            </button>
            {seedStatus === 'done' && <span className="inline-flex items-center gap-1 text-emerald-700 text-sm"><CheckCircle2 className="h-4 w-4" /> {seedMsg}</span>}
            {seedStatus === 'error' && <span className="text-rose-700 text-sm">{seedMsg}</span>}
            {seedStatus === 'loading' && <span className="text-sm text-gray-600">Seeding…</span>}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <select className="px-3 py-2 rounded-md border border-gray-300" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
          </select>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gray-500" />
            <input type="date" className="flex-1 px-3 py-2 rounded-md border border-gray-300" value={endBy} onChange={(e) => setEndBy(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-gray-500" />
            <select className="flex-1 px-3 py-2 rounded-md border border-gray-300" value={selected?.id || ''} onChange={(e) => setSelected(filtered.find(x => x.id === e.target.value) || null)}>
              <option value="">Select exercise…</option>
              {filtered.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          {selected ? (
            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
              <div className="font-semibold">Selected: {selected.title}</div>
              <div className="text-sm text-gray-700 mt-1">{selected.description || 'No description'}</div>
              {selected.end_date && <div className="text-xs text-gray-600 mt-1">Ends by {new Date(selected.end_date).toLocaleDateString()}</div>}
            </div>
          ) : (
            <div className="text-sm text-gray-600">No exercise selected.</div>
          )}
        </div>
      </div>
    </section>
  );
}
