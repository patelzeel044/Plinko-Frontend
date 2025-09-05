import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, FileText, LogOut, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { userLogout } from '../../store/Slices/authSlice';

const navItems = [
  { name: 'Dashboard', to: '/admin/dashboard', icon: <Home size={20}/> },
  { name: 'Users', to: '/admin/users', icon: <Users size={20}/> },
  { name: 'Transactions', to: '/admin/transactions', icon: <FileText size={20}/> },
  { name: 'PlinkoRounds', to: '/admin/plinkorounds', icon: <Gamepad2 size={20}/> },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen((open) => !open);
  const handleLogout = () => {
    dispatch(userLogout());
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: isOpen ? 240 : 64 }}
      className="bg-[#1e2a38] text-white h-screen flex flex-col shadow-lg"
    >
      {/* Toggle button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#27343f]">
        {isOpen && <Link to="/admin"><span className="text-xl font-bold">Admin Panel</span></Link>}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-[#2a3b4c] transition"
        >
          {/* rotate icon on collapse */}
          <motion.div
            animate={{ rotate: isOpen ? 0 : 180 }}
            className="text-gray-400"
          >
            ▶
          </motion.div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 my-1 transition
               ${isActive ? 'bg-[#2a3b4c]' : 'hover:bg-[#2a3b4c]'}
               ${!isOpen && 'justify-center'}`
            }
          >
            {item.icon}
            {isOpen && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className={`flex items-center gap-3 px-4 py-3 mb-4 mx-2 rounded hover:bg-red-600 transition
          ${!isOpen && 'justify-center'}`}
      >
        <LogOut size={20} />
        {isOpen && <span>Logout</span>}
      </button>
    </motion.aside>
  );
}
