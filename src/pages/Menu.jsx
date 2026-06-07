import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw, Frown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FoodCard from '../components/FoodCard';

export default function Menu() {
  const { menuItems } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search parameters state sync
  const querySearch = searchParams.get('search') || '';
  const queryCategory = searchParams.get('category') || 'All';
  const queryVeg = searchParams.get('veg') || 'All'; // 'All', 'Veg', 'NonVeg'
  const querySort = searchParams.get('sort') || 'Popularity'; // 'Popularity', 'PriceLow', 'PriceHigh', 'Rating'

  const [search, setSearch] = useState(querySearch);
  const [category, setCategory] = useState(queryCategory);
  const [vegFilter, setVegFilter] = useState(queryVeg);
  const [sortBy, setSortBy] = useState(querySort);

  // Sync state if URL changes
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || 'All');
    setVegFilter(searchParams.get('veg') || 'All');
    setSortBy(searchParams.get('sort') || 'Popularity');
  }, [searchParams]);

  // Update search params helper
  const updateParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'All' || (key === 'sort' && value === 'Popularity')) {
        updated.delete(key);
      } else {
        updated.set(key, value);
      }
    });
    setSearchParams(updated);
  };

  const categories = ['All', 'Meals', 'Biryanis', 'Burgers', 'Pizzas', 'Salads', 'Desserts', 'Beverages'];

  // Filter & Sort menu items
  const filteredItems = menuItems
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                            item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || item.category === category;
      const matchesVeg = vegFilter === 'All' ||
                         (vegFilter === 'Veg' && item.veg) ||
                         (vegFilter === 'NonVeg' && !item.veg);
      return matchesSearch && matchesCategory && matchesVeg;
    })
    .sort((a, b) => {
      if (sortBy === 'PriceLow') return a.price - b.price;
      if (sortBy === 'PriceHigh') return b.price - a.price;
      if (sortBy === 'Rating') return b.rating - a.rating;
      // Default 'Popularity' - sorts by rating (highest first) as simple metric
      return b.rating - a.rating;
    });

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setVegFilter('All');
    setSortBy('Popularity');
    setSearchParams({});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Explore Our Full Menu</h1>
        <p className="text-slate-500 max-w-lg mx-auto">Fresh, organic, and hand-prepared culinary masterpieces delivered straight to you</p>
      </div>

      {/* Filters Box */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Search bar */}
          <div className="lg:col-span-5 relative flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent focus-within:bg-white transition-all">
            <div className="pl-3 text-slate-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                updateParams({ search: e.target.value });
              }}
              className="w-full pl-2.5 pr-4 py-2 text-sm bg-transparent focus:outline-none text-slate-900"
            />
          </div>

          {/* Diet filters */}
          <div className="lg:col-span-4 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mr-2 flex items-center gap-1">
              <SlidersHorizontal className="h-4 w-4" />
              Diet:
            </span>
            <div className="flex bg-slate-50 p-1 border border-slate-100 rounded-xl w-full">
              {['All', 'Veg', 'NonVeg'].map((diet) => (
                <button
                  key={diet}
                  onClick={() => {
                    setVegFilter(diet);
                    updateParams({ veg: diet });
                  }}
                  className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all ${
                    vegFilter === diet
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-100'
                      : 'text-slate-500 hover:text-slate-950'
                  }`}
                >
                  {diet === 'NonVeg' ? 'Non-Veg' : diet}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting dropdown */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mr-2">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateParams({ sort: e.target.value });
              }}
              className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="Popularity">Popularity</option>
              <option value="PriceLow">Price: Low to High</option>
              <option value="PriceHigh">Price: High to Low</option>
              <option value="Rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="border-t border-slate-50 pt-5 flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                updateParams({ category: cat });
              }}
              className={`flex-shrink-0 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
          {/* Reset button */}
          {(search || category !== 'All' || vegFilter !== 'All' || sortBy !== 'Popularity') && (
            <button
              onClick={handleResetFilters}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-emerald-200 text-slate-500 hover:text-emerald-700 bg-white rounded-xl text-xs font-bold transition-all ml-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Menu Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl space-y-4 shadow-inner">
          <span className="inline-flex p-5 bg-emerald-50 text-emerald-600 rounded-full">
            <Frown className="h-10 w-10" />
          </span>
          <h3 className="text-xl font-bold text-slate-950">No Dishes Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            We couldn't find any dishes matching your parameters. Try adjusting your query or resetting filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all"
          >
            Clear Filters & Search
          </button>
        </div>
      )}
    </div>
  );
}
