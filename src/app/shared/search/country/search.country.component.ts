import { Component, forwardRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, filter } from 'rxjs/operators';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SearchService } from 'app/core/search/search.service';

@Component({
  selector: 'search-country',
  templateUrl: './search.country.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchCountryComponent),
      multi: true
    }
  ]
})
export class SearchCountryComponent implements ControlValueAccessor {

  @ViewChild('input', { static: true })
  input!: ElementRef;

  countriesLoading = false;
  updateControl: boolean = true;
  countries$: Observable<any[]>;
  selectedCountry: any;
  filteredOptions: any;
  searchText: any;
  searching = false;
  searchFailed = false;

  public _value;

  ngOnInit() { }

  get value() {
    const country = this._value;
    return country;
  }

  set value(val) {
    if (val) {
      this._value = val;

      this.propagateChange(this._value);
      if (this.updateControl) {
        this.input.nativeElement.value = val.country;
      }
    }
  }

  /* Takes the value  */
  writeValue(value: any) {
    if (value !== undefined) {
      this.value = value;
      this.propagateChange(this.value);
    }
  }

  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  constructor(
    private searchService: SearchService,
    private ngZone: NgZone
    ) {
  }

  selected($event) {
    this.updateControl = false
    this.writeValue($event)
  }

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
    this.searchService.searchCountries(this.searchText).subscribe(data => {
      this.ngZone.run(() => {
        this.filteredOptions = data;
        this.searching = false;
      })
    }, error => {
      this.searching = false;
      this.searchFailed = true;
    });
  }
}
