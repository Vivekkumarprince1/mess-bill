import { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [priceRequests, setPriceRequests] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchOrders();
    fetchPriceRequests();
  }, []);

  const fetchItems = async () => {
    const res = await api.get('/items');
    setItems(res.data);
  };

  const fetchOrders = async () => {
    const res = await api.get('/orders');
    setOrders(res.data);
  };

  const fetchPriceRequests = async () => {
    const res = await api.get('/price-requests');
    setPriceRequests(res.data);
  };

  const handleApproveItem = async (id) => {
    await api.put(`/items/${id}/approve`, { approved: true });
    fetchItems();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-4 border-b">Unapproved Items</h2>
          <ul className="space-y-3">
            {items.filter(i => !i.approved).map(item => (
              <li key={item._id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <span>{item.name} - ₹{item.price}</span>
                <button
                  onClick={() => handleApproveItem(item._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-4 border-b">Disputed Transactions</h2>
          <ul className="space-y-3">
            {orders.filter(o => o.status === 'Disputed').map(order => (
              <li key={order._id} className="bg-red-50 border-l-4 border-red-500 p-3 rounded space-y-1">
                <span className="font-semibold text-sm">Dispute: {order.studentId?.name} vs {order.vendorId?.name}</span>
                <p className="text-red-700 text-sm">Reason: {order.disputeReason}</p>
                <div className="text-gray-500 text-xs">Value: ₹{order.total} | Date: {new Date(order.createdAt).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white p-6 shadow rounded-lg md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 border-b">Recent System Transactions</h2>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">ID</th>
                <th className="px-4 py-2 text-left text-gray-600">Student</th>
                <th className="px-4 py-2 text-left text-gray-600">Total</th>
                <th className="px-4 py-2 text-left text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="px-4 py-2 text-gray-500">{order._id.substring(18)}</td>
                  <td className="px-4 py-2">{order.studentId?.name}</td>
                  <td className="px-4 py-2 font-semibold">₹{order.total}</td>
                  <td className={`px-4 py-2 font-bold 
                    ${order.status === 'Pending' ? 'text-yellow-600' : ''}
                    ${order.status === 'Completed' ? 'text-green-600' : ''}
                    ${order.status === 'Disputed' ? 'text-red-600' : ''}
                  `}>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}