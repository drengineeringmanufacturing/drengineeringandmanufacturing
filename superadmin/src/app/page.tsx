'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Product, CreateProductInput, UpdateProductInput } from '@/types/product';
import { productsApi } from '@/lib/api';
import { getStoredCloudinaryConfig } from '@/lib/cloudinary';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import CloudinarySettingsModal from '@/components/CloudinarySettingsModal';
import {
  Package,
  Plus,
  Search,
  Cloud,
  Layers,
  DollarSign,
  TrendingUp,
  RefreshCw,
  LayoutGrid,
  Table as TableIcon,
  LogOut,
  User,
  ShieldCheck,
} from 'lucide-react';

function SuperadminContent() {
  const { user, token, signOut } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ online: boolean; url: string }>({
    online: false,
    url: 'http://localhost:5207',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isCloudinaryModalOpen, setIsCloudinaryModalOpen] = useState(false);
  const [hasCloudinaryConfig, setHasCloudinaryConfig] = useState(false);

  // Check Cloudinary status
  const checkCloudinary = useCallback(() => {
    const cfg = getStoredCloudinaryConfig();
    setHasCloudinaryConfig(Boolean(cfg.cloudName && cfg.uploadPreset));
  }, []);

  // Load products & check API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const status = await productsApi.getStatus();
      setApiStatus(status);

      const res = await productsApi.getAll();
      setProducts(res.products);
      setIsLiveApi(res.isLiveApi);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkCloudinary();
    loadData();
  }, [checkCloudinary, loadData]);

  // Derived tags
  const allTags = useMemo(() => {
    const tagCount: Record<string, number> = {};
    products.forEach((p) => {
      p.tags?.forEach((t) => {
        tagCount[t] = (tagCount[t] || 0) + 1;
      });
    });
    return Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag =
        !selectedTag ||
        p.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

      return matchesSearch && matchesTag;
    });
  }, [products, searchQuery, selectedTag]);

  // Financial metrics
  const totalValue = useMemo(() => {
    return products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
  }, [products]);

  const avgPrice = useMemo(() => {
    return products.length > 0 ? totalValue / products.length : 0;
  }, [products, totalValue]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (data: CreateProductInput | UpdateProductInput) => {
    if (editingProduct) {
      const res = await productsApi.update(editingProduct.id, data as UpdateProductInput, token);
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? res.product : p))
      );
      setIsLiveApi(res.isLiveApi);
    } else {
      const res = await productsApi.create(data as CreateProductInput, token);
      setProducts((prev) => [res.product, ...prev]);
      setIsLiveApi(res.isLiveApi);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    const res = await productsApi.delete(deletingProduct.id, token);
    setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    setIsLiveApi(res.isLiveApi);
  };

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-[#08101e]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-lg shadow-sky-500/20 font-bold text-lg">
              D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-white sm:text-base">
                  DANIELS AEROSPACE
                </h1>
                <span className="rounded-md bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 text-[10px] font-semibold text-sky-400">
                  SUPERADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Precision Engineering Catalog & Media Control</p>
            </div>
          </div>

          {/* Right Status, User Profile & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live API Status Pill */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs border ${
                apiStatus.online
                  ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-400'
                  : 'border-amber-500/30 bg-amber-950/40 text-amber-400'
              }`}
              title={
                apiStatus.online
                  ? `Connected to ASP.NET Core API at ${apiStatus.url}`
                  : `API offline at ${apiStatus.url} - Running in offline storage mode`
              }
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  apiStatus.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-[11px] font-medium font-mono">
                {apiStatus.online ? 'Next.js API Live' : 'Local Storage Mode'}
              </span>
            </div>

            {/* Cloudinary Config Button */}
            <button
              onClick={() => setIsCloudinaryModalOpen(true)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                hasCloudinaryConfig
                  ? 'border-slate-700 bg-slate-800/80 text-sky-300 hover:border-sky-500/50'
                  : 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 animate-pulse'
              }`}
            >
              <Cloud className="h-4 w-4" />
              <span className="hidden sm:inline">Cloudinary</span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  hasCloudinaryConfig ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
            </button>

            {/* Add Product Button */}
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500 transition-all hover:scale-102"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Add Product</span>
            </button>

            {/* Admin User & Sign Out */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="hidden md:flex flex-col items-end text-right">
                  <span className="text-xs font-medium text-slate-200 truncate max-w-[140px]">
                    {user.email}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="h-2.5 w-2.5" /> Authenticated
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="rounded-xl border border-slate-700 bg-slate-800/80 p-2 text-slate-400 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                  title="Sign out of Superadmin"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Catalog Items</span>
              <Package className="h-4 w-4 text-sky-400" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white font-mono">{products.length}</p>
            <p className="mt-1 text-[11px] text-slate-400">Active engineering parts</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Inventory Value</span>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white font-mono">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(totalValue)}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">Cumulative catalog pricing</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Average Price</span>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white font-mono">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(avgPrice)}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">Per engineered unit</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Unique Tags</span>
              <Layers className="h-4 w-4 text-amber-400" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white font-mono">{allTags.length}</p>
            <p className="mt-1 text-[11px] text-slate-400">Classifications indexed</p>
          </div>
        </div>

        {/* Search, Filter & Controls Bar */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, description, or tag..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* View Mode Toggle & Refresh */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800/80 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg p-1.5 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`rounded-lg p-1.5 transition-colors ${
                    viewMode === 'table'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Table view"
                >
                  <TableIcon className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={loadData}
                disabled={loading}
                className="rounded-xl border border-slate-700 bg-slate-800/80 p-2 text-slate-300 hover:border-slate-600 hover:text-white transition-colors disabled:opacity-50"
                title="Refresh products list"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Tags Pills Bar */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mr-1">
                Filter:
              </span>
              <button
                onClick={() => setSelectedTag(null)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors shrink-0 ${
                  selectedTag === null
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                All ({products.length})
              </button>
              {allTags.map(([tag, count]) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors shrink-0 inline-flex items-center gap-1 ${
                    selectedTag === tag
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span>#{tag}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products Display Area */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-2xl border border-slate-800 bg-slate-900/40 animate-pulse p-4"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-400 border border-slate-700">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">No products found</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm">
              {searchQuery || selectedTag
                ? 'Try adjusting your search criteria or resetting the active tag filter.'
                : 'Your catalog is currently empty. Add your first aerospace engineering product to get started.'}
            </p>
            <div className="mt-5 flex gap-2">
              {(searchQuery || selectedTag) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag(null);
                  }}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400 shadow-lg shadow-sky-500/20"
              >
                <Plus className="h-4 w-4" /> Add Product
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleOpenEdit}
                onDelete={setDeletingProduct}
              />
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-950/60 uppercase tracking-wider text-[11px] text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">Product</th>
                    <th className="px-4 py-3.5">Images</th>
                    <th className="px-4 py-3.5">Price</th>
                    <th className="px-4 py-3.5">Tags</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product.imageUrls?.[0] ||
                              'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
                            }
                            alt=""
                            className="h-11 w-11 rounded-lg object-cover border border-slate-700 bg-slate-950 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-white text-sm">{product.name}</p>
                            <p className="text-slate-400 text-xs line-clamp-1 max-w-md">
                              {product.description || '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-mono text-slate-400">
                          {product.imageUrls?.length || 0} photo{product.imageUrls?.length === 1 ? '' : 's'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-mono font-bold text-white text-sm">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {product.tags?.map((t, i) => (
                            <span
                              key={i}
                              className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-sky-400 hover:bg-slate-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeletingProduct(product)}
                            className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-rose-400 hover:bg-slate-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#060b14] py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Daniels Aerospace & Engineering. Superadmin Portal.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Cloudinary Direct Uploader</span>
            <span>•</span>
            <span>Next.js Full-Stack REST API</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Supabase Auth Secured</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        product={editingProduct}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSaveProduct}
        onOpenCloudinarySettings={() => setIsCloudinaryModalOpen(true)}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteProduct}
      />

      <CloudinarySettingsModal
        isOpen={isCloudinaryModalOpen}
        onClose={() => setIsCloudinaryModalOpen(false)}
        onSaved={checkCloudinary}
      />
    </div>
  );
}

export default function SuperadminDashboard() {
  return (
    <AuthGuard>
      <SuperadminContent />
    </AuthGuard>
  );
}
