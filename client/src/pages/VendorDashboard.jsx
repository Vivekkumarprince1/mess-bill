import { useState, useEffect } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function VendorDashboard() {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  
  useEffect(() => {
    fetchOrders();
    fetchItems();

    socket.on('newOrder', (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    return () => socket.off('newOrder');
  }, []);

  const fetchOrders = async () => {
    const res = await api.get('/orders');
    setOrders(res.data);
  };

  const fetchItems = async () => {
    const res = await api.get('/items/approved');
    setItems(res.data);
  };

  const handleDispense = async (orderId) => {
    try {
      const res = await api.put(`/orders/${orderId}`, { status: 'Completed' });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data : o)));
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post('/items', { name: newItemName, price: newItemPrice });
      alert('Item submitted for admin approval');
      setNewItemName('');
      setNewItemPrice('');
    } catch (err) {
      alert('Error submitting item');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="bg-white p-4 shadow rounded-lg md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Pending Requests Queue</h2>
          <div className="space-y-3">
            {orders.filter(o => o.status === 'Pending').map((order) => (
              <div key={order._id} className="bg-gray-50 border-l-4 border-yellow-400 p-4 rounded-md flex justify-between items-center shadow-sm">
                <div>
                  <p className="text-sm font-semibold">Student: {order.studentId?.name}</p>
                  <p className="text-gray-600 text-sm">Value: ₹{order.total}</p>
                </div>
                <button
                  onClick={() => handleDispense(order._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold shadow hover:bg-green-700"
                >
                  Confirm & Dispense
                </button>
              </div>
            ))}
            {orders.filter(o => o.status === 'Pending').length === 0 && (
              <p className="text-gray-500 text-sm">No pending requests right now.</p>
            )}
          </div>
        </section>

        <section className="bg-white p-4 shadow rounded-lg space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Propose New Item</h2>
            <form onSubmit={handleAddItem} className="space-y-3">
              <input 
                placeholder="Item Name" 
                className="border p-2 w-full rounded" 
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                required
              />
              <input 
                type="number"
                placeholder="Price" 
                className="border p-2 w-full rounded" 
                value={newItemPrice}
                onChange={e => setNewItemPrice(e.target.value)}
                required
              />
              <button className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700">Submit Proposal</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}