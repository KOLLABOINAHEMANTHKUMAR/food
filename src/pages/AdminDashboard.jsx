import React, { useState } from 'react';
import {
  TrendingUp,
  BookOpen,
  ClipboardList,
  DollarSign,
  ShoppingBag,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  RotateCcw,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminDashboard() {
  const {
    menuItems,
    orders,
    addMenuItem,
    editMenuItem,
    deleteMenuItem,
    updateOrderStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'menu', 'orders'

  // Search/Filter states for Menu Management
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilterCategory, setMenuFilterCategory] = useState('All');

  // Search/Filter states for Orders
  const [orderFilterStatus, setOrderFilterStatus] = useState('All');

  // Add/Edit Item Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null means "Adding"
  const [modalData, setModalData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Burgers',
    veg: true,
    image: '',
    prepTime: '15 min'
  });
  const [modalError, setModalError] = useState('');

  // ----------------------------------------------------
  // ANALYTICS CALCULATIONS
  // ----------------------------------------------------
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const pendingOrdersCount = orders.filter(o => o.status !== 'Delivered').length;

  // Group items by category count for chart
  const categoriesCount = menuItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  // 7-day sales simulation details
  const last7DaysSales = [
    { day: 'Mon', sales: 120 },
    { day: 'Tue', sales: 180 },
    { day: 'Wed', sales: 150 },
    { day: 'Thu', sales: 240 },
    { day: 'Fri', sales: 310 },
    { day: 'Sat', sales: 420 },
    { day: 'Sun', sales: totalRevenue > 0 ? Math.round(totalRevenue) : 380 } // Bind to live revenue
  ];

  const maxSaleVal = Math.max(...last7DaysSales.map(d => d.sales));

  // ----------------------------------------------------
  // MENU CRUD MODAL HANDLERS
  // ----------------------------------------------------
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setModalData({
      name: '',
      description: '',
      price: '',
      category: 'Burgers',
      veg: true,
      image: '',
      prepTime: '15 min'
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setModalData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      veg: item.veg,
      image: item.image,
      prepTime: item.prepTime
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    setModalError('');

    if (!modalData.name.trim() || !modalData.description.trim() || !modalData.price.trim() || !modalData.image.trim()) {
      setModalError('Please fill out all required fields');
      return;
    }

    const priceNum = parseFloat(modalData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setModalError('Price must be a valid positive number');
      return;
    }

    const dataToSave = {
      name: modalData.name,
      description: modalData.description,
      price: priceNum,
      category: modalData.category,
      veg: modalData.veg,
      image: modalData.image,
      prepTime: modalData.prepTime
    };

    if (editingItem) {
      editMenuItem(editingItem.id, dataToSave);
    } else {
      addMenuItem(dataToSave);
    }

    setIsModalOpen(false);
  };

  // ----------------------------------------------------
  // FILTERING LOGIC
  // ----------------------------------------------------
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                          item.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCategory = menuFilterCategory === 'All' || item.category === menuFilterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter(order => {
    if (orderFilterStatus === 'All') return true;
    return order.status === orderFilterStatus;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title & Panel switch info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="p-2 bg-emerald-100 rounded-2xl text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </span>
            Restaurant Administration
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            Admin console to manage menus, inspect active delivery tracks, and review weekly revenues.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex bg-white p-1 border border-slate-100 rounded-2xl shadow-sm w-full md:w-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow shadow-emerald-150'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'menu'
                ? 'bg-emerald-600 text-white shadow shadow-emerald-150'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Menu Manager</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow shadow-emerald-150'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span>Orders Board</span>
            {pendingOrdersCount > 0 && (
              <span className="h-5 w-5 bg-amber-500 text-white rounded-full text-[10px] font-black flex items-center justify-center">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------
          TAB 1: OVERVIEW DASHBOARD
          ---------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Metrics cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Revenue card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Revenue</span>
                <span className="text-2xl font-black text-slate-900">${totalRevenue.toFixed(2)}</span>
              </div>
              <span className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                <DollarSign className="h-6 w-6" />
              </span>
            </div>

            {/* Total Orders */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Orders</span>
                <span className="text-2xl font-black text-slate-900">{totalOrdersCount} orders</span>
              </div>
              <span className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                <ShoppingBag className="h-6 w-6" />
              </span>
            </div>

            {/* Avg Order Value */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Avg. Ticket Size</span>
                <span className="text-2xl font-black text-slate-900">${avgOrderValue.toFixed(2)}</span>
              </div>
              <span className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                <TrendingUp className="h-6 w-6" />
              </span>
            </div>

            {/* Pending Deliveries */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Active Orders</span>
                <span className="text-2xl font-black text-slate-900">{pendingOrdersCount} pending</span>
              </div>
              <span className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
                <Clock className="h-6 w-6 animate-pulse" />
              </span>
            </div>
          </div>

          {/* Charts section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sales trend chart - Left Column */}
            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-950">Weekly Sales Analytics</h3>
              
              {/* Premium custom SVG chart */}
              <div className="pt-6 relative h-64 w-full flex items-end justify-between border-b border-l border-slate-100 pb-2">
                {last7DaysSales.map((data, index) => {
                  const barHeightPercent = (data.sales / maxSaleVal) * 80;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1 group relative">
                      {/* Tooltip */}
                      <span className="absolute -top-10 scale-0 group-hover:scale-100 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded shadow transition-all z-20">
                        ${data.sales}
                      </span>
                      {/* Bar */}
                      <div
                        className="w-10 sm:w-12 rounded-t-xl bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-500 shadow-sm cursor-pointer"
                        style={{ height: `${barHeightPercent}%`, minHeight: '10%' }}
                      ></div>
                      {/* Label */}
                      <span className="text-[10px] font-bold text-slate-400 mt-2 block">{data.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category breakdown - Right Column */}
            <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="font-extrabold text-base text-slate-950">Menu Distribution</h3>
              
              {/* Visual Listing */}
              <div className="space-y-4">
                {Object.entries(categoriesCount).map(([catName, count]) => {
                  const percent = Math.round((count / menuItems.length) * 100);
                  return (
                    <div key={catName} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-655">
                        <span>{catName}</span>
                        <span>{count} items ({percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Placed Orders overview */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-950">Recent Orders</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Go to Orders Board
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-100">
                <thead>
                  <tr className="text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Quantity</th>
                    <th className="pb-3">Total Bill</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.slice(0, 4).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-mono font-bold text-emerald-800">{order.id}</td>
                      <td className="py-3 font-medium text-slate-800">{order.customerInfo.name}</td>
                      <td className="py-3 text-slate-500">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </td>
                      <td className="py-3 font-bold text-slate-900">${order.total.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'Preparing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Out for Delivery' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: MENU MANAGEMENT (CRUD SIMULATION)
          ---------------------------------------------------- */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          {/* Action Header / Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex items-center bg-slate-50 border border-slate-150 rounded-xl p-1 w-full sm:w-56 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
                <Search className="h-4.5 w-4.5 text-slate-400 pl-1" />
                <input
                  type="text"
                  placeholder="Search item..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full text-xs pl-2 bg-transparent focus:outline-none"
                />
              </div>

              {/* Category Filter */}
              <select
                value={menuFilterCategory}
                onChange={(e) => setMenuFilterCategory(e.target.value)}
                className="bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Categories</option>
                <option value="Burgers">Burgers</option>
                <option value="Pizzas">Pizzas</option>
                <option value="Salads">Salads</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              <span>Add Food Item</span>
            </button>
          </div>

          {/* Menu Table / Grid */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-100">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Dish</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMenuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-150 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{item.name}</span>
                          <span className="text-[10px] text-slate-400 line-clamp-1">{item.description}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-600">{item.category}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.veg 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {item.veg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">${item.price.toFixed(2)}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Edit Item"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteMenuItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMenuItems.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                No food items match your criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 3: ORDERS MANAGEMENT
          ---------------------------------------------------- */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Order filter */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Filter className="h-4 w-4" />
              Filter Board:
            </span>
            <div className="flex bg-slate-50 p-1 border border-slate-100 rounded-xl">
              {['All', 'Pending', 'Preparing', 'Out for Delivery', 'Delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderFilterStatus(status)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    orderFilterStatus === status
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-100'
                      : 'text-slate-500 hover:text-slate-950'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Orders grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                {/* Header info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                        {order.id}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Placed: {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Status badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Delivered' ? 'bg-emerald-550 text-white' :
                      order.status === 'Preparing' ? 'bg-blue-600 text-white' :
                      order.status === 'Out for Delivery' ? 'bg-purple-600 text-white animate-pulse' :
                      'bg-amber-500 text-white animate-bounce'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Customer details */}
                  <div className="text-xs space-y-0.5 border-b border-slate-50 pb-3">
                    <p className="font-extrabold text-slate-800">{order.customerInfo.name}</p>
                    <p className="text-slate-500">{order.customerInfo.address}</p>
                    <p className="text-slate-400">Phone: {order.customerInfo.phone}</p>
                  </div>

                  {/* Order items listing */}
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-slate-655">
                          {item.name} <span className="font-bold text-slate-400">x{item.quantity}</span>
                        </span>
                        <span className="font-semibold text-slate-700">
                          Size: {item.selectedOptions?.size || 'Medium'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer status controller */}
                <div className="border-t border-slate-50 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Grand Total</span>
                    <span className="text-lg font-black text-slate-900">${order.total.toFixed(2)}</span>
                  </div>

                  {/* Transition actions */}
                  <div className="flex gap-1.5 w-full sm:w-auto">
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Preparing')}
                        className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow shadow-blue-100"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Start Cooking</span>
                      </button>
                    )}
                    {order.status === 'Preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                        className="flex-1 sm:flex-none px-4 py-2 bg-purple-650 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow shadow-purple-100"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        <span>Ship Package</span>
                      </button>
                    )}
                    {order.status === 'Out for Delivery' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Delivered')}
                        className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow shadow-emerald-100"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Mark Delivered</span>
                      </button>
                    )}
                    {order.status === 'Delivered' && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4" />
                        Delivered successfully
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="col-span-2 p-12 text-center bg-white border border-slate-100 rounded-3xl text-slate-400">
                No orders match this status classification.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          CRUD MODAL: ADD/EDIT DISH
          ---------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-md w-full shadow-2xl p-6 space-y-6">
            <h2 className="text-xl font-extrabold text-slate-950">
              {editingItem ? 'Edit Food Item' : 'Add Food Item'}
            </h2>

            {modalError && (
              <div className="p-3 bg-red-50 text-red-750 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <AlertCircle className="h-4.5 w-4.5" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
              {/* Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase block">Dish Name</label>
                <input
                  type="text"
                  value={modalData.name}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  placeholder="e.g. Avocado Toast"
                  className="w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase block">Description</label>
                <textarea
                  value={modalData.description}
                  onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                  rows="2"
                  placeholder="Enter details of ingredients..."
                  className="w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase block">Price ($)</label>
                  <input
                    type="text"
                    value={modalData.price}
                    onChange={(e) => setModalData({ ...modalData, price: e.target.value })}
                    placeholder="e.g. 10.99"
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase block">Category</label>
                  <select
                    value={modalData.category}
                    onChange={(e) => setModalData({ ...modalData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Burgers">Burgers</option>
                    <option value="Pizzas">Pizzas</option>
                    <option value="Salads">Salads</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
              </div>

              {/* Image URL & Prep Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase block">Prep Time</label>
                  <input
                    type="text"
                    value={modalData.prepTime}
                    onChange={(e) => setModalData({ ...modalData, prepTime: e.target.value })}
                    placeholder="e.g. 15 min"
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Diet selector */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase block">Diet type</label>
                  <div className="flex bg-slate-50 p-0.5 border rounded-xl h-10 items-center">
                    <button
                      type="button"
                      onClick={() => setModalData({ ...modalData, veg: true })}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                        modalData.veg
                          ? 'bg-white text-emerald-700 shadow-sm border'
                          : 'text-slate-500'
                      }`}
                    >
                      Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalData({ ...modalData, veg: false })}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                        !modalData.veg
                          ? 'bg-white text-red-700 shadow-sm border'
                          : 'text-slate-500'
                      }`}
                    >
                      Non-Veg
                    </button>
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase block">Image URL</label>
                <input
                  type="text"
                  value={modalData.image}
                  onChange={(e) => setModalData({ ...modalData, image: e.target.value })}
                  placeholder="Paste Unsplash or direct image link..."
                  className="w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm transition-all"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
