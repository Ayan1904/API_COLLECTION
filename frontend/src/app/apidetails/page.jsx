'use client';

import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Star, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  ArrowRight, 
  ExternalLink, 
  Layers, 
  Zap, 
  Lock, 
  FileText, 
  Activity, 
  DollarSign, 
  ChevronRight,
  Server
} from 'lucide-react';

// Sample API detailed data
const API_DETAILS = {
  id: 'payment-gateway-pro',
  name: 'Payment Gateway Pro',
  category: 'Finance',
  version: 'v2.4.0',
  provider: 'StripeX Tech',
  rating: 4.9,
  reviewsCount: 342,
  uptime: '99.99%',
  avgLatency: '38ms',
  description: 'A comprehensive, PCI-DSS compliant API engine designed to accept global card payments, handle multi-tier subscriptions, manage fraud detection, and trigger webhooks effortlessly.',
  tags: ['PCI-DSS Certified', 'Global Payments', 'Webhooks', 'OAuth 2.0'],
  
  endpoints: [
    {
      id: 'ep-1',
      method: 'POST',
      path: '/v2/charges',
      summary: 'Create a new charge',
      description: 'Captures and processes a card charge given a valid token or customer ID.',
      params: [
        { name: 'amount', type: 'integer', required: true, description: 'Amount in smallest currency unit (e.g., 4999 = $49.99).' },
        { name: 'currency', type: 'string', required: true, description: 'Three-letter ISO currency code (e.g., usd, eur).' },
        { name: 'customer_id', type: 'string', required: false, description: 'Optional saved customer identifier.' }
      ],
      samplePayload: { amount: 4999, currency: 'usd', customer_id: 'cus_9982341' }
    },
    {
      id: 'ep-2',
      method: 'GET',
      path: '/v2/customers/{id}',
      summary: 'Retrieve customer info',
      description: 'Returns customer details, attached payment methods, and current subscriptions.',
      params: [
        { name: 'id', type: 'string', required: true, description: 'Unique identifier of the customer.' }
      ],
      samplePayload: {}
    },
    {
      id: 'ep-3',
      method: 'POST',
      path: '/v2/refunds',
      summary: 'Create a refund',
      description: 'Initiates a partial or full refund for a processed charge.',
      params: [
        { name: 'charge_id', type: 'string', required: true, description: 'Identifier of the charge being refunded.' },
        { name: 'amount', type: 'integer', required: false, description: 'Amount to refund. Omitting refunds full charge.' }
      ],
      samplePayload: { charge_id: 'ch_8829103', amount: 1500 }
    }
  ],

  pricingPlans: [
    {
      name: 'Free Tier',
      price: '$0',
      period: '/month',
      requests: '10,000 req/mo',
      features: ['Standard Latency (~80ms)', 'Community Support', 'Shared Rate Limit', '1 API Key'],
      cta: 'Start Free',
      popular: false
    },
    {
      name: 'Pro Developer',
      price: '$49',
      period: '/month',
      requests: '500,000 req/mo',
      features: ['Ultra-low Latency (~35ms)', '99.99% SLA Uptime', 'Dedicated Support (24/7)', 'Unlimited API Keys', 'Custom Webhooks'],
      cta: 'Subscribe Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      requests: 'Unlimited req',
      features: ['Dedicated Edge Nodes', 'Custom SLA Guarantee', 'Dedicated Account Manager', 'Custom Billing & Invoicing'],
      cta: 'Contact Sales',
      popular: false
    }
  ]
};

