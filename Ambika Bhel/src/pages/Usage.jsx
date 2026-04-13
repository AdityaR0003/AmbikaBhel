import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoreContext } from '../context/StoreContext';
import { MdAssignment } from 'react-icons/md';

const Usage = () => {
  const { items, logs, useItem, editLog } = useContext(StoreContext);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [toast, setToast] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!selectedItem || !quantity) return;

    if (editingId) {
      const success = await editLog(editingId, quantity);
      if(success) {
        setToast({ type: 'success', message: 'Usage updated successfully!' });
        setSelectedItem('');
        setQuantity('');
        setEditingId(null);
      } else {
        setToast({ type: 'error', message: 'Failed to update usage!' });
      }
    } else {
      const success = await useItem(parseInt(selectedItem), quantity);
      if(success) {
        setToast({ type: 'success', message: 'Usage recorded successfully!' });
        setSelectedItem('');
        setQuantity('');
      } else {
        setToast({ type: 'error', message: 'Not enough stock available!' });
      }
    }

    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (log) => {
    const item = items.find(i => i.name === log.itemName);
    if(item) {
      setSelectedItem(item.id.toString());
    } else {
      setSelectedItem('');
    }
    setQuantity(log.quantityUsed);
    setEditingId(log.id);
  };

  const selectedItemData = items.find(i => i.id === parseInt(selectedItem));

  return (
    <div className="space-y-8 relative">
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-8 left-1/2 px-6 py-3 rounded-full shadow-xl z-50 text-white font-bold backdrop-blur-md border ${
              toast.type === 'success' ? 'bg-green-600/90 border-green-500 shadow-green-500/20' : 'bg-red-600/90 border-red-500 shadow-red-500/20'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Record Material Usage</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-8 rounded-2xl h-fit border-t-4 border-blue-500 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -m-4 opacity-[0.03] text-blue-600">
             <MdAssignment size={200} />
          </div>
          <div className="flex items-center gap-3 mb-6 relative">
            <div className="p-2 bg-blue-100 rounded-xl">
              <MdAssignment size={24} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Usage' : 'Usage Form'}</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div>
              <label className="block text-sm text-slate-600 mb-2 font-semibold">Select Material</label>
              <select 
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors appearance-none font-medium disabled:opacity-50"
                required
                disabled={!!editingId}
              >
                <option value="" disabled>Choose an item...</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>{item.name} ({item.quantity} {item.unit} left)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-2 font-semibold">Quantity to Use {selectedItemData ? `(${selectedItemData.unit})` : ''}</label>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors font-mono font-medium"
                min="0.1"
                step="0.1"
                placeholder="e.g. 5"
                required
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {editingId ? 'Update Usage' : 'Record Usage'}
            </motion.button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setEditingId(null); setSelectedItem(''); setQuantity(''); }}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all shadow-sm"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-6 rounded-2xl border-t-4 border-purple-500 overflow-hidden flex flex-col h-[500px]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Recent Usage Logs</h2>
            <span className="text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-bold">{logs.length} entries</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {logs.length === 0 ? (
              <p className="text-slate-400 font-medium text-center py-8">No usage recorded yet.</p>
            ) : (
              logs.map((log, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={log.id} 
                  className="bg-white border border-slate-100 rounded-xl p-4 flex justify-between items-center hover:bg-slate-50 transition-colors group shadow-sm"
                >
                  <div>
                    <h4 className="text-slate-800 font-bold text-lg">{log.itemName}</h4>
                    <span className="text-xs text-slate-500 font-medium">{new Date(log.date).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                      -{log.quantityUsed}
                    </div>
                    <button onClick={() => handleEdit(log)} className="text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors border border-blue-200">
                      Edit
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Usage;
