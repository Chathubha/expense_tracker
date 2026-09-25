import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, Wallet, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-white/90 sticky top-0 z-50 border-b border-gray-100 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 transition group">
              <div className="bg-blue-50 p-2 rounded-xl group-hover:bg-blue-100 transition mr-3">
                <Wallet className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">ExpenseTracker</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-sm font-medium transition-all"
                >
                  <LayoutDashboard className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-sm font-medium transition-all"
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                >
                  <LogIn className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Log in</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm"
                >
                  <UserPlus className="h-4 w-4 mr-1 sm:mr-2" />
                  <span>Sign up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
