import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormControl} from "@angular/forms";
import { Product } from "app/models/product";
import { InventoryService } from "../../inventory.service";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { BehaviorSubject, Observable } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";


@Component({
  selector: "app-list-product",
  templateUrl: "./list-product.component.html"
})
export class ListProductComponent implements OnInit {

  products: Array<Product>;
  productName: UntypedFormControl = new UntypedFormControl();
  brand: UntypedFormControl = new UntypedFormControl();
  category: UntypedFormControl = new UntypedFormControl();
  barcode: UntypedFormControl = new UntypedFormControl();
  pageSize: number = 10;
  pageNumber: number = 0;
  displayedColumns: string[] = ['id', 'image', 'name', 'cat', 'size', 'status', 'action'];
  dataSource: any;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  errorMsg: any;
  totalAccounts: any;

  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

  constructor(
    private inventory: InventoryService
  ) { }

  ngOnInit() { 
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.next(true);
    this.dataSource = new MatTableDataSource();
    this.inventory.getAll(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize).subscribe(data => {
      this.dataSource.data = data.data;
      this.dataSource.paginator = this.paginator;
      this.totalAccounts = data.totalSize;
      this.isLoading.next(false);
    }, error => {
      this.isLoading.next(false);
      this.errorMsg = error.message;
    })
  }

  paginate(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }
}
