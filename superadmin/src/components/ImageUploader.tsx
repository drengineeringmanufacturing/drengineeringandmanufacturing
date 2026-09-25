'use client';

import { useState, useRef } from 'react';
import { uploadToCloudinary, getStoredCloudinaryConfig } from '@/lib/cloudinary';
import {
  Upload,
  Image as ImageIcon,
  X,
  Plus,
  Loader2,
  Star,
  ArrowLeft,
  ArrowRight,
  Link as LinkIcon,
  AlertCircle,
  Settings,
  Sparkles,
  Check,
} from 'lucide-react';

interface Props {
  imageUrls: string[];
  onChange: (urls: string[]) => void;
  onOpenCloudinarySettings?: () => void;
}

const PRESET_SAMPLE_IMAGES = [
  {
    name: 'Turbine Hub',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'CNC Milling',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Rocket Engine',
    url: 'https://images.unsplash.com/photo-1517976487502-5f7949442f3c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Hydraulic Valve',
    url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Circuit Board',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  },
];

export default function ImageUploader({ imageUrls, onChange, onOpenCloudinarySettings }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);

    const config = getStoredCloudinaryConfig();
    if (!config.cloudName || !config.uploadPreset) {
      setErrorMessage(
        'Cloudinary credentials are not set. Configure your Cloud Name and Unsigned Preset, or use the Direct URL input below.'
      );
      if (onOpenCloudinarySettings) {
        onOpenCloudinarySettings();
      }
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const newUploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        const url = await uploadToCloudinary(file, undefined, (percent) => {
          setUploadProgress(percent);
        });
        newUploadedUrls.push(url);
      }

      onChange([...imageUrls, ...newUploadedUrls]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddDirectUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onChange([...imageUrls, urlInput.trim()]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleRemove = (index: number) => {
    const updated = imageUrls.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = imageUrls[index];
    const filtered = imageUrls.filter((_, i) => i !== index);
    onChange([item, ...filtered]);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= imageUrls.length) return;
    const copy = [...imageUrls];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    onChange(copy);
  };

  const handleAddPreset = (url: string) => {
    if (!imageUrls.includes(url)) {
      onChange([...imageUrls, url]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Product Images ({imageUrls.length})
        </label>
        <div className="flex items-center gap-2">
          {onOpenCloudinarySettings && (
            <button
              type="button"
              onClick={onOpenCloudinarySettings}
              className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              Cloudinary Setup
            </button>
          )}
        </div>
      </div>

      {/* Cloudinary Upload Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFilesSelected(e.dataTransfer.files);
        }}
        className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
          isUploading
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-gray-300 bg-gray-50/50 hover:border-blue-500 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFilesSelected(e.target.files)}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-gray-900">Uploading to Cloudinary...</p>
            <div className="w-48 bg-gray-200 rounded-full h-1.5 overflow-hidden mt-1">
              <div
                className="bg-blue-600 h-full transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{uploadProgress}%</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-all border border-blue-100">
              <Upload className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-gray-900 mt-1">
              Click or drag images here to upload
            </p>
            <p className="text-xs text-gray-500">Supports PNG, JPG, WebP (multiple images supported)</p>
          </div>
        )}
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1">
            <p>{errorMessage}</p>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-800">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Secondary Actions: Direct URL or Sample Presets */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <LinkIcon className="h-3.5 w-3.5 text-blue-600" />
          {showUrlInput ? 'Hide URL input' : 'Paste Direct Image URL'}
        </button>

        <div className="flex items-center gap-1 text-gray-500">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-[11px]">Quick samples:</span>
          {PRESET_SAMPLE_IMAGES.slice(0, 3).map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAddPreset(sample.url)}
              className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700 hover:bg-gray-200 transition-colors"
            >
              +{sample.name}
            </button>
          ))}
        </div>
      </div>

      {/* Direct URL Form */}
      {showUrlInput && (
        <form onSubmit={handleAddDirectUrl} className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/product-image.jpg"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            Add Image
          </button>
        </form>
      )}

      {/* Gallery of Uploaded Images */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className="group relative rounded-xl border border-gray-200 bg-gray-50 overflow-hidden shadow-sm aspect-square flex flex-col justify-between"
            >
              <img
                src={url}
                alt={`Product image ${index + 1}`}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  (e.target as HTMLElement).style.opacity = '0.3';
                }}
              />

              {/* Cover badge */}
              <div className="absolute top-2 left-2 z-10">
                {index === 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/90 backdrop-blur px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                    <Star className="h-2.5 w-2.5 fill-white" /> Cover
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    title="Set as cover photo"
                    className="opacity-0 group-hover:opacity-100 rounded-md bg-black/70 backdrop-blur px-1.5 py-0.5 text-[10px] text-slate-300 hover:text-white transition-opacity"
                  >
                    Set Cover
                  </button>
                )}
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 z-10 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <X className="h-3 w-3" />
              </button>

              {/* Bottom controls bar */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="flex items-center gap-1">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'left')}
                      className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200"
                      title="Move left"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </button>
                  )}
                  {index < imageUrls.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'right')}
                      className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200"
                      title="Move right"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                    setCopiedUrl(url);
                    setTimeout(() => setCopiedUrl(null), 1500);
                  }}
                  className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-[10px] inline-flex items-center gap-1"
                  title="Copy URL"
                >
                  {copiedUrl === url ? <Check className="h-3 w-3 text-emerald-400" /> : <LinkIcon className="h-3 w-3" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
