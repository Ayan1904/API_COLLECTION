'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Code2,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag,
  Globe,
  Zap,
  DollarSign,
  Terminal,
  Package,
  ChevronDown,
  X,
  Star,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const PRICE_TYPES = ['Free', 'Freemium', 'Paid'];
const PARAM_TYPES = ['string', 'integer', 'number', 'boolean', 'array', 'object'];

const METHOD_COLORS = {
  GET:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  POST:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
  PUT:    'bg-amber-500/15 text-amber-400 border-amber-500/30',
  PATCH:  'bg-orange-500/15 text-orange-400 border-orange-500/30',
  DELETE: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

// ─── Default shapes ───────────────────────────────────────────────────────────
const emptyEndpoint = () => ({
  method: 'GET',
  path: '',
  summary: '',
  description: '',
  params: [],
  samplePayload: '',
});

const emptyParam = () => ({
  name: '',
  type: 'string',
  required: false,
  description: '',
});

const emptyPricingPlan = () => ({
  name: '',
  price: '',
  period: '/month',
  requests: '',
  features: [''],
  cta: 'Get Started',
  popular: false,
});

// ─── Step Indicator ───────────────────────────────────────────────────────────
const STEPS = ['Basic Info', 'Endpoints', 'Pricing'];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((label, idx) => {
        const done    = idx < current;
        const active  = idx === current;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                done   ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-600/30' :
                active ? 'bg-slate-950 border-teal-500 text-teal-400' :
                         'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                {done ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
              </div>
              <span className={`mt-2 text-[11px] font-medium ${active ? 'text-teal-400' : done ? 'text-slate-300' : 'text-slate-600'}`}>
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`h-0.5 w-16 mx-2 mb-5 transition-all duration-500 ${done ? 'bg-teal-600' : 'bg-slate-800'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, iconColor = 'text-teal-400', children }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className={`p-1.5 rounded-lg bg-slate-800 ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Form Input ───────────────────────────────────────────────────────────────
function FormInput({ label, error, hint, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-slate-300 mb-1.5">{label}</label>
      )}
      <input
        {...props}
        className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
          error ? 'border-rose-500/60' : 'border-slate-800'
        }`}
      />
      {hint && !error && <p className="text-[10px] text-slate-500 mt-1">{hint}</p>}
      {error && <p className="text-[10px] text-rose-400 mt-1">{error}</p>}
    </div>
  );
}

// ─── Form Textarea ────────────────────────────────────────────────────────────
function FormTextarea({ label, error, hint, rows = 3, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-slate-300 mb-1.5">{label}</label>
      )}
      <textarea
        rows={rows}
        {...props}
        className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none ${
          error ? 'border-rose-500/60' : 'border-slate-800'
        }`}
      />
      {hint && !error && <p className="text-[10px] text-slate-500 mt-1">{hint}</p>}
      {error && <p className="text-[10px] text-rose-400 mt-1">{error}</p>}
    </div>
  );
}

