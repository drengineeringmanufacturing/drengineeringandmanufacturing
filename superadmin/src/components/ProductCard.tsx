'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import {
  Pencil,
  Trash2,
  Tag,
  Copy,
  Check,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface Props {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedId, setCopiedId] = useState(false);

  const images = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls
    : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'];

  const currentImage = images[Math.min(activeImageIndex, images.length - 1)];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const copyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(product.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  return (
    <div className="group flex flex-col rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-0.5">
      {/* Image Showcase */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
        <img
          src={currentImage}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Price Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm font-mono">
            {formattedPrice}
          </span>
        </div>

        {/* Image Controls for multi-image products */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 backdrop-blur p-1.5 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 backdrop-blur p-1.5 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeImageIndex ? 'w-4 bg-sky-400' : 'w-1.5 bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Image count pill */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-lg bg-black/60 backdrop-blur px-2 py-0.5 text-[10px] text-slate-300 font-mono">
            <ImageIcon className="h-3 w-3" />
            {images.length} {images.length === 1 ? 'image' : 'images'}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-slate-900 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </div>

          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description || 'No description provided.'}
          </p>

          {/* Tags */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {product.tags && product.tags.length > 0 ? (
              product.tags.slice(0, 4).map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-slate-400 italic">No tags</span>
            )}
            {product.tags && product.tags.length > 4 && (
              <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                +{product.tags.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Footer info & Actions */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={copyId}
            className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
            title="Click to copy ID"
          >
            {copiedId ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            <span>{product.id.slice(0, 8)}...</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(product)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
            <button
              onClick={() => onDelete(product)}
              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors shadow-sm"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
