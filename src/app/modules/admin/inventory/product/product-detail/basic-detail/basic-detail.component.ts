import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { SWALMIXIN } from "app/core/services/mixin.service";
import { ProductDetailComponent } from "../product-detail.component";
import { InventoryService } from "../../../inventory.service";
import { Product } from "app/models/product";
import Swal from "sweetalert2";
import { Location } from "@angular/common";
import { BehaviorSubject, Observable, ReplaySubject, Subject } from "rxjs";
import { ProductTypeService } from "../../../product-type/product-type.service";
import { TaxService } from "app/modules/admin/accounting/tax/tax.service";
import { StoreService } from "app/modules/admin/stores/store.service";
import { MatSelect } from "@angular/material/select";

@Component({
  selector: "basic-productDetail",
  templateUrl: "./basic-detail.component.html",
})
export class ProductBasicDetailComponent implements OnInit {
  userForm: UntypedFormGroup;

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  @ViewChild("multiSelect", { static: true }) multiSelect: MatSelect;
  panelOpenState = false;
  productId: any;
  selectedProduct: Product;
  mergeProductForm: UntypedFormGroup;
  formSubmitted: boolean = false;
  productTypes: any;
  taxes: any;
  stores: any;

  public storeFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filterStores = new ReplaySubject();
  currencyList = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "SGD", "CHF", "MYR", "JPY", "CNY"];
  stockControlList = [
    {
      name: "none",
      label: "None",
    },
    {
      name: "purchaseOnce",
      label: "Purchase Once",
    },
    {
      name: "multiPurchase",
      label: "Multi Purchase",
    },
  ];
  constructor(private formBuilder: UntypedFormBuilder, private route: Router, private inventory: InventoryService, public dialog: MatDialog, private productComponent: ProductDetailComponent, private location: Location, private productTypeService: ProductTypeService, private storeService: StoreService, private taxService: TaxService) {
    this.userForm = this.formBuilder.group({
      name: [null, Validators.compose([Validators.required])],
      description: [null],
      productCategory: [null, Validators.compose([Validators.required])],
      ageRestriction: false,
      inStock: false,
      features: null,
      tax: [null, Validators.compose([Validators.required])],
      unitPrice: ["", Validators.compose([Validators.required])],
      currency: ["", Validators.required],
      stockControl: null,
      storeCtrl: null,
      store: null,
      storeFilterCtrl: null,
      lowerAgeLimit: null,
      parentProduct: null,
      productType: null,
      brand: null,
    });
    this.mergeProductForm = this.formBuilder.group({
      productId: [null, Validators.compose([Validators.required])],
    });
  }
  ngOnInit() {
    if (window.innerWidth < 769) this.toggleDrawer();
    let id = this.route.url.split(["/"][0]);
    this.productId = Number(id[4]);
    if (this.productId) this.loadProduct();
    else this.location.back();
    this.getTypes();
    this.gettax();
    this.getStores();
  }

  getTypes() {
    this.productTypeService.productTypes(0, 500).subscribe((data: any) => (this.productTypes = data.data));
  }
  gettax() {
    this.taxService.getAll(0, 500).subscribe((data: any) => {
      this.taxes = data.data;
    });
  }
  getStores() {
    this.isLoading.next(true);
    this.storeService.getStores(0, 500).subscribe((data: any) => {
      this.isLoading.next(false);
      this.stores = data.data;
      this.filterStores.next(this.stores.slice());
    });
    this.userForm.controls.storeFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterData(this.stores, this.filterStores, this.userForm.controls.storeFilterCtrl.value);
    });
  }
  _onDestroy = new Subject();

  filterData(data, filterData, searchVal) {
    if (!data) return;
    let search = searchVal;
    if (!search) {
      filterData.next(data.slice());
      return;
    } else search = search.toLowerCase();
    filterData.next(data.filter((item) => item.name.toLowerCase().indexOf(search) > -1));
  }
  loadProduct() {
    this.isLoading.next(true);
    this.inventory.get(this.productId).subscribe((data) => {
      this.isLoading.next(false);
      this.selectedProduct = data;
      this.userForm.patchValue({
        name: this.selectedProduct.name,
        description: this.selectedProduct.description,
        productCategory: data.category,
        ageRestriction: data.ageRestriction,
        features: data.features,
        tax: data.tax?.id,
        storeCtrl: data?.store?.id,
        store: data.store?.id,
        currency: data.currency,
        stockControl: data.stockControl,
        unitPrice: data.unitPrice / 100,
        lowerAgeLimit: data.lowerAgeLimit,
        productType: data.productType?.id,
        brand: data.brand,
        inStock: data.inStock,
      });
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.userForm.invalid) return;

    console.log("con", this.userForm.controls.stockControl);
    this.isLoading.next(true);
    const id = this.selectedProduct ? this.selectedProduct.id : 0;
    var registerPayload: Product = {
      id,
      category: this.userForm.controls.productCategory.value,
      name: this.userForm.controls.name.value,
      description: this.userForm.controls.description.value,
      ageRestriction: this.userForm.controls.ageRestriction.value,
      features: this.userForm.controls.features.value,
      currency: this.userForm.controls.currency.value,
      tax: { id: this.userForm.controls.tax.value },
      stockControl: this.userForm.controls.stockControl.value,

      lowerAgeLimit: this.userForm.controls.lowerAgeLimit.value,
      productType: { id: this.userForm.controls.productType.value },
      unitPrice: Number(this.userForm.controls.unitPrice.value) * 100,
      brand: this.userForm.controls.brand.value,
      inStock: this.userForm.controls.inStock.value,
    };

    if (this.userForm.controls.storeCtrl.value) {
      registerPayload.store = { id: this.userForm.controls.storeCtrl.value};
    }

    this.inventory.save(registerPayload, id).subscribe(
      (data) => {
        this.isLoading.next(false);
        if (data.status != 200) return;
        SWALMIXIN.fire({
          icon: "success",
          title: "Your product details have been saved.",
        });
        id == 0 ? this.route.navigate(["/admin/products/", data.body.id]) : this.loadProduct();
      },
      (error) => {
        this.isLoading.next(false);
        SWALMIXIN.fire({
          icon: "error",
          title: error.error.errorMessage,
        });
      }
    );
  }

  toggleDrawer() {
    this.productComponent.matDrawer.toggle();
  }

  openModal(modal) {
    this.dialog.open(modal, { width: "600px" });
  }

  closeModal() {
    this.dialog.closeAll();
  }

  archiveProduct() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading.next(true);
        this.inventory.archive(this.selectedProduct.id).subscribe(
          (data) => {
            this.closeModal();
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
              icon: "success",
              title: "Archived successfuly.",
            });
            this.location.back();
          },
          (error) => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
              icon: "error",
              title: error.error.errorMessage,
            });
          }
        );
      }
    });
  }

  liveProduct() {
    this.isLoading.next(true);
    this.inventory.approveProduct(this.selectedProduct.id).subscribe(
      (data) => {
        this.isLoading.next(false);
        this.closeModal();
        if (data.status != 200) return;
        SWALMIXIN.fire({
          icon: "success",
          title: "Lived successfuly.",
        });
        this.loadProduct();
      },
      (error) => {
        this.isLoading.next(false);
        this.closeModal();
        SWALMIXIN.fire({
          icon: "error",
          title: error.error.errorMessage,
        });
      }
    );
  }

  hideProduct() {
    this.isLoading.next(true);
    this.inventory.disableProduct(this.selectedProduct.id).subscribe(
      (data) => {
        this.closeModal();
        this.isLoading.next(false);
        if (data.status != 200) return;
        SWALMIXIN.fire({
          icon: "success",
          title: "Hidden successfuly.",
        });
        this.loadProduct();
      },
      (error) => {
        this.isLoading.next(false);
        this.closeModal();
        SWALMIXIN.fire({
          icon: "error",
          title: error.error.errorMessage,
        });
      }
    );
  }

  onMergeProductSubmit() {
    const payload = {
      id: this.mergeProductForm.controls.productId.value,
    };
    this.isLoading.next(false);
    this.inventory.mergeProduct(payload, this.selectedProduct.id).subscribe(
      (data) => {
        this.closeModal();
        this.isLoading.next(false);
        if (data.status != 200) return;
        SWALMIXIN.fire({
          icon: "success",
          title: "Merged successfuly.",
        });
        this.loadProduct();
      },
      (error) => {
        this.isLoading.next(false);
        this.closeModal();
        SWALMIXIN.fire({
          icon: "error",
          title: error.error.errorMessage,
        });
      }
    );
  }
}
