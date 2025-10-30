import {
    Component,
    Input,
    forwardRef,
    Output,
    EventEmitter,
    ElementRef,
    ViewChild,
    NgZone,
    Inject,
} from '@angular/core';
import { fromEvent, Observable, BehaviorSubject } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    tap,
    filter,
} from 'rxjs/operators';
import { finalize } from 'rxjs/operators';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SearchService } from 'app/core/search/search.service';

@Component({
    selector: 'search-address',
    templateUrl: './search.address.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchAddressComponent),
            multi: true,
        },
    ],
})
export class SearchAddressComponent {
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    resultFailure: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public resultFailureObs: Observable<boolean> = this.isLoading.asObservable();

    searchFailed = false;
    searchText: string = '';
    filteredOptions: any;

    @Output() onSelect: EventEmitter<any> = new EventEmitter();
    @ViewChild('input', { static: true })
    input!: ElementRef;
    @Input() isCustomerAddressSearch:boolean=false;
    @Input() customerId:string;

    constructor(private searchService: SearchService, private ngZone: NgZone) {}

    ngAfterViewInit() {
        // server-side search
        fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                filter(Boolean),
                debounceTime(1000),
                distinctUntilChanged(),
                tap((text) => {
                    this.searchText = this.input.nativeElement.value;                    
                    if(this.isCustomerAddressSearch){
                        this.getCustomersAddress();
                    }else this.getSearch();
                })
            )
            .subscribe();
    }

    getSearch() {
        this.isLoading.next(true);

        this.searchService
            .searchAddresses(this.searchText)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe(
                (data) => {
                    this.filteredOptions = data;
                },
                (error) => {
                  //  this.resultFailure.next(true);
                }
            );
    }
    
    getCustomersAddress() {
        this.isLoading.next(true);
        this.searchService
            .searchCustomerAddresses(this.customerId)
            // .searchCustomerAddresses(this.searchText)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe(
                (data:any) => {
                    this.filteredOptions = data.data.filter((item) => item.address1.toLowerCase().includes(this.searchText.toLowerCase()));
                },
                (error) => {
                  //  this.resultFailure.next(true);
                }
            );
    }

    selected(data) {
        this.onSelect.emit(data);
    }
}
