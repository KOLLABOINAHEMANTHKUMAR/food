import React, { useState, useEffect } from 'react';
import { Store, Home, Compass } from 'lucide-react';

export default function DeliveryMap({ status }) {
  // Map status to interpolation value t (0 to 1)
  let targetT = 0.05;
  if (status === 'Preparing') targetT = 0.3;
  if (status === 'Out for Delivery') targetT = 0.7;
  if (status === 'Delivered') targetT = 1.0;

  const [t, setT] = useState(0.05);

  // Smoothly animate t toward targetT
  useEffect(() => {
    let animFrame;
    const animate = () => {
      setT((prev) => {
        const diff = targetT - prev;
        if (Math.abs(diff) < 0.01) {
          return targetT;
        }
        return prev + diff * 0.08; // easing step
      });
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [targetT]);

  // Quadratic Bezier Curve coordinates:
  // P0 = (40, 70) [Restaurant]
  // P1 = (190, 20) [Checkpoint]
  // P2 = (340, 70) [Home]
  const p0 = { x: 40, y: 70 };
  const p1 = { x: 190, y: 20 };
  const p2 = { x: 340, y: 70 };

  // Calculate position along Bezier curve
  const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;

  // Tangent derivatives to calculate rotation angle
  const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <div className="bg-emerald-50/40 border border-emerald-100 rounded-3xl p-5 shadow-inner select-none relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Map Header */}
        <div className="flex items-center gap-1.5 self-start mb-4 text-[10px] font-black uppercase text-emerald-800 tracking-wider">
          <Compass className="h-4 w-4 animate-spin-slow text-emerald-650" />
          <span>Interactive Vector Dispatch Map</span>
        </div>

        {/* SVG Path Canvas */}
        <svg viewBox="0 0 380 120" className="w-full h-auto drop-shadow-sm">
          {/* Dotted Delivery Route Path */}
          <path
            d={`M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />

          {/* Completed Portion of Path */}
          <path
            d={`M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`}
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeDasharray="6 4"
            strokeDashoffset="0"
            strokeLinecap="round"
            style={{
              strokeDasharray: 400,
              strokeDashoffset: 400 - (t * 400)
            }}
          />

          {/* Restaurant node */}
          <g transform={`translate(${p0.x - 16}, ${p0.y - 16})`}>
            <circle cx="16" cy="16" r="20" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
            <foreignObject x="6" y="6" width="20" height="20">
              <Store className="h-5 w-5 text-sky-650" />
            </foreignObject>
            <text x="16" y="42" textAnchor="middle" className="text-[8px] font-extrabold fill-slate-500">Kitchen</text>
          </g>

          {/* Middle Checkpoint flag */}
          <g transform={`translate(${p1.x - 12}, ${p1.y - 12})`}>
            <circle cx="12" cy="12" r="6" fill={t >= 0.5 ? '#10b981' : '#cbd5e1'} className={t >= 0.3 && t < 0.7 ? 'animate-ping' : ''} />
            <circle cx="12" cy="12" r="4" fill={t >= 0.5 ? '#047857' : '#94a3b8'} />
            <text x="12" y="-4" textAnchor="middle" className="text-[7px] font-extrabold fill-slate-400">Transit</text>
          </g>

          {/* Home node */}
          <g transform={`translate(${p2.x - 16}, ${p2.y - 16})`}>
            <circle cx="16" cy="16" r="20" fill={t >= 1.0 ? '#d1fae5' : '#f1f5f9'} stroke={t >= 1.0 ? '#10b981' : '#cbd5e1'} strokeWidth="1.5" className={t >= 1.0 ? 'animate-bounce' : ''} />
            <foreignObject x="6" y="6" width="20" height="20">
              <Home className={`h-5 w-5 ${t >= 1.0 ? 'text-emerald-650' : 'text-slate-400'}`} />
            </foreignObject>
            <text x="16" y="42" textAnchor="middle" className="text-[8px] font-extrabold fill-slate-500">Home</text>
          </g>

          {/* Delivery Scooter Node */}
          <g transform={`translate(${x}, ${y}) rotate(${angle})`}>
            {/* Pulsing radar */}
            <circle cx="0" cy="0" r="14" fill="#10b981" opacity="0.3" className="animate-ping" />
            {/* Scooter background */}
            <circle cx="0" cy="0" r="10" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            {/* Simple representation of scooter using text / shape */}
            <text x="0" y="3.5" textAnchor="middle" className="text-[8px] font-bold fill-white">🛵</text>
          </g>
        </svg>

        {/* Step-by-Step Stepper below the SVG */}
        <div className="w-full grid grid-cols-4 gap-1 mt-6 text-center text-[9px] font-extrabold text-slate-450 tracking-wider">
          <div className={`p-1 rounded-lg ${status === 'Pending' ? 'bg-emerald-600 text-white shadow shadow-emerald-150' : ''}`}>
            PLACED
          </div>
          <div className={`p-1 rounded-lg ${status === 'Preparing' ? 'bg-emerald-600 text-white shadow shadow-emerald-150' : ''}`}>
            PREPPING
          </div>
          <div className={`p-1 rounded-lg ${status === 'Out for Delivery' ? 'bg-emerald-600 text-white shadow shadow-emerald-150' : ''}`}>
            ON THE WAY
          </div>
          <div className={`p-1 rounded-lg ${status === 'Delivered' ? 'bg-emerald-600 text-white shadow shadow-emerald-150' : ''}`}>
            DELIVERED
          </div>
        </div>
      </div>
    </div>
  );
}
