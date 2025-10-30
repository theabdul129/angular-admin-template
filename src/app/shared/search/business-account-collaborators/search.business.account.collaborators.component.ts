import {
    Component,
    Input,
    forwardRef,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    tap,
    filter,
} from 'rxjs/operators';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BusinessAccount } from 'app/models/businessaccount';
import { BusinessAccountService } from 'app/modules/admin/business-accounts/business-account.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'search-business-account-collaborators',
    templateUrl: './search.business.account.collaborators.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(
                () => SearchBusinessAccountCollaboratorsComponent
            ),
            multi: true,
        },
    ],
})
export class SearchBusinessAccountCollaboratorsComponent {
    @Input() businessAccount: BusinessAccount;
    @ViewChild('input', { static: true })
    input!: ElementRef;
    searchText: string = '';
    filteredOptions: any;
    searching = false;
    isSearching: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isSearchingObs: Observable<boolean> =
        this.isSearching.asObservable();
    searchFailed = false;
    public _value;
    updateControl: boolean = true;

    ngOnInit() {}

    get value() {
        const country = this._value;
        return country;
    }

    set value(val) {
        if (val) {
            this._value = val;
            this.propagateChange(this._value);
        }
    }

    /* Takes the value  */
    writeValue(value: any) {
        if (value !== undefined) {
            this.value = value;
            this.propagateChange(this.value);
        }
    }

    propagateChange = (_: any) => {};

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {}

    constructor(
        private businessService: BusinessAccountService

    ) {}

    ngAfterViewInit() {
        // server-side search
        fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                filter(Boolean),
                debounceTime(1000),
                distinctUntilChanged(),
                tap((text) => {
                    this.searchText = this.input.nativeElement.value;
                    this.getSearch();
                })
            )
            .subscribe();
    }

    getSearch() {
        this.searching = true;
        this.businessService
            .searchCollaborators(this.searchText)
            .pipe(
                finalize(() => {
                    this.isSearching.next(false);
                })
            )
            .subscribe(
                (data) => {
                    if (data) {
                        this.filteredOptions = data.data;
                    } else this.searchFailed = true;
                },
                (error) => {
                    this.searchFailed = true;
                }
            );
    }

    selected($event) {
        this.updateControl = false;
        this.writeValue($event);
    }
}
