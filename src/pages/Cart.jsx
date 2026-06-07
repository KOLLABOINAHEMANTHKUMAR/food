import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Percent, Users, UserPlus, LogOut, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SpinWheel from '../components/SpinWheel';

export default function Cart() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    groupCart,
    startGroupOrder,
    joinGroupOrder,
    leaveGroupOrder,
    coupons,
    user,
    updateGroupCartItemNote
  } = useApp();
  
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [groupPinInput, setGroupPinInput] = useState('');

  // Source items list: use either collaborative group items or personal cart items
  const activeCartItems = groupCart.active ? groupCart.items : cart;

  const subtotal = activeCartItems.reduce((sum, item) => {
    const sizeModifiers = { 'Small': -50, 'Medium': 0, 'Large': 100 };
    const extrasModifiers = { 'Extra Sauce': 20, 'Extra Cheese': 50, 'Gluten-Free Prep': 60, 'Extra Aioli': 20 };
    
    let itemUnitPrice = item.price + (sizeModifiers[item.selectedOptions.size] || 0);
    if (item.selectedOptions.extras && item.selectedOptions.extras.length > 0) {
      item.selectedOptions.extras.forEach(extra => {
        itemUnitPrice += (extrasModifiers[extra] || 20);
      });
    }
    return sum + (itemUnitPrice * item.quantity);
  }, 0);

  const discount = subtotal * (discountPercent / 100);
  const deliveryFee = subtotal > 500 ? 0.00 : 49.00;
  const taxRate = 0.10; // 10% tax
  const tax = (subtotal - discount) * taxRate;
  const total = subtotal - discount + deliveryFee + tax;

  const applyPromoCode = (code) => {
    setCoupon(code);
    setCouponError('');
    setCouponSuccess('');
    
    const matched = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (matched) {
      setDiscountPercent(matched.discount);
      setCouponSuccess(`Promo code ${matched.code} applied: ${matched.discount}% discount!`);
      sessionStorage.setItem('applied_discount_percent', matched.discount.toString());
    } else {
      setDiscountPercent(0);
      setCouponError('Invalid promo code.');
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    applyPromoCode(coupon);
  };

  const handleProceedToCheckout = () => {
    sessionStorage.setItem('checkout_subtotal', subtotal.toFixed(2));
    sessionStorage.setItem('checkout_discount', discount.toFixed(2));
    sessionStorage.setItem('checkout_delivery', deliveryFee.toFixed(2));
    sessionStorage.setItem('checkout_tax', tax.toFixed(2));
    sessionStorage.setItem('checkout_total', total.toFixed(2));
    navigate('/checkout');
  };

  const handleJoinGroup = (e) => {
    e.preventDefault();
    if (groupPinInput.trim()) {
      joinGroupOrder(groupPinInput.trim());
      setGroupPinInput('');
    }
  };

  // Helper to render customized item unit price
  const getItemUnitPrice = (item) => {
    const sizeModifiers = { 'Small': -50, 'Medium': 0, 'Large': 100 };
    const extrasModifiers = { 'Extra Sauce': 20, 'Extra Cheese': 50, 'Gluten-Free Prep': 60, 'Extra Aioli': 20 };
    
    let price = item.price + (sizeModifiers[item.selectedOptions.size] || 0);
    if (item.selectedOptions.extras) {
      item.selectedOptions.extras.forEach(extra => {
        price += (extrasModifiers[extra] || 20);
      });
    }
    return price;
  };

  if (activeCartItems.length === 0 && !groupCart.active) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-6">
        <span className="inline-flex p-6 bg-slate-100 text-slate-400 rounded-full">
          <ShoppingBag className="h-12 w-12" />
        </span>
        <h2 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-slate-500 max-w-sm mx-auto">
          Browse our organic dishes and add mouthwatering meals to your cart.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/menu"
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm shadow-emerald-250"
          >
            Browse Our Menu
          </Link>
          <div className="flex gap-2 border border-slate-200 p-1 rounded-xl bg-white">
            <input
              type="text"
              placeholder="Enter PIN (e.g. 4902)"
              value={groupPinInput}
              onChange={(e) => setGroupPinInput(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:bg-white text-slate-800 w-36 font-semibold"
            />
            <button
              onClick={handleJoinGroup}
              className="px-4 py-1.5 bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Join Group
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Your Basket</h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            {groupCart.active ? `Collaborative Group Cart (Session PIN: GRP-${groupCart.code})` : 'Personal checkout cart'}
          </p>
        </div>

        {/* Group Ordering Controls */}
        {groupCart.active ? (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-2.5">
            <span className="text-[10px] font-black text-emerald-850 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              Joined: {groupCart.members.join(', ')}
            </span>
            <button
              onClick={leaveGroupOrder}
              className="px-3 py-1.5 bg-red-105 hover:bg-red-200 text-red-750 border border-red-200 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1"
            >
              <LogOut className="h-3 w-3" />
              Leave Group
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              onClick={startGroupOrder}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Users className="h-4 w-4" />
              Start Group Order
            </button>
            <form onSubmit={handleJoinGroup} className="flex gap-2 border border-slate-200 p-1 rounded-xl bg-white shadow-sm">
              <input
                type="text"
                placeholder="Session PIN"
                value={groupPinInput}
                onChange={(e) => setGroupPinInput(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:bg-white text-slate-800 w-28 font-semibold"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-650 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all"
              >
                Join
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          {activeCartItems.map((item) => {
            const unitPrice = getItemUnitPrice(item);
            return (
              <div
                key={item.cartId}
                className="flex flex-col sm:flex-row items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all gap-4"
              >
                {/* Image & details */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{item.name}</h3>
                    <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                      <p>Portion: <span className="font-semibold text-slate-655">{item.selectedOptions.size}</span></p>
                      {item.selectedOptions.extras && item.selectedOptions.extras.length > 0 && (
                        <p>Add-ons: <span className="font-semibold text-slate-655">{item.selectedOptions.extras.join(', ')}</span></p>
                      )}
                      {groupCart.active && item.member && (
                        <p>Added by: <span className="font-extrabold text-emerald-650 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px]">{item.member}</span></p>
                      )}
                      {groupCart.active && (
                        <div className="mt-2">
                          <label className="text-[10px] text-slate-400 font-semibold block mb-1">Custom Notes:</label>
                          <input
                            type="text"
                            placeholder="e.g. No onions, extra spicy"
                            value={item.note || ''}
                            onChange={(e) => updateGroupCartItemNote(item.cartId, e.target.value)}
                            className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white text-[11px] text-slate-800 font-medium"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing & Control panel */}
                <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-50">
                  {/* Quantity adjustment */}
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                    <button
                      onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                      className="p-1.5 text-slate-500 hover:text-slate-950 transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 font-bold text-sm text-slate-900 w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                      className="p-1.5 text-slate-500 hover:text-slate-950 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Subtotal price tag */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-extrabold text-slate-950">₹{(unitPrice * item.quantity)}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">₹{unitPrice} each</span>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="p-2 text-slate-400 hover:text-red-650 transition-colors hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals Summary - Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
            <h2 className="font-bold text-lg text-slate-950">Bill Details</h2>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Item Subtotal</span>
                <span className="text-slate-800">₹{subtotal}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Delivery Fee</span>
                <span className="text-slate-800">
                  {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">Free</span> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>GST/Tax (10%)</span>
                <span className="text-slate-800">₹{tax.toFixed(2)}</span>
              </div>
              <hr className="border-slate-100" />
              <div className="flex justify-between text-base font-black text-slate-900">
                <span>Grand Total</span>
                <span className="text-emerald-700">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Code section */}
            <div className="pt-2">
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all">
                  <div className="pl-2.5 text-slate-400">
                    <Percent className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="w-full pl-2 pr-3 py-2 text-xs bg-transparent focus:outline-none text-slate-900 uppercase font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Tag className="h-3 w-3 text-slate-450" />
                  <span>Try FRESH50, ORGANIC30, or spin the wheel below!</span>
                </p>
                {couponError && <p className="text-[11px] text-red-650 font-semibold">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-650 font-semibold">{couponSuccess}</p>}
              </form>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-150 hover:shadow-emerald-250 text-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Gamified Promo Coupon Spinner Wheel */}
          <SpinWheel onApplyCoupon={applyPromoCode} />
        </div>
      </div>
    </div>
  );
}
