'use client'; 
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Code2, 
  Zap, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  Terminal, 
  Star, 
  TrendingUp, 
  Lock,
  Plus
} from 'lucide-react';

// Sample API Data
const APIS = [
  {
    id: 1,
    name: "Payment Gateway Pro",
    category: "Finance",
    description: "Accept global payments, handle subscriptions, and manage fraud detection effortlessly.",
    latency: "45ms",
    uptime: "99.99%",
    rating: 4.9,
    price: "Freemium"
  },
  {
    id: 2,
    name: "AI Vision & OCR",
    category: "Machine Learning",
    description: "Extract text, detect objects, and analyze image contents in real-time with state-of-the-art AI.",
    latency: "120ms",
    uptime: "99.9%",
    rating: 4.8,
    price: "Paid"
  },
  {
    id: 3,
    name: "GeoLocation Sync",
    category: "Mapping & Data",
    description: "High-precision IP geolocation, reverse geocoding, and timezone identification.",
    latency: "25ms",
    uptime: "100%",
    rating: 4.7,
    price: "Free"
  },
  {
    id: 4,
    name: "User Auth & Identity",
    category: "Security",
    description: "Zero-trust auth solution supporting OAuth2, SAML, WebAuthn, and biometric sign-ins.",
    latency: "35ms",
    uptime: "99.95%",
    rating: 4.9,
    price: "Freemium"
  },
  {
    id: 5,
    name: "Smart Weather & Climate",
    category: "Data & Analytics",
    description: "Historical, current, and forecasted weather metrics tailored for enterprise scale.",
    latency: "50ms",
    uptime: "99.8%",
    rating: 4.6,
    price: "Free"
  },
  {
    id: 6,
    name: "OmniChannel SMS & Push",
    category: "Communication",
    description: "Send transactional SMS, email notifications, and app push alerts across 180+ countries.",
    latency: "80ms",
    uptime: "99.9%",
    rating: 4.8,
    price: "Paid"
  }
];
const CATEGORIES = ["All", "Finance", "Machine Learning", "Security", "Mapping & Data", "Communication"];

export default function ApiMarketplaceHome() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [apis, setApis] = useState(APIS);

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

  useEffect(() => {
    const fetchApis = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.append('category', selectedCategory);
        }
        if (searchTerm) {
          queryParams.append('search', searchTerm);
        }
        const res = await fetch(`http://localhost:5000/api/products?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.products) {
            setApis(data.products);
          }
        }
      } catch (err) {
        console.error("Failed to fetch APIs", err);
      }
    };
    fetchApis();
  }, [searchTerm, selectedCategory]);

  // Filter APIs based on search input & category
  const filteredApis = apis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          api.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || api.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* 1. Header Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-teal-600 p-2 rounded-lg text-white">
              <Code2 className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">APIHub</span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#explore" className="hover:text-teal-400 transition-colors">Explore APIs</a>
            <a href="#features" className="hover:text-teal-400 transition-colors">Features</a>
            <a href="#docs" className="hover:text-teal-400 transition-colors">Documentation</a>
            <a href="#pricing" className="hover:text-teal-400 transition-colors">Pricing</a>
          </div>

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
                  className="text-xs text-slate-300 hover:text-white border border-slate-850 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-all font-medium"
                >
                  My Subscriptions
                </a>
                <a
                  href="/add-api"
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 px-3 py-1.5 rounded-lg transition-all shadow-md shadow-teal-600/20"
                >
                  <Plus className="h-3.5 w-3.5" /> Publish API
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
                <a href="/login" className="text-sm text-slate-300 hover:text-white font-medium px-3 py-2">
                  Sign In
                </a>
                <a href="/signup" className="text-sm bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-teal-600/20">
                  Get Started
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="h-3.5 w-3.5" /> Next-Gen API Hub
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Discover, Test, and Integrate <br />
            <span className="text-teal-400">
              Production-Ready APIs
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Connect your applications to thousands of reliable APIs through a single SDK. Standardized authentication, zero latency overhead, and unified billing.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search APIs by keyword, category, or functionality..."
                className="w-full pl-12 pr-32 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-xl"
              />
              <button className="absolute right-2.5 bg-teal-600 hover:bg-teal-500 text-white font-medium px-5 py-2 rounded-lg text-sm transition-all">
                Search
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-800/80 max-w-3xl mx-auto text-left">
            <div>
              <div className="text-2xl font-bold text-white">10,000+</div>
              <div className="text-xs text-slate-400 mt-0.5">Verified APIs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">99.99%</div>
              <div className="text-xs text-slate-400 mt-0.5">Global Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">500M+</div>
              <div className="text-xs text-slate-400 mt-0.5">Daily Requests</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">&lt; 30ms</div>
              <div className="text-xs text-slate-400 mt-0.5">Avg. Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Marketplace Main Section */}
      <section id="explore" className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Explore API Collections</h2>
            <p className="text-sm text-slate-400 mt-1">Browse top-performing APIs curated for developer workflows.</p>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* API Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApis.length > 0 ? (
            filteredApis.map(api => (
              <div 
                key={api._id || api.id} 
                className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-teal-400 border border-slate-700/50">
                      {api.category}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      api.price === 'Free' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      api.price === 'Freemium' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}>
                      {api.price}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors mb-2">
                    {api.name}
                  </h3>
                  
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-2">
                    {api.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800/60">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800/40">
                      <div className="text-slate-400 font-medium">Latency</div>
                      <div className="text-slate-200 font-semibold mt-0.5">{api.latency}</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800/40">
                      <div className="text-slate-400 font-medium">Uptime</div>
                      <div className="text-slate-200 font-semibold mt-0.5">{api.uptime}</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800/40">
                      <div className="text-slate-400 font-medium">Rating</div>
                      <div className="text-slate-200 font-semibold mt-0.5 flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        {api.rating}
                      </div>
                    </div>
                  </div>

                  <a 
                    href={`/apidetails/${api._id || api.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-teal-600 text-slate-200 hover:text-white py-2 rounded-lg text-xs font-medium transition-all"
                  >
                    Connect API <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-900/30 rounded-xl border border-slate-800">
              No APIs found matching your search criteria.
            </div>
          )}
        </div>
      </section>

      {/* 4. Why APIHub Section */}
      <section id="features" className="border-t border-slate-800/60 bg-slate-950/50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Built for High-Scale Applications</h2>
            <p className="text-slate-400 text-sm">Everything you need to integrate, manage, and scale external API dependencies seamlessly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-xl">
              <div className="p-3 bg-teal-500/10 text-teal-400 w-fit rounded-lg mb-4">
                <Terminal className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Unified API Key</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Access thousands of APIs using a single developer key. No need to manage dozens of separate accounts and credentials.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-xl">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 w-fit rounded-lg mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Enterprise Security</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Bank-grade encryption, automated threat prevention, and SOC2 compliance built natively into every gateway route.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-xl">
              <div className="p-3 bg-purple-500/10 text-purple-400 w-fit rounded-lg mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Analytics</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Monitor request volumes, response times, error rates, and costs in real time from a consolidated dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="bg-teal-600 p-1.5 rounded-md text-white">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-200">APIHub</span>
          </div>
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} APIHub Marketplace, Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}