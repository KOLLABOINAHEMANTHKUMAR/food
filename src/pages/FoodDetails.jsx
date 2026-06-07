import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Clock, Plus, Minus, ChevronLeft, ShoppingBag, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { menuItems, addToCart, dietPreference } = useApp();

  const food = menuItems.find((item) => item.id === id);

  const isDietCompliant = (foodItem, diet) => {
    if (!diet || diet === 'None') return true;
    if (diet === 'Vegan') {
      if (!foodItem.veg) return false;
      const nonVeganIngredients = ['mozzarella', 'cheese cream', 'gelato', 'parmesan', 'cheese', 'cream', 'molten', 'egg'];
      const ingredients = Object.keys(foodItem.ingredients || {}).map(k => k.toLowerCase());
      const hasNonVegan = ingredients.some(ing => nonVeganIngredients.some(nv => ing.includes(nv)));
      const nameLower = foodItem.name.toLowerCase();
      const descLower = foodItem.description.toLowerCase();
      const hasNonVeganText = nonVeganIngredients.some(nv => nameLower.includes(nv) || descLower.includes(nv));
      return !hasNonVegan && !hasNonVeganText;
    }
    if (diet === 'Gluten-Free') {
      const glutenIngredients = ['bun', 'dough', 'crust', 'flour', 'molten', 'brioche'];
      const ingredients = Object.keys(foodItem.ingredients || {}).map(k => k.toLowerCase());
      const hasGluten = ingredients.some(ing => glutenIngredients.some(g => ing.includes(g)));
      const nameLower = foodItem.name.toLowerCase();
      const descLower = foodItem.description.toLowerCase();
      const hasGlutenText = glutenIngredients.some(g => nameLower.includes(g) || descLower.includes(g));
      return !hasGluten && !hasGlutenText;
    }
    return true;
  };

  const dietActive = dietPreference && dietPreference !== 'None';
  const compliant = food ? isDietCompliant(food, dietPreference) : true;

  if (!food) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Food Item Not Found</h2>
        <p className="text-slate-500">The dish you are trying to view does not exist or has been removed.</p>
        <Link to="/menu" className="inline-block px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold">
          Back to Menu
        </Link>
      </div>
    );
  }

  // Customization State
  const [size, setSize] = useState('Medium');
  const [extras, setExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  // Extras options
  const extrasOptions = [
    { name: 'Extra Sauce', price: 20 },
    { name: 'Extra Cheese', price: 50 },
    { name: 'Gluten-Free Prep', price: 60 }
  ];

  // Price calculations
  const sizeModifiers = {
    'Small': -50,
    'Medium': 0,
    'Large': 100
  };

  const extraPrices = extras.reduce((sum, extraName) => {
    const option = extrasOptions.find(opt => opt.name === extraName);
    return sum + (option ? option.price : 0);
  }, 0);

  const unitPrice = food.price + sizeModifiers[size] + extraPrices;
  const totalPrice = unitPrice * quantity;

  const handleExtraToggle = (extraName) => {
    setExtras((prev) =>
      prev.includes(extraName)
        ? prev.filter((name) => name !== extraName)
        : [...prev, extraName]
    );
  };

  const handleAddToCart = () => {
    addToCart(food, quantity, { size, extras });
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  const mockReviews = [
    { name: 'Alice M.', rating: 5, comment: 'Absolutely delicious! The ingredients are so fresh and organic. Highly recommended!', date: 'June 4, 2026' },
    { name: 'David K.', rating: 4, comment: 'Very tasty and came hot. The avocado was perfect.', date: 'May 28, 2026' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Back link */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm">
            <img
              src={food.image}
              alt={food.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex justify-between items-center bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-sm">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Clock className="h-4.5 w-4.5 text-emerald-600" />
              <span>Prep Time: {food.prepTime}</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <span className={`h-2.5 w-2.5 rounded-full ${food.veg ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              <span>{food.veg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{food.rating} / 5.0</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customizations & Purchase */}
        <div className="lg:col-span-6 space-y-8 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          {/* Header */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded">
              {food.category}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900">{food.name}</h1>
            <p className="text-slate-500 leading-relaxed text-sm">{food.description}</p>
          </div>

          {dietActive && !compliant && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 animate-pulse">
              <span className="text-xl leading-none">⚠️</span>
              <div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider">Dietary Safety Warning</h4>
                <p className="text-[11px] font-semibold mt-1 leading-relaxed">
                  This dish violates your active <span className="font-black text-red-900 uppercase">{dietPreference}</span> preference profile. Please review the ingredients before consuming.
                </p>
              </div>
            </div>
          )}

          {dietActive && compliant && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 text-emerald-800">
              <span className="text-xl leading-none">🌿</span>
              <div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider">{dietPreference} Approved</h4>
                <p className="text-[11px] font-semibold mt-1 leading-relaxed">
                  This dish matches your active <span className="font-black text-emerald-900 uppercase">{dietPreference}</span> preference profile. Safe to order!
                </p>
              </div>
            </div>
          )}

          <hr className="border-slate-100" />

          {/* Size customizer */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Select Portion Size</h3>
            <div className="grid grid-cols-3 gap-3">
              {['Small', 'Medium', 'Large'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex flex-col items-center p-3.5 rounded-xl border text-center transition-all ${
                    size === s
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50'
                  }`}
                >
                  <span className="text-xs uppercase font-semibold">{s}</span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    {s === 'Small' && '-₹50'}
                    {s === 'Medium' && 'Standard'}
                    {s === 'Large' && '+₹100'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Extras customizer */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Choose Add-ons</h3>
            <div className="space-y-2">
              {extrasOptions.map((opt) => {
                const isSelected = extras.includes(opt.name);
                return (
                  <button
                    key={opt.name}
                    onClick={() => handleExtraToggle(opt.name)}
                    className={`flex items-center justify-between w-full p-3.5 border rounded-xl text-left transition-all ${
                      isSelected
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${
                        isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-350 bg-white'
                      }`}>
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span className="text-sm font-semibold">{opt.name}</span>
                    </div>
                    <span className="text-xs text-slate-400">+₹{opt.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Price & Quantity & Add */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            {/* Price tag */}
            <div className="text-center sm:text-left">
              <span className="text-xs text-slate-400 block font-medium">Total Price</span>
              <span className="text-3xl font-black text-slate-950">₹{totalPrice}</span>
            </div>

            {/* Quantity Controller & Add button */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-slate-500 hover:text-slate-950 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 font-extrabold text-sm text-slate-900 w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-slate-500 hover:text-slate-950 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-100 hover:shadow-emerald-250 transition-all text-sm whitespace-nowrap"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>

          {/* Success feedback */}
          {addedMessage && (
            <div className="p-3 bg-emerald-550 text-white rounded-xl text-center text-xs font-bold animate-pulse">
              Added to Cart! View your cart page to check out.
            </div>
          )}
        </div>
      </div>

      {/* Details / Reviews section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Ingredients */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Ingredients & Diet info</h2>
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 text-sm text-slate-650 leading-relaxed">
            <p>
              We pride ourselves on organic food formulations. This dish uses locally sourced, chemical-free ingredients.
            </p>
            
            {/* SVG Health Macro Indicators */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Nutritional Breakdown</h3>
              <div className="grid grid-cols-4 gap-2 text-center select-none">
                {[
                  { label: 'Calories', val: '380 kcal', pct: 0.75, color: '#10b981', bg: '#ecfdf5' },
                  { label: 'Protein', val: '14g', pct: 0.55, color: '#3b82f6', bg: '#eff6ff' },
                  { label: 'Carbs', val: '42g', pct: 0.65, color: '#f59e0b', bg: '#fffbeb' },
                  { label: 'Fats', val: '11g', pct: 0.40, color: '#ef4444', bg: '#fef2f2' }
                ].map((macro) => {
                  const r = 24;
                  const circ = 2 * Math.PI * r;
                  const offset = circ - macro.pct * circ;
                  return (
                    <div key={macro.label} className="flex flex-col items-center p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
                      <div className="relative w-14 h-14">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="28" cy="28" r={r} stroke="#e2e8f0" strokeWidth="3" fill="transparent" />
                          <circle
                            cx="28"
                            cy="28"
                            r={r}
                            stroke={macro.color}
                            strokeWidth="3.5"
                            fill="transparent"
                            strokeDasharray={circ}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-slate-750">
                          {macro.val}
                        </span>
                      </div>
                      <span className="text-[9px] font-extrabold text-slate-500 mt-2">{macro.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <ul className="list-disc pl-5 space-y-1 text-slate-500 pt-2 border-t border-slate-50">
              <li>100% natural, farm-to-table organic components</li>
              <li>Free of artificial stabilizers, food dyes, and trans-fats</li>
              <li>Contains allergen compounds (gluten, dairy/cheese where applicable)</li>
            </ul>
          </div>
        </div>

        {/* Reviews */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Customer Reviews</h2>
          <div className="space-y-4">
            {mockReviews.map((rev, index) => (
              <div key={index} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-slate-900">{rev.name}</span>
                  <span className="text-xs text-slate-400">{rev.date}</span>
                </div>
                <div className="flex text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
