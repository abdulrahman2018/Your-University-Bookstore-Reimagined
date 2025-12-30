
import React, { useState, useEffect, useCallback } from 'react';
import { X, Lock, ShieldAlert, Clock, ExternalLink } from 'lucide-react';
import Button from './Button';

interface PDFViewerProps {
  pdfUrl: string;
  bookTitle: string;
  onClose: () => void;
  sellerPhone: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, bookTitle, onClose, sellerPhone }) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isBlurred, setIsBlurred] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (isExpired) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExpired]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBlur = useCallback(() => setIsBlurred(true), []);
  const handleFocus = useCallback(() => setIsBlurred(false), []);

  useEffect(() => {
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    
    // Anti-print / Anti-copy
    const preventAction = (e: any) => {
      if (
        (e.ctrlKey && (e.key === 'p' || e.key === 'P' || e.key === 'c' || e.key === 'C')) ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        alert('Security violation: Content protection is active.');
      }
    };

    window.addEventListener('keydown', preventAction);
    window.addEventListener('contextmenu', e => e.preventDefault());

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', preventAction);
    };
  }, [handleBlur, handleFocus]);

  const handleContactSeller = () => {
    const message = encodeURIComponent(`Hi, I'm interested in buying your book: "${bookTitle}" from BUE Marketplace. I just viewed the preview!`);
    window.open(`https://wa.me/2${sellerPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col no-select">
      {/* Header */}
      <div className="h-20 bg-slate-800/95 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-6 shrink-0 shadow-xl">
        <div className="flex items-center gap-4 text-white">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl leading-tight">{bookTitle}</h2>
            <p className="text-xs text-slate-400 font-medium">Secure Preview Mode (Read-only)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl shadow-lg transition-all ${
            timeLeft < 60 
              ? 'bg-gradient-to-r from-rose-500/20 to-rose-600/20 text-rose-300 border border-rose-500/30' 
              : 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-indigo-300 border border-indigo-500/30'
          }`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold text-sm">{formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 hover:bg-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden bg-slate-950 flex justify-center">
        {isExpired ? (
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-md">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-2xl"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-rose-500/20 to-rose-600/20 rounded-3xl flex items-center justify-center border border-rose-500/30 shadow-2xl">
                <Clock className="w-12 h-12 text-rose-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">Preview Expired</h3>
            <p className="text-slate-400 mb-10 leading-relaxed text-lg">
              Your 10-minute preview session has ended. To continue reading or get the full book, please contact the seller directly.
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={handleContactSeller} 
                variant="primary" 
                size="lg"
                className="shadow-xl shadow-indigo-500/30 hover:shadow-2xl transition-all"
              >
                Contact Seller Now
              </Button>
              <Button 
                onClick={onClose} 
                variant="outline" 
                size="lg" 
                className="text-white border-slate-600 hover:bg-slate-700/50 transition-all"
              >
                Exit Preview
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl h-full relative">
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className={`w-full h-full transition-all duration-300 ${isBlurred ? 'blur-2xl grayscale' : ''}`}
              title="PDF Viewer"
            />
            
            {isBlurred && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-xl z-10 text-center px-6">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl"></div>
                  <div className="relative p-6 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-3xl border border-indigo-500/30">
                    <Lock className="w-16 h-16 text-indigo-300" />
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-white mb-3">Security Pause</h4>
                <p className="text-slate-300 text-lg">Click back into the window to resume reading.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer / Watermark */}
      <div className="h-10 bg-slate-800 text-[10px] uppercase tracking-widest text-slate-500 flex items-center justify-center pointer-events-none">
        Copyright Protected Content • BUE Marketplace Secure Preview • Do not share
      </div>
    </div>
  );
};

export default PDFViewer;
