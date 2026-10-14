'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Code2,
  ArrowLeft,
  Edit2,
  Trash2,
  Check,
  Plus,
  Loader2,
  AlertCircle,
  Package,
  Activity,
  Globe,
  Settings,
  Eye,
  X,
  RefreshCw,
} from 'lucide-react';

const PRICE_TYPES = ['Free', 'Freemium', 'Paid'];

export default function MyApisPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Modal State
  const [editingApi, setEditingApi] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    description: '',
    price: 'Free',
    latency: '',
    uptime: '',
    version: '',
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState(null);

  // Load auth token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setAuthChecked(true);
  }, []);

  // Fetch listings
  const fetchMyApis = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/my-listings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to retrieve listings');
      }
      setApis(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApis();
  }, [token]);

  // Open Edit Modal
  const openEditModal = (api) => {
    setEditingApi(api);
    setEditForm({
      name: api.name || '',
      category: api.category || '',
      description: api.description || '',
      price: api.price || 'Free',
      latency: api.latency || '',
      uptime: api.uptime || '',
      version: api.version || 'v1.0.0',
    });
    setEditError(null);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setEditingApi(null);
  };

  // Save Edit Changes
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingApi) return;

    setEditSaving(true);
    setEditError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/products/${editingApi._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update listing');
      }

      // Update locally
      setApis((prev) =>
        prev.map((item) => (item._id === editingApi._id ? { ...item, ...editForm } : item))
      );
      closeEditModal();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditSaving(false);
    }
  };

  // Toggle API Active / Inactive status
  const handleToggleActive = async (apiId, currentActive) => {
    try {
      const endpoint = `http://localhost:5000/api/products/${apiId}`;
      const method = currentActive ? 'DELETE' : 'PUT';
      const body = currentActive ? null : JSON.stringify({ isActive: true });

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Operation failed');
      }

      // Refresh list
      fetchMyApis();
    } catch (err) {
      alert(err.message);
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
            You must be signed in with a provider account to manage published APIs.
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col relative">
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
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Manage Published APIs</h1>
            <p className="text-slate-400 text-sm">
              Publish new API integrations, edit specifications, or toggle marketplace listing statuses.
            </p>
          </div>
          <a
            href="/add-api"
            className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-teal-600/25"
          >
            <Plus className="h-4 w-4" /> Publish New API
          </a>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 text-teal-400 animate-spin" />
            <p className="text-slate-400 text-sm">Fetching your API listings...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : apis.length === 0 ? (
          <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
            <Package className="h-8 w-8 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 text-sm font-semibold mb-1">No API listings published yet</p>
            <p className="text-slate-500 text-xs mb-6">
              Create and share your API documentation endpoints with developers global scale.
            </p>
            <a
              href="/add-api"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-teal-600/20"
            >
              Publish First API
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {apis.map((api) => {
              const isInactive = api.isActive === false;

              return (
                <div
                  key={api._id}
                  className={`bg-slate-900/60 border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${isInactive
                      ? 'border-slate-800 opacity-60 bg-slate-950/20'
                      : 'border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/80'
                    }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-teal-400 border border-slate-700/50">
                        {api.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{api.version}</span>
                      {isInactive ? (
                        <span className="text-[9px] bg-slate-950 text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded uppercase font-bold">
                          Inactive
                        </span>
                      ) : (
                        <span className="text-[9px] bg-teal-950 text-teal-400 border border-teal-500/20 px-1.5 py-0.5 rounded uppercase font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mb-1 truncate">{api.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed max-w-2xl">
                      {api.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 shrink-0">
                    <div className="grid grid-cols-2 gap-2 text-center text-[11px] bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60 w-36">
                      <div>
                        <div className="text-slate-500">Latency</div>
                        <div className="font-semibold text-slate-300 mt-0.5">{api.latency || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Uptime</div>
                        <div className="font-semibold text-slate-300 mt-0.5">{api.uptime || '99.9%'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/apidetails/${api._id}`}
                        className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl border border-slate-700/50 transition-all"
                        title="View Documentation"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => openEditModal(api)}
                        className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl border border-slate-700/50 transition-all"
                        title="Edit Details"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(api._id, api.isActive)}
                        className={`p-2.5 rounded-xl border transition-all ${isInactive
                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-rose-500/20'
                          }`}
                        title={isInactive ? 'Reactivate listing' : 'Deactivate listing'}
                      >
                        {isInactive ? <RefreshCw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Edit Modal Overlay */}
      {editingApi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <button
              onClick={closeEditModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-teal-400" /> Edit API Specifications
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Modify basic descriptors and details for {editingApi.name}.
                </p>
              </div>

              {editError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-medium">
                  {editError}
                </div>
              )}

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">API Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                    <input
                      type="text"
                      required
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Pricing Model</label>
                    <select
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {PRICE_TYPES.map((pt) => (
                        <option key={pt} value={pt}>
                          {pt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Latency</label>
                    <input
                      type="text"
                      value={editForm.latency}
                      onChange={(e) => setEditForm({ ...editForm, latency: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Uptime SLA</label>
                    <input
                      type="text"
                      value={editForm.uptime}
                      onChange={(e) => setEditForm({ ...editForm, uptime: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Version</label>
                    <input
                      type="text"
                      value={editForm.version}
                      onChange={(e) => setEditForm({ ...editForm, version: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center gap-1.5"
                >
                  {editSaving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
