import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StoreDataService {

    private storeData = new BehaviorSubject(null);
    activeStore = this.storeData.asObservable();

    constructor() { }

    newStore(data: any) {
        this.storeData.next(data)
    }

}