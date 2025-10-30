import { ProductCategory } from './productcategory';
import { ProductProfile } from './productprofile';
import { ProductBrand } from './productbrand';
import { ProductImage } from './productimage';
import { PackageDimension } from './packagedimension';
import { Country } from './country';
import { Gtin } from './gtin';

export class Product {
  id: number;
  name: string;
  description: string;
  category: ProductCategory;
  archivedAt ?: number;
  approvedAt ?: number;
  updatedAt ?: number;
  createdAt ?: number;
  packageDimensions?: [PackageDimension];
  productImages?: [ProductImage];
  images?: [ProductImage];
  gtins?: [Gtin];
  ageRestriction: boolean;
  features: string;
  lowerAgeLimit: string;
  store?: any;
  storeCtrl?: any;
  currency?: any;
  unitPrice?: any;
  tax?: any;
  stockControl?: any;
  // parentProduct?:  ProductProfile;
  relatedProductCategories?: any;
  productTags?: any;
  productType?: any;
  attributes?: [any];
  brand?:any;
  inStock?:boolean;
}


