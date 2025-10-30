import { LngLat } from './lnglat';

export class CatchmentArea {
  id?: number;
  name: string;
  depotLocation: LngLat;
  availableFrom: number;
  points: [LngLat];
  area?: any;
  maxWaitingTime?: any;
  maxOrderTravelTime?: any;
  maxRouteTime?: any;
  maxOutOfCatchmentDistance: number;
  deliverySlotDuration?: number;
  deliverySlotCutOfTime?: number;
}
