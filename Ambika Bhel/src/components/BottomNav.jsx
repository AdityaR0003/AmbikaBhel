import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdInventory, MdAssignment, MdAttachMoney, MdBarChart } from 'react-icons/md';

const BottomNav = () => {
  const links = [
    { name: 'Home', path: '/', icon: <MdDashboard size={24} /> },
    { name: 'Stock', path: '/stock', icon: <MdInventory size={24} /> },
    { name: 'Usage', path: '/usage', icon: <MdAssignment size={24} /> },
    { name: 'Txn', path: '/transactions', icon: <MdAttachMoney size={24} /> },
    { name: 'Stats', path: '/reports', icon: <MdBarChart size={24} /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-200/60 flex justify-around items-center h-16 px-2 z-50 rounded-t-2xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) => 
            `flex flex-col items-center justify-center w-full h-full text-xs transition-colors ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <div className={`mb-1 transition-transform ${window.location.pathname === link.path ? 'scale-110' : ''}`}>
            {link.icon}
          </div>
          <span className="truncate w-full text-center">{link.name}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;
