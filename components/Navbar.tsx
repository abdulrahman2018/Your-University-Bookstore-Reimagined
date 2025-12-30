
import React from 'react';
import { BookOpen, Plus, UserCircle, LogOut } from 'lucide-react';
import Button from './Button';
import { AdminUser } from '../types';

interface NavbarProps {
  onListBook: () => void;
  onGoHome: () => void;
  onAdminClick: () => void;
  admin: AdminUser | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onListBook, onGoHome, onAdminClick, admin, onLogout }) => {
  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={onGoHome}
          >
            <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">BUE</span>
              <span className="text-sm font-medium text-slate-500 ml-1">Marketplace</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="hidden sm:flex"
              onClick={onAdminClick}
            >
              {admin ? 'Admin Dashboard' : 'Admin Login'}
            </Button>
            
            {admin && (
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}

            <Button 
              variant="primary" 
              onClick={onListBook}
              className="flex items-center gap-2"
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
