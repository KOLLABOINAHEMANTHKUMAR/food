import React, { useState } from 'react';
import { HelpCircle, RefreshCw, Gift } from 'lucide-react';
import { useApp } from '../context/AppContext';

const WHEEL_SECTORS = [
  { code: 'FRESH50', label: '50% OFF', color: '#10b981', text: '#ffffff' },
  { code: 'TRY_AGAIN', label: 'Better Luck', color: '#f1f5f9', text: '#64748b' },
  { code: 'ORGANIC30', label: '30% OFF', color: '#34d399', text: '#022c22' },
  { code: 'WELCOME100', label: '₹100 OFF', color: '#059669', text: '#ffffff' },
  { code: 'TRY_AGAIN_2', label: 'Spin Again', color: '#e2e8f0', text: '#475569' },
  { code: 'FRESH10', label: '10% OFF', color: '#6ee7b7', text: '#064e3b' }
];

export default function SpinWheel({ onApplyCoupon }) {
  const { triggerToast } = useApp();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);
  const [prize, setPrize] = useState(null);

  // Synthesizer Audio click sound using Web Audio API!
  const playClickSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (err) {
      // Audio context block bypass
    }
  };

  const handleSpinWheel = () => {
    if (spinning || hasSpun) return;

    setSpinning(true);
    setPrize(null);

    // Pick a random prize index (prefer discount coupons over try again!)
    const winningIndex = Math.floor(Math.random() * WHEEL_SECTORS.length);
    const sectorAngle = 360 / WHEEL_SECTORS.length;
    // Calculate rotation degree. We rotate 5 full times (1800 deg) plus slice adjustment.
    // The arrow is pointing at the top (90 degrees or 270 degrees depending on offset).
    // Let's target the top center pointer.
    const targetDeg = 1800 + (360 - (winningIndex * sectorAngle) - (sectorAngle / 2));
    
    setRotation(targetDeg);

    // Play tick sounds at intervals to simulate wheel rotation
    let ticks = 0;
    const tickInterval = setInterval(() => {
      ticks++;
      playClickSound();
      if (ticks >= 20) clearInterval(tickInterval);
    }, 150);

    setTimeout(() => {
      clearInterval(tickInterval);
      setSpinning(false);
      setHasSpun(true);

      const sector = WHEEL_SECTORS[winningIndex];
      setPrize(sector);

      if (sector.code.startsWith('TRY_AGAIN')) {
        triggerToast('No coupon this time! But you can try shopping other fresh organic foods.', 'info');
      } else {
        triggerToast(`🎉 You won coupon ${sector.code}! (${sector.label})`, 'success');
        if (onApplyCoupon) {
          onApplyCoupon(sector.code);
        }
      }
    }, 4000);
  };

  const resetWheel = () => {
    setHasSpun(false);
    setRotation(0);
    setPrize(null);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center select-none text-xs">
      <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 mb-1">
        <Gift className="h-4.5 w-4.5 text-emerald-600 animate-bounce" />
        Gamified Spin-the-Wheel
      </h3>
      <p className="text-[10px] text-slate-450 font-semibold mb-5 text-center">
        Spin our FreshBite organic wheel to win exclusive promo code discounts!
      </p>

      {/* Wheel Container */}
      <div className="relative w-64 h-64 mb-6">
        {/* Pointer arrow */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-red-500 drop-shadow-md"></div>
        {/* Inner pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white rounded-full border border-slate-200 shadow flex items-center justify-center font-bold text-slate-700">
          🎯
        </div>

        {/* SVG Circle Wheel */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full rounded-full border border-slate-200 shadow-md transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 4s cubic-bezier(0.1, 0.8, 0.3, 1)' : 'none'
          }}
        >
          {WHEEL_SECTORS.map((sector, index) => {
            const angle = 360 / WHEEL_SECTORS.length;
            const startAngle = index * angle;
            const endAngle = (index + 1) * angle;

            // Radians for coordinates
            const radStart = ((startAngle - 90) * Math.PI) / 180;
            const radEnd = ((endAngle - 90) * Math.PI) / 180;

            // Coordinates
            const x1 = 100 + 100 * Math.cos(radStart);
            const y1 = 100 + 100 * Math.sin(radStart);
            const x2 = 100 + 100 * Math.cos(radEnd);
            const y2 = 100 + 100 * Math.sin(radEnd);

            // Text coordinates (mid-angle)
            const textAngle = startAngle + angle / 2 - 90;
            const radText = (textAngle * Math.PI) / 180;
            const tx = 100 + 65 * Math.cos(radText);
            const ty = 100 + 65 * Math.sin(radText);

            return (
              <g key={index}>
                {/* Sector Path */}
                <path
                  d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                  fill={sector.color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                {/* Text label */}
                <text
                  x={tx}
                  y={ty}
                  fill={sector.text}
                  fontSize="7"
                  fontWeight="bold"
                  textAnchor="middle"
                  transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                >
                  {sector.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Button Controls */}
      {!hasSpun ? (
        <button
          onClick={handleSpinWheel}
          disabled={spinning}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all pt-1.5 flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${spinning ? 'animate-spin' : ''}`} />
          {spinning ? 'SPINNING WHEEL...' : 'SPIN THE WHEEL NOW'}
        </button>
      ) : (
        <div className="w-full text-center space-y-2">
          {prize && !prize.code.startsWith('TRY_AGAIN') ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-2xl font-bold flex flex-col items-center">
              <span className="text-[10px] uppercase text-emerald-500 font-extrabold tracking-wider">Coupon Code Applied</span>
              <span className="font-mono text-base font-black tracking-widest text-emerald-950 mt-0.5">{prize.code}</span>
            </div>
          ) : (
            <p className="text-slate-450 font-semibold py-2">Hard luck! Give it another try on your next visit.</p>
          )}
          <button
            onClick={resetWheel}
            className="text-[10px] text-emerald-650 hover:text-emerald-800 font-extrabold flex items-center gap-1 mx-auto pt-1"
          >
            <RefreshCw className="h-3 w-3" />
            Spin Again
          </button>
        </div>
      )}
    </div>
  );
}
