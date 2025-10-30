import { Component, ElementRef, forwardRef, NgZone, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, filter } from 'rxjs/operators';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SearchService } from 'app/core/search/search.service';

@Component({
  selector: 'search-catchment-area',
  templateUrl: './search.catchment.area.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchCatchmentAreaComponent),
      multi: true
    }
  ]
})
export class SearchCatchmentAreaComponent implements ControlValueAccessor {

  catchmentAreasLoading = false;
  updateControl: boolean = true;
  catchmentAreas$: Observable<any[]>;
  selectedCatchmentArea: any;
  searching = false;
  searchFailed = false;
  searchText: string = '';
  filteredOptions: any;

  @ViewChild('input', { static: true })
  input!: ElementRef;

  public _value;

  ngOnInit() { }

  get value() {
    const catchmentArea = this._value;
    return catchmentArea;
  }

  set value(val) {
    if (val) {
      this._value = val;

      this.propagateChange(this._value);
      if (this.updateControl) {
        if(val.name) this.input.nativeElement.value = val.name;
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
    this.searchService.searchCatchmentArea(this.searchText).subscribe(data => {
      this.ngZone.run(() => {
        this.filteredOptions = data;
        this.searching = false;
      })      
    }, error => {
      this.searching = false;
      this.searchFailed = true;
    });
  }

  selected($event) {
    this.updateControl = false
    this.writeValue($event)
  }

}
