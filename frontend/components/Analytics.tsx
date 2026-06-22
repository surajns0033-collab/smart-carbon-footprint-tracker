import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BarChart3, LineChart, PieChart, Trash2, Search, Filter, Calendar, Activity, Zap, TrendingDown, ArrowDown, ArrowUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { useAppContext } from '../context/AppContext';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6'];

export const Analytics: React.FC = () => {
  const { logs, deleteLog } = useAppContext();
  const [searchParams] = useSearchParams();

  // Filters state initialized from query params if present
  const [timeframe, setTimeframe] = useState<string>(searchParams.get('timeframe') || 'all');
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'all');
  const [search, setSearch] = useState<string>('');

  // Synchronize state if URL params change
  useEffect(() => {
    const tfParam = searchParams.get('timeframe');
    if (tfParam) setTimeframe(tfParam);
    const catParam = searchParams.get('category');
    if (catParam) setCategory(catParam);
  }, [searchParams]);

  // Filter logs list based on user selections
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // 1. Timeframe
      if (timeframe !== 'all') {
        const logDate = new Date(log.date).getTime();
        const now = Date.now();
        if (timeframe === 'today') {
          if (new Date(log.date).toDateString() !== new Date().toDateString()) return false;
        } else if (timeframe === 'week') {
          if (now - logDate > 7 * 24 * 3600 * 1000) return false;
        } else if (timeframe === 'month') {
          if (now - logDate > 30 * 24 * 3600 * 1000) return false;
        }
      }

      // 2. Category
      if (category !== 'all') {
        if (log.category.toLowerCase() !== category.toLowerCase()) return false;
      }

      // 3. Search query
      if (search.trim() !== '') {
        const query = search.toLowerCase();
        const descMatch = log.description.toLowerCase().includes(query);
        const catMatch = log.category.toLowerCase().includes(query);
        if (!descMatch && !catMatch) return false;
      }

      return true;
    });
  }, [logs, timeframe, category, search]);

  // Calculative summary KPIs
  const kpis = useMemo(() => {
    let totalEmitted = 0;
    let totalSaved = 0;
    let xpEarned = 0;

    filteredLogs.forEach(log => {
      xpEarned += log.xpEarned;
      if (log.co2Impact > 0) {
        totalEmitted += log.co2Impact;
      } else {
        totalSaved += Math.abs(log.co2Impact);
      }
    });

    return {
      netFootprint: parseFloat((totalEmitted - totalSaved).toFixed(2)),
      totalEmitted: parseFloat(totalEmitted.toFixed(2)),
      totalSaved: parseFloat(totalSaved.toFixed(2)),
      xpEarned
    };
  }, [filteredLogs]);

  // Category breakdown for bar chart
  const categoryChartData = useMemo(() => {
    const catMap: Record<string, number> = {};
    filteredLogs.forEach(log => {
      if (log.co2Impact > 0) {
        catMap[log.category] = (catMap[log.category] || 0) + log.co2Impact;
      }
    });
    return Object.keys(catMap).map(k => ({
      name: k,
      emissions: parseFloat(catMap[k].toFixed(2))
    }));
  }, [filteredLogs]);

  // Trend data: daily emissions in filtered logs
  const dailyTrendData = useMemo(() => {
    const dateMap: Record<string, number> = {};
    // Sort logs by date ascending
    const sorted = [...filteredLogs].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    sorted.forEach(log => {
      const dateLabel = new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateMap[dateLabel] = (dateMap[dateLabel] || 0) + (log.co2Impact > 0 ? log.co2Impact : 0);
    });

    // Fallback trend values if empty
    if (Object.keys(dateMap).length === 0) {
      return [
        { date: 'Day 1', co2: 2.5 },
        { date: 'Day 2', co2: 3.2 },
        { date: 'Day 3', co2: 1.8 },
        { date: 'Day 4', co2: 4.1 },
        { date: 'Day 5', co2: 2.9 },
      ];
    }

    return Object.keys(dateMap).map(k => ({
      date: k,
      co2: parseFloat(dateMap[k].toFixed(2))
    }));
  }, [filteredLogs]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this activity log? All calculation metrics will update automatically.")) {
      deleteLog(id);
    }
  };

  const categories = Array.from(new Set(logs.map(l => l.category)));

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-gray-900 dark:text-gray-100">
      
      {/* Header */}
      <div className="flex items-center gap-3 bg-white/95 dark:bg-gray-900/90 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md">
        <div className="p-3 bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 rounded-xl">
          <LineChart size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Analytics & Detailed Logs</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Review, filter, and trace carbon emissions with actual logged history.</p>
        </div>
      </div>

      {/* Dynamic Filter Controls */}
      <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-md">
        
        {/* Timeframe selector */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-full md:w-auto">
          {['all', 'today', 'week', 'month'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`flex-1 md:flex-initial px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tf === 'all' ? 'All Time' : tf === 'week' ? '7 Days' : tf === 'month' ? '30 Days' : 'Today'}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto flex-1 justify-end">
          {/* Category drop down */}
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full md:w-48 pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold rounded-xl outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Search ledger input */}
          <div className="relative flex-1 md:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold rounded-xl outline-none"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Net Carbon footprint</p>
          <h3 className="text-xl font-black mt-1 flex items-baseline gap-1">
            {kpis.netFootprint} <span className="text-xs font-normal text-gray-400">kg CO₂e</span>
          </h3>
          <span className="text-[10px] font-bold text-gray-400 mt-2 block">Total Emitted - Saved</span>
        </div>

        <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gross Emissions</p>
          <h3 className="text-xl font-black mt-1 text-red-500 flex items-baseline gap-1">
            +{kpis.totalEmitted} <span className="text-xs font-normal text-gray-400">kg CO₂e</span>
          </h3>
          <span className="text-[10px] font-bold text-red-400/80 mt-2 block flex items-center gap-1">
            <ArrowUp size={12} /> Carbon footprint
          </span>
        </div>

        <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Carbon Savings</p>
          <h3 className="text-xl font-black mt-1 text-emerald-500 flex items-baseline gap-1">
            -{kpis.totalSaved} <span className="text-xs font-normal text-gray-400">kg CO₂e</span>
          </h3>
          <span className="text-[10px] font-bold text-emerald-400/80 mt-2 block flex items-center gap-1">
            <ArrowDown size={12} /> Positive offsets
          </span>
        </div>

        <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">XP Accumulated</p>
          <h3 className="text-xl font-black mt-1 text-yellow-600 flex items-baseline gap-1">
            +{kpis.xpEarned} <span className="text-xs font-normal text-gray-400">XP</span>
          </h3>
          <span className="text-[10px] font-bold text-yellow-500 mt-2 block">XP in filtered range</span>
        </div>
      </div>

      {/* Graph Visualizers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trend Area Chart */}
        <div className="bg-white/90 dark:bg-gray-900/90 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-700 dark:text-gray-250 mb-4">CO₂ Emission Trend over Time</h3>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyTrendData} margin={{ left: -25, right: 10 }}>
                  <defs>
                    <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                  <Area type="monotone" dataKey="co2" name="CO2 impact" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category breakdown bar chart */}
        <div className="bg-white/90 dark:bg-gray-900/90 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-700 dark:text-gray-250 mb-4">Emissions by Category (kg CO₂)</h3>
            <div className="h-[220px] w-full">
              {categoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ left: -25, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                    <Bar dataKey="emissions" radius={[4, 4, 0, 0]}>
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-gray-400">
                  No emissions logged to display category chart.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Log History Table */}
      <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50/50 dark:bg-gray-950/20 border-b border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-400 flex justify-between items-center">
          <span>Traceable Activity Ledger ({filteredLogs.length} entries)</span>
          <span>Click Trash icon to delete logs</span>
        </div>

        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-left text-xs font-semibold">
            <thead className="bg-white dark:bg-gray-900 sticky top-0 shadow-sm text-gray-500 border-b border-gray-200 dark:border-gray-800 z-10">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Category</th>
                <th className="p-4">Description</th>
                <th className="p-4">Carbon Impact</th>
                <th className="p-4">XP Gained</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="p-4 text-gray-400 dark:text-gray-400 whitespace-nowrap">
                      {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                        {log.category}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700 dark:text-gray-300 max-w-[200px] truncate" title={log.description}>
                      {log.description}
                    </td>
                    <td className={`p-4 font-black whitespace-nowrap ${log.co2Impact > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {log.co2Impact > 0 ? '+' : ''}{log.co2Impact} kg CO₂e
                    </td>
                    <td className="p-4 text-yellow-600 font-bold whitespace-nowrap">
                      +{log.xpEarned} XP
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-1.5 border border-transparent text-gray-400 hover:text-red-600 hover:border-red-100 dark:hover:border-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 text-xs">
                    No logged activities found matching the filters. Start tracking in "Daily Log"!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
