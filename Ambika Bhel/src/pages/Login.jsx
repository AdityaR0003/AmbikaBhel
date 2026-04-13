import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StoreContext } from '../context/StoreContext';
import { MdLockOutline } from 'react-icons/md';

const Login = () => {
  const { login } = useContext(StoreContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      setError(false);
      login(username);
      navigate('/');
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-white p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 glass rounded-2xl mx-auto shadow-2xl shadow-blue-900/5 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-400"></div>
        
        <div className="flex justify-center mb-6">
          <img src="/logo.jpg" alt="Ambika Bhel Logo" className="w-24 h-24 rounded shadow-md object-cover" onError={(e) => e.target.src='https://placehold.co/100x100?text=Logo'} />
        </div>

        <h2 className="text-3xl font-black text-center text-red-600 mb-2">Ambika Bhel</h2>
        <p className="text-center text-slate-500 mb-8 font-medium">Storage Management System</p>

        <motion.form 
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          onSubmit={handleLogin}
          className="space-y-6"
        >
          <div className="relative">
            <input 
              type="text" 
              id="username"
              className="peer w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label 
              htmlFor="username" 
              className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-white peer-focus:text-blue-600"
            >
              Username
            </label>
          </div>

          <div className="relative">
            <input 
              type="password" 
              id="password"
              className="peer w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label 
              htmlFor="password" 
              className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-white peer-focus:text-blue-600"
            >
              Password
            </label>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold tracking-wide shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            Login
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;
