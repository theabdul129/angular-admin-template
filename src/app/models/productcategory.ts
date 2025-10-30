import { ProductImage } from "./productimage";

export class ProductCategory {
  name: string;
  description: string;
  imageUrl: string;
  publicImageUrl: string;
  id: number;
  popular: boolean;
  archivedAt?: number;
  approvedAt?: number;
  orderPosition?: number;
  parentProductCategory: ProductCategory;
  productCategoryImages?: [ProductImage];
  relatedCategories?: [ProductCategory];
}
