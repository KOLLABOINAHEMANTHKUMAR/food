import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, ShieldAlert, Truck, Loader2, Sparkles, Utensils, CheckCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import foodBanner from '../assets/login_food_banner.png';

export default function Login() {
  const { login, registerUser } = useApp();
  const navigate = useNavigate();

  // Mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState('login');
  
  // Login Form States
  const [loginRole, setLoginRole] = useState('customer');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('customer');
  const [regReferralCode, setRegReferralCode] = useState('');

  // Common UI States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Please fill in all email and password fields.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = login(loginEmail, loginPassword);
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
    }, 1200);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      setError('All fields are required.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = registerUser(regName, regEmail, regPassword, regRole, regReferralCode);
      setLoading(false);

      if (res.success) {
        setSuccess('Registration successful! You can now log in.');
        setLoginEmail(regEmail);
        setLoginPassword(regPassword);
        setLoginRole(regRole);
        setAuthMode('login');
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setRegConfirmPassword('');
        setRegReferralCode('');
      } else {
        setError(res.message);
      }
    }, 1500);
  };

  // Helper for quick login buttons
  const triggerQuickLogin = (demoEmail, demoRole) => {
    setError('');
    setSuccess('');
    setLoginEmail(demoEmail);
    setLoginPassword('password');
    setLoginRole(demoRole);
    setAuthMode('login');
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
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-[85vh] flex items-center justify-center">
      <div className="w-full bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-md lg:grid lg:grid-cols-12 min-h-[680px]">
        
        {/* Left Side: Welcoming Image Banner Panel */}
        <div className="hidden lg:block lg:col-span-5 relative bg-slate-900 overflow-hidden select-none">
          <img
            src={foodBanner}
            alt="Fresh Healthy Food Salad"
            className="absolute inset-0 h-full w-full object-cover opacity-70 scale-105 transition-transform duration-10000 ease-out hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/35 to-slate-950/20"></div>
          
          <div className="absolute inset-0 p-10 flex flex-col justify-between text-white z-10">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-emerald-600/90 rounded-xl text-white backdrop-blur-sm">
                <Utensils className="h-5 w-5" />
              </span>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Fresh<span className="text-emerald-400">Bite</span>
              </span>
            </div>

            {/* Welcome messages */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold rounded-full backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Guaranteed Freshness
              </span>
              <h2 className="text-3xl font-black tracking-tight leading-tight">
                Freshness in every bite, convenience in every click.
              </h2>
              <p className="text-slate-350 text-xs leading-relaxed">
                Log in to order organic dishes hand-prepared by local chefs, manage commercial kitchen boards, or deliver fresh dispatches around your city.
              </p>

              {/* USP List */}
              <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>100% Organic & Farm-sourced Ingredients</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Interactive Real-time Administrative Dashboards</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Logistics Management for Delivery Partners</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 font-medium">© {new Date().getFullYear()} FreshBite Food Systems</p>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-8">
          {/* Header Switcher */}
          <div className="space-y-4">
            <div className="flex border-b border-slate-100 pb-1">
              <button
                onClick={() => { setAuthMode('login'); setError(''); }}
                className={`flex-1 text-center pb-3 text-sm font-bold transition-all relative ${
                  authMode === 'login'
                    ? 'text-emerald-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-600'
                    : 'text-slate-400 hover:text-slate-655'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthMode('register'); setError(''); }}
                className={`flex-1 text-center pb-3 text-sm font-bold transition-all relative ${
                  authMode === 'register'
                    ? 'text-emerald-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-600'
                    : 'text-slate-400 hover:text-slate-655'
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-750 border border-red-100 rounded-xl text-xs font-bold text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 text-emerald-750 border border-emerald-100 rounded-xl text-xs font-bold text-center">
                {success}
              </div>
            )}

            {/* ----------------- LOGIN FORM ----------------- */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                {/* Role selection tab */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Login Role</label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 border border-slate-100 rounded-xl">
                    {[
                      { id: 'customer', label: 'Customer' },
                      { id: 'admin', label: 'Admin' },
                      { id: 'delivery', label: 'Delivery' }
                    ].map((roleTab) => (
                      <button
                        key={roleTab.id}
                        type="button"
                        onClick={() => setLoginRole(roleTab.id)}
                        className={`py-2 rounded-lg text-xs font-bold transition-all ${
                          loginRole === roleTab.id
                            ? 'bg-emerald-600 text-white shadow shadow-emerald-150'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {roleTab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                  <div className="relative flex items-center bg-slate-50 border rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
                    <span className="pl-2 text-slate-400"><Mail className="h-4 w-4" /></span>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@example.com"
                      disabled={loading}
                      className="w-full text-xs pl-2 pr-2 py-2 bg-transparent focus:outline-none text-slate-900"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Password</label>
                  <div className="relative flex items-center bg-slate-50 border rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
                    <span className="pl-2 text-slate-400"><Lock className="h-4 w-4" /></span>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                      className="w-full text-xs pl-2 pr-2 py-2 bg-transparent focus:outline-none text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-emerald-150 transition-all pt-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ----------------- REGISTER FORM ----------------- */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                {/* Full name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                  <div className="relative flex items-center bg-slate-50 border rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
                    <span className="pl-2 text-slate-400"><User className="h-4 w-4" /></span>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Full Name"
                      disabled={loading}
                      className="w-full text-xs pl-2 pr-2 py-2 bg-transparent focus:outline-none text-slate-900"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                  <div className="relative flex items-center bg-slate-50 border rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
                    <span className="pl-2 text-slate-400"><Mail className="h-4 w-4" /></span>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@example.com"
                      disabled={loading}
                      className="w-full text-xs pl-2 pr-2 py-2 bg-transparent focus:outline-none text-slate-900"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider block">Password</label>
                    <div className="relative flex items-center bg-slate-50 border rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
                      <span className="pl-2 text-slate-400"><Lock className="h-4 w-4" /></span>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={loading}
                        className="w-full text-xs pl-2 pr-2 py-2 bg-transparent focus:outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider block">Confirm Password</label>
                    <div className="relative flex items-center bg-slate-50 border rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
                      <span className="pl-2 text-slate-400"><Lock className="h-4 w-4" /></span>
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={loading}
                        className="w-full text-xs pl-2 pr-2 py-2 bg-transparent focus:outline-none text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Referral Code */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Referral Code (Optional)</label>
                  <div className="relative flex items-center bg-slate-50 border rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
                    <span className="pl-2 text-slate-400"><Sparkles className="h-4 w-4" /></span>
                    <input
                      type="text"
                      value={regReferralCode}
                      onChange={(e) => setRegReferralCode(e.target.value)}
                      placeholder="e.g. FRESH-ALEX-83"
                      disabled={loading}
                      className="w-full text-xs pl-2 pr-2 py-2 bg-transparent focus:outline-none text-slate-900"
                    />
                  </div>
                </div>

                {/* Role selection tab */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Register As</label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 border border-slate-100 rounded-xl">
                    {[
                      { id: 'customer', label: 'Customer' },
                      { id: 'admin', label: 'Admin' },
                      { id: 'delivery', label: 'Delivery' }
                    ].map((roleTab) => (
                      <button
                        key={roleTab.id}
                        type="button"
                        onClick={() => setRegRole(roleTab.id)}
                        className={`py-2 rounded-lg text-xs font-bold transition-all ${
                          regRole === roleTab.id
                            ? 'bg-emerald-600 text-white shadow shadow-emerald-150'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {roleTab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-emerald-150 transition-all pt-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Register Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Quick Demo Credentials Shortcuts */}
          <div className="space-y-3.5">
            <h3 className="font-bold text-slate-400 uppercase tracking-widest text-center text-[10px]">
              Quick Access Demo Shortcuts
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => triggerQuickLogin('customer@freshbite.com', 'customer')}
                disabled={loading}
                className="flex flex-col items-center p-3 border border-slate-100 hover:border-emerald-250 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl transition-all text-center group disabled:opacity-50"
              >
                <span className="p-2 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl text-emerald-750 text-xs mb-1.5">
                  <User className="h-4.5 w-4.5" />
                </span>
                <span className="font-bold text-slate-800 text-[11px]">Customer</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Quick Login</span>
              </button>

              <button
                type="button"
                onClick={() => triggerQuickLogin('admin@freshbite.com', 'admin')}
                disabled={loading}
                className="flex flex-col items-center p-3 border border-slate-100 hover:border-emerald-250 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl transition-all text-center group disabled:opacity-50"
              >
                <span className="p-2 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl text-emerald-750 text-xs mb-1.5">
                  <ShieldAlert className="h-4.5 w-4.5" />
                </span>
                <span className="font-bold text-slate-800 text-[11px]">Admin Panel</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Quick Login</span>
              </button>

              <button
                type="button"
                onClick={() => triggerQuickLogin('delivery@freshbite.com', 'delivery')}
                disabled={loading}
                className="flex flex-col items-center p-3 border border-slate-100 hover:border-emerald-250 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl transition-all text-center group disabled:opacity-50"
              >
                <span className="p-2 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl text-emerald-750 text-xs mb-1.5">
                  <Truck className="h-4.5 w-4.5" />
                </span>
                <span className="font-bold text-slate-800 text-[11px]">Delivery Rider</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Quick Login</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
