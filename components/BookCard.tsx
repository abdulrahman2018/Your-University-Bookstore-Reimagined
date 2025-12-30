
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={book.photos} 
          alt={book.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
            {book.university}
          </span>
          <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
            {book.condition}
          </span>
        </div>
        {book.pdf_url && (
           <button 
             onClick={() => onViewPdf(book)}
             className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors"
             title="View Preview"
           >
             <Eye className="w-4 h-4 text-indigo-600" />
           </button>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-slate-900 line-clamp-1">{book.title}</h3>
          <div className="flex items-center text-xs text-slate-500 mt-1">
            <User className="w-3 h-3 mr-1" />
            {book.author_doctor}
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-indigo-700">{book.price} <span className="text-sm font-normal">EGP</span></p>
            <p className="text-xs text-slate-400 flex items-center">
               <Clock className="w-3 h-3 mr-1" />
               Qty: {book.quantity}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              <BadgeCheck className="w-3 h-3 mr-0.5" />
              INSPECT BEFORE PAYING
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button 
            variant="primary" 
            className="w-full text-sm py-2"
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
