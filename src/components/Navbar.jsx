import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, LogOut, User, ShieldAlert, Truck, Utensils } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { cart, user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path) => location.pathname === path;

  const handleLogoutClick = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav className="glass-nav sticky top-0 z-50 border-b border-emerald-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to={user?.role === 'admin' ? '/admin' : user?.role === 'delivery' ? '/delivery' : '/'} className="flex items-center space-x-2">
              <span className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                <Utensils className="h-6 w-6" />
              </span>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                Fresh<span className="text-emerald-600">Bite</span>
              </span>
            </Link>
          </div>

          {/* Center Navigation Links - Adaptive based on Role */}
          <div className="hidden md:flex space-x-8 items-center">
            {/* If anonymous or Customer role */}
            {(!user || user.role === 'customer') && (
              <>
                <Link
                  to="/"
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive('/') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-500'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/menu"
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive('/menu') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-500'
                  }`}
                >
                  Our Menu
                </Link>
                <Link
                  to="/about"
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive('/about') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-500'
                  }`}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive('/contact') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-500'
                  }`}
                >
                  Contact
                </Link>
              </>
            )}

            {/* If Admin role */}
            {user?.role === 'admin' && (
              <span className="text-sm font-semibold px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-full flex items-center gap-1.5">
                <ShieldAlert className="h-4.5 w-4.5" />
                Restaurant Administration Board
              </span>
            )}

            {/* If Delivery role */}
            {user?.role === 'delivery' && (
              <span className="text-sm font-semibold px-3.5 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full flex items-center gap-1.5">
                <Truck className="h-4.5 w-4.5" />
                Logistics Dispatch panel
              </span>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Active user status badge */}
                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className={`p-1.5 rounded-lg text-xs ${
                    user.role === 'admin' ? 'bg-amber-100 text-amber-700' :
                    user.role === 'delivery' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {user.role === 'admin' ? <ShieldAlert className="h-3.5 w-3.5" /> :
                     user.role === 'delivery' ? <Truck className="h-3.5 w-3.5" /> :
                     <User className="h-3.5 w-3.5" />}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 leading-none">{user.name}</h4>
                    <span className="text-[9px] text-slate-400 capitalize block mt-0.5">{user.role} Account</span>
                  </div>
                </div>

                {/* Cart link only for Customer role */}
                {user.role === 'customer' && (
                  <Link
                    to="/cart"
                    className="relative p-2.5 text-slate-650 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 rounded-xl transition-all"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-500 hover:text-red-750 rounded-xl text-sm font-semibold transition-all"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-emerald-150"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile navigation triggers */}
          <div className="md:hidden flex items-center space-x-3">
            {user?.role === 'customer' && (
              <Link
                to="/cart"
                className="relative p-2 text-slate-600 hover:text-emerald-600 rounded-lg"
              >
                <ShoppingBag className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-650 hover:text-emerald-600 rounded-lg focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-inner text-xs">
          {user ? (
            <>
              {/* User Avatar details */}
              <div className="px-3 py-3 bg-slate-50 border rounded-xl flex items-center gap-2 mb-3">
                <span className="p-1.5 bg-emerald-100 rounded-lg text-emerald-750 text-xs">
                  <User className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="font-bold text-slate-800 leading-none">{user.name}</h4>
                  <span className="text-[9px] text-slate-400 block capitalize mt-0.5">{user.role} role active</span>
                </div>
              </div>

              {/* Paths */}
              {user.role === 'customer' && (
                <>
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                      isActive('/') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/menu"
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                      isActive('/menu') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Our Menu
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                      isActive('/about') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    About Us
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                      isActive('/contact') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Contact
                  </Link>
                </>
              )}

              {user.role === 'admin' && (
                <div className="px-3 py-2 text-sm font-semibold text-emerald-750 bg-emerald-55/40 rounded-lg">
                  Restaurant Admin Mode Active
                </div>
              )}

              {user.role === 'delivery' && (
                <div className="px-3 py-2 text-sm font-semibold text-indigo-705 bg-indigo-50 rounded-lg">
                  Logistics Driver Mode Active
                </div>
              )}

              <hr className="my-2 border-slate-100" />
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-red-650 hover:bg-red-50 rounded-xl text-base font-medium"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block text-center py-3 bg-emerald-600 text-white font-bold rounded-xl text-base"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
