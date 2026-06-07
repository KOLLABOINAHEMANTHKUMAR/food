import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12 pb-16">
      {/* Title */}
      <div className="text-center space-y-2 max-w-lg mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Get In Touch</h1>
        <p className="text-slate-500">Have feedback or questions? Contact our customer support team directly.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact info cards - Left */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
            <h2 className="font-extrabold text-lg text-slate-950">Support Info</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Support</h4>
                  <p className="text-sm font-bold text-slate-800">+1 (555) FRESH-BITE</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Support</h4>
                  <p className="text-sm font-bold text-slate-800">support@freshbite.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Main Cloud-Kitchen</h4>
                  <p className="text-sm font-bold text-slate-800">452 Organic Drive, Food City, FC 90210</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operating Hours</h4>
                  <p className="text-sm font-bold text-slate-800">Mon - Sun: 8:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="h-48 rounded-3xl border border-slate-100 overflow-hidden relative shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&auto=format&fit=crop&q=60"
              alt="Map Placeholder"
              className="w-full h-full object-cover filter grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
              <span className="px-4 py-2 bg-white text-slate-900 rounded-xl font-bold text-xs shadow">
                San Francisco Hub Location
              </span>
            </div>
          </div>
        </div>

        {/* Contact Form - Right */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="font-extrabold text-lg text-slate-950">Send Message</h2>

          {isSent ? (
            <div className="py-12 text-center space-y-4 animate-fade-in">
              <div className="flex justify-center text-emerald-600">
                <CheckCircle2 className="h-16 w-16" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                We have registered your inquiry. Our support executives will write back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 transition-all"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 transition-all"
                  placeholder="Subject details"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Message Details</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 transition-all"
                  placeholder="Tell us what you need help with..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
              >
                <Send className="h-4.5 w-4.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
