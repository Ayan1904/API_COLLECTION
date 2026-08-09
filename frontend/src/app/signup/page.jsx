'use client'; 

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaGithub } from 'react-icons/fa';
import { 
  Code2, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  X,
  Lock,
  Mail,
  User
} from 'lucide-react';

const signupSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  terms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions')
});

export default function SignUpModal({ isOpen = true, onClose = null }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push('/');
    }
  };

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      terms: false
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setErrorMsg(null);
      try {
        const response = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fullName: values.fullName,
            email: values.email,
            password: values.password,
            role: 'developer'
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        // Store auth token & user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to homepage
        router.push('/');
      } catch (err) {
        setErrorMsg(err.message || 'Something went wrong. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  if (!isOpen) return null;

  // Simple password strength calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(formik.values.password);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center justify-center bg-teal-600 p-2.5 rounded-xl text-white mb-2 shadow-lg shadow-teal-600/30">
              <Code2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Create your APIHub account</h2>
            <p className="text-xs text-slate-400">Get your free API key and start building in minutes</p>
          </div>

          {/* General Error Banner */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          {/* Social Sign Up Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              type="button"
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-white py-2.5 px-4 rounded-xl border border-slate-700/50 text-xs font-medium transition-all"
            >
              <FaGithub className="h-4 w-4" />
              GitHub
            </button>
            <button 
              type="button"
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-white py-2.5 px-4 rounded-xl border border-slate-700/50 text-xs font-medium transition-all"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.3s.7 2.6 1.9 5l3.7-2.5z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
              </svg>
              Google
            </button>
          </div>

          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500 absolute">
              or continue with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Alex Morgan"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 border rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                    formik.touched.fullName && formik.errors.fullName ? 'border-rose-500/50 focus:ring-rose-500' : 'border-slate-800'
                  }`}
                />
              </div>
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-[10px] text-rose-400 mt-1 ml-1">{formik.errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="alex@company.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 border rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                    formik.touched.email && formik.errors.email ? 'border-rose-500/50 focus:ring-rose-500' : 'border-slate-800'
                  }`}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-[10px] text-rose-400 mt-1 ml-1">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-950 border rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                    formik.touched.password && formik.errors.password ? 'border-rose-500/50 focus:ring-rose-500' : 'border-slate-800'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formik.values.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 rounded-full transition-all ${
                          strength >= step
                            ? strength <= 2 ? 'bg-amber-500' : 'bg-emerald-500'
                            : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {strength <= 1 && 'Weak password'}
                    {strength === 2 && 'Fair password'}
                    {strength === 3 && 'Good password'}
                    {strength === 4 && 'Strong password'}
                  </span>
                </div>
              )}
              {formik.touched.password && formik.errors.password && (
                <p className="text-[10px] text-rose-400 mt-1 ml-1">{formik.errors.password}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formik.values.terms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-0.5 h-3.5 w-3.5 rounded border-slate-800 bg-slate-950 text-teal-600 focus:ring-teal-500 focus:ring-offset-slate-900"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-400 leading-tight select-none cursor-pointer">
                I agree to the{' '}
                <a href="#terms" className="text-teal-400 hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#privacy" className="text-teal-400 hover:underline">Privacy Policy</a>.
              </label>
            </div>
            {formik.touched.terms && formik.errors.terms && (
              <p className="text-[10px] text-rose-400 mt-1 ml-1 block">{formik.errors.terms}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-xs transition-all shadow-lg shadow-teal-600/25 mt-4"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Sign In Redirect */}
          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-teal-400 hover:underline font-medium">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}