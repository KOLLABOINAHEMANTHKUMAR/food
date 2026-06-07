import React, { useState } from 'react';
import { Heart, ShoppingCart, MessageSquare, Star, Sparkles, Send, CheckCircle2, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function CommunityFeed() {
  const { feedPosts, likeFeedPost, addFeedPost, menuItems, addToCart, user } = useApp();
  const navigate = useNavigate();
  const [selectedDishId, setSelectedDishId] = useState(menuItems[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleGiftClick = (dish) => {
    const giftItem = {
      cartId: `${dish.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      veg: dish.veg,
      quantity: 1,
      selectedOptions: { size: 'Medium', extras: [] },
      member: user ? user.name : 'A Friend',
      note: `Gifted from community recommendation!`
    };
    navigate('/checkout', { state: { giftItem } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const dish = menuItems.find(m => m.id === selectedDishId);
    if (!dish) return;

    addFeedPost(dish.id, dish.name, rating, comment.trim());
    setComment('');
    setRating(5);
    setShowForm(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] uppercase rounded-full mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Social Network
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Foodie Community Feed</h1>
          <p className="text-xs text-slate-450 font-semibold mt-1">
            See what other food lovers are saying and order recommended items instantly!
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all pt-1.5"
        >
          {showForm ? 'View Community Posts' : 'Write Food Review'}
        </button>
      </div>

      {/* Write review form toggle */}
      {showForm && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5 animate-fade-in">
          <h2 className="font-bold text-base text-slate-950">Publish a Food Review</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Select Dish */}
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Select Menu Item</label>
                <select
                  value={selectedDishId}
                  onChange={(e) => setSelectedDishId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 bg-white"
                >
                  {menuItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Rating (Stars)</label>
                <div className="flex items-center gap-2 h-11 border border-slate-200 rounded-xl px-4 bg-slate-50">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-1">
              <label className="font-bold text-slate-400 uppercase tracking-wider block">Your Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the taste, freshness, and delivery?"
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow shadow-emerald-150 pt-1.5 flex items-center justify-center gap-1.5"
            >
              <Send className="h-4 w-4" />
              <span>Share Review Post</span>
            </button>
          </form>
        </div>
      )}

      {/* Posts list */}
      <div className="space-y-6">
        {feedPosts.map((post) => {
          const dish = menuItems.find((m) => m.id === post.dishId);
          return (
            <div
              key={post.id}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-emerald-100 transition-all flex flex-col md:flex-row gap-6 items-start"
            >
              {/* Dish Thumbnail Column */}
              {dish && (
                <div className="w-full md:w-32 h-24 rounded-2xl overflow-hidden relative flex-shrink-0 bg-slate-50 border border-slate-100">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-lg text-[8px] font-bold text-white uppercase tracking-wider">
                    {dish.category}
                  </div>
                </div>
              )}

              {/* Post Details Column */}
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      {post.author}
                      <span className="inline-block px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 text-[8px] font-extrabold text-emerald-800 rounded">
                        Verified Foodie
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Stars display */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= post.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-slate-650 leading-relaxed font-semibold">
                  "{post.comment}"
                </p>

                {/* Tagged Dish Card block */}
                {dish && (
                  <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-2xl p-3 text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${dish.veg ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      <div>
                        <h4 className="font-bold text-slate-800">{dish.name}</h4>
                        <span className="text-[10px] font-black text-emerald-700">₹{dish.price}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGiftClick(dish)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1"
                      >
                        <Gift className="h-3 w-3" />
                        <span>Gift This</span>
                      </button>
                      <button
                        onClick={() => addToCart(dish)}
                        className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white rounded-xl text-[10px] font-bold transition-all flex items-center gap-1"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        <span>Order This</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center gap-4 pt-1 border-t border-slate-50 text-[10px] font-bold">
                  <button
                    onClick={() => likeFeedPost(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.likedByUser ? 'text-red-500' : 'text-slate-450 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-4.5 w-4.5 ${post.likedByUser ? 'fill-red-500' : ''}`} />
                    <span>{post.likes} Likes</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MessageSquare className="h-4.5 w-4.5" />
                    <span>Simulated Discussion</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
