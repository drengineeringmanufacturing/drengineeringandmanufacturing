export type ProductCategory =
  | "Automotive"
  | "Tooling"
  | "Prototypes"
  | "Home & Office"
  | "Custom";

export interface Product {
  id: string;
  code: string;
  title: string;
  category: ProductCategory;
  image: string;
  imageUrls?: string[];
  /** CSS object-position for the grid thumbnail */
  focus?: string;
  /** Show the image contained (no crop) — for renders on white */
  contain?: boolean;
  summary: string;
  price?: number;
  tags?: string[];
  process: string[];
  specs?: { label: string; value: string }[];
}

export const productCategories: ("All" | ProductCategory)[] = [
  "All",
  "Automotive",
  "Tooling",
  "Prototypes",
  "Home & Office",
  "Custom",
];

// No hardcoded showcase products. All products are dynamically fetched via the Superadmin REST API
export const products: Product[] = [];
