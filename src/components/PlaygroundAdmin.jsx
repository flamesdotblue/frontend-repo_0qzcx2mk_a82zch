import { useEffect, useMemo, useState } from 'react';
import { Rocket, Flag, Settings, User, Lock, LogOut, Plus, Trash2, Download, CheckCircle2, AlertTriangle, History as HistoryIcon } from 'lucide-react';

// Utility: simple ID generator
const uid = () => Math.random().toString(36).slice(2, 10);

// Local storage helpers for demo persistence
const load = (k, fallback) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// Inline Auth Panel (mock). Integrate your auth backend here.
function AuthPanel({ user, setUser }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('participant');
  const [loading, setLoading] = useState(false);

  const onAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Integration note:
    // Replace the block below with calls to Flames.blue auth system.
    // Expected shape: setUser({ id, email, role, token }) and persist securely.
    setTimeout(() => {
      const fakeUser = { id: uid(), email, role };
      setUser(fakeUser);
      save('demo_user', fakeUser);
      setLoading(false);
    }, 600);
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
          onClick={() => { setUser(null); localStorage.removeItem('demo_user'); }}
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onAuth} className="grid sm:grid-cols-4 gap-2">
      <input
        required
        type="email"
        placeholder="you@example.org"
        className="sm:col-span-2 w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        required
        type="password"
        placeholder="Password"
        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-2">
        <select
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="participant">Participant</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-black whitespace-nowrap"
          disabled={loading}
        >
          <Lock className="h-4 w-4" /> {mode === 'login' ? 'Login' : 'Sign up'}
        </button>
      </div>
      <div className="sm:col-span-4 text-xs text-gray-600">
        <button type="button" className="underline" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Login'}
        </button>
        <span className="ml-2 text-gray-500">Demo auth stores session locally for this preview.</span>
      </div>
    </form>
  );
}

