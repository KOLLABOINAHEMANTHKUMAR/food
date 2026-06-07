import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, ShieldAlert, Truck, Loader2, Sparkles, Utensils } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [role, setRole] = useState('customer'); // 'customer', 'admin', 'delivery'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);

      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else if (res.user.role === 'delivery') {
          navigate('/delivery');
        } else {
          navigate('/');
        }
      } else {
        setError(res.message);
      }
    }, 1500);
  };

  // Helper for quick login buttons
  const triggerQuickLogin = (demoEmail, demoRole) => {
    setError('');
    setEmail(demoEmail);
    setPassword('password');
    setRole(demoRole);
    setLoading(true);

    setTimeout(() => {
      const res = login(demoEmail, 'password');
      setLoading(false);
      
      if (res.success) {
        if (demoRole === 'admin') {
          navigate('/admin');
        } else if (demoRole === 'delivery') {
          navigate('/delivery');
        } else {
          navigate('/');
        }
      } else {
        setError(res.message);
      }
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 min-h-[80vh] flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side Info Panel */}
        <div className="lg:col-span-5 space-y-6 lg:text-left text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Welcome to FreshBite Portal</span>
          </div>
          
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
            One Account,<br />
            Multiple <span className="text-emerald-600">Roles.</span>
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Access the customer food court to order, the restaurant admin suite to adjust menus, or the logistics center to track dispatch packages.
          </p>

          <div className="hidden lg:flex items-center gap-2.5 text-xs text-slate-400 font-medium pt-4">
            <ShieldCheck className="h-5 w-5 text-emerald-650" />
            <span>Secure SSL role-based authentication.</span>
          </div>
        </div>

        {/* Right Side Login Box */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-emerald-100 rounded-2xl text-emerald-600 mb-1">
              <Utensils className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Sign In to Your Account</h2>
            <p className="text-xs text-slate-400">Select your role or click a demo shortcut below</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 border border-slate-100 rounded-2xl">
            {[
              { id: 'customer', label: 'Customer', icon: <User className="h-3.5 w-3.5" /> },
              { id: 'admin', label: 'Admin', icon: <ShieldAlert className="h-3.5 w-3.5" /> },
              { id: 'delivery', label: 'Delivery', icon: <Truck className="h-3.5 w-3.5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRole(tab.id)}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  role === tab.id
                    ? 'bg-emerald-600 text-white shadow shadow-emerald-150'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-750 rounded-xl text-xs font-bold text-center">
              {error}
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-400 uppercase tracking-widest block">Email Address</label>
              <div className="relative flex items-center bg-slate-50 border rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
                <span className="pl-2.5 text-slate-400"><Mail className="h-4 w-4" /></span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={loading}
                  className="w-full text-xs pl-2.5 pr-2 py-2 bg-transparent focus:outline-none text-slate-905"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-400 uppercase tracking-widest block">Password</label>
              <div className="relative flex items-center bg-slate-50 border rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
                <span className="pl-2.5 text-slate-400"><Lock className="h-4 w-4" /></span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full text-xs pl-2.5 pr-2 py-2 bg-transparent focus:outline-none text-slate-905"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all pt-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Login into FreshBite</span>
              )}
            </button>
          </form>

          <hr className="border-slate-100" />

          {/* Quick Login Shortcuts */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-400 uppercase tracking-widest text-center text-[10px]">
              Quick Access Demo Shortcuts
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Customer Shortcut */}
              <button
                type="button"
                onClick={() => triggerQuickLogin('customer@freshbite.com', 'customer')}
                disabled={loading}
                className="flex flex-col items-center p-3.5 border border-slate-100 hover:border-emerald-200 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl transition-all text-center group disabled:opacity-50"
              >
                <span className="p-2 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl text-emerald-700 text-xs mb-1.5">
                  <User className="h-4.5 w-4.5" />
                </span>
                <span className="font-bold text-slate-900 text-xs">Customer</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Quick Login</span>
              </button>

              {/* Admin Shortcut */}
              <button
                type="button"
                onClick={() => triggerQuickLogin('admin@freshbite.com', 'admin')}
                disabled={loading}
                className="flex flex-col items-center p-3.5 border border-slate-100 hover:border-emerald-200 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl transition-all text-center group disabled:opacity-50"
              >
                <span className="p-2 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl text-emerald-700 text-xs mb-1.5">
                  <ShieldAlert className="h-4.5 w-4.5" />
                </span>
                <span className="font-bold text-slate-900 text-xs">Admin Console</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Quick Login</span>
              </button>

              {/* Delivery Shortcut */}
              <button
                type="button"
                onClick={() => triggerQuickLogin('delivery@freshbite.com', 'delivery')}
                disabled={loading}
                className="flex flex-col items-center p-3.5 border border-slate-100 hover:border-emerald-200 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl transition-all text-center group disabled:opacity-50"
              >
                <span className="p-2 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl text-emerald-700 text-xs mb-1.5">
                  <Truck className="h-4.5 w-4.5" />
                </span>
                <span className="font-bold text-slate-900 text-xs">Delivery Rider</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Quick Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
