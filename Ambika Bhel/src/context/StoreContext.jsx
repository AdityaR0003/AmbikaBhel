import React, { createContext, useState, useEffect } from 'react';

export const StoreContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const StoreProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]); // Fetch data when user logs in

  const fetchData = async () => {
    try {
      const itemsRes = await fetch(`${API_BASE}/items`);
      const logsRes = await fetch(`${API_BASE}/logs`);
      const txnRes = await fetch(`${API_BASE}/transactions`);
      
      if(itemsRes.ok) setItems(await itemsRes.json());
      if(logsRes.ok) setLogs(await logsRes.json());
      if(txnRes.ok) setTransactions(await txnRes.json());
    } catch (e) {
      console.error("Failed to fetch data:", e);
    }
  };

  const computedItems = items.map(item => ({
    ...item,
    quantity: parseFloat(item.quantity) || 0,
    status: (parseFloat(item.quantity) || 0) <= 20 ? 'Low Stock' : 'Available',
  }));

  const login = (username) => {
    setUser(username);
    setIsAuthenticated(true);
  };
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const useItem = async (itemId, quantity) => {
    try {
      const res = await fetch(`${API_BASE}/use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity: parseFloat(quantity) })
      });
      if (!res.ok) return false;
      
      await fetchData(); // Refresh all to get new logs and updated items
      return true;
    } catch (e) {
      console.error("Error using item:", e);
      return false;
    }
  };

  const addTransaction = async (type, amount, description, mode = 'Cash') => {
    try {
      await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, amount: parseFloat(amount), description, mode })
      });
      await fetchData(); // Refresh transactions
    } catch (e) {
      console.error("Error adding transaction:", e);
    }
  };

  const editTransaction = async (id, type, amount, description, mode) => {
    try {
      await fetch(`${API_BASE}/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, amount: parseFloat(amount), description, mode })
      });
      await fetchData();
    } catch (e) {
      console.error("Error editing transaction:", e);
    }
  };

  const editLog = async (id, quantityUsed) => {
    try {
      const res = await fetch(`${API_BASE}/logs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantityUsed: parseFloat(quantityUsed) })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to edit log");
      }
      await fetchData();
      return true;
    } catch (e) {
      console.error("Error editing log:", e);
      return false;
    }
  };

  const updateItem = async (itemId, newQuantity) => {
     try {
       await fetch(`${API_BASE}/items/${itemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: parseFloat(newQuantity) })
       });
       await fetchData(); // Refresh items
     } catch (e) {
       console.error("Error updating item:", e);
     }
  };

  const addItem = async (name, unit) => {
    try {
      await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, unit })
      });
      await fetchData(); // Refresh items
    } catch (e) {
      console.error("Error adding item:", e);
    }
  };

  const deleteItem = async (id) => {
    try {
      await fetch(`${API_BASE}/items/${id}`, {
        method: 'DELETE',
      });
      await fetchData(); // Refresh items
    } catch (e) {
      console.error("Error deleting item:", e);
    }
  };

  // Explicit mapping of numbers because MySQL decimal returns a string format
  const amountToFloat = (t) => parseFloat(t.amount) || 0;
  
  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((acc, curr) => acc + amountToFloat(curr), 0);
  const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((acc, curr) => acc + amountToFloat(curr), 0);
  const profit = totalIncome - totalExpense;

  return (
    <StoreContext.Provider value={{
      items: computedItems, logs, transactions, useItem, addTransaction, updateItem, addItem, deleteItem, editTransaction, editLog,
      dashboardStats: { totalIncome, totalExpense, profit },
      isAuthenticated, login, logout, user
    }}>
      {children}
    </StoreContext.Provider>
  );
};
