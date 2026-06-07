import React from 'react';
import { Leaf, Award, Heart, HelpCircle } from 'lucide-react';

export default function About() {
  const values = [
    {
      title: '100% Organic Sourcing',
      desc: 'We form close partnerships with local sustainable farms to ensure that every vegetable, herb, and fruit is completely pesticide-free.',
      icon: <Leaf className="h-6 w-6 text-emerald-600" />
    },
    {
      title: 'Michelin Grade Chefs',
      desc: 'Our culinary kitchen is led by award-winning chefs dedicated to designing healthy meals without compromising rich, exquisite flavors.',
      icon: <Award className="h-6 w-6 text-emerald-600" />
    },
    {
      title: 'Eco-Friendly Deliveries',
      desc: 'All packaging is biodegradable and compostable, and our logistics network prioritizes electric-powered bicycles for zero emissions.',
      icon: <Heart className="h-6 w-6 text-emerald-600" />
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-16 pb-16">
      {/* Hero */}
      <section className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Redefining Online <span className="text-emerald-600">Organic Dining</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-500 leading-relaxed">
          Founded in 2024, FreshBite began with a simple mission: to make organic, healthy meals accessible to everyone through advanced logistics and culinary excellence.
        </p>
      </section>

      {/* Philosophy Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((v, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4">
            <span className="inline-flex p-3 bg-emerald-50 rounded-2xl">{v.icon}</span>
            <h3 className="font-extrabold text-lg text-slate-950">{v.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </section>

      {/* Story Column */}
      <section className="lg:grid lg:grid-cols-12 lg:gap-12 items-center bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">Our Farm to Fork Philosophy</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Unlike traditional fast-food services that rely on factory-processed ingredients, we make all dressings, pastries, sauces, and doughs from scratch daily in our cloud-kitchen facility.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            By avoiding artificial preservatives and processed sugars, we bring meals that not only satisfy hunger but also nurture vitality and physical health.
          </p>
        </div>
        <div className="lg:col-span-6 mt-8 lg:mt-0 overflow-hidden rounded-2xl aspect-video bg-slate-100 border border-slate-50">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d159f87b81?w=500&auto=format&fit=crop&q=80"
            alt="Organic Farm Crops"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}
