import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { StoreContext } from '../context/StoreContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const Reports = () => {
  const { dashboardStats } = useContext(StoreContext);

  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const trendData = last7Days.map(date => {
    const randomVariance = Math.random() * 0.4 + 0.8;
    return {
      name: date.slice(5),
      Profit: Math.floor(dashboardStats.profit > 0 ? (dashboardStats.profit / 7) * randomVariance : 1000 * randomVariance),
      Expense: Math.floor(dashboardStats.totalExpense > 0 ? (dashboardStats.totalExpense / 7) * randomVariance : 500 * randomVariance)
    }
  });

  const summaryData = [
    { name: 'Today', Income: dashboardStats.totalIncome, Expense: dashboardStats.totalExpense }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-xl font-medium z-50">
          <p className="text-slate-800 mb-3 font-bold border-b border-slate-200 pb-2">{label}</p>
          {payload.map((p, idx) => (
            <div key={idx} className="flex items-center gap-2 my-1">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: p.color }}></div>
              <span className="text-slate-600 font-semibold">{p.name}:</span>
              <span className="text-slate-900 font-bold font-mono">₹{p.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Analytics & Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass bg-white p-6 rounded-2xl h-[450px] flex flex-col"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Income vs Expenses</h2>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontWeight: 600 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontWeight: 600 }} tickFormatter={(val) => `₹${val}`} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.8 }} />
                <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', color: '#334155' }} iconType="circle" />
                <Bar dataKey="Income" fill="#22c55e" radius={[6, 6, 0, 0]} barSize={80} animationDuration={1500} />
                <Bar dataKey="Expense" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={80} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass bg-white p-6 rounded-2xl h-[450px] flex flex-col"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">7-Day Profit Trend (Mocked)</h2>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontWeight: 600 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontWeight: 600 }} tickFormatter={(val) => `₹${val}`} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} iconType="circle" />
                <Line type="monotone" dataKey="Profit" stroke="#3b82f6" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: '#ffffff' }} activeDot={{ r: 8, fill: '#3b82f6' }} animationDuration={2000} />
                <Line type="monotone" dataKey="Expense" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }} opacity={0.8} animationDuration={2000} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
