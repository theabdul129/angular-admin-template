import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { BehaviorSubject, Observable, ReplaySubject, Subject } from "rxjs";
import { Location } from "@angular/common";
import { PackageDimension } from "app/models/packagedimension";
import { Product } from "app/models/product";
import { ProductImage } from "app/models/productimage";
import { InventoryService } from "../../inventory.service";
import { MatDialog } from "@angular/material/dialog";
import { SWALMIXIN } from "app/core/services/mixin.service";
import Swal from "sweetalert2";
import { ProductTypeService } from "../../product-type/product-type.service";
import { StoreService } from "app/modules/admin/stores/store.service";
import { ComponentType } from "@angular/cdk/portal";
import { TaxService } from "app/modules/admin/accounting/tax/tax.service";
import { MatSelect } from "@angular/material/select";

@Component({
  selector: "app-save-product",
  templateUrl: "./save-product.component.html",
})
export class SaveProductComponent implements OnInit {
  heading = "Products";
  icon = "pe-7s-display1 icon-gradient bg-premium-dark";
  userForm: UntypedFormGroup;
  gtinForm: UntypedFormGroup;
  tagForm: UntypedFormGroup;
  relatedCategoryForm: UntypedFormGroup;
  mergeProductForm: UntypedFormGroup;
  invalidForm = false;
  productCategories$: Observable<any[]>;
  selectedProduct: Product;
  selectedProductImage: ProductImage;
  selectedPackageDimension: PackageDimension;
  filterArgs = { archived: null };
  //s3ImageHttpUrl = environment.s3ImageHttpUrl;
  bookingPriceForm: UntypedFormGroup;
  showOverlay = false;
  productId: any;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  @ViewChild("multiSelect", { static: true }) multiSelect: MatSelect;
  errorMsg: any;
  dataSource: any;
  formSubmitted: boolean = false;
  productTypes: any;
  stores: any;
  taxes: any;

  public storeFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filterStores = new ReplaySubject();
  currencyList = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "SGD", "CHF", "MYR", "JPY", "CNY"];
  stockControl = [
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
  constructor(private formBuilder: UntypedFormBuilder, private router: Router, private activeRoute: ActivatedRoute, private inventory: InventoryService, private location: Location, public dialog: MatDialog, private productTypeService: ProductTypeService, private storeService: StoreService, private taxService: TaxService) {
    this.userForm = this.formBuilder.group({
      name: [null, Validators.compose([Validators.required])],
      description: [null],
      category: [null, Validators.compose([Validators.required])],
      ageRestriction: false,
      features: null,
      lowerAgeLimit: null,
      tax: [null, Validators.compose([Validators.required])],
      store: null,
      storeCtrl: null,
      storeFilterCtrl: null,
      unitPrice: ["", Validators.compose([Validators.required])],
      currency: ["", Validators.required],
      stockControl: null,
      parentProduct: null,
      productType: null,
      brand: null,
    });
  }

  ngOnInit() {
    this.productId = Number(this.activeRoute.snapshot.paramMap.get("id"));
    if (this.productId) this.loadProduct();
    this.getTypes();
    this.getStores();
    this.gettax();
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
  getTypes() {
    this.productTypeService.productTypes(0, 500).subscribe((data: any) => (this.productTypes = data.data));
  }
  gettax() {
    this.taxService.getAll(0, 500).subscribe((data: any) => {
      this.taxes = data.data;
    });
  }
  loadProduct() {
    this.isLoading.next(true);
    this.inventory.get(this.productId).subscribe((data) => {
      this.isLoading.next(false);
      this.selectedProduct = data;
      this.dataSource = this.selectedProduct.gtins;
      this.userForm.patchValue({
        name: this.selectedProduct.name,
        description: this.selectedProduct.description,
        category: data.category,
        ageRestriction: data.ageRestriction,
        features: data.features,
        lowerAgeLimit: data.lowerAgeLimit,
        tax: data.tax,
        store: data.store,
        storeCtrl: data.storeCtrl,
        currency: data.currency,
        unitPrice: data.unitPrice / 100,
      });
    });
  }
  onSubmit() {
    console.log("this.userForm.invalid",this.userForm);
    this.formSubmitted = true;
    if (this.userForm.invalid) return;
    this.isLoading.next(true);
    const id = this.selectedProduct ? this.selectedProduct.id : 0;
    var registerPayload: Product = {
      id,
      category: this.userForm.controls.category.value,
      name: this.userForm.controls.name.value,
      description: this.userForm.controls.description.value,
      ageRestriction: this.userForm.controls.ageRestriction.value,
      features: this.userForm.controls.features.value,
      lowerAgeLimit: this.userForm.controls.lowerAgeLimit.value,
      currency: this.userForm.controls.currency.value,
      tax: { id: this.userForm.controls.tax.value },
      stockControl: this.userForm.controls.stockControl.value,
      productType: { id: this.userForm.controls.productType.value },
      unitPrice: Number(this.userForm.controls.unitPrice.value) * 100,
      brand: this.userForm.controls.brand.value,
    };

    if (this.userForm.controls.storeCtrl.value) {
      registerPayload.store = { id: this.userForm.controls.storeCtrl.value };
    }

    this.inventory.save(registerPayload, id).subscribe(
      (data) => {
        this.isLoading.next(false);
        if (data.status != 200) return;
        SWALMIXIN.fire({
          icon: "success",
          title: "Your product details have been saved.",
        });
        this.router.navigateByUrl("/admin/products");
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

  openProductPackage(modal: ComponentType<unknown>, dimension: PackageDimension) {
    this.selectedPackageDimension = dimension;
    this.dialog.open(modal, { width: "650px" });
  }

  closeModal() {
    this.dialog.closeAll();
  }

  updateProductPackages() {
    this.inventory.packageDimensions(this.selectedProduct.id).subscribe((data) => {
      this.selectedProduct.packageDimensions = data.data;
    });
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

  openModal(modal: ComponentType<unknown>) {
    this.dialog.open(modal, { width: "600px" });
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
    this.inventory.disableProduct(this.selectedProduct.id).subscribe(
      (data) => {
        this.closeModal();
        if (data.status != 200) return;
        SWALMIXIN.fire({
          icon: "success",
          title: "Hidden successfuly.",
        });
        this.loadProduct();
      },
      (error) => {
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
    this.inventory.mergeProduct(payload, this.selectedProduct.id).subscribe(
      (data) => {
        this.closeModal();
        if (data.status != 200) return;
        SWALMIXIN.fire({
          icon: "success",
          title: "Merged successfuly.",
        });
        this.loadProduct();
      },
      (error) => {
        this.closeModal();
        SWALMIXIN.fire({
          icon: "error",
          title: error.error.errorMessage,
        });
      }
    );
  }

  updateProductImages() {
    this.inventory.productImages(this.selectedProduct.id).subscribe(
      (data: any) => {
        if (data.status != 200) return;
        SWALMIXIN.fire({
          icon: "success",
          title: "Updated successfuly.",
        });
        this.selectedProduct.productImages = data.data;
      },
      (error) => {
        SWALMIXIN.fire({
          icon: "error",
          title: error.error.errorMessage,
        });
      }
    );
  }

  openProductImage(modal: ComponentType<unknown>, selectedProductImage: ProductImage) {
    if (!selectedProductImage == undefined) {
      this.selectedProductImage = selectedProductImage;
      this.dialog.open(modal, { width: "500px" });
    }
  }
}
