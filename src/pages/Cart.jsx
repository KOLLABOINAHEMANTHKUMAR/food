import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Percent } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Cart() {
  const { cart, updateCartQuantity, removeFromCart } = useApp();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const subtotal = cart.reduce((sum, item) => {
    // Calculate actual unit price based on modifications
    // In Context, item has price which is already stored, but wait -
    // AppContext addToCart stores the customized unit price as item.price,
    // let's confirm: in AppContext, we store item.price as the base food price,
    // wait! In AppContext: `price: item.price` is stored. Let's check how we calculated customized price in details.
    // In FoodDetails, we calculated unitPrice: `food.price + sizeModifiers[size] + extraPrices`
    // And in AppContext we called: `addToCart(food, quantity, { size, extras })`
    // Wait! Let's check: did we store the base price or customized price in the cart?
    // In AppContext, we did:
    // `addToCart(item, quantity, selectedOptions)`:
    // we added `{ id: item.id, name: item.name, price: item.price, image: item.image, quantity, selectedOptions }`.
    // That means `price` is the base price. Let's make sure our cart page correctly calculates the actual price of the customized item!
    // Size modifiers: Small (-1.5), Medium (0), Large (+2.5).
    // Extras: Extra Sauce (+0.75), Extra Cheese (+1.5), Gluten-Free Prep (+2.0).
    // Let's implement this calculation helper in the Cart page so that customized item pricing matches perfectly!
    
    const sizeModifiers = { 'Small': -1.50, 'Medium': 0.00, 'Large': 2.50 };
    const extrasModifiers = { 'Extra Sauce': 0.75, 'Extra Cheese': 1.50, 'Gluten-Free Prep': 2.00, 'Extra Aioli': 0.75 };
    
    let itemUnitPrice = item.price + (sizeModifiers[item.selectedOptions.size] || 0);
    if (item.selectedOptions.extras && item.selectedOptions.extras.length > 0) {
      item.selectedOptions.extras.forEach(extra => {
        itemUnitPrice += (extrasModifiers[extra] || 0.75); // fallback to 0.75 if customized
      });
    }
    return sum + (itemUnitPrice * item.quantity);
  }, 0);

  const discount = subtotal * (discountPercent / 100);
  const deliveryFee = subtotal > 30 ? 0.00 : 2.99;
  const taxRate = 0.10; // 10% tax
  const tax = (subtotal - discount) * taxRate;
  const total = subtotal - discount + deliveryFee + tax;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (coupon.trim().toUpperCase() === 'FRESH50') {
      setDiscountPercent(50);
      setCouponSuccess('Promo code FRESH50 applied: 50% discount!');
      // Save discount percent to sessionStorage so checkout page can read it!
      sessionStorage.setItem('applied_discount_percent', '50');
    } else {
      setCouponError('Invalid promo code. Try FRESH50.');
    }
  };

  const handleProceedToCheckout = () => {
    // Save totals to sessionStorage so Checkout can load them
    sessionStorage.setItem('checkout_subtotal', subtotal.toFixed(2));
    sessionStorage.setItem('checkout_discount', discount.toFixed(2));
    sessionStorage.setItem('checkout_delivery', deliveryFee.toFixed(2));
    sessionStorage.setItem('checkout_tax', tax.toFixed(2));
    sessionStorage.setItem('checkout_total', total.toFixed(2));
    navigate('/checkout');
  };

  // Helper to render customized item unit price
  const getItemUnitPrice = (item) => {
    const sizeModifiers = { 'Small': -1.50, 'Medium': 0.00, 'Large': 2.50 };
    const extrasModifiers = { 'Extra Sauce': 0.75, 'Extra Cheese': 1.50, 'Gluten-Free Prep': 2.00, 'Extra Aioli': 0.75 };
    
    let price = item.price + (sizeModifiers[item.selectedOptions.size] || 0);
    if (item.selectedOptions.extras) {
      item.selectedOptions.extras.forEach(extra => {
        price += (extrasModifiers[extra] || 0.75);
      });
    }
    return price;
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-6">
        <span className="inline-flex p-6 bg-slate-100 text-slate-400 rounded-full">
          <ShoppingBag className="h-12 w-12" />
        </span>
        <h2 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-slate-500 max-w-sm mx-auto">
          Browse our organic dishes and add mouthwatering meals to your cart.
        </p>
        <Link
          to="/menu"
          className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm shadow-emerald-250"
        >
          Browse Our Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-slate-900">Your Basket</h1>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart items list - Left Column */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
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
                    <span className="text-sm font-extrabold text-slate-950">${(unitPrice * item.quantity).toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">${unitPrice.toFixed(2)} each</span>
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
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="font-bold text-lg text-slate-950">Bill Details</h2>
          
          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Item Subtotal</span>
              <span className="text-slate-800">${subtotal.toFixed(2)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount ({discountPercent}%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Delivery Fee</span>
              <span className="text-slate-800">
                {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">Free</span> : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-500 font-medium">
              <span>GST/Tax (10%)</span>
              <span className="text-slate-800">${tax.toFixed(2)}</span>
            </div>
            <hr className="border-slate-100" />
            <div className="flex justify-between text-base font-black text-slate-900">
              <span>Grand Total</span>
              <span className="text-emerald-700">${total.toFixed(2)}</span>
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
              <p className="text-[10px] text-slate-400">
                Tip: Enter code <span className="font-bold text-slate-655">FRESH50</span> for a 50% discount!
              </p>
              {couponError && <p className="text-[11px] text-red-600 font-semibold">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-600 font-semibold">{couponSuccess}</p>}
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
      </div>
    </div>
  );
}
