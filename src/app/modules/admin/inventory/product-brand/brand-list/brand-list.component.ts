import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { SWALMIXIN } from "app/core/services/mixin.service";
import { BehaviorSubject, Observable } from "rxjs";
import Swal from "sweetalert2";
import { ProductBrandService } from "../product-brand.service";


@Component({
  selector: "app-brandlist",
  templateUrl: "./brand-list.component.html"
})
export class BrandListComponent implements OnInit {

  productName: UntypedFormControl = new UntypedFormControl();
  brand: UntypedFormControl = new UntypedFormControl();
  pageSize: number = 10;
  pageNumber: number = 0;
  displayedColumns: string[] = ['id', 'name', 'status', 'action'];
  dataSource: any;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  errorMsg: any;
  totalAccounts: any;

  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

  constructor(
    private brandService: ProductBrandService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.next(true);
    this.dataSource = new MatTableDataSource();
    this.brandService.getAll(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize).subscribe(data => {
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
    this.loadData();
  }

  removeItem(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading.next(true);
        this.brandService
          .delete(id).subscribe(data => {
            if (data.status != 200) return;
            this.isLoading.next(false);
            SWALMIXIN.fire({
              icon: 'success',
              title: 'Removed successfuly.',
            });
            this.loadData();
          }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
              icon: 'error',
              title: error.error.errorMessage,
            });
          });
      }
    });
  }
}
