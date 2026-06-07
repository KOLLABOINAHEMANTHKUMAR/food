import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Plus, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FoodCard({ food }) {
  const { addToCart } = useApp();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(food, 1, { size: 'Medium', extras: [] });
    // Alert or animation can be added
  };

  return (
    <div className="hover-lift flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
      {/* Food Image */}
      <Link to={`/food/${food.id}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={food.image}
          alt={food.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        {/* Diet tag */}
        <span className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${
          food.veg 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {food.veg ? 'Veg' : 'Non-Veg'}
        </span>
        {/* Prep Time */}
        <span className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-semibold text-slate-700 shadow-sm border border-white/55">
          <Clock className="h-3.5 w-3.5 text-emerald-600" />
          {food.prepTime}
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
            {food.category}
          </span>
          <div className="flex items-center gap-0.5 text-amber-500 font-semibold text-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>{food.rating}</span>
          </div>
        </div>

        <Link to={`/food/${food.id}`} className="hover:text-emerald-600 transition-colors">
          <h3 className="font-bold text-lg text-slate-900 leading-snug line-clamp-1">
            {food.name}
          </h3>
        </Link>

        <p className="text-sm text-slate-500 line-clamp-2 mt-2 flex-grow">
          {food.description}
        </p>

        {/* Pricing & Add to Cart */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-50">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-xl font-extrabold text-slate-950">${food.price.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/food/${food.id}`}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 rounded-xl transition-all"
            >
              Details
            </Link>
            <button
              onClick={handleQuickAdd}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-100 hover:shadow-emerald-200"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
