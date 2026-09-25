'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteConfirmModal({ product, isOpen, onClose, onConfirm }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !product) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-900 shadow-2xl p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white">Delete Product</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{product.name}"</strong>?
              This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/20 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Deleting...
                  </>
                ) : (
                  'Yes, Delete Product'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
