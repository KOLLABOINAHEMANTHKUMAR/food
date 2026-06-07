import React, { useState } from 'react';
import { Truck, CheckCircle, Clock, MapPin, Phone, CreditCard, DollarSign, Award, Smile } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DeliveryDashboard() {
  const { orders, updateOrderStatus, user } = useApp();
  const [tab, setTab] = useState('pending'); // 'pending', 'completed'

  // Filter orders for delivery agent
  const pendingDeliveries = orders.filter((order) => order.status === 'Out for Delivery');
  const completedDeliveries = orders.filter((order) => order.status === 'Delivered');

  const handleMarkDelivered = (orderId) => {
    updateOrderStatus(orderId, 'Delivered');
  };

  // Simulated earnings: ₹50.00 per delivery completed
  const simulatedEarnings = completedDeliveries.length * 50.00;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Profile Info */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="p-4 bg-emerald-100 rounded-2xl text-emerald-600">
            <Truck className="h-8 w-8" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Logistics Dispatch Center</h1>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Active Rider: <span className="text-emerald-700 font-bold">{user?.name || 'Alex Rider'}</span>
            </p>
          </div>
        </div>

        {/* Driver Stats */}
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-initial bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Today's Deliveries</span>
            <span className="text-xl font-black text-slate-900">{completedDeliveries.length} completed</span>
          </div>
          <div className="flex-1 md:flex-initial bg-emerald-50 border border-emerald-150 rounded-2xl px-5 py-3 text-center">
            <span className="text-[10px] text-emerald-600 uppercase tracking-wider block font-bold">Rider Commission</span>
            <span className="text-xl font-black text-emerald-700 font-mono">₹{simulatedEarnings.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Tab selectors */}
      <div className="flex bg-white p-1 border border-slate-100 rounded-2xl shadow-sm max-w-md">
        <button
          onClick={() => setTab('pending')}
          className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            tab === 'pending'
              ? 'bg-emerald-600 text-white shadow shadow-emerald-150'
              : 'text-slate-655 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Active Shipments ({pendingDeliveries.length})</span>
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            tab === 'completed'
              ? 'bg-emerald-600 text-white shadow shadow-emerald-150'
              : 'text-slate-655 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          <span>Delivery Log ({completedDeliveries.length})</span>
        </button>
      </div>

      {/* ----------------------------------------------------
          TAB 1: ACTIVE DISPATCHES
          ---------------------------------------------------- */}
      {tab === 'pending' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingDeliveries.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 border-l-4 border-l-emerald-500"
            >
              {/* Info */}
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      {order.id}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Assigned: Just Now
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-500 text-white rounded text-[10px] font-bold">
                    Out for Delivery
                  </span>
                </div>

                {/* Customer Details */}
                <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 border border-slate-100">
                  <p className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Smile className="h-4 w-4 text-emerald-600" />
                    <span>Customer: {order.customerInfo.name}</span>
                  </p>
                  <p className="text-slate-500 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Address: {order.customerInfo.address}</span>
                  </p>
                  <p className="text-slate-500 flex items-center gap-1.5 font-bold">
                    <Phone className="h-4 w-4 text-emerald-600" />
                    <span>Phone: {order.customerInfo.phone}</span>
                  </p>
                  <p className="text-slate-500 flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                    <span>Payment Mode: <span className="font-bold text-slate-700">{order.customerInfo.paymentMethod}</span></span>
                  </p>
                </div>

                {/* Billing alert if Cash on Delivery */}
                {order.customerInfo.paymentMethod === 'Cash on Delivery' && (
                  <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl font-bold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 stroke-[3]" />
                    <span>COD Order: Collect ₹{order.total.toFixed(2)} cash from customer.</span>
                  </div>
                )}

                {/* Items Summary */}
                <div className="space-y-1.5 pl-1">
                  <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-1">Package Contents:</p>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-655 text-xs">
                      <span>{item.name} <span className="font-bold text-slate-400">x{item.quantity}</span></span>
                      <span>Portion: {item.selectedOptions?.size || 'Medium'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complete Delivery Action */}
              <button
                onClick={() => handleMarkDelivered(order.id)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-100 hover:shadow-emerald-250 transition-all"
              >
                <CheckCircle className="h-4.5 w-4.5" />
                <span>Mark as Delivered</span>
              </button>
            </div>
          ))}

          {pendingDeliveries.length === 0 && (
            <div className="col-span-2 py-16 text-center bg-white border border-slate-100 rounded-3xl space-y-3">
              <Truck className="h-10 w-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 text-sm">No Pending Shipments</h3>
              <p className="text-xs text-slate-450 max-w-xs mx-auto">
                All assigned orders have been dispatched. Grab a coffee and wait for the kitchen to flag new dispatches.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: COMPLETED LOGS
          ---------------------------------------------------- */}
      {tab === 'completed' && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-150">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Receipt</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Delivered At</th>
                  <th className="p-4">Paid Mode</th>
                  <th className="p-4 text-right">Commission Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completedDeliveries.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-emerald-800">{order.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{order.customerInfo.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{order.customerInfo.address}</div>
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(order.timestamp).toLocaleDateString()} at {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-655">{order.customerInfo.paymentMethod}</span>
                    </td>
                    <td className="p-4 text-right font-bold text-emerald-700">+₹50.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {completedDeliveries.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              You haven't completed any deliveries today.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
