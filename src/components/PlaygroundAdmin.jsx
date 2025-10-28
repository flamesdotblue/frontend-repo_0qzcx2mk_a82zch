import { useEffect, useMemo, useState } from 'react';
import { Rocket, Flag, Settings, User, Lock, LogOut, Plus, Trash2, Download, CheckCircle2, AlertTriangle, History as HistoryIcon, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Simple API helper with JSON
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

function usePersistentState(key, initial) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

// Authentication connected to backend
function AuthPanel({ user, setUser }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('participant');
  const [loading, setLoading] = useState(false);

  const onAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        const data = await api('/auth/signup', { method: 'POST', body: { email, password, name, role } });
        setUser(data);
      } else {
        const data = await api('/auth/login', { method: 'POST', body: { email, password } });
        setUser(data);
      }
    } catch (err) {
      alert('Auth error: ' + String(err.message || err));
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm">
          <User className="h-4 w-4" /> {user.email}
          <span className="px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-700">{user.role}</span>
        </div>
        <button
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-sm"
          onClick={() => setUser(null)}
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onAuth} className="grid sm:grid-cols-5 gap-2 w-full">
      {mode === 'signup' && (
        <input type="text" placeholder="Name" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500" value={name} onChange={(e) => setName(e.target.value)} />
      )}
      <input required type="email" placeholder="you@example.org" className="sm:col-span-2 w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input required type="password" placeholder="Password" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500" value={password} onChange={(e) => setPassword(e.target.value)} />
      {mode === 'signup' && (
        <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="participant">Participant</option>
          <option value="admin">Admin</option>
        </select>
      )}
      <div className="flex gap-2">
        <button type="submit" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-black whitespace-nowrap" disabled={loading}>
          <Lock className="h-4 w-4" /> {mode === 'login' ? 'Login' : 'Sign up'}
        </button>
        <button type="button" className="text-sm underline" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Login'}
        </button>
      </div>
    </form>
  );
}

