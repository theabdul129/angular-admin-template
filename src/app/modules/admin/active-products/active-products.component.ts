import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from 'app/models/product';
import { BehaviorSubject, Observable } from 'rxjs';
import { InventoryService } from '../inventory/inventory.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-active-products',
  templateUrl: './active-products.component.html',
  styleUrls: ['./active-products.component.scss']
})
export class ActiveProductsComponent implements OnInit {
  products: Array<Product>;

  pageSize: number = 10;
  pageNumber: number = 0;
  totalProducts: number =0;
  displayedColumns: string[] = ['id', 'image', 'name', 'cat', 'size'];
  dataSource: any;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  errorMsg: any;
  
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
    this.inventory.getAllActive(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize).subscribe(data => {
      this.dataSource.data = data.data;
      this.dataSource.paginator = this.paginator;
      this.totalProducts = data.totalSize;
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
