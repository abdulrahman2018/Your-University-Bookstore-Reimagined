
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">List Your Book</h2>
            <p className="text-slate-500">Sell your textbooks to fellow students quickly.</p>
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
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Andrew Tanenbaum"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">University *</label>
                <select 
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Edition</label>
                <input 
                  name="edition"
                  value={formData.edition}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <strong>Note:</strong> All listings undergo admin review before becoming public. Listings containing piracy links or digital copies will be rejected.
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="primary" 
                className="flex-1"
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