function FlagModal({ open, onClose, onSubmit }) {
  const [type, setType] = useState('Harmful Content');
  const [severity, setSeverity] = useState(5);
  const [comments, setComments] = useState('');

  useEffect(() => { if (!open) { setType('Harmful Content'); setSeverity(5); setComments(''); } }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md mx-auto rounded-xl bg-white shadow-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Flag This Response</h3>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Type / Category</label>
            <select className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300" value={type} onChange={(e) => setType(e.target.value)}>
              {['Harmful Content','Misinformation','Bias/Discrimination','Privacy Violation','Inappropriate Response','Factual Error','Off-Topic Response'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Severity: {severity}</label>
            <input type="range" min={1} max={10} value={severity} onChange={(e) => setSeverity(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="text-sm font-medium">Additional Comments</label>
            <textarea className="mt-1 w-full h-28 px-3 py-2 rounded-md border border-gray-300" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Briefly explain the issue" />
          </div>
          <button onClick={() => onSubmit({ type, severity, comments })} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700">
            <Flag className="h-4 w-4" /> Submit Flag
          </button>
        </div>
      </div>
    </div>
  );
}

function Playground({ user, interactions, setInteractions }) {
  const [prompt, setPrompt] = useState('Explain model cards for AI systems in simple terms.');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedBlind, setSelectedBlind] = useState('alpha');
  const [customEndpoint, setCustomEndpoint] = usePersistentState('custom_endpoint', '');
  const [customKey, setCustomKey] = usePersistentState('custom_key', '');
  const [flagOpen, setFlagOpen] = useState(false);
  const [latestInteraction, setLatestInteraction] = useState(null);

  const blindMap = useMemo(() => ({
    alpha: { label: 'Model Alpha' },
    beta: { label: 'Model Beta' },
    custom: { label: 'Custom Model' },
  }), []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) { alert('Please login to submit.'); return; }
    setLoading(true);
    setResponse('');
    try {
      const data = await api('/api/generate', {
        method: 'POST',
        body: { prompt, blind: selectedBlind, custom_endpoint: selectedBlind === 'custom' ? customEndpoint : undefined, custom_key: selectedBlind === 'custom' ? customKey : undefined },
        query: { user_email: user.email },
        token: user.token,
      });
      setResponse(data.response);
      setLatestInteraction(data);
      const fresh = await api('/interactions', { query: { user_email: user.email }, token: user.token });
      setInteractions(fresh);
    } catch (err) {
      setResponse(String(err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="playground" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">AI Playground</h2>
            <p className="text-gray-600 mt-1">Blind-test models, collect outputs, and flag concerns.</p>
          </div>
          <div className="hidden md:block"><AuthPanel user={user} setUser={() => {}} /></div>
        </div>

        <form onSubmit={onSubmit} className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="rounded-xl border border-gray-200 p-4 bg-white">
              <label className="text-sm font-medium text-gray-800">Prompt</label>
              <textarea className="mt-2 w-full h-36 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500" value={prompt} onChange={(e) => setPrompt(e.target.value)} required />
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <AlertTriangle className="h-4 w-4 text-amber-600" /> Avoid entering personal or sensitive data.
                </div>
                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-black" disabled={loading}>
                  {loading ? (<span className="inline-flex items-center gap-2"><span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Generating…</span>) : (<><Rocket className="h-4 w-4" /> Generate</>)}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 bg-white space-y-3">
            <label className="text-sm font-medium text-gray-800">Blind Model</label>
            <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500" value={selectedBlind} onChange={(e) => setSelectedBlind(e.target.value)}>
              <option value="alpha">Model Alpha</option>
              <option value="beta">Model Beta</option>
              <option value="custom">Custom Model</option>
            </select>
            {selectedBlind === 'custom' && (
              <div className="space-y-2">
                <div className="text-xs text-gray-600">Connect any HTTP API that accepts a JSON body with your prompt.</div>
                <input className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="https://api.my-model.com/v1/generate" value={customEndpoint} onChange={(e) => setCustomEndpoint(e.target.value)} />
                <input className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="API Key (optional)" value={customKey} onChange={(e) => setCustomKey(e.target.value)} />
                <div className="text-xs text-gray-600">Keys stay on your device. The backend only proxies your request for this call.</div>
              </div>
            )}
            <div className="rounded-md bg-gray-50 p-3 text-xs text-gray-700">
              <div className="font-medium">Blind mapping (server-managed)</div>
              <div>Alpha → provider model</div>
              <div>Beta → provider model</div>
              <div>Custom → your API</div>
            </div>
          </div>
        </form>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 rounded-xl border border-gray-200 p-4 bg-white">
            <label className="text-sm font-medium text-gray-800">Response</label>
            <div className="mt-2 min-h-[140px] whitespace-pre-wrap text-gray-800">{loading ? 'Waiting for response…' : response || '—'}</div>
            <div className="mt-3">
              <button disabled={!user || !latestInteraction} onClick={() => setFlagOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50">
                <Flag className="h-4 w-4" /> Flag This Response
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 p-4 bg-white">
            <div className="flex items-center gap-2"><HistoryIcon className="h-5 w-5 text-purple-600" /><h3 className="text-sm font-semibold">Recent</h3></div>
            <div className="mt-2 space-y-2 max-h-[220px] overflow-auto">
              {interactions.slice(0, 6).map((it) => (
                <div key={it.id} className="rounded-md border border-gray-200 p-3">
                  <div className="text-xs text-gray-500">{new Date(it.created_at || it.ts || Date.now()).toLocaleString()} • {it.blind}</div>
                  <div className="mt-1 text-sm line-clamp-2"><span className="font-medium">Prompt:</span> {it.prompt}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <FlagModal open={flagOpen} onClose={() => setFlagOpen(false)} onSubmit={async ({ type, severity, comments }) => {
          if (!user || !latestInteraction) return;
          try {
            await api('/flags', { method: 'POST', body: { interaction_id: latestInteraction.id, user_email: user.email, type, severity, comments }, token: user.token });
            alert('Flag submitted. Thank you!');
            setFlagOpen(false);
          } catch (err) {
            alert('Error submitting flag: ' + String(err.message || err));
          }
        }} />
      </div>
    </section>
  );
}

function AdminDashboard({ user }) {
  const [exercises, setExercises] = useState([]);
  const [models, setModels] = useState([]);
  const [flags, setFlags] = useState([]);
  const [stats, setStats] = useState({ users: 0, teams: 0, interactions: 0, open_flags: 0 });
  const [newExercise, setNewExercise] = useState({ title: '', endDate: '', description: '' });

  const loadAll = async () => {
    try {
      const [exs, mms, fls, st] = await Promise.all([
        api('/exercises'), api('/model-mappings'), api('/flags'), api('/admin/analytics')
      ]);
      setExercises(exs);
      setModels(mms);
      setFlags(fls);
      setStats(st);
    } catch (err) { /* ignore for first render */ }
  };

  useEffect(() => { loadAll(); }, []);

  if (!user || user.role !== 'admin') {
    return (
      <section id="admin" className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-xl border border-dashed border-gray-300 p-6 bg-white text-center">
            <div className="inline-flex items-center gap-2 text-gray-700"><Lock className="h-4 w-4" /> Admins only</div>
            <p className="text-sm text-gray-600 mt-2">Login as an admin to view dashboards and manage exercises.</p>
          </div>
        </div>
      </section>
    );
  }

  const addExercise = async (e) => {
    e.preventDefault();
    if (!newExercise.title) return;
    const created = await api('/exercises', { method: 'POST', body: { title: newExercise.title, description: newExercise.description, end_date: newExercise.endDate, guidelines: [] }, token: user.token });
    setExercises([created, ...exercises]);
    setNewExercise({ title: '', endDate: '', description: '' });
  };

  const removeExercise = async (id) => {
    await api(`/exercises/${id}`, { method: 'DELETE', token: user.token });
    setExercises(exercises.filter(e => e.id !== id));
  };

  const removeFlag = async (id) => {
    await api(`/flags/${id}/resolve`, { method: 'POST', token: user.token });
    setFlags(flags.map(f => f.id === id ? { ...f, status: 'resolved' } : f));
  };

  const exportJSON = async () => {
    const data = await api('/export/json');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'redteam_export.json'; a.click(); URL.revokeObjectURL(url);
  };

  const exportCSV = async () => {
    const csv = await api('/export/csv');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'interactions.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <section id="admin" className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Admin Dashboard</h2>
            <p className="text-gray-600 mt-1">Manage exercises, models, flags, and exports.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportJSON} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-sm"><Download className="h-4 w-4" /> JSON</button>
            <button onClick={exportCSV} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-sm"><Download className="h-4 w-4" /> CSV</button>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <Stat title="Users" value={stats.users} />
          <Stat title="Teams" value={stats.teams} />
          <Stat title="Interactions" value={stats.interactions} />
          <Stat title="Open Flags" value={stats.open_flags} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-200 p-4 bg-white">
            <div className="flex items-center gap-2"><Settings className="h-4 w-4 text-purple-600" /><h3 className="font-semibold">Exercises</h3></div>
            <form className="grid sm:grid-cols-3 gap-2 mt-3" onSubmit={addExercise}>
              <input className="px-3 py-2 rounded-md border border-gray-300" placeholder="Title" value={newExercise.title} onChange={(e) => setNewExercise({ ...newExercise, title: e.target.value })} />
              <input className="px-3 py-2 rounded-md border border-gray-300" placeholder="End date" value={newExercise.endDate} onChange={(e) => setNewExercise({ ...newExercise, endDate: e.target.value })} />
              <div className="flex gap-2">
                <input className="flex-1 px-3 py-2 rounded-md border border-gray-300" placeholder="Short description" value={newExercise.description} onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })} />
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-900 text-white hover:bg-black"><Plus className="h-4 w-4" /> Add</button>
              </div>
            </form>
            <div className="mt-3 space-y-2">
              {exercises.map(ex => (
                <div key={ex.id} className="flex items-start justify-between gap-3 rounded-md border border-gray-200 p-3">
                  <div>
                    <div className="font-medium">{ex.title} <span className="text-xs text-gray-500">{ex.end_date}</span></div>
                    <div className="text-sm text-gray-600">{ex.description}</div>
                  </div>
                  <button className="p-2 rounded-md hover:bg-gray-50" onClick={() => removeExercise(ex.id)}><Trash2 className="h-4 w-4 text-gray-600" /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 bg-white">
            <div className="flex items-center gap-2"><Flag className="h-4 w-4 text-rose-600" /><h3 className="font-semibold">Flag Review</h3></div>
            <div className="mt-3 space-y-2 max-h-[360px] overflow-auto">
              {flags.length === 0 && <div className="text-sm text-gray-600">No flags yet.</div>}
              {flags.map(f => (
                <div key={f.id} className="rounded-md border border-gray-200 p-3">
                  <div className="text-xs text-gray-500">{new Date(f.created_at || Date.now()).toLocaleString()} • {f.user_email}</div>
                  <div className="text-sm"><span className="font-medium">Type:</span> {f.type} • <span className="font-medium">Severity:</span> {f.severity} • <span className="font-medium">Status:</span> {f.status}</div>
                  {f.comments && <div className="text-sm mt-1">{f.comments}</div>}
                  <div className="mt-2 flex gap-2">
                    {f.status !== 'resolved' && (
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-sm" onClick={() => removeFlag(f.id)}>
                        <CheckCircle2 className="h-4 w-4" /> Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2"><Settings className="h-4 w-4 text-purple-600" /><h3 className="font-semibold">Blind Model Mapping</h3></div>
          <div className="mt-3 grid md:grid-cols-2 gap-3">
            {models.map(m => (
              <div key={m.id} className="rounded-md border border-gray-200 p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm"><span className="font-medium">{m.blind}</span> → {m.provider} <span className="text-gray-500">{m.model}</span></div>
                  <div className="text-xs text-gray-600">Managed on server to preserve blindness during analysis.</div>
                </div>
                <button className="p-2 rounded-md hover:bg-gray-50" onClick={async () => { await api(`/model-mappings/${m.id}`, { method: 'DELETE', token: user.token }); setModels(models.filter(x => x.id !== m.id)); }}><Trash2 className="h-4 w-4 text-gray-600" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 bg-white">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

export default function PlaygroundAdmin() {
  const [user, setUser] = usePersistentState('session_user', null);
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (user?.email) {
        try {
          const data = await api('/interactions', { query: { user_email: user.email } });
          setInteractions(data);
        } catch {}
      }
    };
    init();
  }, [user?.email]);

  return (
    <div>
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-200 text-purple-700 bg-purple-50 text-xs">
              <User className="h-4 w-4" /> Sign in to participate and access admin tools
            </div>
            <AuthPanel user={user} setUser={setUser} />
          </div>
        </div>
      </section>

      <Playground user={user} interactions={interactions} setInteractions={setInteractions} />
      <AdminDashboard user={user} />
    </div>
  );
}
