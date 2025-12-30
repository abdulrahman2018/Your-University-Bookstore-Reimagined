
import React from 'react';
import { Book } from '../types';
import { BadgeCheck, User, School, Clock, Eye } from 'lucide-react';
import Button from './Button';

interface BookCardProps {
  book: Book;
  onContact: (book: Book) => void;
  onViewPdf: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onContact, onViewPdf }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-md border border-slate-200/60 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <img 
          src={book.photos} 
          alt={book.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm">
            {book.university}
          </span>
          <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm">
            {book.condition}
          </span>
        </div>
        
        {book.pdf_url && (
           <button 
             onClick={() => onViewPdf(book)}
             className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 group/btn"
             title="View Preview"
           >
             <Eye className="w-5 h-5 text-indigo-600 group-hover/btn:text-indigo-700 transition-colors" />
           </button>
        )}
      </div>
      
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 line-clamp-2 mb-2 group-hover:text-indigo-700 transition-colors">
            {book.title}
          </h3>
          <div className="flex items-center text-sm text-slate-500">
            <User className="w-4 h-4 mr-2 text-slate-400" />
            <span className="line-clamp-1">{book.author_doctor}</span>
          </div>
        </div>

        <div className="flex justify-between items-end pt-2 border-t border-slate-100">
          <div className="space-y-1">
            <p className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {book.price.toLocaleString()}
              <span className="text-sm font-semibold text-slate-500 ml-1">EGP</span>
            </p>
            <p className="text-xs text-slate-400 flex items-center font-medium">
               <Clock className="w-3.5 h-3.5 mr-1.5" />
               Stock: {book.quantity}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
              <BadgeCheck className="w-3 h-3 mr-1" />
              VERIFIED
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button 
            variant="primary" 
            className="w-full text-sm py-3 font-semibold shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02]"
            onClick={() => onContact(book)}
          >
            Contact Seller
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
