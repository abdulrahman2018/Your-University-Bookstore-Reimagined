
import React, { useState, useEffect, useCallback } from 'react';
import { Book, University } from '../types';
import { api } from '../services/mockApi';
import { UNIVERSITIES } from '../constants';
import { RefreshCcw, Search, Package, DollarSign, TrendingUp, AlertTriangle, Users, BarChart3 } from 'lucide-react';
import Button from './Button';

interface StockStats {
  totalItems: number;
  uniqueTitles: number;
  totalValue: number;
  avgPrice: number;
  stockByUniversity: Record<Exclude<University, 'All Universities'>, number>;
  stockByCondition: Record<string, number>;
  lowStockCount: number;
  outOfStockCount: number;
  totalSellers: number;
}

const AdminDashboard: React.FC = () => {
  const [stockBooks, setStockBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<StockStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [universityFilter, setUniversityFilter] = useState<University | 'all'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStockData = useCallback(async () => {
    setIsLoading(true);
    const [booksData, statsData] = await Promise.all([
      api.getStockBooks(universityFilter === 'all' ? undefined : universityFilter),
      api.getStockStats()
    ]);
    setStockBooks(booksData);
    setStats(statsData);
    setIsLoading(false);
  }, [universityFilter]);

  useEffect(() => {
    fetchStockData();
    
    // Auto-refresh every 30 seconds if enabled
    if (autoRefresh) {
      const interval = setInterval(fetchStockData, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchStockData, autoRefresh]);

  useEffect(() => {
    let filtered = [...stockBooks];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(term) ||
        b.author_doctor.toLowerCase().includes(term) ||
        b.seller_name.toLowerCase().includes(term) ||
        b.subject?.toLowerCase().includes(term)
      );
    }
    
    setFilteredBooks(filtered);
  }, [stockBooks, searchTerm]);

  const handleQuantityUpdate = async (id: string, current: number) => {
    const newVal = prompt("Update stock quantity:", current.toString());
    if (newVal !== null) {
      const q = parseInt(newVal);
      if (!isNaN(q) && q >= 0) {
        await api.updateQuantity(id, q);
        fetchStockData();
      }
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "indigo", trend }: {
    icon: React.ElementType;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: "indigo" | "emerald" | "amber" | "rose" | "blue" | "purple";
    trend?: string;
  }) => {
    const colors = {
      indigo: "bg-indigo-100 text-indigo-600",
      emerald: "bg-emerald-100 text-emerald-600",
      amber: "bg-amber-100 text-amber-600",
      rose: "bg-rose-100 text-rose-600",
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
    };
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
            {trend && <p className="text-xs text-emerald-600 mt-1 font-medium">{trend}</p>}
          </div>
          <div className={`${colors[color]} p-3 rounded-lg`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Stock Inventory Dashboard</h1>
          <p className="text-slate-500">Real-time inventory management - Approved books only</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchStockData}
            className="flex items-center gap-2"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Now
          </Button>
          <Button
            variant={autoRefresh ? "primary" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2"
          >
            {autoRefresh ? 'Auto: ON' : 'Auto: OFF'}
          </Button>
        </div>
      </div>

      {/* Real-time Stock Statistics */}
      {stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Package}
              title="Total Items in Stock"
              value={stats.totalItems}
              subtitle={`${stats.uniqueTitles} unique titles`}
              color="indigo"
            />
            <StatCard
              icon={DollarSign}
              title="Total Inventory Value"
              value={`${stats.totalValue.toLocaleString()} EGP`}
              subtitle={`Avg: ${stats.avgPrice} EGP per book`}
              color="emerald"
            />
            <StatCard
              icon={AlertTriangle}
              title="Low Stock Alert"
              value={stats.lowStockCount}
              subtitle={`${stats.outOfStockCount} out of stock`}
              color={stats.lowStockCount > 0 ? "amber" : "emerald"}
            />
            <StatCard
              icon={Users}
              title="Active Sellers"
              value={stats.totalSellers}
              subtitle="Selling in marketplace"
              color="blue"
            />
          </div>

          {/* Stock Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Stock by University */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Stock by University
              </h3>
              <div className="space-y-3">
                {(['BUE', 'AUC', 'GUC'] as University[]).map((uni) => {
                  const count = stats.stockByUniversity[uni] || 0;
                  const percentage = stats.totalItems > 0 ? (count / stats.totalItems) * 100 : 0;
                  return (
                    <div key={uni}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">{uni}</span>
                        <span className="text-slate-600 font-semibold">{count} items ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                        <div
                          className="bg-indigo-600 h-3 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stock by Condition */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Stock by Condition
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.stockByCondition).map(([condition, count]) => {
                  const percentage = stats.totalItems > 0 ? (count / stats.totalItems) * 100 : 0;
                  return (
                    <div key={condition}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">{condition}</span>
                        <span className="text-slate-600 font-semibold">{count} items ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                        <div
                          className="bg-emerald-600 h-3 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, author, seller, or subject..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* University Filter */}
          <select
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            value={universityFilter}
            onChange={(e) => setUniversityFilter(e.target.value as University | 'all')}
          >
            <option value="all">All Universities</option>
            {UNIVERSITIES.filter(u => u !== 'All Universities').map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stock Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">
            Current Stock ({filteredBooks.length} titles, {filteredBooks.reduce((sum, b) => sum + b.quantity, 0)} items)
          </h2>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Clear search
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Book</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">University</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Qty</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <RefreshCcw className="w-8 h-8 animate-spin mx-auto mb-2 opacity-50" />
                    Loading stock data...
                  </td>
                </tr>
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                    {searchTerm || universityFilter !== 'all' 
                      ? 'No stock matches your filters.' 
                      : 'No items in stock.'}
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => {
                  const isLowStock = book.quantity > 0 && book.quantity <= 2;
                  const isOutOfStock = book.quantity === 0;
                  const totalValue = book.price * book.quantity;
                  
                  return (
                    <tr 
                      key={book.id} 
                      className={`hover:bg-slate-50/50 transition-colors ${
                        isOutOfStock ? 'bg-rose-50/50' : isLowStock ? 'bg-amber-50/50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={book.photos} alt={book.title} className="w-12 h-16 object-cover rounded shadow-sm border" />
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{book.title}</div>
                            <div className="text-xs text-slate-500">{book.author_doctor}</div>
                            {book.subject && (
                              <div className="text-xs text-slate-400 mt-1">{book.subject}</div>
                            )}
                            <div className="text-xs text-slate-400 mt-1">{book.condition}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-700">{book.seller_name}</div>
                        <div className="text-xs text-slate-400">{book.seller_phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                          {book.university}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-900">{book.price.toLocaleString()} EGP</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${
                            isOutOfStock ? 'text-rose-600' : 
                            isLowStock ? 'text-amber-600' : 
                            'text-emerald-600'
                          }`}>
                            {book.quantity}
                          </span>
                          {isOutOfStock && (
                            <span className="text-[10px] text-rose-600 font-bold bg-rose-100 px-1.5 py-0.5 rounded">
                              OUT
                            </span>
                          )}
                          {isLowStock && !isOutOfStock && (
                            <span className="text-[10px] text-amber-600 font-bold bg-amber-100 px-1.5 py-0.5 rounded">
                              LOW
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-700">{totalValue.toLocaleString()} EGP</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleQuantityUpdate(book.id, book.quantity)}
                          className="text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                          title="Update stock quantity"
                        >
                          <Package className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time indicator */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-slate-500">
          <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
          {autoRefresh ? 'Auto-refreshing every 30 seconds' : 'Auto-refresh disabled'}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
