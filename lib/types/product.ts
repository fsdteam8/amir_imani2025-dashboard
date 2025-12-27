export interface Product {
  _id: string;
  productName: string;
  price: number;
  productType?: "card" | "marchandice" | string; // Assuming 'marchandice' is the typo in DB, keeping it as string literal or string
  feature?: string;
  description?: string;
  videoLink?: string;
  img?: string; // Some products have 'img', some have 'imgs'
  imgs?: string[];
  quantity?: number;
  color?: string[];
  size?: string[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export interface CreateProductInput {
  productName: string;
  price: number;
  productType: string;
  feature?: string;
  description?: string;
  videoLink?: string;
  imgs?: File[];
  existingImgs?: string[]; // URLs of existing images to keep
  color?: string[];
  size?: string[];
  quantity?: number;
}
