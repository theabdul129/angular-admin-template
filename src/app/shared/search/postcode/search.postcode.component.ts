import { Component, Input, forwardRef, ViewChild, ElementRef, NgZone, Inject } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, filter } from 'rxjs/operators';

import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SearchService } from 'app/core/search/search.service';

@Component({
  selector: 'search-postcode',
  templateUrl: './search.postcode.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchPostcodeComponent),
      multi: true
    }
  ]
})
export class SearchPostcodeComponent {


  constructor(
    private searchService: SearchService,
    private ngZone: NgZone
  ) { }

  // selectedPostcode: any;
  searching = false;
  searchFailed = false;
  filteredOptions: any;
  searchText: any;

  @Input('postcode') selectedPostcode;

  @ViewChild('input', { static: true })
  input!: ElementRef;

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
    this.searchService.searchPostcodes(this.searchText).subscribe(data => {
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
  }

}
