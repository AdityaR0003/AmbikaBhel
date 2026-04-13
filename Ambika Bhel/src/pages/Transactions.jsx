import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoreContext } from '../context/StoreContext';
import { MdTrendingUp, MdTrendingDown, MdAccountBalance, MdPayments, MdQrCodeScanner } from 'react-icons/md';

const Transactions = () => {
  const { transactions, addTransaction, editTransaction } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState('Income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(activeTab !== 'Bank Deposit' && !mode) {
      alert("Please select a payment mode");
      return;
    }
    if(amount) {
      if (editingId) {
        editTransaction(editingId, activeTab, amount, description, activeTab === 'Bank Deposit' ? 'Bank' : mode);
        setEditingId(null);
      } else {
        addTransaction(activeTab, amount, description, activeTab === 'Bank Deposit' ? 'Bank' : mode);
      }
      setAmount('');
      setDescription('');
      setMode('');
    }
  };

  const handleEdit = (t) => {
    setActiveTab(t.type);
    setAmount(t.amount);
    setDescription(t.description);
    setMode(t.mode === 'Bank' ? '' : t.mode);
    setEditingId(t.id);
  };

  const filteredTransactions = transactions.filter(t => t.type === activeTab);

  // Derive Daily sums
  const totalUPI = filteredTransactions.filter(t => t.mode === 'UPI').reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  const totalCash = filteredTransactions.filter(t => t.mode === 'Cash').reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  const totalBank = filteredTransactions.filter(t => t.type === 'Bank Deposit').reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Financial Transactions</h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        {['Income', 'Expense', 'Bank Deposit'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-8 py-3 rounded-xl font-bold transition-all ${
              activeTab === tab 
                ? (tab === 'Income' ? 'bg-green-600 text-white shadow-md shadow-green-500/20' : tab === 'Expense' ? 'bg-red-600 text-white shadow-md shadow-red-500/20' : 'bg-blue-600 text-white shadow-md shadow-blue-500/20')
                : (tab === 'Income' ? 'text-green-600 bg-green-50 hover:bg-green-100 border border-green-200' : tab === 'Expense' ? 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200' : 'text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200')
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {tab === 'Income' ? <MdTrendingUp size={20} /> : tab === 'Expense' ? <MdTrendingDown size={20} /> : <MdAccountBalance size={20} />}
              {tab}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`glass p-6 rounded-2xl border-t-4 bg-white ${activeTab === 'Income' ? 'border-green-500' : activeTab === 'Expense' ? 'border-red-500' : 'border-blue-500'}`}
          >
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              {activeTab === 'Income' ? <MdTrendingUp className="text-green-600" /> : activeTab === 'Expense' ? <MdTrendingDown className="text-red-600" /> : <MdAccountBalance className="text-blue-600" />}
              {editingId ? 'Edit' : 'Add'} {activeTab}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-2 font-semibold">Amount (₹)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors font-mono font-medium"
                  min="1"
                  required
                />
              </div>

              {activeTab !== 'Bank Deposit' && (
                <div>
                  <label className="block text-sm text-slate-600 mb-2 font-semibold">Payment Mode</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setMode('Cash')} className={`py-2 rounded-xl flex items-center justify-center gap-2 font-bold transition-all border ${mode === 'Cash' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}>
                      <MdPayments size={20} /> Cash
                    </button>
                    <button type="button" onClick={() => setMode('UPI')} className={`py-2 rounded-xl flex items-center justify-center gap-2 font-bold transition-all border ${mode === 'UPI' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}>
                      <MdQrCodeScanner size={20} /> UPI
                    </button>
                  </div>
                </div>
              )}

                <label className="block text-sm text-slate-600 mb-2 font-semibold">Description</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors font-medium"
                  placeholder="e.g. Sold materials"
                  required
                />
              <button 
                type="submit" 
                className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg mt-4 cursor-pointer ${
                  activeTab === 'Income' ? 'bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 shadow-green-500/20' : activeTab === 'Expense' ? 'bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 shadow-red-500/20' : 'bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 shadow-blue-500/20'
                }`}
              >
                {editingId ? 'Update' : 'Save'} {activeTab}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setAmount(''); setDescription(''); setMode(''); }}
                  className="w-full py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all shadow-sm mt-2 cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass p-6 rounded-2xl min-h-[400px] flex flex-col bg-white">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">{activeTab} History</h2>
                <div className="flex gap-2">
                   {activeTab !== 'Bank Deposit' && (
                     <>
                        <span className="text-sm px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-bold border border-slate-200">Cash: ₹{totalCash}</span>
                        <span className="text-sm px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-bold border border-slate-200">UPI: ₹{totalUPI}</span>
                     </>
                   )}
                   {activeTab === 'Bank Deposit' && (
                     <span className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold border border-blue-200">Total: ₹{totalBank}</span>
                   )}
                </div>
             </div>
             
             <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar flex-1">
                <AnimatePresence>
                  {filteredTransactions.length === 0 ? (
                    <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-slate-500 text-center py-12 text-lg font-medium">No {activeTab.toLowerCase()} records found.</motion.p>
                  ) : (
                    filteredTransactions.map((t, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: idx * 0.05 }}
                        key={t.id}
                        className={`bg-white border rounded-xl p-4 flex justify-between items-center hover:bg-slate-50 transition-colors shadow-sm group ${t.mode === 'UPI' ? 'border-purple-100' : 'border-slate-100'}`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-slate-800 font-bold text-lg">{t.description}</h4>
                            {t.mode && t.mode !== 'Bank' && (
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${t.mode === 'UPI' ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-600'}`}>{t.mode}</span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-600 transition-colors">{new Date(t.date).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`text-xl font-black px-4 py-2 rounded-lg border flex items-center gap-1 shadow-sm ${activeTab === 'Income' ? 'text-green-700 bg-green-50 border-green-200' : activeTab === 'Expense' ? 'text-red-700 bg-red-50 border-red-200' : 'text-blue-700 bg-blue-50 border-blue-200'}`}>
                            {activeTab === 'Income' ? '+' : activeTab === 'Expense' ? '-' : ''}₹{t.amount}
                          </div>
                          <button onClick={() => handleEdit(t)} className="text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors border border-blue-200">
                            Edit
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
