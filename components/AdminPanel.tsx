import React, { useState } from 'react';
import { Clock, Link as LinkIcon, Check, AlertCircle, Upload, FileText } from 'lucide-react';
import { Layout } from './Layout';
import { supabase } from '../services/supabaseClient';

const AdminPanel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a valid PDF file.');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size limit is 10MB.');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setGeneratedLink(null);
    }
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    setError(null);
    if (!file) return;

    try {
      // 1. Upload to Supabase
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      const publicUrl = data.publicUrl;

      // 3. Generate Secure Link
      const expiresAt = Date.now() + 60 * 60 * 1000; // 1 Hour
      const baseUrl = window.location.href.split('#')[0];

      const encodedUrl = encodeURIComponent(publicUrl);
      const name = encodeURIComponent(file.name);

      const link = `${baseUrl}#/view?url=${encodedUrl}&name=${name}&exp=${expiresAt}`;

      setGeneratedLink(link);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to upload and generate link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-4 flex-grow">
        <div className="w-full max-w-lg bg-brand-card border border-brand-border rounded-2xl p-8 shadow-2xl shadow-black/50">

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold mb-2 text-white">Create Secure Access Link</h1>
            <p className="text-brand-muted">Upload a PDF to generate a time-limited (1-hour), view-only link.</p>
          </div>

          <div className="space-y-6">

            {/* FILE UPLOAD */}
            <div className="relative group">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${file ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-border hover:border-brand-muted hover:bg-brand-edge'}`}>
                {file ? (
                  <div className="flex items-center justify-center gap-3 text-brand-primary">
                    <FileText size={24} />
                    <span className="font-medium truncate">{file.name}</span>
                  </div>
                ) : (
                  <div className="text-brand-muted">
                    <Upload size={32} className="mx-auto mb-3 opacity-50" />
                    <p className="font-medium text-brand-text">Drop PDF here or click to browse</p>
                    <p className="text-xs mt-2 text-slate-500">Max 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3 text-red-400 text-sm">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerateLink}
              disabled={!file || loading}
              className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${loading || !file
                ? 'bg-brand-border text-brand-muted cursor-not-allowed'
                : 'bg-brand-primary hover:bg-brand-primaryHover text-white shadow-lg shadow-brand-primary/25'
                }`}
            >
              {loading ? (
                <>Uploading & Generating...</>
              ) : (
                <>
                  <Clock size={18} />
                  Generate Secure Link
                </>
              )}
            </button>
          </div>

          {/* Result Area */}
          {generatedLink && (
            <div className="mt-8 pt-8 border-t border-brand-border animate-in fade-in slide-in-from-bottom-4">
              <label className="block text-xs font-bold text-brand-muted mb-2 uppercase tracking-wider">Your Secure Link is Ready</label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={generatedLink}
                  className="flex-1 bg-brand-edge border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text font-mono focus:outline-none focus:border-brand-primary/50"
                  onClick={(e) => e.currentTarget.select()}
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-brand-edge hover:bg-brand-border text-white p-2 rounded-lg border border-brand-border transition-colors"
                  title="Copy link"
                >
                  {copied ? <Check size={20} className="text-brand-success" /> : <LinkIcon size={20} />}
                </button>
              </div>
              <p className="text-xs text-brand-success/80 mt-3 flex items-start gap-2 bg-brand-success/5 p-2 rounded">
                <Check size={14} className="mt-0.5 shrink-0" />
                <span>
                  Link expires automatically in 1 hour.
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;