import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdDashboard, MdInventory, MdAssignment, MdAttachMoney, MdBarChart, MdMenu, MdChevronLeft } from 'react-icons/md';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const links = [
    { name: 'Dashboard', path: '/', icon: <MdDashboard size={24} /> },
    { name: 'Stock', path: '/stock', icon: <MdInventory size={24} /> },
    { name: 'Usage', path: '/usage', icon: <MdAssignment size={24} /> },
    { name: 'Transactions', path: '/transactions', icon: <MdAttachMoney size={24} /> },
    { name: 'Reports', path: '/reports', icon: <MdBarChart size={24} /> },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: isOpen ? 250 : 80 }}
      className="h-screen glass flex flex-col justify-between z-50 transition-all duration-300 border-r border-slate-200/60 relative shrink-0"
    >
      <div>
        <div className="flex items-center justify-between p-4 border-b border-slate-200/60 h-16">
          {isOpen && (
            <div className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded shadow-sm object-cover" onError={(e) => e.target.style.display='none'} />
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-black text-red-600 truncate">Ambika Bhel</motion.span>
            </div>
          )}
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500 hover:text-slate-800 transition-colors mx-auto">
            {isOpen ? <MdChevronLeft size={28} /> : <MdMenu size={28} />}
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-6 px-3">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => 
                `flex items-center gap-4 p-3 rounded-xl transition-all overflow-hidden ${isActive ? 'bg-blue-100 text-blue-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`
              }
            >
              <div className="min-w-[24px]">
                {link.icon}
              </div>
              {isOpen && <span className="whitespace-nowrap">{link.name}</span>}
            </NavLink>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
