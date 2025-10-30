export class Marker {
    lat: number;
    lng: number;
    id?: number;
    label:string;
}

export class  StoreLocation {
    latitude: number;
    longitude: number;
    mapType?: string;
    zoom?: number;
    marker?: Marker;
    markers: Array<Marker>;
}
