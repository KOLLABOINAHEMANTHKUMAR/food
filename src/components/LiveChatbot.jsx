import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LiveChatbot() {
  const { chatMessages, setChatMessages, orders, menuItems, user } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

  const speakText = (text) => {
    if (!voiceEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      // TTS fail fallback
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now().toString(), sender: 'user', text: input.trim() };
    setChatMessages((prev) => [...prev, userMessage]);
    const query = input.toLowerCase();
    setInput('');

    // Generate smart mock answers based on query
    setTimeout(() => {
      let reply = "I'm here to help! Try asking about your order status ('where is my order') or our organic dishes ('is the veggie burger gluten-free?').";

      if (query.includes('order') || query.includes('track') || query.includes('status') || query.includes('where is')) {
        // Find latest customer order
        const userOrders = orders.filter(o => o.customerInfo?.email === user?.email);
        if (userOrders.length > 0) {
          const latest = userOrders[0];
          let statusStr = '';
          if (latest.status === 'Pending') statusStr = 'Placed & Confirmed';
          else if (latest.status === 'Preparing') statusStr = 'Cooking in the Kitchen';
          else if (latest.status === 'Out for Delivery') statusStr = 'Out for Delivery with rider Alex Rider';
          else if (latest.status === 'Delivered') statusStr = 'Delivered Successfully';

          reply = `Let me scan our logistics network... Ah! Your latest order ${latest.id} is currently [${statusStr}].`;
        } else {
          reply = "I couldn't find any orders placed under your account yet. Browse our menu to place your first fresh order!";
        }
      } else if (query.includes('burger') || query.includes('veggie')) {
        reply = "Our Gourmet Veggie Burger features a plant-based patty, fresh avocado, organic lettuce, heirloom tomatoes, and herb aioli. It does contain gluten in the brioche bun, but you can request a gluten-free bun in the instructions!";
      } else if (query.includes('pizza') || query.includes('margherita') || query.includes('pepperoni')) {
        reply = "We offer both the Margherita Basil Pizza (pure vegetarian) and the Spicy Pepperoni Pizza (contains cured Italian pork pepperoni). Both use artisanal organic sourdough crust!";
      } else if (query.includes('salad') || query.includes('avocado')) {
        reply = "The Organic Avocado Salad is vegan, gluten-free, and contains healthy fats from fresh avocados and pumpkin seeds. Very popular for health-focused foodies!";
      } else if (query.includes('gluten') || query.includes('allergy')) {
        reply = "We mark all allergen details! The Organic Avocado Salad is gluten-free. For burgers and pizzas, you can request gluten-free flour or buns in the custom notes at checkout.";
      } else if (query.includes('vegan') || query.includes('veg')) {
        reply = "Most of our menu is vegetarian/vegan! The Veggie Burger, Margherita Pizza, Avocado Salad, Fries, and desserts are all vegetarian. Just specify 'no dairy' for vegan preparation.";
      } else if (query.includes('coin') || query.includes('loyalty') || query.includes('wallet')) {
        reply = `You currently have 🪙${user?.coins || 0} Green Coins in your loyalty wallet. You earn 10% back on every purchase, and you can apply them on checkout to save money!`;
      } else if (query.includes('calorie') || query.includes('recommend') || query.includes('meal plan') || query.includes('diet')) {
        reply = "Here is a curated 500-calorie organic meal plan: Start with our crisp Organic Avocado Salad (approx. 220 kcal) and pair it with a fresh Strawberry Bliss Cheesecake (approx. 280 kcal) for a total of exactly 500 kcal!";
      } else if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
        reply = `Hello, ${user?.name || 'there'}! How can I assist you with your FreshBite order today?`;
      }

      setChatMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'bot', text: reply }
      ]);
      speakText(reply);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] bg-white border border-slate-100 rounded-3xl shadow-xl flex flex-col mb-4 overflow-hidden animate-fade-in text-xs">
          {/* Header */}
          <div className="bg-emerald-600 p-4 text-white flex justify-between items-center select-none">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500 rounded-lg">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <h4 className="font-extrabold text-sm leading-none">FreshBite Assistant</h4>
                <span className="text-[10px] text-emerald-100 block mt-0.5">Online • Simulated Support</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const newVal = !voiceEnabled;
                  setVoiceEnabled(newVal);
                  if (newVal) {
                    // Speak confirmation
                    try {
                      window.speechSynthesis.cancel();
                      const utterance = new SpeechSynthesisUtterance("Voice mode enabled. Support audio active.");
                      window.speechSynthesis.speak(utterance);
                    } catch (e) {}
                  } else {
                    window.speechSynthesis.cancel();
                  }
                }}
                className={`p-1.5 rounded-lg transition-all ${
                  voiceEnabled ? 'bg-emerald-500 text-white shadow-sm' : 'text-emerald-100 hover:text-white hover:bg-emerald-55'
                }`}
                title={voiceEnabled ? 'Disable Voice Support' : 'Enable Voice Support'}
              >
                {voiceEnabled ? <Volume2 className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-emerald-105 hover:text-white hover:bg-emerald-55 rounded-lg transition-all"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {chatMessages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={msg.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex gap-2 max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    <span className={`p-1.5 rounded-lg h-7 w-7 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                      isBot ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-205 text-slate-800'
                    }`}>
                      {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </span>
                    <div className={`p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm font-semibold ${
                      isBot ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100' : 'bg-emerald-600 text-white rounded-tr-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about orders, ingredients..."
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs text-slate-850 font-medium"
            />
            <button
              type="submit"
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow shadow-emerald-150 flex items-center justify-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-200/55 hover:scale-105 hover:rotate-6 transition-all duration-300 flex items-center justify-center relative group"
        title="Live Support Chat"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        {/* Subtle notification badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white">
            1
          </span>
        )}
      </button>
    </div>
  );
}
