import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, AlertTriangle, EyeOff, ShieldCheck } from 'lucide-react';
import { usePageVisibility, useSecurityMeasures } from '../utils/security';
import { Watermark } from './Watermark';
import { PdfViewerProps } from '../types';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker from CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer: React.FC<PdfViewerProps> = ({ file, fileName, expiresAt }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [pageWidth, setPageWidth] = useState(Math.min(window.innerWidth - 40, 800));
  const isVisible = usePageVisibility();

  useSecurityMeasures();

  useEffect(() => {
    const handleResize = () => {
      setPageWidth(Math.min(window.innerWidth - 40, 800));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onLoadError = (err: Error) => {
    console.error('PDF load error:', err);
    setError(err.message || 'Failed to load PDF');
  };

  // Security pause when tab is not visible
  if (!isVisible) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900">
        <div className="text-center p-8 bg-slate-800 rounded-2xl border border-slate-700">
          <EyeOff size={48} className="mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl font-bold text-white mb-2">Security Pause</h2>
          <p className="text-slate-400">Document hidden while tab is inactive.</p>
        </div>
      </div>
    );
  }

  // Use CORS proxy for cross-origin PDFs
  const corsProxy = 'https://corsproxy.io/?';
  const pdfUrl = typeof file === 'string' ? corsProxy + encodeURIComponent(file) : file;

  return (
    <div
      className="min-h-screen bg-slate-900 flex flex-col items-center py-6 select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Watermark */}
      <Watermark text={`CONFIDENTIAL • ${new Date().toLocaleString()} • VIEW ONLY`} />

      {/* Header Bar */}
      <div className="w-full max-w-4xl px-4 mb-6 z-10">
        <div className="flex justify-between items-center bg-slate-800 border border-slate-700 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-blue-500" size={24} />
            <div>
              <h1 className="text-white font-semibold">{fileName}</h1>
              <p className="text-green-400 text-xs">● Secure Viewing Session</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-orange-400 text-xs font-mono">EXPIRES IN</p>
            <p className="text-white font-mono text-lg font-bold">
              {Math.max(0, Math.floor((expiresAt - Date.now()) / 60000))}m
            </p>
          </div>
        </div>
      </div>

      {/* PDF Container */}
      <div className="w-full max-w-4xl px-4 z-10">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 min-h-[500px] relative">

          {/* Overlay to prevent interactions */}
          <div className="absolute inset-0 z-20 pointer-events-none" />

          {error ? (
            <div className="flex flex-col items-center justify-center h-96 text-red-400">
              <AlertTriangle size={48} className="mb-4" />
              <p className="text-lg font-medium">Unable to load document</p>
              <p className="text-sm text-slate-400 mt-2 max-w-md text-center">{error}</p>
            </div>
          ) : (
            <Document
              file={pdfUrl}
              onLoadSuccess={onLoadSuccess}
              onLoadError={onLoadError}
              loading={
                <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                  <Loader2 className="animate-spin mb-4 text-blue-500" size={48} />
                  <p>Loading document...</p>
                </div>
              }
              className="flex flex-col items-center"
            >
              {numPages > 0 && Array.from({ length: numPages }, (_, i) => (
                <div key={i} className="my-4 shadow-xl">
                  <Page
                    pageNumber={i + 1}
                    width={pageWidth}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="border border-slate-600"
                  />
                </div>
              ))}
            </Document>
          )}
        </div>
      </div>
      {/* Security Warning */}
      <div className="mt-8 max-w-2xl px-4 text-center">
        <p className="text-red-400/80 text-xs leading-relaxed">
          ⚠️ This system actively monitors all activity. Screenshot attempts, screen recording, or link sharing are logged with IP address and device data. Misuse may result in account blocking and legal consequences.
        </p>
      </div>

      <p className="mt-4 text-slate-500 text-xs uppercase tracking-widest">
        Protected by Applicator Pdf
      </p>
    </div>
  );
};

export default PdfViewer;