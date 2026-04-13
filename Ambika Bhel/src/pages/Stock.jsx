import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoreContext } from '../context/StoreContext';
import { MdEdit, MdClose, MdDelete, MdAdd } from 'react-icons/md';

const Stock = () => {
  const { items, updateItem, addItem, deleteItem } = useContext(StoreContext);
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemData, setNewItemData] = useState({ name: '', unit: 'kg' });

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewQuantity(item.quantity);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if(editingItem && newQuantity !== '') {
      updateItem(editingItem.id, newQuantity);
      setEditingItem(null);
    }
  };

  const handleAddNewItem = (e) => {
    e.preventDefault();
    if(newItemData.name !== '') {
      addItem(newItemData.name, newItemData.unit);
      setIsAddingItem(false);
      setNewItemData({ name: '', unit: 'kg' });
    }
  };

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Stock Management</h1>
        <button onClick={() => setIsAddingItem(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-semibold shadow-sm">
          <MdAdd size={20} /> Add Item
        </button>
      </div>

      <div className="glass rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-100/50 border-b border-slate-200 text-sm">
              <th className="p-4 text-slate-600 font-semibold uppercase tracking-wider">Item Name</th>
              <th className="p-4 text-slate-600 font-semibold uppercase tracking-wider">Quantity</th>
              <th className="p-4 text-slate-600 font-semibold uppercase tracking-wider">Unit</th>
              <th className="p-4 text-slate-600 font-semibold uppercase tracking-wider">Status</th>
              <th className="p-4 text-slate-600 font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={item.id} 
                className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors group"
              >
                <td className="p-4 font-semibold text-slate-800 text-lg">{item.name}</td>
                <td className="p-4 text-slate-700 font-mono text-lg">{item.quantity}</td>
                <td className="p-4 text-slate-500 capitalize font-medium">{item.unit}</td>
                <td className="p-4">
                  {item.status === 'Low Stock' ? (
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold animate-pulse inline-block border border-red-200 shadow-sm">
                      {item.status}
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold border border-green-200">
                      {item.status}
                    </span>
                  )}
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 bg-white text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-600 hover:text-white transition-all opacity-70 group-hover:opacity-100 shadow-sm">
                    <MdEdit size={20} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-white text-red-600 border border-red-100 rounded-lg hover:bg-red-600 hover:text-white transition-all opacity-70 group-hover:opacity-100 shadow-sm">
                    <MdDelete size={20} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white border-t-4 border-t-blue-500 p-6 rounded-2xl w-full max-w-sm relative shadow-2xl"
            >
              <button 
                onClick={() => setEditingItem(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 p-1 rounded-full transition-colors"
              >
                <MdClose size={20} />
              </button>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <MdEdit className="text-blue-600" /> Edit {editingItem.name}
              </h2>
              <form onSubmit={saveEdit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-2 font-semibold">New Quantity ({editingItem.unit})</label>
                  <input 
                    type="number" 
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                    min="0"
                    step="0.1"
                    autoFocus
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                  Save Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {isAddingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white border-t-4 border-t-green-500 p-6 rounded-2xl w-full max-w-sm relative shadow-2xl"
            >
              <button 
                onClick={() => setIsAddingItem(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 p-1 rounded-full transition-colors"
              >
                <MdClose size={20} />
              </button>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <MdAdd className="text-green-600" /> Add New Item
              </h2>
              <form onSubmit={handleAddNewItem} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-2 font-semibold">Item Name</label>
                  <input 
                    type="text" 
                    value={newItemData.name}
                    onChange={(e) => setNewItemData({...newItemData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-2 font-semibold">Unit</label>
                  <select 
                    value={newItemData.unit}
                    onChange={(e) => setNewItemData({...newItemData, unit: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all uppercase"
                  >
                    <option value="kg">KG</option>
                    <option value="liters">Liters</option>
                    <option value="pieces">Pieces</option>
                    <option value="packets">Packets</option>
                    <option value="boxes">Boxes</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="w-full mt-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-500/20"
                >
                  Add Item
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Stock;
