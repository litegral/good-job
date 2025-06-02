import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, UserPlus, LogIn, Briefcase, ClipboardList, LogOut, User as UserIconLucide } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    // No need to navigate as the UI will update based on auth state
  };
  
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-white" />
          GoodJob Talent
        </Link>
        
        <ul className="flex space-x-1 md:space-x-4 text-sm md:text-base">
          <li>
            <Link 
              to="/" 
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-white text-indigo-700 font-medium'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="hidden md:inline">Home</span>
            </Link>
          </li>
          
          {/* Always show Jobs link */}
          <li>
            <Link 
              to="/jobs" 
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/jobs') 
                  ? 'bg-white text-indigo-700 font-medium'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span className="hidden md:inline">Jobs</span>
            </Link>
          </li>
          
          {/* Show these links only when user is NOT authenticated */}
          {!isAuthenticated && (
            <>
              <li>
                <Link 
                  to="/register-talent" 
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/register-talent') 
                      ? 'bg-white text-indigo-700 font-medium'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden md:inline">Register</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/login') 
                      ? 'bg-white text-indigo-700 font-medium'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden md:inline">Login</span>
                </Link>
              </li>
            </>
          )}
          
          {/* Show these links only when user is authenticated */}
          {isAuthenticated && (
            <>
              <li>
                <Link 
                  to="/my-applications" 
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/my-applications') 
                      ? 'bg-white text-indigo-700 font-medium'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <ClipboardList className="h-4 w-4" />
                  <span className="hidden md:inline">Applications</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile"
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/profile') 
                      ? 'bg-white text-indigo-700 font-medium'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <UserIconLucide className="h-4 w-4" />
                  <span className="hidden md:inline">{user?.name || 'Profile'}</span>
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 text-white hover:bg-white/20"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 