import { Router, ActivatedRoute } from "@angular/router";
import { Component, NgZone, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, Validators } from "@angular/forms";
import { ProductInventory } from "app/models/productinventory";
import { StoreDetail } from "app/models/storedetail";
import { MatDialog } from "@angular/material/dialog";
import { SearchService } from "app/core/search/search.service";
import { StoreService } from "../../store.service";
import { StoreInventoryService } from "./store.inventory.service";
import { StoreDetailComponent } from "../store-detail.component";
import { SWALMIXIN } from "app/core/services/mixin.service";
import { StoreDataService } from "../store.data.service";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { finalize } from 'rxjs/operators';
import { MatTableDataSource } from "@angular/material/table";


@Component({
  selector: "store-inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: []
})
export class StoreInventoryComponent implements OnInit, OnDestroy {

  collectionSize = 0;

  pageSize: number = 10;
  pageNumber: number = 0;
  displayedColumns: string[] = ['id', 'image', 'name', 'cat', 'size', 'quantity', 'action'];
  dataSource: any;
  errorMsg: any;

  productInventory: Array<ProductInventory>;
  searchForm: UntypedFormGroup;
  inventoryTable: UntypedFormGroup;
  control: UntypedFormArray;
  mode: boolean;
  touchedRows: any;
  selectedStoreId;
  selectedStore: StoreDetail;
  urlPage: number;
  filterInventory = false;
  selectedProduct;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  subscription: Subscription;
  displayedColumns2: string[] = ['iD', 'name', 'id', 'created'];
  dataSource2: any;
  totalAccounts2: any;
  pageSize2: number = 10;
  pageNumber2: number = 0;
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(('matPaginator'), { read: true }) paginator2: MatPaginator;

  constructor(
    private storeInventoryService: StoreInventoryService,
    private storeService: StoreService,
    private searchService: SearchService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private storeComponent: StoreDetailComponent,
    private storeData: StoreDataService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    let storeId = this.router.url.split(['/'][0]);
    this.selectedStoreId = Number(storeId[4]);
    if(this.selectedStoreId) this.getStocks();
    this.subscription = this.storeData.activeStore.subscribe((data: any) => {
      this.selectedStore = data;
    })
    if (!this.selectedStore) this.loadStore();

    this.loadProductInventory();
    this.searchForm = this.formBuilder.group({
      name: [null],
      brand: [null],
      category: [null]
    });

    this.inventoryTable = this.formBuilder.group({
      tableRows: this.formBuilder.array([])
    });
  }

  loadStore() {
    this.isLoading.next(true);
    this.storeService.storeDetail(this.selectedStoreId).subscribe(data => {
      this.isLoading.next(false);
      this.selectedStore = data;
      this.storeData.newStore(this.selectedStore);
    });
  }

  ngAfterOnInit() {
    this.control = this.inventoryTable.get("tableRows") as UntypedFormArray;
  }

  initiateForm(product): UntypedFormGroup {
    return this.formBuilder.group({
      quantity: [product.quantity, Validators.compose([Validators.required])],
      productId: [
        product.product.id,
        Validators.compose([Validators.required])
      ],
      productName: [product.product.name],
      priceId: [product.priceId],
      priceApproved: product.priceApprovedAt,
      stockId: [product.stockId],
      isEditable: [true]
    });
  }

  clearRows() {
    const controls = this.inventoryTable.get("tableRows") as UntypedFormArray;

    while (controls.length !== 0) {
      controls.removeAt(0);
    }
  }

  addRow(product) {
    const control = this.inventoryTable.get("tableRows") as UntypedFormArray;
    control.push(this.initiateForm(product));
  }

  deleteRow(index: number) {
    const control = this.inventoryTable.get("tableRows") as UntypedFormArray;
    control.removeAt(index);
  }

  editRow(group: UntypedFormGroup) {
    group.get("isEditable").setValue(true);
  }

  doneRow(group: UntypedFormGroup) {
    group.get("isEditable").setValue(false);
  }

  filterList(event) {
    this.filterInventory = event.value;
    this.loadProductInventory();
  }

  get getFormControls() {
    const control = this.inventoryTable.get("tableRows") as UntypedFormArray;
    return control;
  }