// Playground for testing models with blind labels and flagging
function Playground({ user, interactions, setInteractions, flags, setFlags }) {
  const [prompt, setPrompt] = useState('Explain model cards for AI systems in simple terms.');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedBlind, setSelectedBlind] = useState('alpha'); // alpha | beta | custom
  const [customEndpoint, setCustomEndpoint] = useState(load('custom_endpoint', 'https://api.your-model.example/v1/generate'));
  const [customKey, setCustomKey] = useState(load('custom_key', '')); // never store real keys in production

  // Blind mapping (demo). In production, resolve on backend to preserve blindness.
  const blindMap = useMemo(() => ({
    alpha: { label: 'Model Alpha', provider: 'OpenAI', model: 'gpt-4o' },
    beta: { label: 'Model Beta', provider: 'Anthropic', model: 'claude-3-opus' },
    custom: { label: 'Custom Model', provider: 'Custom', model: 'byo' },
  }), []);

  // Simulated model call for demo; replace with backend proxy calls.
  const callModel = async ({ modelKey, input }) => {
    // Integration notes:
    // 1) Send requests to your FastAPI backend to call providers (OpenAI, Anthropic, Google) securely.
    // 2) For custom models, post to customEndpoint with Authorization: Bearer customKey if required.
    // 3) Store { userId, exerciseId?, blindLabel, provider, model, prompt, response, ts } server-side.

    if (modelKey === 'custom') {
      // Example on how to hit a custom endpoint (commented for safety):
      // const res = await fetch(customEndpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', ...(customKey ? { Authorization: `Bearer ${customKey}` } : {}) },
      //   body: JSON.stringify({ prompt: input })
      // });
      // const data = await res.json();
      // return data.output || JSON.stringify(data);
    }

    // Demo stub response
    return `Demo response from ${blindMap[modelKey].label}:\n\n` +
      '• Summary: This is a simulated output for preview.\n' +
      '• Note: Connect real providers via backend for production.\n' +
      '• Tip: Use the flag form below to report issues.';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) { alert('Please login to submit.'); return; }
    setLoading(true);
    setResponse('');
    // persist custom fields (demo)
    save('custom_endpoint', customEndpoint);
    save('custom_key', customKey);

    const text = await callModel({ modelKey: selectedBlind, input: prompt });
    setResponse(text);
    const record = {
      id: uid(),
      userId: user.id,
      email: user.email,
      blind: selectedBlind,
      provider: blindMap[selectedBlind].provider,
      model: blindMap[selectedBlind].model,
      prompt,
      response: text,
      ts: new Date().toISOString(),
    };
    const next = [record, ...interactions];
    setInteractions(next);
    save('demo_interactions', next);
    setLoading(false);
  };

  const submitFlag = (interactionId, flag) => {
    if (!user) { alert('Please login to flag.'); return; }
    const entry = { id: uid(), interactionId, userId: user.id, email: user.email, ...flag, status: 'open', ts: new Date().toISOString() };
    const next = [entry, ...flags];
    setFlags(next);
    save('demo_flags', next);
  };

  return (
    <section id="playground" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">AI Playground</h2>
            <p className="text-gray-600 mt-1">Blind-test models, collect outputs, and flag concerns.</p>
          </div>
          <div className="hidden md:block"><AuthPanel user={user} setUser={setUser => {}} /></div>
        </div>

        {/* Compose input area */}
        <form onSubmit={onSubmit} className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="rounded-xl border border-gray-200 p-4 bg-white">
              <label className="text-sm font-medium text-gray-800">Prompt</label>
              <textarea
                className="mt-2 w-full h-36 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <AlertTriangle className="h-4 w-4 text-amber-600" /> Avoid entering personal or sensitive data.
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-black"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2"><span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Generating…</span>
                  ) : (
                    <><Rocket className="h-4 w-4" /> Generate</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right rail: model selection */}
          <div className="rounded-xl border border-gray-200 p-4 bg-white space-y-3">
            <label className="text-sm font-medium text-gray-800">Blind Model</label>
            <select
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedBlind}
              onChange={(e) => setSelectedBlind(e.target.value)}
            >
              <option value="alpha">Model Alpha</option>
              <option value="beta">Model Beta</option>
              <option value="custom">Custom Model</option>
            </select>

            {selectedBlind === 'custom' && (
              <div className="space-y-2">
                <div className="text-xs text-gray-600">Connect any HTTP API that accepts a JSON body with your prompt.</div>
                <input
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://api.my-model.com/v1/generate"
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                />
                <input
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="API Key (optional)"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                />
                <div className="text-xs text-gray-600">Keys are stored locally for this demo. In production, store keys server-side and proxy requests.</div>
              </div>
            )}

            <div className="rounded-md bg-gray-50 p-3 text-xs text-gray-700">
              <div className="font-medium">Blind mapping (example)</div>
              <div>Alpha → OpenAI GPT-4</div>
              <div>Beta → Anthropic Claude</div>
              <div>Custom → Your API</div>
            </div>
          </div>
        </form>

        {/* Output and flagging */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 rounded-xl border border-gray-200 p-4 bg-white">
            <label className="text-sm font-medium text-gray-800">Response</label>
            <div className="mt-2 min-h-[140px] whitespace-pre-wrap text-gray-800">{loading ? 'Waiting for response…' : response || '—'}</div>
          </div>
          <FlagPanel
            latestResponse={response}
            latestInteraction={interactions[0]}
            onSubmit={(payload) => latestResponse && interactions[0] && submitFlag(interactions[0].id, payload)}
          />
        </div>

        {/* History */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-3">
            <HistoryIcon className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Your recent interactions</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {interactions.slice(0, 6).map((it) => (
              <div key={it.id} className="rounded-lg border border-gray-200 p-4 bg-white">
                <div className="text-xs text-gray-500">{new Date(it.ts).toLocaleString()} • {it.blind}</div>
                <div className="mt-2 text-sm"><span className="font-medium">Prompt:</span> {it.prompt}</div>
                <div className="mt-2 text-sm whitespace-pre-wrap"><span className="font-medium">Response:</span> {it.response}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FlagPanel({ latestResponse, latestInteraction, onSubmit }) {
  const [type, setType] = useState('harm'); // harm | bias | privacy | other
  const [severity, setSeverity] = useState('medium'); // low | medium | high
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!latestResponse || !latestInteraction) return;
    setSubmitting(true);
    const payload = { type, severity, comments };
    onSubmit(payload);
    setComments('');
    setSubmitting(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 p-4 bg-white">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2"><Flag className="h-4 w-4 text-rose-600" /> Flag output</label>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <select className="px-3 py-2 rounded-md border border-gray-300" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="harm">Harm</option>
          <option value="bias">Bias</option>
          <option value="privacy">Privacy</option>
          <option value="other">Other</option>
        </select>
        <select className="px-3 py-2 rounded-md border border-gray-300" value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <textarea
          placeholder="Optional comments (what is harmful or biased?)"
          className="col-span-2 h-24 px-3 py-2 rounded-md border border-gray-300"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        <button
          onClick={submit}
          className="col-span-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700"
          disabled={submitting || !latestInteraction}
        >
          {submitting ? 'Submitting…' : (<><Flag className="h-4 w-4" /> Submit Flag</>)}
        </button>
      </div>
    </div>
  );
}

function AdminDashboard({ user, interactions, flags, setFlags }) {
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

  const [exercises, setExercises] = useState(load('demo_exercises', [
    { id: uid(), title: 'Safety Stress Test — Model Alpha', endDate: '2025-12-31', description: 'Probe jailbreaks & disallowed content.', guidelines: ['Avoid personal data', 'Report harmful outputs', 'Use reproducible prompts'] },
  ]));
  const [models, setModels] = useState(load('demo_models', [
    { id: uid(), blind: 'alpha', provider: 'OpenAI', model: 'gpt-4o' },
    { id: uid(), blind: 'beta', provider: 'Anthropic', model: 'claude-3-opus' },
  ]));
  const [newExercise, setNewExercise] = useState({ title: '', endDate: '', description: '' });

  useEffect(() => { save('demo_exercises', exercises); }, [exercises]);
  useEffect(() => { save('demo_models', models); }, [models]);

  const removeFlag = (id) => {
    const next = flags.map(f => f.id === id ? { ...f, status: 'resolved' } : f);
    setFlags(next); save('demo_flags', next);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ interactions, flags, exercises, models }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'redteam_export.json'; a.click(); URL.revokeObjectURL(url);
  };
  const exportCSV = () => {
    const rows = [['ts','user','blind','provider','model','prompt','response']].concat(
      interactions.map(i => [i.ts, i.email, i.blind, i.provider, i.model, JSON.stringify(i.prompt), JSON.stringify(i.response)])
    );
    const csv = rows.map(r => r.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
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

        {/* Analytics */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Stat title="Users (demo)" value={new Set(interactions.map(i => i.email)).size || 0} />
          <Stat title="Interactions" value={interactions.length} />
          <Stat title="Open Flags" value={flags.filter(f => f.status === 'open').length} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Exercise management */}
          <div className="rounded-xl border border-gray-200 p-4 bg-white">
            <div className="flex items-center gap-2"><Settings className="h-4 w-4 text-purple-600" /><h3 className="font-semibold">Exercises</h3></div>
            <form
              className="grid sm:grid-cols-3 gap-2 mt-3"
              onSubmit={(e) => { e.preventDefault(); if (!newExercise.title) return; setExercises([{ id: uid(), guidelines: [], ...newExercise }, ...exercises]); setNewExercise({ title: '', endDate: '', description: '' }); }}
            >
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
                    <div className="font-medium">{ex.title} <span className="text-xs text-gray-500">{ex.endDate}</span></div>
                    <div className="text-sm text-gray-600">{ex.description}</div>
                  </div>
                  <button className="p-2 rounded-md hover:bg-gray-50" onClick={() => setExercises(exercises.filter(e => e.id !== ex.id))}><Trash2 className="h-4 w-4 text-gray-600" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Flag review */}
          <div className="rounded-xl border border-gray-200 p-4 bg-white">
            <div className="flex items-center gap-2"><Flag className="h-4 w-4 text-rose-600" /><h3 className="font-semibold">Flag Review</h3></div>
            <div className="mt-3 space-y-2 max-h-[360px] overflow-auto">
              {flags.length === 0 && <div className="text-sm text-gray-600">No flags yet.</div>}
              {flags.map(f => (
                <div key={f.id} className="rounded-md border border-gray-200 p-3">
                  <div className="text-xs text-gray-500">{new Date(f.ts).toLocaleString()} • {f.email}</div>
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

        {/* Model mapping */}
        <div className="mt-6 rounded-xl border border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2"><Settings className="h-4 w-4 text-purple-600" /><h3 className="font-semibold">Blind Model Mapping</h3></div>
          <div className="mt-3 grid md:grid-cols-2 gap-3">
            {models.map(m => (
              <div key={m.id} className="rounded-md border border-gray-200 p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm"><span className="font-medium">{m.blind}</span> → {m.provider} <span className="text-gray-500">{m.model}</span></div>
                  <div className="text-xs text-gray-600">Update in backend to preserve blindness during analysis.</div>
                </div>
                <button className="p-2 rounded-md hover:bg-gray-50" onClick={() => setModels(models.filter(x => x.id !== m.id))}><Trash2 className="h-4 w-4 text-gray-600" /></button>
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
  const [user, setUser] = useState(load('demo_user', null));
  const [interactions, setInteractions] = useState(load('demo_interactions', []));
  const [flags, setFlags] = useState(load('demo_flags', []));

  useEffect(() => { save('demo_user', user); }, [user]);

  return (
    <div>
      {/* Auth quick access */}
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

      <Playground user={user} interactions={interactions} setInteractions={setInteractions} flags={flags} setFlags={setFlags} />
      <AdminDashboard user={user} interactions={interactions} flags={flags} setFlags={setFlags} />
    </div>
  );
}
