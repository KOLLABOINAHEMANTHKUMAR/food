import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, Loader2, CheckCircle2, ChevronRight, Utensils } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Checkout() {
  const { cart, placeOrder } = useApp();
  const navigate = useNavigate();

  // Load totals calculated in Cart page from sessionStorage
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    delivery: 0,
    tax: 0,
    total: 0
  });

  useEffect(() => {
    const subtotal = parseFloat(sessionStorage.getItem('checkout_subtotal') || '0');
    const discount = parseFloat(sessionStorage.getItem('checkout_discount') || '0');
    const delivery = parseFloat(sessionStorage.getItem('checkout_delivery') || '0');
    const tax = parseFloat(sessionStorage.getItem('checkout_tax') || '0');
    const total = parseFloat(sessionStorage.getItem('checkout_total') || '0');

    setTotals({ subtotal, discount, delivery, tax, total });

    // If cart is empty and not success, redirect back
    if (cart.length === 0 && !isSuccess) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'Credit Card'
  });

  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

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
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Start checkout animation
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
      
      // Place Order in State
      const order = placeOrder(
        { ...formData },
        totals.subtotal,
        totals.tax,
        totals.total
      );

      setPlacedOrder(order);
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Clear sessionStorage items
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
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-8 animate-fade-in">
        <div className="flex justify-center text-emerald-600">
          <CheckCircle2 className="h-20 w-20 stroke-[1.5]" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900">Order Placed Successfully!</h1>
          <p className="text-sm text-slate-500">
            Thank you for dining with us. Your chef is prepping your meal as we speak.
          </p>
          <div className="inline-block px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full font-mono font-bold text-xs">
            Ref ID: {placedOrder.id}
          </div>
        </div>

        {/* Live status simulation */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Truck className="h-4.5 w-4.5 text-emerald-600" />
              Delivery Estimate
            </h3>
            <span className="font-extrabold text-emerald-700 text-sm">20-25 mins</span>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full w-1/4 animate-pulse"></div>
            </div>
            <p className="text-xs text-slate-400 font-semibold text-center">
              Order Status: <span className="text-emerald-700">Kitchen Preparing</span>
            </p>
          </div>

          <hr className="border-slate-50" />

          {/* Delivery Details */}
          <div className="text-xs space-y-1 text-slate-500">
            <p className="font-bold text-slate-900">Delivering To:</p>
            <p>{placedOrder.customerInfo.name}</p>
            <p>{placedOrder.customerInfo.address}</p>
            <p>Phone: {placedOrder.customerInfo.phone}</p>
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
            to="/admin"
            className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-sm text-sm"
          >
            Go to Kitchen Dashboard
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
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 transition-all"
                placeholder="John Doe"
              />
              {formErrors.name && <p className="text-[11px] text-red-650 font-semibold">{formErrors.name}</p>}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 transition-all"
                  placeholder="john@example.com"
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
                  placeholder="+1 (555) 000-0000"
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
              Authorize & Place Order (${totals.total.toFixed(2)})
            </button>
          </form>
        </div>

        {/* Order Summary - Right Column */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="font-bold text-lg text-slate-950">Summary</h2>

          {/* Items */}
          <div className="max-h-60 overflow-y-auto pr-1 space-y-3 divide-y divide-slate-50">
            {cart.map((item, index) => (
              <div key={item.cartId} className={`flex justify-between items-start gap-4 ${index > 0 ? 'pt-3' : ''}`}>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">{item.name} <span className="text-slate-400">x {item.quantity}</span></span>
                  <span className="text-[10px] text-slate-400">Size: {item.selectedOptions.size}</span>
                </div>
                {/* We display customized item price calculations */}
                <span className="text-xs font-bold text-slate-800">
                  {/* Let's compute actual total price for the item */}
                  ${(
                    (item.price +
                      (item.selectedOptions.size === 'Small' ? -1.5 : item.selectedOptions.size === 'Large' ? 2.5 : 0) +
                      (item.selectedOptions.extras ? item.selectedOptions.extras.length * 0.75 : 0)) *
                    item.quantity
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-slate-100" />

          {/* Pricing detail */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount applied</span>
                <span>-${totals.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Delivery Charges</span>
              <span>{totals.delivery === 0 ? 'Free' : `$${totals.delivery.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>GST & Tax (10%)</span>
              <span>${totals.tax.toFixed(2)}</span>
            </div>
            <hr className="border-slate-50" />
            <div className="flex justify-between text-sm font-black text-slate-950">
              <span>Grand Total</span>
              <span className="text-emerald-700">${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
