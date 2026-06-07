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
  Filter,
  Utensils
} from 'lucide-react';
import { useApp } from '../context/AppContext';

function DispatchHeatmap() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Draw background city map simulation
    const width = canvas.width = 600;
    const height = canvas.height = 300;

    // Heatmap points
    const points = [
      { x: 120, y: 80, intensity: 25, label: "Sector 15 Hub" },
      { x: 450, y: 150, intensity: 35, label: "Vashi Plaza" },
      { x: 280, y: 220, intensity: 15, label: "Navi Mumbai Hub" },
      { x: 180, y: 190, intensity: 45, label: "Nerul Junction" },
      { x: 500, y: 90, intensity: 20, label: "Sanpada Center" }
    ];

    let animationId;
    let angle = 0;

    const render = () => {
      ctx.fillStyle = '#0f172a'; // Sleek dark blueprint map background
      ctx.fillRect(0, 0, width, height);

      // Draw grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw simulated roads
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      
      // Main Highway
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      // Diagonal Expressways
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, height);
      ctx.stroke();

      angle += 0.05;

      // Draw glowing radial circles (Heatmap)
      points.forEach(pt => {
        // Pulsing radius scale
        const pulse = Math.sin(angle + pt.x) * 12 + pt.intensity;

        // Radial gradient for glowing heat signature
        const grad = ctx.createRadialGradient(pt.x, pt.y, 2, pt.x, pt.y, pulse);
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.9)'); // Emerald Green Center
        grad.addColorStop(0.3, 'rgba(16, 185, 129, 0.4)');
        grad.addColorStop(0.8, 'rgba(16, 185, 129, 0.1)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pulse, 0, Math.PI * 2);
        ctx.fill();

        // Small center dot
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '8px monospace';
        ctx.fillText(`${pt.label} (${Math.round(pulse)} pkg)`, pt.x + 8, pt.y + 3);
      });

      // Draw simulated delivery riders moving
      ctx.fillStyle = '#f59e0b'; // Amber dots
      const numRiders = 4;
      for (let i = 0; i < numRiders; i++) {
        const speed = 0.5 + i * 0.1;
        const rx = (angle * 10 * speed + i * 150) % width;
        const ry = height / 2; // Move along main highway
        ctx.beginPath();
        ctx.arc(rx, ry, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(rx, ry, 10, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3 select-none">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Live Dispatch Logistics Heatmap</h4>
          <span className="text-[9px] text-slate-500 font-bold block mt-0.5">Real-time GPS coordinate mapping of hubs and riders</span>
        </div>
        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold rounded-full animate-pulse">
          LIVE MAP FEED
        </span>
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] border border-slate-800">
        <canvas ref={canvasRef} className="w-full h-[180px] sm:h-[220px] block" />
      </div>
      <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>Dispatch Hub Density</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500"></span>
          <span>Transit Riders</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 border border-slate-700 bg-slate-800"></span>
          <span>Blueprint Coordinates</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const {
    menuItems,
    orders,
    addMenuItem,
    editMenuItem,
    deleteMenuItem,
    updateOrderStatus,
    inventory,
    restockIngredient,
    coupons,
    addPromoCampaign,
    triggerToast,
    autoRestockEnabled,
    setAutoRestockEnabled
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'menu', 'orders', 'inventory', 'campaigns'

  // Search/Filter states for Menu Management
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilterCategory, setMenuFilterCategory] = useState('All');

  // Search/Filter states for Orders
  const [orderFilterStatus, setOrderFilterStatus] = useState('All');

  // Add/Edit Item Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
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

  // Promo form states
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('');
  const [promoMinOrder, setPromoMinOrder] = useState('');

  const handleExportCSV = () => {
    const headers = 'Order ID,Customer,Phone,Subtotal,Tax,Grand Total,Status,Timestamp\n';
    const rows = orders.map(o => 
      `"${o.id}","${o.customerInfo?.name}","${o.customerInfo?.phone}",${o.subtotal},${o.tax},${o.total},"${o.status}","${o.timestamp}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_report_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('CSV Sales Report downloaded successfully!', 'success');
  };

  // ----------------------------------------------------
  // ANALYTICS CALCULATIONS
  // ----------------------------------------------------
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const pendingOrdersCount = orders.filter(o => o.status !== 'Delivered').length;
  
  const preparingOrdersCount = orders.filter(o => o.status === 'Preparing').length;
  let kitchenLoad = 'Low';
  let kitchenLoadColor = 'text-emerald-700 bg-emerald-50 border-emerald-100';
  if (preparingOrdersCount > 5) {
    kitchenLoad = 'Busy';
    kitchenLoadColor = 'text-red-750 bg-red-50 border-red-150 animate-pulse';
  } else if (preparingOrdersCount >= 3) {
    kitchenLoad = 'Medium';
    kitchenLoadColor = 'text-amber-750 bg-amber-50 border-amber-150';
  }

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
        <div className="flex flex-wrap bg-white p-1 border border-slate-100 rounded-2xl shadow-sm w-full md:w-auto gap-1">
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
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow shadow-emerald-150'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span>Kanban Orders Board</span>
            {pendingOrdersCount > 0 && (
              <span className="h-5 w-5 bg-amber-500 text-white rounded-full text-[10px] font-black flex items-center justify-center">
                {pendingOrdersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'inventory'
                ? 'bg-emerald-600 text-white shadow shadow-emerald-150'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Utensils className="h-4 w-4" />
            <span>Inventory Ledger</span>
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'campaigns'
                ? 'bg-emerald-600 text-white shadow shadow-emerald-150'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Campaign Builder</span>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------
          TAB 1: OVERVIEW DASHBOARD
          ---------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Live commercial bar header */}
          <div className="flex justify-between items-center bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-bold text-slate-700 text-xs">Live commercial data feed</span>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow"
            >
              <span>Download Sales CSV</span>
            </button>
          </div>

          {/* AI Demand Forecaster alerts */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-5 shadow-inner space-y-3 select-none">
            <h3 className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="h-4.5 w-4.5 text-emerald-655" />
              Smart AI Demand Forecaster
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] font-semibold text-slate-655">
              <div className="flex gap-2.5 p-3.5 bg-white border border-emerald-100/50 rounded-2xl items-start">
                <span className="text-xl leading-none">📈</span>
                <p className="leading-relaxed">
                  Peak demand forecasted between <span className="font-extrabold text-slate-900">8:00 PM - 10:00 PM</span> tonight. Recommend pre-cooking Pepperoni Pizzas to optimize order dispatch speed.
                </p>
              </div>
              <div className="flex gap-2.5 p-3.5 bg-white border border-emerald-100/50 rounded-2xl items-start">
                <span className="text-xl leading-none">🥑</span>
                <p className="leading-relaxed">
                  Avocado Salad sales are up by <span className="font-extrabold text-emerald-700">25%</span>. We recommend raising Avocado and Salad Greens ingredient inventory immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Metrics cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Revenue card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Revenue</span>
                <span className="text-2xl font-black text-slate-900">₹{totalRevenue.toFixed(2)}</span>
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
                <span className="text-2xl font-black text-slate-900">₹{avgOrderValue.toFixed(2)}</span>
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
                        ₹{data.sales}
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

          {/* Live Dispatch Logistics Heatmap */}
          <DispatchHeatmap />

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
                      <td className="py-3 font-bold text-slate-900">₹{order.total.toFixed(2)}</td>
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
                      <td className="p-4 font-bold text-slate-900">₹{item.price.toFixed(2)}</td>
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
        <div className="space-y-6 animate-fade-in text-xs select-none">
          {/* Chef Prep Load Timeline Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-slate-100 rounded-3xl p-5 shadow-sm gap-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Utensils className="h-4.5 w-4.5" />
              </span>
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Kitchen Chef Prep Load Timeline</h4>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Real-time monitoring of kitchen preparation queue</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[9px] text-slate-405 font-bold block uppercase leading-none">Preparing Orders</span>
                <span className="text-xs font-black text-slate-800 mt-1 block">{preparingOrdersCount} in-prep</span>
              </div>
              <span className={`px-4 py-2 border rounded-2xl font-black text-xs uppercase tracking-widest ${kitchenLoadColor}`}>
                Kitchen Load: {kitchenLoad}
              </span>
            </div>
          </div>

          {/* Kanban Columns grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start min-h-[550px]">
            {[
              { id: 'Pending', label: 'Incoming Orders', color: 'bg-amber-500', text: 'text-amber-800', list: orders.filter(o => o.status === 'Pending') },
              { id: 'Preparing', label: 'Prepped / In-Prep', color: 'bg-blue-600', text: 'text-blue-800', list: orders.filter(o => o.status === 'Preparing') },
              { id: 'Out for Delivery', label: 'Cooked / Dispatch Queue', color: 'bg-purple-650', text: 'text-purple-800', list: orders.filter(o => o.status === 'Out for Delivery') },
              { id: 'Delivered', label: 'Delivered', color: 'bg-emerald-600', text: 'text-emerald-805', list: orders.filter(o => o.status === 'Delivered') }
            ].map((col) => (
              <div key={col.id} className="bg-slate-50 border border-slate-100 rounded-3xl p-4 flex flex-col h-[520px] min-w-[220px]">
                {/* Column header */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-205 mb-3">
                  <h3 className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                    <span className={`h-2.5 w-2.5 rounded-full ${col.color}`}></span>
                    {col.label}
                  </h3>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-bold rounded-lg text-[9px]">
                    {col.list.length}
                  </span>
                </div>

                {/* Column list */}
                <div className="flex-grow overflow-y-auto space-y-3 pr-1">
                  {col.list.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow hover:scale-[1.02] transition-all flex flex-col justify-between space-y-3"
                    >
                      {/* Card head */}
                      <div className="flex justify-between items-start">
                        <span className="font-mono font-bold text-emerald-805 bg-emerald-50 px-2 py-0.5 rounded text-[9px]">
                          {order.id}
                        </span>
                        <span className="text-[8px] text-slate-400 font-semibold">
                          {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Card body */}
                      <div className="text-[10px] space-y-1">
                        <p className="font-extrabold text-slate-850">{order.customerInfo.name}</p>
                        <p className="text-slate-400 line-clamp-1">{order.customerInfo.address}</p>
                      </div>

                      <div className="space-y-1.5 border-t border-slate-50 pt-2 text-[9px] text-slate-500 font-semibold max-h-20 overflow-y-auto">
                        {order.items.map((item, index) => (
                          <div key={index} className="space-y-0.5">
                            <div className="flex justify-between">
                              <span>{item.name} x{item.quantity}</span>
                              <span>{item.selectedOptions?.size}</span>
                            </div>
                            {item.note && (
                              <p className="text-[8px] text-slate-400 italic font-semibold pl-1.5 border-l border-emerald-300">
                                Note: "{item.note}"
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Card footer / Actions */}
                      <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                        <span className="font-black text-slate-900 text-xs">₹{order.total}</span>
                        
                        <div className="flex gap-1">
                          {order.status === 'Pending' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Preparing')}
                              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-750 text-white font-bold rounded-xl text-[9px] transition-all"
                            >
                              Prep
                            </button>
                          )}
                          {order.status === 'Preparing' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                              className="px-2.5 py-1.5 bg-purple-650 hover:bg-purple-700 text-white font-bold rounded-xl text-[9px] transition-all"
                            >
                              Ship
                            </button>
                          )}
                          {order.status === 'Out for Delivery' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Delivered')}
                              className="px-2.5 py-1.5 bg-emerald-650 hover:bg-emerald-700 text-white font-bold rounded-xl text-[9px] transition-all"
                            >
                              Arrive
                            </button>
                          )}
                          {order.status === 'Delivered' && (
                            <span className="text-[8px] text-emerald-750 font-black bg-emerald-50 px-2 py-1 rounded-lg">
                              Done
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {col.list.length === 0 && (
                    <div className="py-10 text-center text-slate-400 font-semibold text-[10px]">
                      No orders in column
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 4: INVENTORY LEDGER
          ---------------------------------------------------- */}
      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-fade-in text-xs select-none">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-50 pb-4 gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-950">Raw Ingredients Inventory Ledger</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Track real-time stock levels of organic ingredients. Ordering food deducts quantities automatically.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Auto Restock Switch */}
                <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 select-none hover:bg-slate-100 transition-all">
                  <input
                    type="checkbox"
                    checked={autoRestockEnabled}
                    onChange={(e) => setAutoRestockEnabled(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4.5 w-4.5"
                  />
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-slate-700 block leading-none">Auto-Restock Ledgers</span>
                    <span className="text-[8px] text-slate-450 font-semibold mt-0.5 block">Automate +15 raw replenishment</span>
                  </div>
                </label>

                <span className="px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl font-bold text-[10px]">
                  Low Stock Threshold: &lt; 3
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {Object.entries(inventory).map(([ingName, stockCount]) => {
                const isLow = stockCount < 3;
                const isCritical = stockCount === 0;
                return (
                  <div
                    key={ingName}
                    className={`border rounded-2xl p-4 flex justify-between items-center transition-all ${
                      isCritical ? 'bg-red-50/70 border-red-200' :
                      isLow ? 'bg-amber-50/70 border-amber-200' :
                      'bg-slate-50/50 border-slate-150'
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        {ingName}
                        {isLow && (
                          <span className={`inline-block h-2 w-2 rounded-full bg-red-500 ${isCritical ? 'animate-ping' : 'animate-pulse'}`} title="Low Stock Warning"></span>
                        )}
                      </h4>
                      <p className="text-xs font-black text-slate-900">
                        Stock: <span className={isLow ? 'text-red-650' : 'text-emerald-700'}>{stockCount} units</span>
                      </p>
                    </div>

                    <button
                      onClick={() => restockIngredient(ingName, 15)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[10px] shadow transition-all"
                    >
                      +15 Restock
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 5: CAMPAIGN & PROMO BUILDER
          ---------------------------------------------------- */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6 animate-fade-in text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form builder */}
            <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-950 border-b border-slate-50 pb-3">Create Promo Campaign</h3>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!promoCode.trim() || !promoDiscount.trim() || !promoMinOrder.trim()) {
                    triggerToast('All campaign parameters are required!', 'error');
                    return;
                  }
                  const discVal = parseInt(promoDiscount);
                  const minVal = parseInt(promoMinOrder);
                  if (isNaN(discVal) || discVal <= 0 || discVal > 100) {
                    triggerToast('Discount must be between 1% and 100%', 'error');
                    return;
                  }
                  if (isNaN(minVal) || minVal < 0) {
                    triggerToast('Minimum order value must be positive', 'error');
                    return;
                  }

                  const res = addPromoCampaign(promoCode.trim(), discVal, minVal);
                  if (res.success) {
                    setPromoCode('');
                    setPromoDiscount('');
                    setPromoMinOrder('');
                  } else {
                    triggerToast(res.message, 'error');
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="font-bold text-slate-450 uppercase tracking-wider block">Promo Code</label>
                  <input
                    type="text"
                    placeholder="e.g. WEEKEND30"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase font-mono font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-455 uppercase tracking-wider block">Discount Percent (%)</label>
                  <input
                    type="number"
                    placeholder="e.g. 30"
                    value={promoDiscount}
                    onChange={(e) => setPromoDiscount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-455 uppercase tracking-wider block">Min Order Value (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 399"
                    value={promoMinOrder}
                    onChange={(e) => setPromoMinOrder(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-205 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-650 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition-all"
                >
                  Launch Campaign Code
                </button>
              </form>
            </div>

            {/* List active coupons */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-950 border-b border-slate-50 pb-3">Active Campaign Promos</h3>
              
              <div className="space-y-3">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className="border border-slate-150 rounded-2xl p-4 flex justify-between items-center bg-slate-50/50"
                  >
                    <div className="space-y-1">
                      <span className="font-mono text-sm font-black tracking-wider text-emerald-950 block">
                        {coupon.code}
                      </span>
                      <p className="text-[10px] text-slate-455 font-semibold">
                        Min Order: ₹{coupon.minOrder} • Applied Discount: {coupon.discount}% off
                      </p>
                    </div>

                    <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-805 rounded-xl font-bold text-xs border border-emerald-150">
                      {coupon.discount}% Discount
                    </span>
                  </div>
                ))}
              </div>
            </div>
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
                  <label className="font-bold text-slate-400 uppercase block">Price (₹)</label>
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
