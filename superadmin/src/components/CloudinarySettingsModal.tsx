'use client';

import { useState, useEffect } from 'react';
import { getStoredCloudinaryConfig, saveStoredCloudinaryConfig } from '@/lib/cloudinary';
import { X, Cloud, Key, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function CloudinarySettingsModal({ isOpen, onClose, onSaved }: Props) {
  const [cloudName, setCloudName] = useState('');
  const [uploadPreset, setUploadPreset] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getStoredCloudinaryConfig();
      setCloudName(config.cloudName);
      setUploadPreset(config.uploadPreset);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredCloudinaryConfig(cloudName, uploadPreset);
    setSavedSuccess(true);
    setTimeout(() => {
      onSaved();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Cloudinary Configuration</h2>
              <p className="text-xs text-slate-400">Direct client-side media uploads</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="rounded-xl border border-sky-500/20 bg-sky-950/30 p-3.5 text-xs text-sky-300 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-sky-400" />
            <div>
              <span className="font-medium text-white">Direct browser uploads require an Unsigned Upload Preset.</span>
              <p className="mt-1 text-slate-300">
                In your Cloudinary console, go to <strong>Settings → Upload → Upload Presets</strong> and add an unsigned preset.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Cloud Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={cloudName}
                onChange={(e) => setCloudName(e.target.value)}
                placeholder="e.g. dr-aerospace"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Unsigned Upload Preset <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={uploadPreset}
                onChange={(e) => setUploadPreset(e.target.value)}
                placeholder="e.g. products_unsigned"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <a
              href="https://cloudinary.com/console"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 hover:underline"
            >
              Open Cloudinary Console <ExternalLink className="h-3 w-3" />
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/20"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-white" /> Saved!
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
