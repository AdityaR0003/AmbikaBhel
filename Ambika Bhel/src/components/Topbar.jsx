import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { MdLogout } from 'react-icons/md';

const Topbar = () => {
  const { logout, user } = useContext(StoreContext);

  return (
    <div className="h-16 glass flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 border-b border-slate-200/60 shrink-0">
      <div className="flex md:hidden items-center gap-2">
        <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded shadow-sm object-cover" onError={(e) => e.target.style.display='none'} />
        <span className="text-lg font-black text-red-600">Ambika</span>
      </div>
      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        <div className="hidden md:flex flex-col text-right">
          <span className="text-sm font-semibold text-slate-800">{user || 'Admin User'}</span>
          <span className="text-xs text-green-600 font-medium">Online</span>
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 uppercase text-xs md:text-base">
          {user ? user.substring(0, 2) : 'AB'}
        </div>
        <button onClick={logout} className="ml-2 md:ml-4 text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-100" title="Logout">
          <MdLogout size={22} className="md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
