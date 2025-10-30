import { Product } from './product';
import { Pager } from './pager';

export class ProductGroup {
  name: string;
  description: string;
  contentLocation: string;
  orientation: string;
  id: number;
  archivedAt?: number;
  approvedAt?: number;
  displayedDateFrom?: any;
  displayedDateTo?: any;
  displayedTimeFrom: number;
  displayedTimeTo: number;
  products?: Pager<Product>
}
