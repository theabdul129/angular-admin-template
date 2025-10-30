import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ProductCategoryService } from "../category.service";
import { BehaviorSubject, Observable } from 'rxjs';


@Component({
  selector: "app-categorylist",
  templateUrl: "./category-list.component.html"
})
export class CategoryListComponent implements OnInit {

  productName: UntypedFormControl = new UntypedFormControl();
  brand: UntypedFormControl = new UntypedFormControl();
  pageSize: number = 10;
  pageNumber: number = 0;
  displayedColumns: string[] = ['id', 'image', 'name', 'cat', 'status', 'action'];
  dataSource: any;

  errorMsg: any;
  totalAccounts: any;

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();

  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

  constructor(
    private categoryService: ProductCategoryService
  ) { }

  ngOnInit() { 
    this.loadData();
  }

  loadData() {
    this.isLoading.next(true);
    this.dataSource = new MatTableDataSource();
    this.categoryService.getAll(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
    
    .subscribe(data => {
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
}
