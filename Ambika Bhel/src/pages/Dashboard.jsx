import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StoreContext } from '../context/StoreContext';
import { MdInventory, MdTrendingUp, MdTrendingDown, MdAttachMoney } from 'react-icons/md';

const CountUp = ({ value, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (start === end || isNaN(end)) return;
    
    let totalDuration = 1000;
    let incrementTime = 20;
    let steps = totalDuration / incrementTime;
    let step = end / steps;

    let timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{count}{suffix}</span>;
};

const MetricCard = ({ title, value, icon, colorClass, prefix = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5 }}
    className="glass p-6 rounded-2xl relative overflow-hidden group cursor-pointer"
  >
    <div className={`absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500 ${colorClass}`}>
      {React.cloneElement(icon, { size: 100 })}
    </div>
    
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-3 rounded-xl bg-white shadow-sm border border-slate-100 ${colorClass}`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h3 className="text-slate-500 font-semibold">{title}</h3>
    </div>
    <div className="text-3xl font-bold text-slate-800">
      <CountUp value={value} prefix={prefix} />
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { dashboardStats, items } = useContext(StoreContext);
  const totalStockItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
        <div className="text-sm text-slate-600 font-medium bg-white/60 px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          Welcome back, Admin!
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Stock Items" 
          value={totalStockItems} 
          icon={<MdInventory />} 
          colorClass="text-blue-500"
          delay={0.1}
        />
        <MetricCard 
          title="Daily Income" 
          value={dashboardStats.totalIncome} 
          prefix="₹"
          icon={<MdTrendingUp />} 
          colorClass="text-green-500"
          delay={0.2}
        />
        <MetricCard 
          title="Daily Expenses" 
          value={dashboardStats.totalExpense} 
          prefix="₹"
          icon={<MdTrendingDown />} 
          colorClass="text-red-500"
          delay={0.3}
        />
        <MetricCard 
          title="Profit" 
          value={dashboardStats.profit} 
          prefix="₹"
          icon={<MdAttachMoney />} 
          colorClass="text-emerald-500"
          delay={0.4}
        />
      </div>

      <div className="mt-12 p-8 glass rounded-2xl min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <MdTrendingUp size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl text-slate-500 font-medium">Head to Reports page for visual analytics</h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
