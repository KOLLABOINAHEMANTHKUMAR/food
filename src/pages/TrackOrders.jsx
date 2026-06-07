import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Truck, CheckCircle, Clock, MapPin, ClipboardList, Utensils, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DeliveryMap from '../components/DeliveryMap';

export default function TrackOrders() {
  const { orders, user, addToCart } = useApp();
  const navigate = useNavigate();
  const [expandedOrders, setExpandedOrders] = useState({});

  // Filter orders for the active logged-in customer
  const customerOrders = orders.filter(
    (order) => order.customerInfo.email.toLowerCase() === user?.email.toLowerCase()
  );

  // Split into active tracking and completed history
  const activeOrders = customerOrders.filter((order) => order.status !== 'Delivered');
  const pastOrders = customerOrders.filter((order) => order.status === 'Delivered');

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleOrderAgain = (order) => {
    // Add all items in this order to the cart
    order.items.forEach((item) => {
      // Re-add to cart
      addToCart(item, item.quantity, item.selectedOptions);
    });
    // Navigate directly to cart
    navigate('/cart');
  };

  // Stepper Status stages helper
  const getStepStatus = (orderStatus, stepName) => {
    const statusSequence = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
    const currentIdx = statusSequence.indexOf(orderStatus);
    
    const steps = {
      'Placed': 0,
      'Preparing': 1,
      'Out for Delivery': 2,
      'Delivered': 3
    };
    
    const stepIdx = steps[stepName];
    
    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'active';
    return 'upcoming';
  };

  if (customerOrders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-6">
        <span className="inline-flex p-6 bg-slate-105 text-slate-400 rounded-full">
          <ClipboardList className="h-12 w-12" />
        </span>
        <h2 className="text-2xl font-bold text-slate-900">No Orders Placed Yet</h2>
        <p className="text-slate-500 max-w-sm mx-auto">
          You have not placed any orders yet. Head to the menu to explore organic items.
        </p>
        <Link
          to="/menu"
          className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm"
        >
          Explore Our Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-16">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Orders & Tracking</h1>
        <p className="text-slate-500">Track active kitchen preparation and review your past organic dining logs.</p>
      </div>

      {/* ----------------------------------------------------
          SECTION 1: ACTIVE ORDER TRACKING
          ---------------------------------------------------- */}
      {activeOrders.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Order Tracking
          </h2>

          <div className="space-y-6">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-6"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-50">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                      {order.id}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">
                      Placed: {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Total Amount</span>
                    <span className="text-base font-extrabold text-slate-900">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Live Tracking Stepper */}
                <div className="py-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                    {/* Stepper items */}
                    {[
                      { name: 'Placed', label: 'Order Received', desc: 'Order placed & accepted' },
                      { name: 'Preparing', label: 'Food Cooking', desc: 'Dishes being prepped by chef' },
                      { name: 'Out for Delivery', label: 'Shipped / Out for Delivery', desc: 'Rider carrying your order' },
                      { name: 'Delivered', label: 'Delivered', desc: 'Dispatched package arrived' }
                    ].map((step, idx) => {
                      const status = getStepStatus(order.status, step.name);
                      return (
                        <div key={idx} className="flex flex-row md:flex-col items-start md:items-center gap-4 md:text-center relative z-10">
                          {/* Circle Indicator */}
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all flex-shrink-0 ${
                            status === 'completed' ? 'bg-emerald-600 text-white' :
                            status === 'active' ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-600 glow-emerald' :
                            'bg-slate-100 text-slate-400 border border-slate-205'
                          }`}>
                            {status === 'completed' ? '✓' : idx + 1}
                          </div>

                          {/* Label info */}
                          <div>
                            <h4 className={`font-bold text-xs ${
                              status === 'active' ? 'text-emerald-700 font-extrabold' :
                              status === 'completed' ? 'text-slate-800 font-semibold' : 'text-slate-400'
                            }`}>{step.label}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Animated vector dispatch map coordinates */}
                <div className="border border-slate-100 bg-slate-50/20 rounded-3xl p-5 shadow-inner">
                  <DeliveryMap status={order.status} />
                </div>

                {/* Items & Address Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50 text-xs">
                  {/* Items list */}
                  <div className="space-y-2">
                    <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Items in Package:</p>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-slate-655">
                          <span>{item.name} <span className="font-bold text-slate-400">x{item.quantity}</span></span>
                          <span className="font-semibold text-slate-700">Portion: {item.selectedOptions?.size || 'Medium'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div className="space-y-2">
                    <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Destination details:</p>
                    <p className="text-slate-550 flex items-start gap-1.5 leading-relaxed">
                      <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{order.customerInfo.address}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          SECTION 2: PAST ORDERS HISTORY
          ---------------------------------------------------- */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Clock className="h-5 w-5 text-slate-605" />
          Past Orders History
        </h2>

        {pastOrders.length > 0 ? (
          <div className="space-y-4">
            {pastOrders.map((order) => {
              const isExpanded = expandedOrders[order.id];
              return (
                <div
                  key={order.id}
                  className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Collapsed header banner */}
                  <div
                    onClick={() => toggleOrderExpand(order.id)}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4 cursor-pointer hover:bg-slate-50/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                          {order.id}
                        </span>
                        <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Delivered
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Completed: {new Date(order.timestamp).toLocaleDateString()} at {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">Total Paid</span>
                        <span className="text-base font-extrabold text-slate-900">₹{order.total.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderAgain(order);
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Order Again</span>
                        </button>
                        <span className="p-1 text-slate-400">
                          {isExpanded ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detailed summary */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-50 space-y-4 text-xs animate-fade-in bg-slate-50/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* Items detailed lists */}
                        <div className="space-y-2">
                          <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Purchased Items:</p>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-slate-655 p-2 bg-white border border-slate-100 rounded-xl">
                                <div>
                                  <span className="font-bold text-slate-900 block">{item.name}</span>
                                  <span className="text-[10px] text-slate-400">
                                    Portion: {item.selectedOptions?.size || 'Medium'}
                                    {item.selectedOptions?.extras && item.selectedOptions.extras.length > 0 && ` | Add-ons: ${item.selectedOptions.extras.join(', ')}`}
                                  </span>
                                </div>
                                <span className="font-extrabold text-slate-900">
                                  ₹{item.price} <span className="text-slate-400 font-semibold text-[10px]">x{item.quantity}</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bill split summary */}
                        <div className="space-y-3 bg-white border border-slate-100 rounded-2xl p-4">
                          <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-1">Receipt details:</p>
                          <div className="space-y-1.5 text-slate-500">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>GST & Service Tax</span>
                              <span>₹{order.tax.toFixed(2)}</span>
                            </div>
                            <hr className="border-slate-100" />
                            <div className="flex justify-between font-bold text-slate-900">
                              <span>Grand Total Paid</span>
                              <span className="text-emerald-700">₹{order.total.toFixed(2)}</span>
                            </div>
                          </div>
                          
                          <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 space-y-0.5">
                            <p className="font-bold text-slate-700">Delivered To Address:</p>
                            <p className="line-clamp-1">{order.customerInfo.address}</p>
                            <p>Phone: {order.customerInfo.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border border-slate-100 rounded-3xl text-slate-400 text-xs">
            No completed dispatches registered.
          </div>
        )}
      </div>
    </div>
  );
}
