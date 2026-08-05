'use client';

import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { 
  Code2, 
  Search, 
  Terminal, 
  Play, 
  Copy, 
  Check, 
  ChevronRight, 
  Server, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Sparkles, 
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

// Sample API Catalog with mock endpoints and default params
const API_CATALOG = [
  {
    id: 'payment-pro',
    name: 'Payment Gateway Pro',
    category: 'Finance',
    version: 'v2.1',
    status: 'Operational',
    badge: 'Popular',
    description: 'Process global card payments, handle automated subscriptions, and trigger webhooks.',
    endpoints: [
      { id: 'p1', method: 'POST', path: '/v2/charges', summary: 'Create a new payment charge' },
      { id: 'p2', method: 'GET', path: '/v2/customers/{id}', summary: 'Fetch customer details' },
      { id: 'p3', method: 'POST', path: '/v2/refunds', summary: 'Process a full/partial refund' }
    ],
    defaultParams: { amount: '4999', currency: 'usd', customer_id: 'cus_9982341' }
  },
  {
    id: 'ai-vision',
    name: 'AI Vision & OCR',
    category: 'Machine Learning',
    version: 'v1.0',
    status: 'Operational',
    badge: 'New',
    description: 'Extract raw text, scan barcodes, and recognize objects from image payloads.',
    endpoints: [
      { id: 'a1', method: 'POST', path: '/v1/vision/ocr', summary: 'Perform optical character recognition' },
      { id: 'a2', method: 'POST', path: '/v1/vision/detect-objects', summary: 'Identify bounding boxes in image' }
    ],
    defaultParams: { image_url: 'https://example.com/document.png', language: 'en' }
  },
  {
    id: 'geo-sync',
    name: 'GeoLocation Sync',
    category: 'Mapping & Data',
    version: 'v3.4',
    status: 'Operational',
    badge: 'Fast',
    description: 'Low-latency IP-to-location mapping, reverse geocoding, and timezone calculations.',
    endpoints: [
      { id: 'g1', method: 'GET', path: '/v3/ip/lookup', summary: 'Locate physical coordinates by IP' },
      { id: 'g2', method: 'GET', path: '/v3/timezone', summary: 'Get current offset and DST data' }
    ],
    defaultParams: { ip: '192.0.2.1', format: 'json' }
  },
  {
    id: 'user-auth',
    name: 'User Auth & Identity',
    category: 'Security',
    version: 'v1.2',
    status: 'Operational',
    badge: 'Enterprise',
    description: 'Issue OAuth2 tokens, validate WebAuthn biometric challenges, and handle SAML SSO.',
    endpoints: [
      { id: 'u1', method: 'POST', path: '/oauth/token', summary: 'Exchange authorization grant for JWT' },
      { id: 'u2', method: 'GET', path: '/userinfo', summary: 'Retrieve verified user claim set' }
    ],
    defaultParams: { grant_type: 'client_credentials', scope: 'read:user' }
  }
];

const CATEGORIES = ['All', 'Finance', 'Machine Learning', 'Mapping & Data', 'Security'];

export default function ApiExplorerPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApi, setSelectedApi] = useState(API_CATALOG[0]);
  const [selectedEndpoint, setSelectedEndpoint] = useState(API_CATALOG[0].endpoints[0]);
  const [activeTab, setActiveTab] = useState('curl'); // 'curl' | 'node' | 'python'
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResponse, setTestResponse] = useState(null);

  // Handle API Selection Change
  const handleSelectApi = (api) => {
    setSelectedApi(api);
    setSelectedEndpoint(api.endpoints[0]);
    setTestResponse(null);
  };

  // Filter Catalog
  const filteredApis = API_CATALOG.filter(api => {
    const matchesCategory = selectedCategory === 'All' || api.category === selectedCategory;
    const matchesQuery = api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         api.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Dynamic Code Generators
  const generateCodeSnippet = () => {
    const baseUrl = `https://api.apihub.dev${selectedEndpoint.path}`;
    const params = JSON.stringify(selectedApi.defaultParams, null, 2);

    if (activeTab === 'curl') {
      return `curl -X ${selectedEndpoint.method} "${baseUrl}" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(selectedApi.defaultParams)}'`;
    }
    if (activeTab === 'node') {
      return `const response = await fetch('${baseUrl}', {\n  method: '${selectedEndpoint.method}',\n  headers: {\n    'Authorization': 'Bearer YOUR_API_KEY',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify(${params})\n});\nconst data = await response.json();`;
    }
    if (activeTab === 'python') {
      return `import requests\n\nurl = "${baseUrl}"\nheaders = {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "Content-Type": "application/json"\n}\npayload = ${params.replace(/"/g, "'")}\n\nresponse = requests.${selectedEndpoint.method.toLowerCase()}(url, json=payload, headers=headers)\nprint(response.json())`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setTestResponse({
        status: 200,
        statusText: 'OK',
        time: '42ms',
        body: {
          success: true,
          timestamp: new Date().toISOString(),
          request_id: 'req_' + Math.random().toString(36).substring(2, 9),
          data: selectedApi.defaultParams
        }
      });
      setIsTesting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Code2 className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">APIHub</span>
          <span className="text-xs bg-slate-800 text-indigo-400 font-semibold px-2.5 py-0.5 rounded-full border border-slate-700">
            Explorer
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <a href="/login" className="text-xs text-slate-300 hover:text-white font-medium">Sign In</a>
          <button className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3.5 py-2 rounded-lg transition-all shadow-md shadow-indigo-600/20">
            Get API Key
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Column: API Directory Sidebar (4 Cols) */}
        <aside className="lg:col-span-4 border-r border-slate-800/80 bg-slate-950 p-4 flex flex-col space-y-4">
          
          {/* Search & Filter Controls */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search APIs by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredApis.map(api => {
              const isSelected = selectedApi.id === api.id;
              return (
                <div
                  key={api.id}
                  onClick={() => handleSelectApi(api)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-950/50' 
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {api.name}
                      <span className="text-[10px] text-slate-400 font-normal">({api.version})</span>
                    </span>
                    <span className="text-[10px] bg-slate-800 text-indigo-400 px-2 py-0.5 rounded font-medium border border-slate-700/50">
                      {api.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                    {api.description}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {api.status}
                    </span>
                    <span>•</span>
                    <span>{api.endpoints.length} Endpoints</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Column: Live Playground & Code Workspace (8 Cols) */}
        <main className="lg:col-span-8 bg-slate-950 p-6 flex flex-col space-y-6 overflow-y-auto">
          
          {/* Header Info */}
          <div className="border-b border-slate-800/80 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-white">{selectedApi.name}</h1>
                <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">
                  {selectedApi.version}
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-xl">{selectedApi.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Bearer Auth
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
                <Clock className="h-4 w-4 text-indigo-400" />
                ~35ms
              </span>
            </div>
          </div>

          {/* Endpoint Selector Bar */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Select Endpoint
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {selectedApi.endpoints.map(endpoint => {
                const isEpSelected = selectedEndpoint.id === endpoint.id;
                const methodColor = 
                  endpoint.method === 'GET' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                  endpoint.method === 'POST' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' :
                  'text-amber-400 bg-amber-500/10 border-amber-500/20';

                return (
                  <button
                    key={endpoint.id}
                    onClick={() => {
                      setSelectedEndpoint(endpoint);
                      setTestResponse(null);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isEpSelected 
                        ? 'bg-slate-900 border-indigo-500' 
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono ${methodColor}`}>
                        {endpoint.method}
                      </span>
                      <span className="text-xs font-mono text-slate-200 truncate">{endpoint.path}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate">{endpoint.summary}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Code Generator & Runner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
            
            {/* Code Header Bar */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-300">Request Snippet</span>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {['curl', 'node', 'python'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-semibold uppercase rounded transition-all ${
                      activeTab === lang 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Block Container */}
            <div className="relative p-4 bg-slate-950/80 font-mono text-xs text-indigo-300 overflow-x-auto">
              <button
                onClick={handleCopyCode}
                className="absolute top-3 right-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 p-2 rounded-lg transition-all border border-slate-700/50"
                title="Copy code"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <pre className="leading-relaxed">
                <code>{generateCodeSnippet()}</code>
              </pre>
            </div>

            {/* Test Execution Bar */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Test with mock payload in real time
              </span>
              <button
                onClick={handleRunTest}
                disabled={isTesting}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                {isTesting ? 'Executing...' : 'Run Request'}
              </button>
            </div>
          </div>

          {/* Test Response Console */}
          {testResponse && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">Response</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono px-2 py-0.5 rounded font-bold">
                    {testResponse.status} {testResponse.statusText}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Time: {testResponse.time}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto">
                <pre>{JSON.stringify(testResponse.body, null, 2)}</pre>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}