  submitForm() {
    const control = this.inventoryTable.get("tableRows") as UntypedFormArray;
    this.touchedRows = control.controls
      .filter(row => row.touched)
      .map(row => row.value);

    let payload = control.controls
      .filter(row => row.touched)
      .map(row => ({
        product: { id: row.value.productId },
        quantity: row.value.quantity,
        unitPrice: row.value.unitPrice * 100,
        inventoryMatcher: "product"
      }));

    this.storeInventoryService
      .saveInventory(payload, this.selectedStoreId)
      .subscribe(data => {
        if(data.status != 200) return;
        SWALMIXIN.fire({
          icon: 'success',
          title: 'Your inventory details have been saved.',
        });
        this.loadProductInventory();
      });
  }

  approvedPrice(priceId) {
    this.storeInventoryService.approvePrice(priceId).subscribe(data => {
      if(data.status != 200) return;
      SWALMIXIN.fire({
        icon: 'success',
        title: 'Approved successfully',
      });
      this.loadProductInventory();
    }, error => {
      SWALMIXIN.fire({
        icon: 'error',
        title: error.error.errorMessage,
      });
    });
  }

  unapprovedPrice(priceId) {
    this.storeInventoryService.unapprovedPrice(priceId).subscribe(data => {
      if(data.status != 200) return;
      SWALMIXIN.fire({
        icon: 'success',
        title: 'Unproved successfully',
      });
      this.loadProductInventory();
    }, error => {
      SWALMIXIN.fire({
        icon: 'error',
        title: error.error.errorMessage,
      });
    });
  }

  loadProductInventory() {
    this.isLoading.next(true);
    this.dataSource = new MatTableDataSource();

    this.storeInventoryService
      .getAll(this.selectedStoreId, this.filterInventory, this.pageNumber, this.pageSize)
      .pipe(
        finalize(() => {
            this.isLoading.next(false);
        })
    )
      .subscribe(data => {
        this.dataSource.data = data.data;
        this.dataSource.paginator = this.paginator;
        this.collectionSize = data.totalSize;
      }, error => {
        this.isLoading.next(false);
        this.errorMsg = error.message;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property === "store") {
        //  if (this.form === undefined) {
        //  this.defineForm();
        // }
        if (changes[property].currentValue != null) {
          this.loadProductInventory();
        }
      }
    }
  }

  addProductInventory(modal) {
    this.dialog.open(modal);
  }

  onSearchSubmit() {
    if (this.searchForm.invalid) return;
    const searchPayload = {
      name: this.searchForm.controls.name.value,
      brand: this.searchForm.controls.brand.value,
      category: this.searchForm.controls.category.value
    };

    this.searchService.searchProducts(searchPayload).subscribe(data => {
      if (data.status === 200) {
        this.productInventory = data.body.data.map(s => {
          product: s;
        });
      }
    });
  }

  onShowPopOver(popover, productId, productName) {
    this.selectedProduct = { id: productId, name: productName };
    this.dialog.open(popover, { width: '300px' });
  }

  onShowPricingPopOver(popover, productId) {
    this.selectedProduct = { id: productId };
    this.dialog.open(popover, { width: '500px' });
  }

  toggleDrawer() {
    this.storeComponent.matDrawer.toggle();
  }

  closeModal() {
    this.dialog.closeAll();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  paginate(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProductInventory();
  }

  paginate2(event: PageEvent) {
    this.pageNumber2 = event.pageIndex;
    this.pageSize2 = event.pageSize;
    this.getStocks();
  }

  getStocks() {
    this.isLoading.next(true);
    this.dataSource2 = new MatTableDataSource();
    this.storeService.lowStocks(this.selectedStoreId, this.paginator2 ? this.paginator2.pageIndex : this.pageNumber2, this.paginator2 ? this.paginator2.pageSize : this.pageSize2)
      .subscribe((data: any) => {
        this.dataSource2.data = data.data;
        this.dataSource2.paginator = this.paginator;
        this.totalAccounts2 = data.totalSize;
        this.isLoading.next(false);
      }, error => {
        this.isLoading.next(false);
      })
  }
}
