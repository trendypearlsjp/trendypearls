import React from 'react';
import { X, Database, Cloud, MessageSquare, Terminal, Code2, Copy } from 'lucide-react';

interface ApiSetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiSetupGuideModal: React.FC<ApiSetupGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel modal-content max-w-3xl p-6 relative border border-purple-500/40 text-xs leading-relaxed"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Full-Stack Integration Guide</h3>
            <p className="text-slate-400 text-[11px]">
              Supabase PostgreSQL Database, Cloudinary Image Upload API, and WhatsApp Integration
            </p>
          </div>
        </div>

        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-pink-400">
              <Database className="w-4 h-4" />
              <span>1. Supabase Database & Auth Setup</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>Create a free Supabase project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-pink-400 underline">supabase.com</a>.</li>
              <li>Navigate to <strong>SQL Editor</strong> in Supabase dashboard.</li>
              <li>
                Execute the DDL schema provided in <code className="text-emerald-400 font-mono">supabase/schema.sql</code>. It creates the <code className="font-mono text-purple-300">products</code> and <code className="font-mono text-purple-300">categories</code> tables, full-text search indexes, and automatic stock triggers (<code className="text-xs text-slate-400">in_stock</code>, <code className="text-xs text-slate-400">sold_out</code>, <code className="text-xs text-slate-400">out_of_stock</code>).
              </li>
              <li>Go to <strong>Project Settings → API</strong> and copy your Project URL & Anon Key into your <code className="font-mono text-pink-300">.env</code> file.</li>
            </ol>

            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-[11px] text-slate-300 flex justify-between items-center">
              <span>VITE_SUPABASE_URL=https://your-project.supabase.co<br />VITE_SUPABASE_ANON_KEY=your-anon-key</span>
              <button
                onClick={() => copyToClipboard('VITE_SUPABASE_URL=\nVITE_SUPABASE_ANON_KEY=')}
                className="btn btn-secondary btn-sm text-[10px]"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-purple-400">
              <Cloud className="w-4 h-4" />
              <span>2. Cloudinary File Upload API (Picture File → CDN URL)</span>
            </div>
            <p className="text-slate-300">
              When an admin picks any image file in the Admin modal (JPEG, PNG, WebP), it is automatically sent via Cloudinary REST API and converted into a permanent hosted CDN image URL.
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>Sign up for a free account at <a href="https://cloudinary.com" target="_blank" rel="noreferrer" className="text-purple-400 underline">cloudinary.com</a>.</li>
              <li>Go to <strong>Settings → Upload</strong> and add an <strong>Unsigned Upload Preset</strong> named <code className="font-mono text-pink-300">trendy_products</code>.</li>
              <li>Add your Cloud Name and Upload Preset to <code className="font-mono text-pink-300">.env</code>.</li>
            </ol>

            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-[11px] text-slate-300 flex justify-between items-center">
              <span>VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name<br />VITE_CLOUDINARY_UPLOAD_PRESET=trendy_products</span>
              <button
                onClick={() => copyToClipboard('VITE_CLOUDINARY_CLOUD_NAME=\nVITE_CLOUDINARY_UPLOAD_PRESET=trendy_products')}
                className="btn btn-secondary btn-sm text-[10px]"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
              <MessageSquare className="w-4 h-4" />
              <span>3. WhatsApp Order Integration</span>
            </div>
            <p className="text-slate-300">
              Set your boutique sales phone number in <code className="font-mono text-pink-300">.env</code> (include country code without + or spaces).
            </p>
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-[11px] text-slate-300 flex justify-between items-center">
              <span>VITE_WHATSAPP_NUMBER=919876543210</span>
              <button
                onClick={() => copyToClipboard('VITE_WHATSAPP_NUMBER=919876543210')}
                className="btn btn-secondary btn-sm text-[10px]"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-blue-400">
              <Terminal className="w-4 h-4" />
              <span>4. Seeding Products</span>
            </div>
            <p className="text-slate-300">
              You can add products manually via the Admin Dashboard, import from Instagram, or seed products into Supabase using:
            </p>
            <div className="bg-slate-950 p-2 rounded font-mono text-slate-300 text-[11px]">
              node supabase/seed.js
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
