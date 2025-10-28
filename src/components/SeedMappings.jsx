import { useEffect, useState } from 'react';
import { Bolt, CheckCircle2 } from 'lucide-react';

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

export default function SeedMappings() {
  const user = useSession();
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const seed = async () => {
    setStatus('loading'); setMessage('');
    try {
      const existing = await api('/model-mappings');
      const blinds = new Set((existing || []).map(m => m.blind));
      const toCreate = [];
      if (!blinds.has('alpha')) toCreate.push({ blind: 'alpha', provider: 'OpenAI', model: 'gpt-4o-mini', api_key_env: 'OPENAI_API_KEY' });
      if (!blinds.has('beta')) toCreate.push({ blind: 'beta', provider: 'Anthropic', model: 'claude-3-haiku-20240307', api_key_env: 'ANTHROPIC_API_KEY' });
      // Keep custom available without creating a mapping entry; backend supports custom proxy via request
      for (const m of toCreate) { await api('/model-mappings', { method: 'POST', body: m, token: user?.token }); }
      setStatus('done'); setMessage(toCreate.length ? 'Default mappings created.' : 'Mappings already present.');
    } catch (err) {
      setStatus('error'); setMessage(String(err.message || err));
    }
  };

  return (
    <section id="seed" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-xl border border-gray-200 p-4 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bolt className="h-5 w-5 text-purple-600" />
            <div>
              <div className="font-semibold">Seed Default Model Mappings</div>
              <div className="text-sm text-gray-600">Alpha → OpenAI GPT-4o mini, Beta → Anthropic Claude 3 Haiku. Custom proxy remains available.</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={seed} className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-black">Seed Now</button>
            {status === 'done' && <span className="inline-flex items-center gap-1 text-emerald-700 text-sm"><CheckCircle2 className="h-4 w-4" /> {message}</span>}
            {status === 'error' && <span className="text-rose-700 text-sm">{message}</span>}
            {status === 'loading' && <span className="text-sm text-gray-600">Seeding…</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
