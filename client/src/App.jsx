import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function HomeRouter() {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'Student') return <StudentDashboard />;
  if (user.role === 'Vendor') return <VendorDashboard />;
  if (['Admin', 'Super Admin'].includes(user.role)) return <AdminDashboard />;
  
  return <div>Role unknown</div>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomeRouter />} />
      </Route>
    </Routes>
  );
}

export default App;
