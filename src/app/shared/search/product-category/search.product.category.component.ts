import { Component, forwardRef, ElementRef, ViewChild, NgZone } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, filter } from 'rxjs/operators';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SearchService } from 'app/core/search/search.service';

@Component({
  selector: 'search-product-category',
  templateUrl: './search.product.category.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchProductCategoryComponent),
      multi: true
    }
  ]
})
export class SearchProductCategoryComponent implements ControlValueAccessor {

  constructor(private searchService: SearchService,
    private ngZone: NgZone
  ) { }

  searching = false;
  searchFailed = false;
  searchText: string = '';
  filteredOptions: any[] = [];

  @ViewChild('input', { static: true })
  input!: ElementRef;

  inputValue;

  get counterValue() {
    return this.inputValue;
  }

  set counterValue(val) {
    this.inputValue = val;
    this.propagateChange(this.inputValue);
  }

  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  writeValue(value: any) {
    this.counterValue = value;
    if(this.counterValue) this.input.nativeElement.value = this.counterValue.name;
  }

  selected($event) {
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
    this.searchService.searchProductCategories(this.searchText).subscribe(data => {
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
