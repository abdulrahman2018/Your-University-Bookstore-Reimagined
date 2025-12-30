
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import BookCard from './components/BookCard';
import ListingModal from './components/ListingModal';
import PDFViewer from './components/PDFViewer';
import AdminDashboard from './components/AdminDashboard';
import AuthPage from './components/AuthPage';
import Button from './components/Button';
import { Book, University, AdminUser, User } from './types';
import { UNIVERSITIES } from './constants';
import { api } from './services/mockApi';
import { Search, Filter, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUni, setSelectedUni] = useState<University>('All Universities');
  const [showListingModal, setShowListingModal] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<Book | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load Admin and User from storage
  useEffect(() => {
    setAdmin(api.getAdmin());
    setCurrentUser(api.getCurrentUser());
  }, []);

  const fetchBooks = async () => {
    setIsLoading(true);
    const data = await api.getBooks(selectedUni, searchTerm);
    setBooks(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isAdminView) {
      fetchBooks();
    }
  }, [selectedUni, searchTerm, isAdminView]);

  const handleContact = (book: Book) => {
    const message = encodeURIComponent(`Hi, I'm interested in buying your book: "${book.title}" from BUE Marketplace.`);
    window.open(`https://wa.me/2${book.seller_phone}?text=${message}`, '_blank');
  };

  const handleListSubmit = async (data: Partial<Book>) => {
    const res = await api.listBook(data);
    if (res.success) {
      alert(res.message || "Book submitted successfully! It will appear once approved by an admin.");
      setShowListingModal(false);
      fetchBooks();
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    const user = await api.adminLogin(target.username.value, target.password.value);
    if (user) {
      setAdmin(user);
      setShowAdminLogin(false);
      setIsAdminView(true);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    api.logout();
    api.logoutUser();
    setAdmin(null);
    setCurrentUser(null);
    setIsAdminView(false);
  };

  const handleLoginSuccess = () => {
    setCurrentUser(api.getCurrentUser());
    setShowAuthPage(false);
  };

  // Show AuthPage if requested
  if (showAuthPage) {
    return <AuthPage onBack={() => setShowAuthPage(false)} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar 
        onListBook={() => setShowListingModal(true)}
        onGoHome={() => setIsAdminView(false)}
        onAdminClick={() => admin ? setIsAdminView(!isAdminView) : setShowAdminLogin(true)}
        admin={admin}
        user={currentUser}
        onLogout={handleLogout}
        onAuthClick={() => setShowAuthPage(true)}
      />

      <main className="flex-1">
        {isAdminView ? (
          <AdminDashboard />
        ) : (
          <>
            {/* Hero & Search Section */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '40px 40px'
                }}></div>
              </div>
              
              <div className="relative max-w-5xl mx-auto text-center space-y-8">
                <div className="space-y-4 animate-fade-in">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                    Your University Bookstore, <br/>
                    <span className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                      Reimagined.
                    </span>
                  </h1>
                  <p className="text-xl sm:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
                    Buy and sell textbooks easily within Egyptian universities. 
                    <span className="font-semibold text-white"> Inspect before you pay, always.</span>
                  </p>
                </div>

                <div className="relative max-w-3xl mx-auto pt-4">
                  <div className="flex flex-col sm:flex-row gap-3 bg-white/95 backdrop-blur-xl p-3 rounded-2xl shadow-2xl ring-1 ring-white/20">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search by title, author, or professor..."
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-none focus:ring-0 text-slate-900 text-lg placeholder:text-slate-400 bg-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="sm:w-56 relative border-t sm:border-t-0 sm:border-l border-slate-200">
                      <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select 
                        className="w-full pl-10 pr-4 py-4 bg-transparent border-none focus:ring-0 text-slate-700 font-semibold appearance-none cursor-pointer hover:text-indigo-600 transition-colors"
                        value={selectedUni}
                        onChange={(e) => setSelectedUni(e.target.value as University)}
                      >
                        {UNIVERSITIES.map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Marketplace Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    {selectedUni === 'All Universities' ? 'Available Books' : `${selectedUni} Marketplace`}
                  </h2>
                  <p className="text-slate-500 text-sm ml-14">Browse through our curated collection</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-600 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
                    {books.length} {books.length === 1 ? 'Listing' : 'Listings'}
                  </span>
                </div>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <RefreshCw className="relative w-12 h-12 animate-spin text-indigo-600 mb-6" />
                  </div>
                  <p className="text-lg font-semibold text-slate-600">Fetching the latest listings...</p>
                  <p className="text-sm text-slate-400 mt-2">This will only take a moment</p>
                </div>
              ) : books.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-slate-200 rounded-full blur-2xl opacity-50"></div>
                    <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 p-8 rounded-3xl shadow-xl">
                      <Search className="w-16 h-16 text-slate-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">No books found</h3>
                  <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
                    We couldn't find any books matching your search. Try different keywords or check other universities.
                  </p>
                  <Button 
                    variant="outline" 
                    className="shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => { setSearchTerm(''); setSelectedUni('All Universities'); }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {books.map((book, index) => (
                    <div 
                      key={book.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <BookCard 
                        book={book} 
                        onContact={handleContact}
                        onViewPdf={(b) => setViewingPdf(b)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-slate-50 border-t border-slate-200 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              CampusBooks
            </span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto">
            &copy; 2025 CampusBooks Marketplace. For students, by students. <br/>
            <span className="text-slate-400">All transactions are made in person. Inspect books thoroughly before purchasing.</span>
          </p>
        </div>
      </footer>

      {/* Modals & Overlays */}
      {showListingModal && (
        <ListingModal 
          onClose={() => setShowListingModal(false)}
          onSubmit={handleListSubmit}
        />
      )}

      {viewingPdf && viewingPdf.pdf_url && (
        <PDFViewer 
          pdfUrl={viewingPdf.pdf_url}
          bookTitle={viewingPdf.title}
          sellerPhone={viewingPdf.seller_phone}
          onClose={() => setViewingPdf(null)}
        />
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative ring-1 ring-slate-200/50 animate-scale-in">
             <button 
               onClick={() => setShowAdminLogin(false)} 
               className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
             >
               <XIcon className="w-5 h-5" />
             </button>
             <div className="text-center mb-8">
               <div className="relative inline-block mb-4">
                 <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-50"></div>
                 <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg">
                   <AlertCircle className="w-10 h-10 text-white" />
                 </div>
               </div>
               <h3 className="text-3xl font-bold text-slate-900 mb-2">Admin Portal</h3>
               <p className="text-slate-500">Secure access for moderators</p>
             </div>
             <form onSubmit={handleAdminLogin} className="space-y-5">
               <div>
                 <label className="text-sm font-semibold text-slate-700 block mb-2">Username</label>
                 <input 
                   name="username" 
                   required 
                   className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white" 
                   defaultValue="admin" 
                 />
               </div>
               <div>
                 <label className="text-sm font-semibold text-slate-700 block mb-2">Password</label>
                 <input 
                   name="password" 
                   type="password" 
                   required 
                   className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white" 
                   defaultValue="admin123" 
                 />
               </div>
               <Button type="submit" className="w-full shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all" size="lg">
                 Login as Admin
               </Button>
               <p className="text-center text-xs text-slate-400 mt-4">Demo Credentials: admin / admin123</p>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default App;
