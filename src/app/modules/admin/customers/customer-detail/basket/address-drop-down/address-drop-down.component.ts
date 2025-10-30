import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SearchService } from 'app/core/search/search.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-address-drop-down',
    templateUrl: './address-drop-down.component.html',
    styleUrls: ['./address-drop-down.component.scss'],
})
export class AddressDropDownComponent implements OnInit,OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject(); // for unsbscribe the on leaving the component
    @Input() address: any;
    @Input() customerId: any;
    @Output() onSelect=new EventEmitter()

    addressesList=[];
    selectedValue;

    constructor(private searchService: SearchService) {}

    ngOnInit(): void {
      if(this.address?.id){
        this.selectedValue=this.address?.id;
      }
      this.getAllAddresses();
    }

    ngOnDestroy(): void {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
    }

    getAllAddresses() {
        this.searchService
            .searchCustomerAddresses(this.customerId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp:any)=>{
              this.addressesList=resp?.data
            });
    }

    onSelected(){
      let selected=this.addressesList?.find((item)=>item.id==this.selectedValue);
      this.onSelect.emit(selected);
    }



}
