import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { BehaviorSubject, Observable } from "rxjs";
import { ProductGroupService } from "../product-group.service";


@Component({
  selector: "app-grouplist",
  templateUrl: "./group-list.component.html"
})
export class GroupListComponent implements OnInit {

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
    private groupService: ProductGroupService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.next(true);
    this.dataSource = new MatTableDataSource();
    this.groupService.getAll(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize).subscribe(data => {
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