export default function ApiDetailPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'docs' | 'pricing'
  const [selectedEndpoint, setSelectedEndpoint] = useState(API_DETAILS.endpoints[0]);
  const [codeLanguage, setCodeLanguage] = useState('curl'); // 'curl' | 'node' | 'python'
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResponse, setTestResponse] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // Dynamic code snippet generator
  const getCodeSnippet = () => {
    const url = `https://api.apihub.dev${selectedEndpoint.path}`;
    const payloadStr = JSON.stringify(selectedEndpoint.samplePayload, null, 2);

    if (codeLanguage === 'curl') {
      return `curl -X ${selectedEndpoint.method} "${url}" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(selectedEndpoint.samplePayload)}'`;
    }
    if (codeLanguage === 'node') {
      return `const response = await fetch('${url}', {\n  method: '${selectedEndpoint.method}',\n  headers: {\n    'Authorization': 'Bearer YOUR_API_KEY',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify(${payloadStr})\n});\nconst data = await response.json();`;
    }
    if (codeLanguage === 'python') {
      return `import requests\n\nurl = "${url}"\nheaders = {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "Content-Type": "application/json"\n}\npayload = ${payloadStr.replace(/"/g, "'")}\n\nresponse = requests.${selectedEndpoint.method.toLowerCase()}(url, json=payload, headers=headers)\nprint(response.json())`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunRequest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setTestResponse({
        status: 200,
        statusText: 'OK',
        time: API_DETAILS.avgLatency,
        data: {
          success: true,
          id: 'res_' + Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toISOString(),
          payload_received: selectedEndpoint.samplePayload
        }
      });
      setIsTesting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* 1. Navbar Header */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <a href="/" className="flex items-center space-x-3">
              <div className="bg-teal-600 p-2 rounded-lg text-white">
                <Code2 className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">APIHub</span>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {!mounted ? (
              <div className="w-20 h-8" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-300 font-medium bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                  Logged in as <span className="text-teal-400 font-semibold">{user.fullName}</span>
                </span>
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

      {/* 2. Hero Header Banner */}
      <section className="bg-slate-900/60 border-b border-slate-800/80 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                {API_DETAILS.category}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700/60">
                {API_DETAILS.version}
              </span>
              <span className="text-xs text-slate-400">by <span className="text-slate-200 font-medium">{API_DETAILS.provider}</span></span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white">{API_DETAILS.name}</h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">{API_DETAILS.description}</p>

            {/* Badges & Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {API_DETAILS.tags.map(tag => (
                <span key={tag} className="text-[11px] bg-slate-800/80 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/40">
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics Card */}
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 min-w-[280px]">
            <div className="grid grid-cols-2 gap-4 text-center border-b border-slate-800/80 pb-3">
              <div>
                <div className="text-xs text-slate-400">Avg Latency</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">{API_DETAILS.avgLatency}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">SLA Uptime</div>
                <div className="text-base font-bold text-teal-400 mt-0.5">{API_DETAILS.uptime}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Star className="h-4 w-4 fill-amber-400" />
                {API_DETAILS.rating} <span className="text-slate-500 font-normal">({API_DETAILS.reviewsCount} reviews)</span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>

            <button className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-teal-600/20">
              Subscribe to API
            </button>
          </div>
        </div>
      </section>

      {/* 3. Tab Navigation Header */}
      <section className="border-b border-slate-800 bg-slate-950/50 sticky top-16 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex space-x-8 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview & Features', icon: Layers },
            { id: 'docs', label: 'API Reference & Sandbox', icon: Terminal },
            { id: 'pricing', label: 'Pricing Plans', icon: DollarSign }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 flex items-center gap-2 border-b-2 transition-all ${
                  isActive 
                    ? 'border-teal-500 text-teal-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Tab Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        
        {/* --- TAB 1: OVERVIEW & FEATURES --- */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              
              {/* Feature Highlights */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white">Key Capabilities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <div className="text-teal-400 font-semibold text-xs flex items-center gap-2">
                      <Zap className="h-4 w-4" /> Instant Tokenization
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Convert raw payment details into secure, single-use tokens on the client side.
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <div className="text-emerald-400 font-semibold text-xs flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> Smart Fraud Radar
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Machine learning filters analyze transaction risks and block stolen cards in real time.
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <div className="text-purple-400 font-semibold text-xs flex items-center gap-2">
                      <Activity className="h-4 w-4" /> Webhook Events
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Receive signed HTTP POST notifications for charge successes, disputes, and subscription changes.
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <div className="text-amber-400 font-semibold text-xs flex items-center gap-2">
                      <Lock className="h-4 w-4" /> Zero-Trust Auth
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Authenticated via HMAC signature verification and standard OAuth2 Bearer tokens.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Start Guide */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-bold text-white">Integration Quickstart</h2>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="bg-teal-600 text-white font-bold h-5 w-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                    <p><strong className="text-white">Get your API Key:</strong> Subscribe to a plan to receive your secret Bearer token.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-teal-600 text-white font-bold h-5 w-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                    <p><strong className="text-white">Configure HTTP Headers:</strong> Attach <code className="bg-slate-950 px-1.5 py-0.5 rounded text-teal-300 font-mono">Authorization: Bearer YOUR_KEY</code> to all requests.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-teal-600 text-white font-bold h-5 w-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                    <p><strong className="text-white">Test Endpoints:</strong> Use the interactive API reference tab to run live mock calls.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
                <h3 className="font-bold text-white text-sm">Provider Details</h3>
                <div className="space-y-3 text-slate-400">
                  <div className="flex justify-between">
                    <span>Base URL</span>
                    <code className="text-slate-200 font-mono text-[11px]">https://api.apihub.dev</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Format</span>
                    <span className="text-slate-200 font-medium">JSON (UTF-8)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate Limit</span>
                    <span className="text-slate-200 font-medium">100 req/sec</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SLA Guarantee</span>
                    <span className="text-emerald-400 font-medium">99.99%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: API REFERENCE & SANDBOX --- */}
        {activeTab === 'docs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Endpoints Menu (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Endpoints</label>
              <div className="space-y-2">
                {API_DETAILS.endpoints.map(ep => {
                  const isSelected = selectedEndpoint.id === ep.id;
                  const methodColor = 
                    ep.method === 'GET' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                    ep.method === 'POST' ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' :
                    'text-amber-400 bg-amber-500/10 border-amber-500/20';

                  return (
                    <button
                      key={ep.id}
                      onClick={() => {
                        setSelectedEndpoint(ep);
                        setTestResponse(null);
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        isSelected 
                          ? 'bg-slate-900 border-teal-500 shadow-md shadow-teal-950/30' 
                          : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono ${methodColor}`}>
                          {ep.method}
                        </span>
                        <span className="text-xs font-mono text-slate-200 truncate">{ep.path}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block truncate">{ep.summary}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Endpoint Documentation & Live Console (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Endpoint Details */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
                    {selectedEndpoint.method}
                  </span>
                  <span className="text-sm font-mono font-semibold text-white">{selectedEndpoint.path}</span>
                </div>
                <p className="text-xs text-slate-400">{selectedEndpoint.description}</p>

                {/* Parameters Table */}
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
                        {selectedEndpoint.params.map(p => (
                          <tr key={p.name}>
                            <td className="p-2.5 font-mono text-teal-300">{p.name}</td>
                            <td className="p-2.5 font-mono text-slate-400">{p.type}</td>
                            <td className="p-2.5">
                              {p.required ? (
                                <span className="text-amber-400 text-[10px] font-semibold">Yes</span>
                              ) : (
                                <span className="text-slate-500 text-[10px]">Optional</span>
                              )}
                            </td>
                            <td className="p-2.5 text-slate-400">{p.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Code Playground Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-teal-400" />
                    <span className="text-xs font-semibold text-slate-300">Request Playground</span>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    {['curl', 'node', 'python'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => setCodeLanguage(lang)}
                        className={`px-2.5 py-1 text-[10px] font-mono font-semibold uppercase rounded transition-all ${
                          codeLanguage === lang 
                            ? 'bg-teal-600 text-white' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative p-4 bg-slate-950/90 font-mono text-xs text-teal-300 overflow-x-auto">
                  <button
                    onClick={handleCopyCode}
                    className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg transition-all border border-slate-700/50"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <pre><code>{getCodeSnippet()}</code></pre>
                </div>

                <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Send test call to sandbox endpoint</span>
                  <button
                    onClick={handleRunRequest}
                    disabled={isTesting}
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-md shadow-teal-600/20"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    {isTesting ? 'Sending...' : 'Test Request'}
                  </button>
                </div>
              </div>

              {/* Response Preview Console */}
              {testResponse && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-300">Response</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono px-2 py-0.5 rounded font-bold">
                      {testResponse.status} {testResponse.statusText}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Time: {testResponse.time}</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                    <pre>{JSON.stringify(testResponse.data, null, 2)}</pre>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* --- TAB 3: PRICING PLANS --- */}
        {activeTab === 'pricing' && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-white">Flexible Pricing Tiers</h2>
              <p className="text-xs text-slate-400">Choose a subscription tier that fits your production scale.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {API_DETAILS.pricingPlans.map(plan => (
                <div
                  key={plan.name}
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
                      <span className="text-xs text-slate-400">{plan.period}</span>
                    </div>
                    <div className="text-xs font-semibold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20 w-fit">
                      {plan.requests}
                    </div>

                    <ul className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                      {plan.features.map(feat => (
                        <li key={feat} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className={`w-full mt-6 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    plan.popular
                      ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/25'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}