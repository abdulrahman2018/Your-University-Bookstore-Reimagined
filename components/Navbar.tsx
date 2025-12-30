import React from 'react';
import { BookOpen, Plus, UserCircle, LogOut } from 'lucide-react';
import Button from './Button';
import { AdminUser, User } from '../types';

interface NavbarProps {
  onListBook: () => void;
  onGoHome: () => void;
  onAdminClick: () => void;
  admin: AdminUser | null;
  user: User | null;
  onLogout: () => void;
  onAuthClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onListBook, onGoHome, onAdminClick, admin, user, onLogout, onAuthClick }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onGoHome}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 p-2.5 rounded-xl group-hover:from-indigo-700 group-hover:to-indigo-800 transition-all duration-300 shadow-lg shadow-indigo-500/20">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                CampusBooks
              </span>
              <span className="text-xs font-medium text-slate-500 -mt-1">Marketplace</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-900">{user.email}</span>
                  <span className="text-[10px] text-slate-500">{user.university}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition-all duration-200 ml-2"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              onAuthClick && (
                <Button 
                  variant="outline" 
                  onClick={onAuthClick}
                  className="hidden sm:flex border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200"
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )
            )}
            
            <Button 
              variant="outline" 
              className="hidden sm:flex border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
              onClick={onAdminClick}
            >
              {admin ? 'Admin Dashboard' : 'Admin'}
            </Button>
            
            {admin && (
              <button 
                onClick={onLogout}
                className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-200"
                title="Logout Admin"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}

            <Button 
              variant="primary" 
              onClick={onListBook}
              className="flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Sell a Book</span>
              <span className="sm:hidden">Sell</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
