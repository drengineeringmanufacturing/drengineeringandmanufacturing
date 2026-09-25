'use client';

import { useState, useEffect } from 'react';
import { Product, CreateProductInput, UpdateProductInput } from '@/types/product';
import ImageUploader from './ImageUploader';
import TagInput from './TagInput';
import { X, Package, DollarSign, FileText, Loader2, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  product?: Product | null; // If provided, edit mode; otherwise, create mode
  onClose: () => void;
  onSubmit: (data: CreateProductInput | UpdateProductInput) => Promise<void>;
  onOpenCloudinarySettings?: () => void;
}

export default function ProductModal({
  isOpen,
  product,
  onClose,
  onSubmit,
  onOpenCloudinarySettings,
}: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isEditMode = !!product;

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setName(product.name);
        setDescription(product.description || '');
        setPrice(product.price.toString());
        setImageUrls(product.imageUrls || []);
        setTags(product.tags || []);
      } else {
        setName('');
        setDescription('');
        setPrice('');
        setImageUrls([]);
        setTags([]);
      }
      setFormError(null);
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setFormError('Please enter a valid price (greater than or equal to 0).');
      return;
    }

    if (!name.trim()) {
      setFormError('Product name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        imageUrls,
        tags,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while saving the product.';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl text-slate-100 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/70 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditMode
                  ? 'Update product specifications, images, and pricing'
                  : 'Register a precision engineering product in the catalog'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {formError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-3.5 text-xs text-rose-300">
              {formError}
            </div>
          )}

          {/* Name & Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Product Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Titanium Aero Turbine Rotor Hub"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Price (USD) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <DollarSign className="h-4 w-4" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-8 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Description & Engineering Specs
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide technical specifications, tolerances, material composition, or usage applications..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-y"
            />
          </div>

          {/* Tags */}
          <TagInput tags={tags} onChange={setTags} />

          {/* Images Section with Cloudinary */}
          <ImageUploader
            imageUrls={imageUrls}
            onChange={setImageUrls}
            onOpenCloudinarySettings={onOpenCloudinarySettings}
          />

          {/* Sticky Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
