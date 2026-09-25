'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Product, CreateProductInput, UpdateProductInput } from '@/types/product';
import { productsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import ProductModal from '@/components/ProductModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import {
  Package,
  Plus,
  Search,
  LogOut,
  Pencil,
  Trash2,
  Loader2,
  RefreshCw,
  Tag,
} from 'lucide-react';

function SuperadminContent() {
  const { user, token, signOut } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Load products
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsApi.getAll();
      setProducts(res.products || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [products, searchQuery]);

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
    } else {
      const res = await productsApi.create(data as CreateProductInput, token);
      setProducts((prev) => [res.product, ...prev]);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    await productsApi.delete(deletingProduct.id, token);
    setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Clean White Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-sm">
              DR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-sm sm:text-base">
                  DR Engineering &amp; Manufacturing
                </span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  Admin
                </span>
              </div>
            </div>
          </div>

          {/* User & Sign Out */}
          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="hidden sm:inline-block text-xs text-slate-500 font-medium">
                {user.email}
              </span>
            )}
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Title & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {products.length} {products.length === 1 ? 'item' : 'items'} in catalog
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-sm"
              />
            </div>

            {/* Refresh */}
            <button
              onClick={loadData}
              disabled={loading}
              className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
              title="Refresh list"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Add Product Button */}
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors shrink-0"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Product List Table */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {loading && products.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
              <p className="mt-3 text-sm">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center px-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-3">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                {searchQuery ? 'No matching products found' : 'No products yet'}
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? 'Try searching with a different keyword or clear your search input.'
                  : 'Start by clicking the "Add Product" button above to list your first item.'}
              </p>
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Clear search
                </button>
              ) : (
                <button
                  onClick={handleOpenCreate}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Product</th>
                    <th className="px-4 py-3.5">Price</th>
                    <th className="px-4 py-3.5">Tags</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => {
                    const thumb =
                      product.imageUrls?.[0] ||
                      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80';

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={thumb}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-slate-500 text-xs line-clamp-1 max-w-md">
                                {product.description || '—'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-900">
                          ${Number(product.price).toFixed(2)}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {product.tags && product.tags.length > 0 ? (
                              product.tags.map((t, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                                >
                                  {t}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(product)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                            >
                              <Pencil className="h-3.5 w-3.5 text-slate-500" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => setDeletingProduct(product)}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-500" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        product={editingProduct}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSaveProduct}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteProduct}
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
