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
  Lock, 
  Mail 
} from 'lucide-react';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setErrorMsg(null);
      try {
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Invalid email or password');
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-8">
        
        {/* Header Logo & Title */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center bg-teal-600 p-3 rounded-xl text-white mb-2 shadow-lg shadow-teal-600/30">
            <Code2 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-xs text-slate-400">Sign in to manage your API keys and subscriptions</p>
        </div>

        {/* General Error Banner */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* OAuth Social Buttons */}
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

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500 absolute">
            or log in with email
          </span>
        </div>

        {/* Form Fields */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="developer@company.com"
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
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="password" className="text-xs font-medium text-slate-300">Password</label>
              <a href="#forgot" className="text-[11px] text-teal-400 hover:underline">
                Forgot password?
              </a>
            </div>
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
            {formik.touched.password && formik.errors.password && (
              <p className="text-[10px] text-rose-400 mt-1 ml-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formik.values.rememberMe}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="h-3.5 w-3.5 rounded border-slate-800 bg-slate-950 text-teal-600 focus:ring-teal-500 focus:ring-offset-slate-900"
            />
            <label htmlFor="rememberMe" className="text-xs text-slate-400 select-none cursor-pointer">
              Remember this device for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-xs transition-all shadow-lg shadow-teal-600/25 mt-4"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Footer Redirect */}
        <p className="text-center text-xs text-slate-400 mt-8">
          Don't have an APIHub account?{' '}
          <a href="/signup" className="text-teal-400 hover:underline font-medium">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}