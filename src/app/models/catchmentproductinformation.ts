import { ProductProfile } from './productprofile';
import { CatchmentArea } from './catchmentarea';

export class CatchmentProductInformation {

  catchmentAreaUnitPrice: number;

  recommendedStoreUnitPrice: number;

  storeHighUnitPrice: number;

  storeLowUnitPrice: number;

  storeAverageUnitPrice: number;

  storeStockCount : number;

  storeCoverage : number;
  
  catchmentArea: CatchmentArea;

  product: ProductProfile;
}
