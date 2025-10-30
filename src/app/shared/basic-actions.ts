import { BehaviorSubject, Observable, Subject } from 'rxjs';

export class BasicActions {
    public _unsubscribeAll: Subject<any> = new Subject();
    public _subscriptions = { getData: null }; // to manage/cancel any subscription manually.
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    public tableAttributes = { totalRecords: 0, pageSizeOptions: [5,10, 25, 100], pageSize: 10 }; // paginate table properties

    public filterOptions = {
        page: 0,
        limit: 10,
    };

    constructor(public collapseComponent) {}

    loading(loading: boolean) {
        this.isLoading.next(loading);
    }

    toggleDrawer() {
        this.collapseComponent.matDrawer.toggle();
    }

}
