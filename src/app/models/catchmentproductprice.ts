import { ProductProfile } from './productprofile';
import { CatchmentArea } from './catchmentarea';

export class CatchmentProductPrice {
  id: number;
  name: string;
  unitPrice: number;

  validFrom ?: number;
  validTo ?: number;
  
  catchmentArea: CatchmentArea;
  product: ProductProfile;
}
