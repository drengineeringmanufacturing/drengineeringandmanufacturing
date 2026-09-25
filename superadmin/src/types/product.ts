export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  price: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  imageUrls: string[];
  price: number;
  tags: string[];
}

export interface UpdateProductInput {
  name: string;
  description: string;
  imageUrls: string[];
  price: number;
  tags: string[];
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}
