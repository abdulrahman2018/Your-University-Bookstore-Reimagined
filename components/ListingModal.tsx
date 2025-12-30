
import React, { useState } from 'react';
import { X, Upload, Info, AlertTriangle } from 'lucide-react';
import { Book, University, BookCondition } from '../types';
import { UNIVERSITIES, CONDITIONS } from '../constants';
import Button from './Button';

interface ListingModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<Book>) => Promise<void>;
}

const ListingModal: React.FC<ListingModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author_doctor: '',
    university: 'BUE',
    condition: 'Good',
    price: 0,
    edition: '',
    grade_year: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseInt(value) || 0 : value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative ring-1 ring-slate-200/50 animate-scale-in my-8">
        <button 
          onClick={onClose}
          className="absolute right-5 top-5 p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 sm:p-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">List Your Book</h2>
                <p className="text-slate-500 text-sm mt-1">Sell your textbooks to fellow students quickly.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Book Title *</label>
                <input 
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm"
                  placeholder="e.g. Modern Operating Systems"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Author / Professor *</label>
                <input 
                  required
                  name="author_doctor"
                  value={formData.author_doctor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm"
                  placeholder="e.g. Andrew Tanenbaum"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">University *</label>
                <select 
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm"
                >
                  {UNIVERSITIES.filter(u => u !== 'All Universities').map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Condition *</label>
                <select 
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm"
                >
                  {CONDITIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Price (EGP) *</label>
                <input 
                  required
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Edition</label>
                <input 
                  name="edition"
                  value={formData.edition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white shadow-sm"
                  placeholder="e.g. 5th Ed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="Details about quality, notes, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Cover Photo *</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-slate-400" />
                      <p className="text-xs text-slate-500">JPG, PNG up to 10MB</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">PDF Preview (Optional)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-slate-400" />
                      <p className="text-xs text-slate-500">PDF Only up to 10MB</p>
                    </div>
                    <input type="file" className="hidden" accept="application/pdf" />
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-5 rounded-xl flex gap-4 shadow-sm">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Info className="w-5 h-5 text-amber-600 shrink-0" />
              </div>
              <div className="text-sm text-amber-800 leading-relaxed">
                <strong className="font-semibold">Note:</strong> All listings undergo admin review before becoming public. Listings containing piracy links or digital copies will be rejected.
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                type="button"
                variant="outline" 
                onClick={onClose}
                className="flex-1 border-slate-200 hover:bg-slate-50 transition-all"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="primary" 
                className="flex-1 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300"
                isLoading={isSubmitting}
              >
                Submit Listing
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListingModal;
