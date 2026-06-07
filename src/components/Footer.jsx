import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="p-2 bg-emerald-950 rounded-xl text-emerald-400">
                <Utensils className="h-5 w-5" />
              </span>
              <span className="font-bold text-xl tracking-tight text-white">
                Fresh<span className="text-emerald-500">Bite</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400">
              Serving organic, fresh, and hand-prepared culinary creations delivered straight to your table. Experience dining, elevated.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-emerald-400 transition-colors">Our Menu</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-500" />
                <span>+1 (555) FRESH-BITE</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span>support@freshbite.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-500 font-bold" />
                <span>452 Organic Drive, Food City, FC 90210</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Simulation */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Newsletter</h3>
            <p className="text-sm text-slate-400 mb-3">
              Subscribe to receive updates, exclusive discounts, and chef recipes.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-3 py-2 text-slate-900 bg-white border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <hr className="my-8 border-slate-800" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FreshBite Food Systems. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Made with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> by Antigravity
          </p>
        </div>
      </div>
    </footer>
  );
}
