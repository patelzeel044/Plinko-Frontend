import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-white">
     
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

    </div>
  );
}
