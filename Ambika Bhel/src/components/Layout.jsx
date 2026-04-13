import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import { motion } from 'framer-motion';

const Layout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 to-slate-50 relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 relative w-full overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto h-full"
          >
            <Outlet />
          </motion.div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
