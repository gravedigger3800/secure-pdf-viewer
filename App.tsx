import React, { useEffect, useState } from 'react';
import AdminPanel from './components/AdminPanel';
import PdfViewer from './components/PdfViewer';

import { AlertOctagon, Clock } from 'lucide-react';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  const [route, setRoute] = useState<'ADMIN' | 'VIEWER' | 'LOADING'>('LOADING');
  const [file, setFile] = useState<string | { data: any } | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [expiry, setExpiry] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash;

      if (hash.startsWith('#/view')) {
        // Parse Query Params
        const params = new URLSearchParams(hash.split('?')[1]);
        const urlParam = params.get('url');
        const expStr = params.get('exp');
        const nameParam = params.get('name');

        if (!expStr || !urlParam) {
          setErrorMsg("Invalid access link.");
          setRoute('VIEWER');
          return;
        }

        const expiresAt = parseInt(expStr, 10);

        // 1. Check Expiry Logic
        if (Date.now() > expiresAt) {
          setErrorMsg("Access Expired");
          setExpiry(expiresAt);
          return;
        }

        // 2. Set File Source (External URL Only)
        const decodedUrl = decodeURIComponent(urlParam);
        setFile(decodedUrl);
        setFileName(nameParam ? decodeURIComponent(nameParam) : 'Secure Document');

        setExpiry(expiresAt);
        setRoute('VIEWER');
      } else {
        setRoute('ADMIN');
      }
    };

    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Initial check

    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);

  if (route === 'LOADING') {
    return <div className="min-h-screen bg-brand-bg flex items-center justify-center text-brand-muted">Loading SecureView...</div>;
  }

  // Error / Expiration View
  if (errorMsg || (route === 'VIEWER' && (!file && errorMsg))) {
    return (
      <Layout showNav={false}>
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-brand-card border border-red-900/30 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-900/10 rounded-full flex items-center justify-center mx-auto mb-6">
              {errorMsg.includes("Expired") ? (
                <Clock size={32} className="text-red-500" />
              ) : (
                <AlertOctagon size={32} className="text-red-500" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{errorMsg}</h2>
            <p className="text-brand-muted mb-8">
              This secure document is no longer accessible. Please request a new link from the administrator.
            </p>
            <a href="/" className="inline-block px-8 py-3 bg-brand-primary hover:bg-brand-primaryHover text-white font-semibold rounded-lg transition-colors shadow-lg shadow-brand-primary/20">
              Return Home
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  if (route === 'VIEWER' && file) {
    return <PdfViewer file={file} fileName={fileName} expiresAt={expiry} />;
  }

  return <AdminPanel />;
};

export default App;