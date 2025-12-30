
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
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col no-select">
      {/* Header */}
      <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4 text-white">
          <ShieldAlert className="w-6 h-6 text-indigo-400" />
          <div>
            <h2 className="font-bold text-lg leading-tight">{bookTitle}</h2>
            <p className="text-xs text-slate-400">Secure Preview Mode (Read-only)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${timeLeft < 60 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-indigo-300'}`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden bg-slate-950 flex justify-center">
        {isExpired ? (
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-md">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Preview Expired</h3>
            <p className="text-slate-400 mb-8">
              Your 10-minute preview session has ended. To continue reading or get the full book, please contact the seller directly.
            </p>
            <div className="flex gap-4">
              <Button onClick={handleContactSeller} variant="primary" size="lg">
                Contact Seller Now
              </Button>
              <Button onClick={onClose} variant="outline" size="lg" className="text-white border-slate-700">
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
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md z-10 text-center px-6">
                <Lock className="w-16 h-16 text-indigo-400 mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">Security Pause</h4>
                <p className="text-slate-300">Click back into the window to resume reading.</p>
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
