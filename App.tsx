
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import BookCard from './components/BookCard';
import ListingModal from './components/ListingModal';
import PDFViewer from './components/PDFViewer';
import AdminDashboard from './components/AdminDashboard';
import Button from './components/Button';
import { Book, University, AdminUser } from './types';
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

  // Load Admin from storage
  useEffect(() => {
    setAdmin(api.getAdmin());
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
    setAdmin(null);
    setIsAdminView(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar 
        onListBook={() => setShowListingModal(true)}
        onGoHome={() => setIsAdminView(false)}
        onAdminClick={() => admin ? setIsAdminView(!isAdminView) : setShowAdminLogin(true)}
        admin={admin}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {isAdminView ? (
          <AdminDashboard />
        ) : (
          <>
            {/* Hero & Search Section */}
            <div className="bg-indigo-700 text-white py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                  Your University Bookstore, <br/>
                  <span className="text-indigo-200">Reimagined.</span>
                </h1>
                <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                  Buy and sell textbooks easily within the BUE, AUC, and GUC communities. 
                  Inspect before you pay, always.
                </p>

                <div className="relative max-w-2xl mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-2xl shadow-xl">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search by title or professor..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-none focus:ring-0 text-slate-900 text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="sm:w-48 relative border-t sm:border-t-0 sm:border-l border-slate-100">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select 
                        className="w-full pl-9 pr-4 py-3 bg-transparent border-none focus:ring-0 text-slate-600 font-medium appearance-none cursor-pointer"
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  {selectedUni === 'All Universities' ? 'Available Books' : `${selectedUni} Marketplace`}
                </h2>
                <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border">
                  {books.length} Listings
                </span>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                  <RefreshCw className="w-10 h-10 animate-spin mb-4" />
                  <p className="text-lg font-medium">Fetching the latest listings...</p>
                </div>
              ) : books.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="bg-slate-100 p-6 rounded-full mb-6">
                    <Search className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No books found</h3>
                  <p className="text-slate-500 max-w-sm">
                    We couldn't find any books matching your search. Try different keywords or check other universities.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-6"
                    onClick={() => { setSearchTerm(''); setSelectedUni('All Universities'); }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {books.map(book => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      onContact={handleContact}
                      onViewPdf={(b) => setViewingPdf(b)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            &copy; 2025 BUE Book Marketplace. For students, by students. <br/>
            All transactions are made in person. Inspect books thoroughly before purchasing.
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
             <button onClick={() => setShowAdminLogin(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
               <XIcon className="w-5 h-5" />
             </button>
             <div className="text-center mb-8">
               <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <AlertCircle className="w-8 h-8 text-indigo-600" />
               </div>
               <h3 className="text-2xl font-bold">Admin Portal</h3>
               <p className="text-slate-500">Secure access for moderators</p>
             </div>
             <form onSubmit={handleAdminLogin} className="space-y-4">
               <div>
                 <label className="text-sm font-semibold text-slate-700 block mb-1">Username</label>
                 <input name="username" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue="admin" />
               </div>
               <div>
                 <label className="text-sm font-semibold text-slate-700 block mb-1">Password</label>
                 <input name="password" type="password" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue="admin123" />
               </div>
               <Button type="submit" className="w-full" size="lg">Login as Admin</Button>
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
