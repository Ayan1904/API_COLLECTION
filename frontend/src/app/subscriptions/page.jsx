'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Code2,
  ArrowLeft,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  Key,
  ShieldAlert,
} from 'lucide-react';

export default function SubscriptionsPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // Check auth
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setAuthChecked(true);
  }, []);

  // Fetch subscriptions
  useEffect(() => {
    if (!token) return;

    const fetchSubs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/subscriptions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to retrieve subscriptions');
        }
        setSubscriptions(data.subscriptions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubs();
  }, [token]);

  // Copy API key helper
  const handleCopyKey = (id, key) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Cancel subscription
  const handleCancelSub = async (subId) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return;

    setCancellingId(subId);
    try {
      const res = await fetch(`http://localhost:5000/api/subscriptions/${subId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Cancellation failed');
      }

      // Update state
      setSubscriptions((prev) =>
        prev.map((sub) => (sub._id === subId ? { ...sub, status: 'cancelled' } : sub))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  if (!authChecked) return null;

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-slate-400 text-sm mb-6">
            You must be signed in to view and manage your API subscriptions.
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/login"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-teal-600/25"
            >
              Sign In
            </a>
            <a
              href="/"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all"
            >
              Back to Store
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="bg-teal-600 p-1.5 rounded-lg text-white">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="font-bold text-white group-hover:text-teal-400 transition-colors text-sm">APIHub</span>
          </a>
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-all font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Marketplace
          </a>
        </div>
      </nav>

      {/* Header */}
      <div className="border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">My Subscriptions</h1>
          <p className="text-slate-400 text-sm">
            Manage your subscribed API plans, view credentials, and integrate code integrations.
          </p>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <main className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 text-teal-400 animate-spin" />
            <p className="text-slate-400 text-sm">Fetching subscriptions...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
            <Key className="h-8 w-8 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 text-sm font-semibold mb-1">No active subscriptions</p>
            <p className="text-slate-500 text-xs mb-6">
              Subscribe to an API from the explore directory to generate tokens.
            </p>
            <a
              href="/"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-teal-600/20"
            >
              Explore APIs
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptions.map((sub) => {
              const product = sub.api;
              if (!product) return null;
              const isCancelled = sub.status === 'cancelled';

              return (
                <div
                  key={sub._id}
                  className={`bg-slate-900/60 border rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                    isCancelled ? 'border-slate-800 opacity-60' : 'border-slate-800/80 hover:border-slate-700/80'
                  }`}
                >
                  {isCancelled && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      <ShieldAlert className="h-3 w-3" /> Cancelled
                    </div>
                  )}

                  <div>
                    {/* Category & Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-teal-400 border border-slate-700/50">
                        {product.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{product.version}</span>
                    </div>

                    {/* API Title */}
                    <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-1.5">
                      {product.name}
                      <a
                        href={`/apidetails/${product._id}`}
                        className="text-slate-500 hover:text-teal-400 transition-colors"
                        title="View Documentation"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </h3>

                    {/* Subscribed Plan info */}
                    <p className="text-xs text-slate-400 mb-4">
                      Plan: <span className="text-teal-400 font-semibold">{sub.planName}</span>
                    </p>

                    {/* API Key */}
                    {!isCancelled && (
                      <div className="space-y-1.5 mb-6">
                        <label className="text-[10px] text-slate-500 block font-medium uppercase tracking-wider">
                          Sandbox Key
                        </label>
                        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800/80 p-2 rounded-xl">
                          <code className="text-xs font-mono text-teal-400 select-all truncate flex-1">
                            {sub.apiKey}
                          </code>
                          <button
                            onClick={() => handleCopyKey(sub._id, sub.apiKey)}
                            className="text-slate-500 hover:text-slate-200 transition-colors p-1"
                            title="Copy API key"
                          >
                            {copiedId === sub._id ? (
                              <Check className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {!isCancelled && (
                    <div className="pt-4 border-t border-slate-800/60 flex justify-end">
                      <button
                        onClick={() => handleCancelSub(sub._id)}
                        disabled={cancellingId === sub._id}
                        className="flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-400 font-medium transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Unsubscribe
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <div className="bg-teal-600 p-1.5 rounded-md text-white">
            <Code2 className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs text-slate-500">
            © {new Date().getFullYear()} APIHub Marketplace. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
