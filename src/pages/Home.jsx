import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Compass, ShieldCheck, Zap, Sparkles, Gift } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FoodCard from '../components/FoodCard';

export default function Home() {
  const { menuItems, user, orders } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [giftDismissed, setGiftDismissed] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/menu?category=${encodeURIComponent(categoryName)}`);
  };

  // Get top 4 rated items for featured section
  const featuredItems = [...menuItems]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const categories = [
    { name: 'Meals', icon: '🍲', count: menuItems.filter(item => item.category === 'Meals').length },
    { name: 'Biryanis', icon: '🍛', count: menuItems.filter(item => item.category === 'Biryanis').length },
    { name: 'Burgers', icon: '🍔', count: menuItems.filter(item => item.category === 'Burgers').length },
    { name: 'Pizzas', icon: '🍕', count: menuItems.filter(item => item.category === 'Pizzas').length },
    { name: 'Salads', icon: '🥗', count: menuItems.filter(item => item.category === 'Salads').length },
    { name: 'Desserts', icon: '🍰', count: menuItems.filter(item => item.category === 'Desserts').length },
    { name: 'Beverages', icon: '🥤', count: menuItems.filter(item => item.category === 'Beverages').length }
  ];

  const giftedOrder = orders.find(
    (o) =>
      o.giftRecipientEmail?.toLowerCase() === user?.email?.toLowerCase() &&
      o.status !== 'Delivered'
  );

  return (
    <div className="space-y-16 pb-16">
      {giftedOrder && !giftDismissed && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 -mb-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-5 shadow-lg flex items-center justify-between gap-4 animate-slide-down relative overflow-hidden select-none">
            <div className="absolute right-0 top-0 h-full w-1/4 bg-white/10 rounded-l-full blur-xl"></div>
            
            <div className="flex items-center gap-3 relative z-10 text-xs sm:text-sm font-bold">
              <span className="text-2xl animate-bounce">🎁</span>
              <div>
                <p className="font-extrabold text-white text-sm">
                  🎉 Congrats! {giftedOrder.customerInfo.name} gifted you a {giftedOrder.items[0]?.name}!
                </p>
                <p className="text-[10px] text-emerald-100 font-semibold mt-0.5">
                  Your delivery is active and on the way! Status: <span className="underline uppercase tracking-wider">{giftedOrder.status}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 relative z-10">
              <button
                onClick={() => navigate('/track')}
                className="px-4 py-2 bg-white text-emerald-850 font-black rounded-xl text-xs shadow hover:bg-emerald-50 transition-all"
              >
                Track Gift
              </button>
              <button
                onClick={() => setGiftDismissed(true)}
                className="p-1.5 hover:bg-white/15 rounded-lg text-white font-bold transition-all text-xs"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-transparent pt-12 pb-8 sm:pt-16 lg:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                Guaranteed Fresh & Organic
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Fresh Ingredients,<br />
                Exquisite Dishes,<br />
                <span className="text-emerald-600">Delivered Fast.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600">
                Order organic, hand-crafted food made by expert chefs. Skip the line and get fresh culinary delights delivered straight to your door.
              </p>

              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="relative max-w-lg sm:mx-auto lg:mx-0">
                <div className="flex items-center bg-white border border-slate-200 rounded-2xl shadow-md p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all">
                  <div className="pl-3 text-slate-400">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for pizza, burgers, desserts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-2.5 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Quick links */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-slate-500 sm:justify-center lg:justify-start">
                <span>Popular:</span>
                {['Pizza', 'Burger', 'Avocado', 'Mojito'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => navigate(`/menu?search=${tag}`)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-lg transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6 relative flex justify-center">
              <div className="relative w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full bg-emerald-100 overflow-hidden shadow-inner border-[12px] border-white">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"
                  alt="Delicious Healthy Bowl"
                  className="w-full h-full object-cover scale-105"
                />
              </div>
              {/* Float Badge 1 */}
              <div className="absolute -top-4 left-10 sm:left-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2.5 animate-bounce">
                <span className="p-2 bg-amber-100 rounded-xl text-amber-500 text-lg">⭐</span>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">4.9 Star Rating</h4>
                  <p className="text-[10px] text-slate-500">Over 5k reviews</p>
                </div>
              </div>
              {/* Float Badge 2 */}
              <div className="absolute bottom-6 right-10 sm:right-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2.5 animate-pulse">
                <span className="p-2 bg-emerald-100 rounded-xl text-emerald-600 text-lg">🚀</span>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Super Fast Delivery</h4>
                  <p className="text-[10px] text-slate-500">Under 25 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900">Browse by Categories</h2>
          <p className="text-slate-500 max-w-md mx-auto">Explore our diverse menu selections tailored to your tastebuds</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="flex flex-col items-center p-6 bg-white hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-2xl transition-all shadow-sm hover:shadow-md group text-center"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="font-bold text-slate-900 text-sm group-hover:text-emerald-700">{cat.name}</span>
              <span className="text-xs text-slate-400 mt-1">{cat.count} items</span>
            </button>
          ))}
        </div>
      </section>

      {/* promo Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden shadow-xl p-8 sm:p-12">
          {/* Background shapes */}
          <div className="absolute right-0 top-0 h-full w-1/3 bg-emerald-600/20 rounded-l-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-4 text-center md:text-left">
              <span className="px-3 py-1 bg-emerald-600 text-xs font-semibold rounded-full uppercase tracking-wider">
                Special Launch Promo
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Get <span className="text-emerald-400">50% OFF</span> on Your First Order!
              </h2>
              <p className="text-slate-400 max-w-lg text-sm sm:text-base">
                Use the coupon code at checkout to enjoy half price on all items. Valid for a limited time.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 bg-slate-800 border border-slate-700 px-6 py-4 rounded-2xl w-full md:w-auto">
              <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Coupon Code</span>
              <span className="text-2xl font-black tracking-widest text-emerald-400 font-mono">FRESH50</span>
              <span className="text-[10px] text-slate-500">Apply at checkout page</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div className="text-center sm:text-left space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">Featured Masterpieces</h2>
            <p className="text-slate-500">Our highest rated dishes voted by users this week</p>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <span>View Full Menu</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* Value Propositions */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-white border border-slate-100 rounded-3xl py-12 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4 p-4">
            <span className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl flex-shrink-0">
              <Compass className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">Local & Organic</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                We source our ingredients strictly from local farms practicing organic agriculture, ensuring clean nutrition.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4">
            <span className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl flex-shrink-0">
              <Zap className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">Lightning Fast Delivery</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Our optimized routing algorithm matches you with nearby delivery partners to bring hot food in under 25 minutes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4">
            <span className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl flex-shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">Unmatched Hygiene</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                From kitchen sanitation standards to contact-free delivery, we maintain multi-point quality check controls.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
