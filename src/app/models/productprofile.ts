import { ProductCategory } from './productcategory';
import { ProductBrand } from './productbrand';
import { ProductImage } from './productimage';

export class ProductProfile {
  id?: number;
  name?: string;
  gtins: [any];

  productCategory?: ProductCategory;
  productBrand?: ProductBrand;
  productImages?: [ProductImage];
}
