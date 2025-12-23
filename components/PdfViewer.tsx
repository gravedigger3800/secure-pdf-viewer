import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, AlertTriangle, EyeOff, ShieldCheck } from 'lucide-react';
import { usePageVisibility, useSecurityMeasures } from '../utils/security';
import { Watermark } from './Watermark';
import { PdfViewerProps } from '../types';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer: React.FC<PdfViewerProps> = ({ file, fileName, expiresAt }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageWidth, setPageWidth] = useState(window.innerWidth > 800 ? 800 : window.innerWidth - 40);
  const isVisible = usePageVisibility();

  // Enable security event listeners
  useSecurityMeasures();

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = document.getElementById('pdf-container')?.clientWidth || window.innerWidth;
      setPageWidth(Math.min(containerWidth - 32, 800)); // Max width 800px, with padding
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const getTimeString = () => new Date().toLocaleString();

  // Security Pause Screen
  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-brand-edge z-[100] flex flex-col items-center justify-center text-white">
        <div className="p-6 bg-brand-card rounded-2xl border border-brand-border flex flex-col items-center shadow-2xl">
          <EyeOff size={48} className="mb-4 text-brand-warning" />
          <h2 className="text-xl font-bold mb-1">Security Pause</h2>
          <p className="text-brand-muted text-sm">Document hidden while tab is inactive.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen bg-brand-bg flex flex-col items-center pt-6 pb-20 select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Dynamic Watermark Layer */}
      <Watermark text={`CONFIDENTIAL • ${getTimeString()} • VIEW ONLY`} />

      {/* Viewer Header */}
      <div className="w-full max-w-4xl px-4 mb-6 z-10">
        <div className="flex justify-between items-center bg-brand-card/80 backdrop-blur border border-brand-border p-4 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <ShieldCheck className="text-brand-primary" size={20} />
            </div>
            <div className="min-w-0">
              <h1 className="text-brand-text font-semibold truncate text-sm sm:text-base">{fileName}</h1>
              <p className="text-brand-success text-xs flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse"></span>
                Secure Viewing Session
              </p>
            </div>
          </div>
          <div className="text-right pl-4 shrink-0">
            <p className="text-brand-warning text-xs font-mono font-bold">EXPIRES IN</p>
            <p className="text-brand-text font-mono text-lg font-bold leading-none">
              {Math.max(0, Math.floor((expiresAt - Date.now()) / 60000))}m
            </p>
          </div>
        </div>
      </div>

      {/* PDF Container */}
      <div id="pdf-container" className="relative w-full max-w-4xl px-4 z-10">
        <div className="bg-brand-edge rounded-lg shadow-2xl overflow-hidden border border-brand-border min-h-[500px] relative">

          {/* Transparent overlay to block drag/drop and clicks */}
          <div className="absolute inset-0 z-20" />

          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center justify-center h-96 text-brand-muted">
                <Loader2 className="animate-spin mb-4 text-brand-primary" size={40} />
                <p className="text-sm font-medium">Decrypting & rendering...</p>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center h-96 text-red-400">
                <AlertTriangle size={40} className="mb-4" />
                <p>Unable to load document.</p>
                <p className="text-xs text-brand-muted mt-2">Check internet connection or CORS settings.</p>
              </div>
            }
            className="flex flex-col items-center bg-brand-edge p-4 md:p-8"
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} className="my-2 relative shadow-lg">
                {/* Render Page */}
                <Page
                  pageNumber={index + 1}
                  width={pageWidth}
                  renderTextLayer={false} // Disable text selection
                  renderAnnotationLayer={false} // Disable links
                  className="border border-brand-border"
                />
              </div>
            ))}
          </Document>
        </div>
      </div>

      <div className="mt-8 text-brand-muted text-[10px] uppercase tracking-widest text-center max-w-md opacity-50">
        Protected by SecureView
      </div>
    </div>
  );
};

export default PdfViewer;