import React, { useState } from 'react';
import { Clock, Link as LinkIcon, Check, AlertCircle, Globe, Info } from 'lucide-react';
import { Layout } from './Layout';

const AdminPanel: React.FC = () => {
  const [externalUrl, setExternalUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async () => {
    setLoading(true);
    setError(null);

    try {
      const expiresAt = Date.now() + 60 * 60 * 1000; // 1 Hour
      const baseUrl = window.location.href.split('#')[0];
      let link = '';

      // External URL Mode
      if (!externalUrl) {
        setError("Please enter a valid URL");
        setLoading(false);
        return;
      }

      // Basic validation
      try {
        new URL(externalUrl);
      } catch (e) {
        setError("Please enter a valid URL (e.g., https://example.com/file.pdf)");
        setLoading(false);
        return;
      }

      // Encode URL
      const encodedUrl = encodeURIComponent(externalUrl);
      // Extract filename from URL if possible, else default
      let fileName = "Secure Document";
      try {
        const urlObj = new URL(externalUrl);
        const parts = urlObj.pathname.split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart.toLowerCase().endsWith('.pdf')) {
          fileName = decodeURIComponent(lastPart);
        }
      } catch (e) { }

      const name = encodeURIComponent(fileName);
      link = `${baseUrl}#/view?url=${encodedUrl}&name=${name}&exp=${expiresAt}`;

      setGeneratedLink(link);
    } catch (err: any) {
      setError(err.message || 'Failed to generate secure link');
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
            <p className="text-brand-muted">Generate a time-limited (1-hour), view-only link for any PDF.</p>
          </div>

          <div className="space-y-6">
            {/* URL INPUT */}
            <div className="space-y-4">
              <div className="bg-brand-edge/50 border border-brand-border p-4 rounded-lg flex gap-3 text-xs text-brand-muted">
                <Info size={16} className="shrink-0 mt-0.5 text-brand-primary" />
                <p>
                  <strong>How it works:</strong> Paste a direct link to a PDF hosted anywhere (your website, CDN, or a public storage bucket).
                  SecureView wraps it in a protected viewer that disables downloading and printing.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">Document Source URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3.5 text-brand-muted" size={16} />
                  <input
                    type="url"
                    placeholder="https://example.com/documents/brochure.pdf"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    className="w-full pl-10 bg-brand-edge border border-brand-border rounded-lg px-4 py-3 text-sm text-brand-text focus:outline-none focus:border-brand-primary/50 placeholder:text-brand-muted/50"
                  />
                </div>
                <p className="text-[10px] text-brand-muted/70">
                  * Ensure your server allows cross-origin (CORS) requests so the secure viewer can render the file.
                </p>
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
              disabled={!externalUrl || loading}
              className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${loading || !externalUrl
                  ? 'bg-brand-border text-brand-muted cursor-not-allowed'
                  : 'bg-brand-primary hover:bg-brand-primaryHover text-white shadow-lg shadow-brand-primary/25'
                }`}
            >
              {loading ? (
                <>Generating...</>
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