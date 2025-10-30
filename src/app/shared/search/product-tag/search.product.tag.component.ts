import { Component, forwardRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, filter } from 'rxjs/operators';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SearchService } from 'app/core/search/search.service';

@Component({
  selector: 'search-product-tag',
  templateUrl: './search.product.tag.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchProductTagComponent),
      multi: true
    }
  ]
})
export class SearchProductTagComponent implements ControlValueAccessor {

  constructor(
    private searchService: SearchService,
    private ngZone: NgZone
  ) { }

  @ViewChild('input', { static: true })
  input!: ElementRef;

  filteredOptions: any[] = [];
  brandsLoading = false;
  updateControl: boolean = true;

  searching = false;
  searchFailed = false;

  public _value;
  searchText: any;

  ngOnInit() { }

  get value() {
    const brand = this._value;
    return brand;
  }

  set value(val) {
    if (val) {
      this._value = val;

      this.propagateChange(this._value);
      if (this.updateControl) {
        this.input.nativeElement.value = val.name;
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
    this.searchService.searchProductBrands(this.searchText).subscribe(data => {
      this.ngZone.run(() => {
        this.filteredOptions = data;
        this.searching = false;
      });
    }, error => {
      this.searching = false;
      this.searchFailed = true;
    });
  }
}
