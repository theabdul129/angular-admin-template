import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailComponent } from '../product-detail.component';
import { InventoryService } from '../../../inventory.service';
import { Product } from 'app/models/product';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductTypeService } from '../../../product-type/product-type.service';
import { BusinessAccountService } from '../../../../business-accounts/business-account.service';

@Component({
    selector: 'qr-code',
    templateUrl: './qr-code.component.html'
})
export class QrCodeComponent implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    @HostListener('window:afterprint')
  onafterprint() {
    if(this.printDrawerOpened)
    this.toggleDrawer();
  }
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    panelOpenState = false;
    productId: any;
    selectedProduct: Product;
    attributes: any;
    imageToShow: any;
    isImageLoading: boolean
    accountData: any;
    printDrawerOpened = true;

    constructor(
        private route: Router,
        private inventory: InventoryService,
        private businessService: BusinessAccountService,

        public dialog: MatDialog,
        private productComponent: ProductDetailComponent,
        private location: Location,
        private productTypeService: ProductTypeService
    ) { }

    ngOnInit() {
        if(window.innerWidth<769)this.toggleDrawer();
        let id = this.route.url.split(['/'][0]);
        this.productId = Number(id[4]);
        if (this.productId) this.loadProduct();
        else this.location.back();
    }

    loadProduct() {
        this.isLoading.next(true);
        this.loadQR();
        this.inventory.get(this.productId).subscribe(data => {
            this.isLoading.next(false);
            this.selectedProduct = data;
            console.log("selectedProduct", data)
            this.getAttributes(this.selectedProduct.productType.id);
        });

        this.businessService.getBusinessAccount().subscribe((data) => {
            this.accountData = data;
       
        });
    }

    getAttributes(id) {
        this.isLoading.next(true);
        this.productTypeService.getProductType(id).subscribe((data: any) => {
            this.isLoading.next(false);
            this.attributes = data.attributes;
            console.log('this.attributes =>',this.attributes)
        });
    }

    loadQR() {
        this.inventory.getQR(this.productId).subscribe(data => this.createImageFromBlob(data));
    }

    createImageFromBlob(image: Blob) {
        this.isImageLoading = true;
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            this.imageToShow = reader.result;
            this.isImageLoading = false;
        }, false);
        if (image) reader.readAsDataURL(image);
    }

    toggleDrawer() {
        this.productComponent.matDrawer.toggle();
    }

    print(){
       if(this.productComponent.matDrawer.opened){
            
            this.printDrawerOpened = true;
            this.productComponent.matDrawer.close().then(res=>{
                window.print();
                
            })
        }else{
            
            this.printDrawerOpened = false;
               window.print();   
       }
      
       
    }

}