// ─── Form Select ─────────────────────────────────────────────────────────────
function FormSelect({ label, options, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-slate-300 mb-1.5">{label}</label>
      )}
      <div className="relative">
        <select
          {...props}
          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none cursor-pointer"
        >
          {options.map((opt) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
}

// ─── Tags Input ───────────────────────────────────────────────────────────────
function TagsInput({ tags, onChange }) {
  const [input, setInput] = useState('');

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const newTag = input.trim().replace(/,$/, '');
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInput('');
    }
  };

  const removeTag = (idx) => {
    onChange(tags.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="block text-xs font-medium text-slate-300 mb-1.5">Tags</label>
      <div className="min-h-[42px] w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl flex flex-wrap gap-1.5 items-center focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition-all">
        {tags.map((tag, idx) => (
          <span key={idx} className="flex items-center gap-1 bg-teal-600/20 border border-teal-500/30 text-teal-400 px-2 py-0.5 rounded-md text-[11px] font-medium">
            {tag}
            <button type="button" onClick={() => removeTag(idx)} className="hover:text-teal-200">
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={addTag}
          placeholder={tags.length === 0 ? 'Type a tag and press Enter...' : ''}
          className="flex-1 min-w-[120px] bg-transparent text-slate-100 text-xs placeholder-slate-600 focus:outline-none py-0.5 px-1"
        />
      </div>
      <p className="text-[10px] text-slate-500 mt-1">Press Enter or comma to add a tag</p>
    </div>
  );
}

// ─── Step 1 — Basic Info ──────────────────────────────────────────────────────
function Step1({ form, setForm, errors }) {
  return (
    <>
      <SectionCard title="API Identity" icon={Package}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="API Name *"
            placeholder="e.g. Payment Gateway Pro"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            className="md:col-span-2"
          />
          <FormInput
            label="Category *"
            placeholder="e.g. Finance, Machine Learning, Security"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            error={errors.category}
          />
          <FormInput
            label="Provider / Company Name"
            placeholder="e.g. StripeX Tech"
            value={form.provider}
            onChange={(e) => setForm({ ...form, provider: e.target.value })}
          />
          <FormTextarea
            label="Description *"
            placeholder="A clear, compelling description of what your API does and what problems it solves..."
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            error={errors.description}
            className="md:col-span-2"
          />
        </div>
      </SectionCard>

      <SectionCard title="Performance & Pricing" icon={Zap} iconColor="text-amber-400">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Version"
            placeholder="v1.0.0"
            value={form.version}
            onChange={(e) => setForm({ ...form, version: e.target.value })}
            hint="Semantic version of your API"
          />
          <FormInput
            label="Avg. Latency"
            placeholder="e.g. 45ms"
            value={form.latency}
            onChange={(e) => setForm({ ...form, latency: e.target.value })}
            hint="Typical response time"
          />
          <FormInput
            label="Uptime SLA"
            placeholder="e.g. 99.9%"
            value={form.uptime}
            onChange={(e) => setForm({ ...form, uptime: e.target.value })}
            hint="Guaranteed availability"
          />
          <FormSelect
            label="Pricing Model"
            options={PRICE_TYPES}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
      </SectionCard>

      <SectionCard title="Discoverability" icon={Tag} iconColor="text-purple-400">
        <TagsInput
          tags={form.tags}
          onChange={(tags) => setForm({ ...form, tags })}
        />
      </SectionCard>
    </>
  );
}

// ─── Step 2 — Endpoints ────────────────────────────────────────────────────────
function Step2({ form, setForm }) {
  const updateEndpoint = (idx, field, value) => {
    const updated = form.endpoints.map((ep, i) =>
      i === idx ? { ...ep, [field]: value } : ep
    );
    setForm({ ...form, endpoints: updated });
  };

  const addEndpoint = () => {
    setForm({ ...form, endpoints: [...form.endpoints, emptyEndpoint()] });
  };

  const removeEndpoint = (idx) => {
    setForm({ ...form, endpoints: form.endpoints.filter((_, i) => i !== idx) });
  };

  const addParam = (epIdx) => {
    const updated = form.endpoints.map((ep, i) =>
      i === epIdx ? { ...ep, params: [...ep.params, emptyParam()] } : ep
    );
    setForm({ ...form, endpoints: updated });
  };

  const updateParam = (epIdx, pIdx, field, value) => {
    const updated = form.endpoints.map((ep, i) =>
      i === epIdx
        ? {
            ...ep,
            params: ep.params.map((p, j) =>
              j === pIdx ? { ...p, [field]: value } : p
            ),
          }
        : ep
    );
    setForm({ ...form, endpoints: updated });
  };

  const removeParam = (epIdx, pIdx) => {
    const updated = form.endpoints.map((ep, i) =>
      i === epIdx ? { ...ep, params: ep.params.filter((_, j) => j !== pIdx) } : ep
    );
    setForm({ ...form, endpoints: updated });
  };

  return (
    <>
      {form.endpoints.length === 0 && (
        <div className="bg-slate-900/60 border border-dashed border-slate-700 rounded-xl p-8 text-center mb-6">
          <Terminal className="h-8 w-8 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium mb-1">No endpoints added yet</p>
          <p className="text-slate-500 text-xs mb-4">Add the API endpoints that developers will use</p>
        </div>
      )}

      {form.endpoints.map((ep, epIdx) => (
        <div key={epIdx} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 mb-4">
          {/* Endpoint Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${METHOD_COLORS[ep.method]}`}>
                {ep.method}
              </span>
              <span className="text-slate-400 text-xs font-mono">{ep.path || '/path'}</span>
            </div>
            <button
              type="button"
              onClick={() => removeEndpoint(epIdx)}
              className="text-slate-600 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <FormSelect
              label="Method"
              options={HTTP_METHODS}
              value={ep.method}
              onChange={(e) => updateEndpoint(epIdx, 'method', e.target.value)}
            />
            <FormInput
              label="Path *"
              placeholder="/v1/resource/{id}"
              value={ep.path}
              onChange={(e) => updateEndpoint(epIdx, 'path', e.target.value)}
              className="md:col-span-2"
            />
            <FormInput
              label="Summary"
              placeholder="Short one-line description"
              value={ep.summary}
              onChange={(e) => updateEndpoint(epIdx, 'summary', e.target.value)}
              className="md:col-span-3"
            />
            <FormTextarea
              label="Description"
              placeholder="Detailed explanation of what this endpoint does..."
              rows={2}
              value={ep.description}
              onChange={(e) => updateEndpoint(epIdx, 'description', e.target.value)}
              className="md:col-span-3"
            />
          </div>

          {/* Parameters */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Parameters</span>
              <button
                type="button"
                onClick={() => addParam(epIdx)}
                className="flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 border border-teal-500/30 hover:border-teal-400/50 px-2 py-1 rounded-lg transition-all"
              >
                <Plus className="h-3 w-3" /> Add Param
              </button>
            </div>
            {ep.params.length === 0 ? (
              <p className="text-[11px] text-slate-600 italic">No parameters — click "Add Param" to add one</p>
            ) : (
              <div className="space-y-2">
                {ep.params.map((param, pIdx) => (
                  <div key={pIdx} className="flex gap-2 items-start bg-slate-950/50 border border-slate-800/60 rounded-lg p-2.5">
                    <FormInput
                      placeholder="name"
                      value={param.name}
                      onChange={(e) => updateParam(epIdx, pIdx, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <FormSelect
                      options={PARAM_TYPES}
                      value={param.type}
                      onChange={(e) => updateParam(epIdx, pIdx, 'type', e.target.value)}
                      className="w-28"
                    />
                    <FormInput
                      placeholder="description"
                      value={param.description}
                      onChange={(e) => updateParam(epIdx, pIdx, 'description', e.target.value)}
                      className="flex-[2]"
                    />
                    <div className="flex flex-col items-center gap-1 pt-0.5">
                      <label className="text-[10px] text-slate-500">Req.</label>
                      <input
                        type="checkbox"
                        checked={param.required}
                        onChange={(e) => updateParam(epIdx, pIdx, 'required', e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-950 text-teal-600 focus:ring-teal-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeParam(epIdx, pIdx)}
                      className="text-slate-600 hover:text-rose-400 mt-1 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sample Payload */}
          <div className="mt-4">
            <FormTextarea
              label="Sample Payload (JSON)"
              placeholder={'{\n  "key": "value"\n}'}
              rows={3}
              value={ep.samplePayload}
              onChange={(e) => updateEndpoint(epIdx, 'samplePayload', e.target.value)}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEndpoint}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-teal-600/50 hover:border-teal-500 text-teal-500 hover:text-teal-400 py-3 rounded-xl text-xs font-medium transition-all"
      >
        <Plus className="h-4 w-4" /> Add Endpoint
      </button>
    </>
  );
}

// ─── Step 3 — Pricing Plans ───────────────────────────────────────────────────
function Step3({ form, setForm }) {
  const updatePlan = (idx, field, value) => {
    const updated = form.pricingPlans.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    );
    setForm({ ...form, pricingPlans: updated });
  };

  const addPlan = () => {
    setForm({ ...form, pricingPlans: [...form.pricingPlans, emptyPricingPlan()] });
  };

  const removePlan = (idx) => {
    setForm({ ...form, pricingPlans: form.pricingPlans.filter((_, i) => i !== idx) });
  };

  const updateFeature = (planIdx, featIdx, value) => {
    const updated = form.pricingPlans.map((p, i) => {
      if (i !== planIdx) return p;
      const features = p.features.map((f, j) => (j === featIdx ? value : f));
      return { ...p, features };
    });
    setForm({ ...form, pricingPlans: updated });
  };

  const addFeature = (planIdx) => {
    const updated = form.pricingPlans.map((p, i) =>
      i === planIdx ? { ...p, features: [...p.features, ''] } : p
    );
    setForm({ ...form, pricingPlans: updated });
  };

  const removeFeature = (planIdx, featIdx) => {
    const updated = form.pricingPlans.map((p, i) =>
      i === planIdx ? { ...p, features: p.features.filter((_, j) => j !== featIdx) } : p
    );
    setForm({ ...form, pricingPlans: updated });
  };

  return (
    <>
      {form.pricingPlans.length === 0 && (
        <div className="bg-slate-900/60 border border-dashed border-slate-700 rounded-xl p-8 text-center mb-6">
          <DollarSign className="h-8 w-8 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium mb-1">No pricing plans yet</p>
          <p className="text-slate-500 text-xs mb-4">Define Free, Pro, and Enterprise tiers for your API</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
        {form.pricingPlans.map((plan, idx) => (
          <div key={idx} className={`bg-slate-900/60 border rounded-xl p-5 flex flex-col relative ${plan.popular ? 'border-teal-500/60 shadow-lg shadow-teal-600/10' : 'border-slate-800/80'}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="flex items-center gap-1 bg-teal-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-lg shadow-teal-600/40">
                  <Star className="h-2.5 w-2.5 fill-white" /> POPULAR
                </span>
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Plan {idx + 1}</span>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={plan.popular}
                    onChange={(e) => updatePlan(idx, 'popular', e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-950 text-teal-600"
                  />
                  Popular
                </label>
                <button type="button" onClick={() => removePlan(idx)} className="text-slate-600 hover:text-rose-400 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <FormInput
                placeholder="Plan name (e.g. Pro)"
                value={plan.name}
                onChange={(e) => updatePlan(idx, 'name', e.target.value)}
              />
              <div className="flex gap-2">
                <FormInput
                  placeholder="Price (e.g. $49)"
                  value={plan.price}
                  onChange={(e) => updatePlan(idx, 'price', e.target.value)}
                  className="flex-1"
                />
                <FormInput
                  placeholder="/month"
                  value={plan.period}
                  onChange={(e) => updatePlan(idx, 'period', e.target.value)}
                  className="w-28"
                />
              </div>
              <FormInput
                placeholder="Requests (e.g. 500,000 req/mo)"
                value={plan.requests}
                onChange={(e) => updatePlan(idx, 'requests', e.target.value)}
              />
              <FormInput
                placeholder="CTA label (e.g. Get Started)"
                value={plan.cta}
                onChange={(e) => updatePlan(idx, 'cta', e.target.value)}
              />

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-slate-400 font-medium">Features</span>
                  <button type="button" onClick={() => addFeature(idx)} className="text-[10px] text-teal-400 hover:text-teal-300 flex items-center gap-0.5">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </div>
                <div className="space-y-1.5">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex gap-1.5 items-center">
                      <input
                        value={feat}
                        onChange={(e) => updateFeature(idx, fIdx, e.target.value)}
                        placeholder="Feature description"
                        className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-[11px] placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                      />
                      <button type="button" onClick={() => removeFeature(idx, fIdx)} className="text-slate-600 hover:text-rose-400 transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addPlan}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-teal-600/50 hover:border-teal-500 text-teal-500 hover:text-teal-400 py-3 rounded-xl text-xs font-medium transition-all"
      >
        <Plus className="h-4 w-4" /> Add Pricing Plan
      </button>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AddApiPage() {
  const router = useRouter();
  const [step, setStep]         = useState(0);
  const [token, setToken]       = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [serverError, setServerError] = useState(null);
  const [errors, setErrors]     = useState({});

  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    provider: '',
    version: 'v1.0.0',
    latency: '',
    uptime: '99.9%',
    price: 'Free',
    tags: [],
    endpoints: [],
    pricingPlans: [],
  });

  // ─── Auth check ───────────────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('token');
    setToken(stored);
    setAuthChecked(true);
  }, []);

  // ─── Validation for Step 1 ─────────────────────────────────────────────────
  const validateStep1 = () => {
    const errs = {};
    if (!form.name.trim())        errs.name        = 'API name is required';
    if (!form.category.trim())    errs.category    = 'Category is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    setServerError(null);

    // Parse endpoint sample payloads
    const endpoints = form.endpoints.map((ep) => {
      let samplePayload = {};
      try {
        if (ep.samplePayload && ep.samplePayload.trim()) {
          samplePayload = JSON.parse(ep.samplePayload);
        }
      } catch {
        // keep as empty object if invalid JSON
      }
      return { ...ep, samplePayload };
    });

    const payload = {
      ...form,
      endpoints,
      pricingPlans: form.pricingPlans.map((p) => ({
        ...p,
        features: p.features.filter(Boolean),
      })),
    };

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to publish API listing');
      }

      setSuccess(true);
      setTimeout(() => router.push('/'), 2500);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Auth gate ────────────────────────────────────────────────────────────
  if (!authChecked) return null;

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-slate-400 text-sm mb-6">
            You must be signed in with a{' '}
            <span className="text-teal-400 font-semibold">provider</span> account to publish an API listing.
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/login"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-teal-600/25"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─── Success state ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto mb-5 animate-pulse">
            <CheckCircle2 className="h-9 w-9 text-teal-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">API Published!</h2>
          <p className="text-slate-400 text-sm">Your API listing is now live on the marketplace. Redirecting you back...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Nav */}
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

      {/* Page Header */}
      <div className="border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
        <div className="max-w-3xl mx-auto px-6 py-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-[11px] font-semibold uppercase tracking-wider mb-4">
            <Globe className="h-3 w-3" /> Publish to Marketplace
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Add a New API Listing</h1>
          <p className="text-slate-400 text-sm">Fill in the details below to get your API discovered by thousands of developers.</p>
        </div>
      </div>

      {/* Main Form */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <StepIndicator current={step} />

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {step === 0 && <Step1 form={form} setForm={setForm} errors={errors} />}
        {step === 1 && <Step2 form={form} setForm={setForm} />}
        {step === 2 && <Step3 form={form} setForm={setForm} />}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800/60">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 px-4 py-2.5 rounded-xl transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Previous
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-teal-600/25"
            >
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-60 px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-teal-600/25"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5" /> Publish API
                </>
              )}
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <div className="bg-teal-600 p-1.5 rounded-md text-white">
            <Code2 className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs text-slate-500">
            {new Date().getFullYear()} APIHub Marketplace. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
