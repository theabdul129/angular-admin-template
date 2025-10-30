import { Component, forwardRef, ElementRef, EventEmitter, Output, ViewChild, NgZone, Input } from "@angular/core";
import { fromEvent } from "rxjs";
import { debounceTime, distinctUntilChanged, tap, filter } from "rxjs/operators";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { SearchService } from "app/core/search/search.service";

@Component({
  selector: "search-product",
  templateUrl: "./search.product.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchProductComponent),
      multi: true
    }
  ]
})
export class SearchProductComponent implements ControlValueAccessor{

  searching = false;
  searchFailed = false;
  searchText: string = '';
  filteredOptions: any;


  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @ViewChild('input', { static: true })
  input!: ElementRef;
  updateControl: boolean = true;
  @Input() label;

  @Input() onlyLive;

  constructor(private searchService: SearchService,
    private ngZone: NgZone
  ) { }

  ngOnInit() { }

  inputValue;

  get counterValue() {
    return this.inputValue;
  }

  set counterValue(val) {
    this.inputValue = val;
    this.propagateChange(this.inputValue);
  }

  propagateChange = (_: any) => { 
    
  };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  writeValue(value: any) {
    this.counterValue = value;
    if(this.counterValue) this.input.nativeElement.value = this.counterValue.name;
  }

  selected(event) {
    this.updateControl = false
    this.onSelect.emit(event)
    this.writeValue(event)
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
    if(this.onlyLive){
      this.searchService.searchProductsOnlyLive({name: this.searchText}).subscribe((data:any) => {
        this.ngZone.run(() => {
          this.filteredOptions = data.data;
          this.searching = false;
        })      
      }, error => {
        this.searching = false;
        this.searchFailed = true;
      });
    }else{
      this.searchService.searchProducts({name: this.searchText}).subscribe((data:any) => {
        this.ngZone.run(() => {
          this.filteredOptions = data.data;
          this.searching = false;
        })      
      }, error => {
        this.searching = false;
        this.searchFailed = true;
      });
    }
   
  }
}
