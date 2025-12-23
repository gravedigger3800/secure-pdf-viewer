import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text font-sans">
      {/* Header */}
      {showNav && (
        <header className="border-b border-brand-border bg-brand-edge/50 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg shadow-brand-primary/20">
                <ShieldCheck className="text-white" size={20} />
              </div>
              <span className="font-bold text-lg tracking-tight">SecureView</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-brand-muted">
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-card border border-brand-border">
                <Lock size={12} className="text-brand-success" />
                End-to-End Encrypted
              </span>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative">
        {children}
      </main>

      {/* Footer */}
      {showNav && (
        <footer className="border-t border-brand-border bg-brand-edge py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-brand-muted text-sm mb-2">
              SecureView • Enterprise-Grade Document Protection
            </p>
            <div className="flex justify-center gap-4 text-xs text-slate-500">
              <span>No Cookies</span>
              <span>•</span>
              <span>No Persistent Storage</span>
              <span>•</span>
              <span>Client-Side Only</span>
            </div>
            <div className="mt-8 opacity-20 hover:opacity-100 transition-opacity">
              <span className="text-[10px] uppercase tracking-widest">Secure Document Delivery System</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};