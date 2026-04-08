import { useState, useEffect } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function StudentDashboard() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
    fetchOrders();

    socket.on('orderStatusChanged', (updatedOrder) => {
      setOrders((prev) => prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)));
    });

    return () => {
      socket.off('orderStatusChanged');
    };
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/items/approved');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOrder = async (itemId) => {
    try {
      const payload = { items: [{ itemId, quantity: 1 }] }; // Basic 1 item flow for demo
      const res = await api.post('/orders', payload);
      setOrders((prev) => [res.data, ...prev]);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to order');
    }
  };

  const handleDispute = async (orderId) => {
    try {
      const reason = prompt('Enter the reason for dispute:');
      if (!reason) return;
      const res = await api.put(`/orders/${orderId}`, { status: 'Disputed', disputeReason: reason });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data : o)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispute');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Canteen Menu</h2>
          {items.map((item) => (
            <div key={item._id} className="flex justify-between items-center bg-gray-50 p-4 border rounded mb-2">
              <div>
                <span className="font-semibold">{item.name}</span> - ₹{item.price}
              </div>
              <button
                onClick={() => handleOrder(item._id)}
                className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
              >
                Request
              </button>
            </div>
          ))}
        </section>

        <section className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your Recent Orders</h2>
          {orders.map((order) => (
            <div key={order._id} className={`p-4 rounded border mb-2 ${order.status === 'Disputed' ? 'bg-red-50' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-bold
                    ${order.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : ''}
                    ${order.status === 'Completed' ? 'bg-green-200 text-green-800' : ''}
                    ${order.status === 'Disputed' ? 'bg-red-200 text-red-800' : ''}
                  `}
                >
                  {order.status}
                </span>
              </div>
              <div>Total: ₹{order.total}</div>
              {order.status === 'Completed' && (
                <button
                  onClick={() => handleDispute(order._id)}
                  className="mt-2 text-sm text-red-600 font-semibold underline"
                >
                  Dispute this charge
                </button>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}