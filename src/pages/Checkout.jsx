import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Truck, Loader2, CheckCircle2, ChevronRight, Utensils, Gift, Coins, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DeliveryMap from '../components/DeliveryMap';

// Custom lightweight canvas confetti effect
function ConfettiEffect() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const confetti = [];

    for (let i = 0; i < 150; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0
      });
    }

    let animationId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();

        if (p.y > canvas.height) {
          confetti[idx] = {
            ...p,
            x: Math.random() * canvas.width,
            y: -20,
            tilt: Math.random() * 10 - 5
          };
        }
      });
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50 w-full h-full" />;
}

export default function Checkout() {
  const { cart, placeOrder, orders, user, groupCart } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const giftItem = location.state?.giftItem;
  const isGiftingFromFeed = !!giftItem;
  const checkoutItems = isGiftingFromFeed ? [giftItem] : (groupCart.active ? groupCart.items : cart);

  // Load totals calculated in Cart page from sessionStorage
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    delivery: 0,
    tax: 0,
    total: 0
  });

  useEffect(() => {
    if (isGiftingFromFeed) {
      const subtotal = giftItem.price * giftItem.quantity;
      const discount = 0;
      const delivery = subtotal > 500 ? 0.00 : 49.00;
      const tax = subtotal * 0.10;
      const total = subtotal + delivery + tax;
      setTotals({ subtotal, discount, delivery, tax, total });
      setGiftChecked(true);
    } else {
      const subtotal = parseFloat(sessionStorage.getItem('checkout_subtotal') || '0');
      const discount = parseFloat(sessionStorage.getItem('checkout_discount') || '0');
      const delivery = parseFloat(sessionStorage.getItem('checkout_delivery') || '0');
      const tax = parseFloat(sessionStorage.getItem('checkout_tax') || '0');
      const total = parseFloat(sessionStorage.getItem('checkout_total') || '0');

      setTotals({ subtotal, discount, delivery, tax, total });

      if (checkoutItems.length === 0 && !isSuccess) {
        navigate('/cart');
      }
    }
  }, [cart, groupCart, navigate, giftItem, isGiftingFromFeed]);

  // Form States
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    paymentMethod: 'Credit Card'
  });

  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Advanced features states
  const [giftChecked, setGiftChecked] = useState(isGiftingFromFeed);
  const [giftEmail, setGiftEmail] = useState('');
  const [redeemCoinsChecked, setRedeemCoinsChecked] = useState(false);

  // Calculate Coin Redemption values
  const coinBalance = user?.coins || 0;
  const maxRedeemableCoins = Math.min(coinBalance, Math.floor(totals.total));
  const finalTotal = redeemCoinsChecked ? Math.max(0, totals.total - maxRedeemableCoins) : totals.total;

  // Calculate Group Split splits
  const groupSplits = {};
  if (groupCart.active) {
    groupCart.items.forEach(item => {
      const sizeModifiers = { 'Small': -50, 'Medium': 0, 'Large': 100 };
      const extrasModifiers = { 'Extra Sauce': 20, 'Extra Cheese': 50, 'Gluten-Free Prep': 60, 'Extra Aioli': 20 };
      
      let itemPrice = item.price + (sizeModifiers[item.selectedOptions.size] || 0);
      if (item.selectedOptions.extras) {
        item.selectedOptions.extras.forEach(extra => {
          itemPrice += (extrasModifiers[extra] || 20);
        });
      }
      const itemCost = itemPrice * item.quantity;
      const memberName = item.member || user?.name || 'Guest';
      groupSplits[memberName] = (groupSplits[memberName] || 0) + itemCost;
    });
  }

  const processingMessages = [
    'Validating delivery route coordinates...',
    'Establishing secure gateway encryption...',
    'Authenticating payment processing token...',
    'Sending order parameters to kitchen dashboard...'
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Invalid phone format';
    }
    if (!formData.address.trim()) errors.address = 'Delivery address is required';
    if (giftChecked && !giftEmail.trim()) {
      errors.giftEmail = 'Recipient email address is required';
    } else if (giftChecked && !/\S+@\S+\.\S+/.test(giftEmail)) {
      errors.giftEmail = 'Invalid recipient email';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    setProcessingStep(0);

    const stepInterval = setInterval(() => {
      setProcessingStep((step) => {
        if (step >= processingMessages.length - 1) {
          clearInterval(stepInterval);
          return step;
        }
        return step + 1;
      });
    }, 700);

    setTimeout(() => {
      clearInterval(stepInterval);
      
      // Place Order in State passing redeemed coins and gift details
      const order = placeOrder(
        { ...formData },
        totals.subtotal,
        totals.tax,
        finalTotal,
        redeemCoinsChecked ? maxRedeemableCoins : 0,
        giftChecked ? giftEmail : '',
        isGiftingFromFeed ? [giftItem] : null
      );

      setPlacedOrder(order);
      setIsProcessing(false);
      setIsSuccess(true);
      
      sessionStorage.removeItem('applied_discount_percent');
    }, 3200);
  };

  if (isProcessing) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center space-y-6">
        <div className="flex justify-center">
          <Loader2 className="h-16 w-16 text-emerald-600 animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Securing Order Connection</h2>
          <p className="text-sm text-slate-500 font-medium h-6 animate-pulse">
            {processingMessages[processingStep]}
          </p>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-700"
            style={{ width: `${((processingStep + 1) / processingMessages.length) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  }

  if (isSuccess && placedOrder) {
    const liveOrder = orders.find(o => o.id === placedOrder.id) || placedOrder;

    let statusDesc = 'Your order has been placed successfully and is awaiting kitchen confirmation.';

    if (liveOrder.status === 'Preparing') {
      statusDesc = 'Our chef is preparing your fresh organic dishes.';
    } else if (liveOrder.status === 'Out for Delivery') {
      statusDesc = 'Rider has picked up your package and is on the way.';
    } else if (liveOrder.status === 'Delivered') {
      statusDesc = 'Enjoy your delicious organic meal!';
    }

    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-8 animate-fade-in relative">
        {/* Render Confetti on Screen when status is Delivered! */}
        {liveOrder.status === 'Delivered' && <ConfettiEffect />}

        <div className="flex justify-center text-emerald-600">
          <CheckCircle2 className="h-20 w-20 stroke-[1.5]" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900">Order Placed Successfully!</h1>
          <p className="text-sm text-slate-500">
            {statusDesc}
          </p>
          <div className="inline-block px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full font-mono font-bold text-xs">
            Ref ID: {liveOrder.id}
          </div>
        </div>

        {/* Live Vector SVG Map tracking */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-50 pb-2">
            <Truck className="h-4.5 w-4.5 text-emerald-650" />
            Live Shipment Dispatch Map
          </h3>
          
          <DeliveryMap status={liveOrder.status} />

          {/* Delivery Details */}
          <div className="text-[10px] space-y-1.5 text-slate-500 pt-2 font-semibold border-t border-slate-50">
            <p className="font-bold text-slate-800 uppercase tracking-widest text-[8px]">Delivery Coordinates:</p>
            <p>Recipient: {liveOrder.customerInfo.name}</p>
            <p>Address: {liveOrder.customerInfo.address}</p>
            <p>Phone: {liveOrder.customerInfo.phone}</p>
            {liveOrder.giftRecipientEmail && (
              <p className="text-emerald-700 bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
                🎁 Gifted Order to: <span className="font-bold">{liveOrder.giftRecipientEmail}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Link
            to="/menu"
            className="flex-1 px-6 py-3 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 rounded-xl font-bold transition-all text-sm"
          >
            Continue Ordering
          </Link>
          <Link
            to="/track"
            className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-sm text-sm"
          >
            Track Live Order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-slate-900">Secure Checkout</h1>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form - Left Column */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="font-bold text-lg text-slate-950">Delivery Address Details</h2>

          <form onSubmit={handlePlaceOrderSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 transition-all"
                placeholder="Name"
              />
              {formErrors.name && <p className="text-[11px] text-red-650 font-semibold">{formErrors.name}</p>}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 transition-all"
                  placeholder="Email"
                />
                {formErrors.email && <p className="text-[11px] text-red-650 font-semibold">{formErrors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 transition-all"
                  placeholder="Phone Number"
                />
                {formErrors.phone && <p className="text-[11px] text-red-650 font-semibold">{formErrors.phone}</p>}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Delivery Address</label>
              <textarea
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 transition-all"
                placeholder="Apartment/Street Name, City, State, ZIP Code"
              ></textarea>
              {formErrors.address && <p className="text-[11px] text-red-650 font-semibold">{formErrors.address}</p>}
            </div>

            {/* Gift order toggle */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
              <label className="flex items-center gap-2.5 font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftChecked}
                  onChange={(e) => setGiftChecked(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="flex items-center gap-1">
                  <Gift className="h-4 w-4 text-emerald-600" />
                  Gift this Order to a friend 🎁
                </span>
              </label>
              {giftChecked && (
                <div className="space-y-1 animate-fade-in">
                  <input
                    type="email"
                    placeholder="Recipient Customer's Email"
                    value={giftEmail}
                    onChange={(e) => setGiftEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 bg-white"
                  />
                  {formErrors.giftEmail && <p className="text-[11px] text-red-650 font-semibold">{formErrors.giftEmail}</p>}
                </div>
              )}
            </div>

            {/* Wallet Coin toggle */}
            {coinBalance > 0 && (
              <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4">
                <label className="flex items-center gap-2.5 font-bold text-slate-850 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={redeemCoinsChecked}
                    onChange={(e) => setRedeemCoinsChecked(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span className="flex items-center gap-1">
                    <Coins className="h-4 w-4 text-emerald-600" />
                    Redeem Green Loyalty Coins (Balance: 🪙{coinBalance} = ₹{coinBalance})
                  </span>
                </label>
                {redeemCoinsChecked && (
                  <p className="text-[10px] text-emerald-750 font-extrabold mt-1.5 animate-pulse">
                    Applying 🪙{maxRedeemableCoins} Coins discount on this checkout!
                  </p>
                )}
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Select Payment Mode</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Credit Card', 'UPI / Net Banking', 'Cash on Delivery'].map((mode) => {
                  const isSelected = formData.paymentMethod === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: mode })}
                      className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-655 bg-slate-50'
                      }`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shield tag */}
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold pt-4">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span>SSL Encrypted simulated transaction gateway.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-sm pt-2"
            >
              Authorize & Place Order (₹{finalTotal.toFixed(2)})
            </button>
          </form>
        </div>

        {/* Order Summary - Right Column */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="font-bold text-lg text-slate-950">Summary</h2>

          {/* Group order split details */}
          {groupCart.active && Object.keys(groupSplits).length > 0 && (
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-2">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Users className="h-4.5 w-4.5 text-emerald-650" />
                Collaborative Bill Splits
              </h3>
              <div className="space-y-1 text-slate-600 text-[11px] font-bold">
                {Object.entries(groupSplits).map(([member, amount]) => (
                  <div key={member} className="flex justify-between border-b border-emerald-100/30 py-1 last:border-0">
                    <span>{member}</span>
                    <span>₹{amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="max-h-60 overflow-y-auto pr-1 space-y-3 divide-y divide-slate-50">
            {checkoutItems.map((item, index) => (
              <div key={item.cartId} className={`flex justify-between items-start gap-4 ${index > 0 ? 'pt-3' : ''}`}>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">{item.name} <span className="text-slate-400">x {item.quantity}</span></span>
                  <span className="text-[10px] text-slate-400">Size: {item.selectedOptions.size}</span>
                  {item.member && (
                    <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1 rounded block mt-0.5 w-fit">Added by: {item.member}</span>
                  )}
                  {item.note && (
                    <span className="text-[10px] text-slate-500 italic block mt-0.5 font-medium">Note: "{item.note}"</span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800">
                  ₹{(
                    (item.price +
                      (item.selectedOptions.size === 'Small' ? -50 : item.selectedOptions.size === 'Large' ? 100 : 0) +
                      (item.selectedOptions.extras ? item.selectedOptions.extras.length * 20 : 0)) *
                    item.quantity
                  )}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-slate-100" />

          {/* Pricing detail */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>₹{totals.subtotal}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount applied</span>
                <span>-₹{totals.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Delivery Charges</span>
              <span>{totals.delivery === 0 ? 'Free' : `₹${totals.delivery}`}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>GST & Tax (10%)</span>
              <span>₹{totals.tax.toFixed(2)}</span>
            </div>
            {redeemCoinsChecked && maxRedeemableCoins > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Coins Redeemed</span>
                <span>-₹{maxRedeemableCoins}</span>
              </div>
            )}
            <hr className="border-slate-50" />
            <div className="flex justify-between text-sm font-black text-slate-950">
              <span>Grand Total</span>
              <span className="text-emerald-700">₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
