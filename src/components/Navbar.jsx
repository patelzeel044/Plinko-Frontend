import { Link } from 'react-router-dom';
import { User, Wallet, Bell, MessageCircle, Search, LogOutIcon, History, HistoryIcon, LucideHistory } from 'lucide-react';
import { GrTransaction } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { getWalletBalance } from '../store/Slices/walletSlice';
import { useEffect } from 'react';
import { pendingRound } from '../store/Slices/plinkoGSlice';
import { userLogout } from '../store/Slices/authSlice';

export default function Navbar() {
  const authStatus = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();
  const { balance, loading } = useSelector(s => s.wallet);

  useEffect(() => { dispatch(getWalletBalance()); }, [dispatch]);

  useEffect(() => {dispatch(pendingRound()).then(()=>dispatch(getWalletBalance())) }, [dispatch]);

  return (
    <header className="sticky top-0 z-50 bg-[#1e2a38] shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
      
        <Link to="/" className="text-white text-2xl font-bold">
        Plinko.<span className="text-2xl text-blue-500 py-0.5 rounded">com</span>
        </Link>

        {/* Right Side */}
        {authStatus ? (
          <div className="flex items-center gap-5 text-white">
            {/* <button className="flex items-center gap-1 hover:text-blue-400">
              <Search size={20} />
            </button>
            <button className="hover:text-blue-400">
              <Bell size={20} />
            </button>
            <button className="hover:text-blue-400">
              <MessageCircle size={20} />
            </button> */}
            <Link to='/wallet'>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
              <Wallet size={18} />
              <span className="hidden lg:inline">₹{balance}</span>
            </button>
            </Link>
            <Link to='/transaction'>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
              <GrTransaction size={18} />
              <span className="hidden lg:inline">History</span>
            </button>
            </Link>
            
            <button onClick={()=>dispatch(userLogout())} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
              <LogOutIcon size={18} />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-white hover:text-blue-400"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
