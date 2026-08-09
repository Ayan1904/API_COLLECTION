'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Code2,
  Star,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  Play,
  ArrowLeft,
  Layers,
  Zap,
  Lock,
  Activity,
  DollarSign,
  Loader2,
  AlertCircle,
  Tag,
} from 'lucide-react';

// ─── HTTP method colour map ────────────────────────────────────────────────────
const METHOD_COLORS = {
  GET:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  POST:   'text-teal-400   bg-teal-500/10   border-teal-500/20',
  PUT:    'text-amber-400  bg-amber-500/10  border-amber-500/20',
  PATCH:  'text-orange-400 bg-orange-500/10 border-orange-500/20',
  DELETE: 'text-rose-400   bg-rose-500/10   border-rose-500/20',
};

const PRICE_BADGE = {
  Free:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Freemium: 'bg-blue-500/10   text-blue-400   border-blue-500/20',
  Paid:     'bg-purple-500/10 text-purple-400  border-purple-500/20',
};

// ─── Code snippet generator ───────────────────────────────────────────────────
function generateCode(lang, endpoint) {
  const url = `https://api.apihub.dev${endpoint.path}`;
  const payload = endpoint.samplePayload && Object.keys(endpoint.samplePayload).length
    ? JSON.stringify(endpoint.samplePayload, null, 2)
    : '{}';

  if (lang === 'curl') {
    return `curl -X ${endpoint.method} "${url}" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(endpoint.samplePayload || {})}'`;
  }
  if (lang === 'node') {
    return `const response = await fetch('${url}', {\n  method: '${endpoint.method}',\n  headers: {\n    'Authorization': 'Bearer YOUR_API_KEY',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify(${payload})\n});\nconst data = await response.json();`;
  }
  if (lang === 'python') {
    return `import requests\n\nurl = "${url}"\nheaders = {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "Content-Type": "application/json"\n}\npayload = ${payload.replace(/"/g, "'")}\n\nresponse = requests.${endpoint.method.toLowerCase()}(url, json=payload, headers=headers)\nprint(response.json())`;
  }
  return '';
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ApiDetailPage() {
  const { id }   = useParams();
  const router   = useRouter();

  const [api,         setApi]         = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [activeTab,   setActiveTab]   = useState('overview');
  const [selectedEp,  setSelectedEp]  = useState(null);
  const [codeLang,    setCodeLang]    = useState('curl');
  const [copied,      setCopied]      = useState(false);
  const [isTesting,   setIsTesting]   = useState(false);
  const [testRes,     setTestRes]     = useState(null);
  const [mounted,     setMounted]     = useState(false);
  const [user,        setUser]        = useState(null);

  const [subscription, setSubscription] = useState(null);
  const [subscribing,  setSubscribing]  = useState(false);
  const [copySubKey,   setCopySubKey]   = useState(false);

  // ─── Auth & Sub Check ──────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    try {
      const u = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (u) {
        setUser(JSON.parse(u));
        if (token && id) {
          checkSubStatus(token);
        }
      }
    } catch (_) {}
  }, [id]);

  const checkSubStatus = async (tokenVal) => {
    try {
      const checkRes = await fetch(`http://localhost:5000/api/subscriptions/check/${id}`, {
        headers: {
          'Authorization': `Bearer ${tokenVal}`
        }
      });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.subscribed) {
          setSubscription(checkData.subscription);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async (planName) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    setSubscribing(true);
    try {
      const res = await fetch('http://localhost:5000/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          apiId: id,
          planName: planName || 'Free'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Subscription failed');
      }
      setSubscription(data.subscription);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubscribing(false);
    }
  };

  // ─── Fetch product ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;

    const fetchApi = async () => {
      setLoading(true);
      setError(null);
      try {
        const res  = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'API not found');
        setApi(data.product);
        if (data.product.endpoints?.length) {
          setSelectedEp(data.product.endpoints[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApi();
  }, [id]);

  // ─── Copy code ────────────────────────────────────────────────────────────
  const handleCopy = () => {
    if (!selectedEp) return;
    navigator.clipboard.writeText(generateCode(codeLang, selectedEp));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Mock test run ────────────────────────────────────────────────────────
  const handleTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setTestRes({
        status: 200,
        statusText: 'OK',
        time: api?.latency || '~45ms',
        data: {
          success: true,
          id: 'res_' + Math.random().toString(36).slice(2, 9),
          timestamp: new Date().toISOString(),
          payload_received: selectedEp?.samplePayload || {},
        },
      });
      setIsTesting(false);
    }, 600);
  };

  // ─── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-teal-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading API details…</p>
        </div>
      </div>
    );
  }

  // ─── Error state ──────────────────────────────────────────────────────────
  if (error || !api) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">API Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">{error || 'This API listing could not be retrieved.'}</p>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-3">
            <div className="bg-teal-600 p-2 rounded-lg text-white">
              <Code2 className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">APIHub</span>
          </a>

          <div className="flex items-center space-x-4">
            {!mounted ? (
              <div className="w-20 h-8" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-300 font-medium bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                  Logged in as <span className="text-teal-400 font-semibold">{user.fullName}</span>
                </span>
                <a
                  href="/subscriptions"
                  className="text-xs text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-all font-medium"
                >
                  My Subscriptions
                </a>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                    window.location.reload();
                  }}
                  className="text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <a href="/login" className="text-xs text-slate-300 hover:text-white font-medium">Sign In</a>
                <a href="/signup" className="text-xs bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-teal-600/20">
                  Get Started
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Back breadcrumb ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Marketplace
        </button>
      </div>

      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <section className="bg-slate-900/60 border-b border-slate-800/80 py-10 px-6 mt-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-start justify-between gap-8">

          {/* Left: metadata */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                {api.category}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700/60">
                {api.version || 'v1.0.0'}
              </span>
              {api.price && (
                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${PRICE_BADGE[api.price] || PRICE_BADGE.Free}`}>
                  {api.price}
                </span>
              )}
              {api.provider && (
                <span className="text-xs text-slate-400">
                  by <span className="text-slate-200 font-medium">{api.provider}</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white">{api.name}</h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">{api.description}</p>

            {/* Tags */}
            {api.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {api.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-[11px] bg-slate-800/80 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/40">
                    <Tag className="h-2.5 w-2.5 text-teal-500" /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right: Quick metrics card */}
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 min-w-[260px]">
            <div className="grid grid-cols-2 gap-4 text-center border-b border-slate-800/80 pb-3">
              <div>
                <div className="text-xs text-slate-400">Avg Latency</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">{api.latency || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">SLA Uptime</div>
                <div className="text-base font-bold text-teal-400 mt-0.5">{api.uptime || 'N/A'}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Star className="h-4 w-4 fill-amber-400" />
                {api.rating ?? 0}{' '}
                <span className="text-slate-500 font-normal">({api.reviewsCount ?? 0} reviews)</span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>

            {subscription ? (
              <div className="space-y-3 bg-teal-950/20 border border-teal-500/30 rounded-xl p-3.5 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-teal-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                    Subscribed
                  </span>
                  <span className="text-[11px] font-semibold text-slate-200">
                    {subscription.planName}
                  </span>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 block font-medium">Subscription Key</label>
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1.5 rounded-lg">
                    <code className="text-[10px] font-mono text-teal-400 select-all truncate flex-1">
                      {subscription.apiKey}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(subscription.apiKey);
                        setCopySubKey(true);
                        setTimeout(() => setCopySubKey(false), 2000);
                      }}
                      className="text-slate-500 hover:text-white transition-colors"
                      title="Copy subscription API Key"
                    >
                      {copySubKey ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleSubscribe(api.pricingPlans?.[0]?.name || 'Free')}
                disabled={subscribing}
                className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-teal-600/20"
              >
                {subscribing ? 'Subscribing...' : 'Subscribe to API'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Tab Nav ────────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-800 bg-slate-950/50 sticky top-16 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex space-x-8 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Features', icon: Layers },
            { id: 'docs',     label: 'API Reference & Sandbox', icon: Terminal },
            { id: 'pricing',  label: 'Pricing Plans', icon: DollarSign },
          ].map(({ id: tabId, label, icon: Icon }) => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={`py-4 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tabId
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Tab Content ───────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">

        {/* ── OVERVIEW ──────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">

              {/* Dynamic endpoint summary as feature highlights */}
              {api.endpoints?.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white">Available Endpoints</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {api.endpoints.map((ep, i) => (
                      <div key={i} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono ${METHOD_COLORS[ep.method] || 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                            {ep.method}
                          </span>
                          <code className="text-xs text-slate-200 font-mono truncate">{ep.path}</code>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {ep.summary || ep.description || 'No description provided.'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quickstart */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-bold text-white">Integration Quickstart</h2>
                <div className="space-y-3 text-xs text-slate-300">
                  {[
                    ['Get your API Key', 'Subscribe to a plan to receive your secret Bearer token.'],
                    ['Configure HTTP Headers', 'Attach Authorization: Bearer YOUR_KEY to all requests.'],
                    ['Test Endpoints', 'Use the interactive API Reference tab to run live mock calls.'],
                  ].map(([title, desc], i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="bg-teal-600 text-white font-bold h-5 w-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p>
                        <strong className="text-white">{title}:</strong> {desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
                <h3 className="font-bold text-white text-sm">Provider Details</h3>
                <div className="space-y-3 text-slate-400">
                  {[
                    ['Provider',  api.provider   || '—'],
                    ['Version',   api.version    || 'v1.0.0'],
                    ['Category',  api.category   || '—'],
                    ['Latency',   api.latency    || 'N/A'],
                    ['Uptime',    api.uptime     || 'N/A'],
                    ['Pricing',   api.price      || 'Free'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between">
                      <span>{label}</span>
                      <span className="text-slate-200 font-medium text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── API REFERENCE & SANDBOX ───────────────────────────────────── */}
        {activeTab === 'docs' && (
          <>
            {!api.endpoints?.length ? (
              <div className="py-16 text-center text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800">
                <Terminal className="h-8 w-8 mx-auto mb-3 text-slate-700" />
                <p className="text-sm font-medium text-slate-400">No endpoints documented for this API yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Endpoint list sidebar */}
                <div className="lg:col-span-4 space-y-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Endpoints</label>
                  <div className="space-y-2">
                    {api.endpoints.map((ep, i) => {
                      const isSelected = selectedEp === ep || selectedEp?.path === ep.path;
                      return (
                        <button
                          key={i}
                          onClick={() => { setSelectedEp(ep); setTestRes(null); }}
                          className={`w-full p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-slate-900 border-teal-500 shadow-md shadow-teal-950/30'
                              : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono ${METHOD_COLORS[ep.method] || ''}`}>
                              {ep.method}
                            </span>
                            <span className="text-xs font-mono text-slate-200 truncate">{ep.path}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 block truncate">{ep.summary || ep.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right pane: details + playground */}
                <div className="lg:col-span-8 space-y-6">

                  {selectedEp && (
                    <>
                      {/* Endpoint details */}
                      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded border font-mono ${METHOD_COLORS[selectedEp.method] || ''}`}>
                            {selectedEp.method}
                          </span>
                          <span className="text-sm font-mono font-semibold text-white">{selectedEp.path}</span>
                        </div>
                        {(selectedEp.summary || selectedEp.description) && (
                          <p className="text-xs text-slate-400">{selectedEp.description || selectedEp.summary}</p>
                        )}

                        {/* Parameters table */}
                        {selectedEp.params?.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Request Parameters</h4>
                            <div className="border border-slate-800 rounded-xl overflow-hidden">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                                  <tr>
                                    <th className="p-2.5">Field</th>
                                    <th className="p-2.5">Type</th>
                                    <th className="p-2.5">Required</th>
                                    <th className="p-2.5">Description</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                                  {selectedEp.params.map((p, pi) => (
                                    <tr key={pi}>
                                      <td className="p-2.5 font-mono text-teal-300">{p.name}</td>
                                      <td className="p-2.5 font-mono text-slate-400">{p.type}</td>
                                      <td className="p-2.5">
                                        {p.required
                                          ? <span className="text-amber-400 text-[10px] font-semibold">Yes</span>
                                          : <span className="text-slate-500 text-[10px]">Optional</span>
                                        }
                                      </td>
                                      <td className="p-2.5 text-slate-400">{p.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Code Playground */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Terminal className="h-4 w-4 text-teal-400" />
                            <span className="text-xs font-semibold text-slate-300">Request Playground</span>
                          </div>
                          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                            {['curl', 'node', 'python'].map((lang) => (
                              <button
                                key={lang}
                                onClick={() => setCodeLang(lang)}
                                className={`px-2.5 py-1 text-[10px] font-mono font-semibold uppercase rounded transition-all ${
                                  codeLang === lang ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                                }`}
                              >
                                {lang}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="relative p-4 bg-slate-950/90 font-mono text-xs text-teal-300 overflow-x-auto">
                          <button
                            onClick={handleCopy}
                            className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg transition-all border border-slate-700/50"
                          >
                            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                          <pre><code>{generateCode(codeLang, selectedEp)}</code></pre>
                        </div>

                        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">Send test call to sandbox endpoint</span>
                          <button
                            onClick={handleTest}
                            disabled={isTesting}
                            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-md shadow-teal-600/20"
                          >
                            <Play className="h-3.5 w-3.5 fill-current" />
                            {isTesting ? 'Sending…' : 'Test Request'}
                          </button>
                        </div>
                      </div>

                      {/* Response */}
                      {testRes && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-300">Response</span>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono px-2 py-0.5 rounded font-bold">
                              {testRes.status} {testRes.statusText}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">Time: {testRes.time}</span>
                          </div>
                          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                            <pre>{JSON.stringify(testRes.data, null, 2)}</pre>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── PRICING ───────────────────────────────────────────────────── */}
        {activeTab === 'pricing' && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-white">Flexible Pricing Tiers</h2>
              <p className="text-xs text-slate-400">Choose a subscription tier that fits your production scale.</p>
            </div>

            {!api.pricingPlans?.length ? (
              <div className="py-12 text-center text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800">
                <DollarSign className="h-8 w-8 mx-auto mb-3 text-slate-700" />
                <p className="text-sm font-medium text-slate-400">No pricing plans have been published for this API yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {api.pricingPlans.map((plan, i) => (
                  <div
                    key={i}
                    className={`bg-slate-900/60 border rounded-2xl p-6 flex flex-col justify-between relative transition-all ${
                      plan.popular
                        ? 'border-teal-500 shadow-xl shadow-teal-950/50 bg-slate-900'
                        : 'border-slate-800'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                        Most Popular
                      </span>
                    )}

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                        {plan.period && <span className="text-xs text-slate-400">{plan.period}</span>}
                      </div>
                      {plan.requests && (
                        <div className="text-xs font-semibold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20 w-fit">
                          {plan.requests}
                        </div>
                      )}

                      {plan.features?.length > 0 && (
                        <ul className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                          {plan.features.map((feat, fi) => (
                            <li key={fi} className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                              {feat}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <button
                      onClick={() => handleSubscribe(plan.name)}
                      disabled={subscribing || !!subscription}
                      className={`w-full mt-6 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        subscription?.planName === plan.name
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
                          : subscription
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : plan.popular
                          ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/25'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {subscription?.planName === plan.name
                        ? 'Active Plan'
                        : subscription
                        ? 'Subscribed'
                        : plan.cta || 'Get Started'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
