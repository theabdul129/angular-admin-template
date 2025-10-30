import { Location } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductGroupService } from '../../product-group.service';
import { ProductGroupDetailComponent } from '../group-detail.component';

@Component({
    selector: 'group-products',
    templateUrl: './products.component.html'
})
export class GroupProductsComponent implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    userForm: UntypedFormGroup;
    selectedProductGroup: any;
    groupId: any;
    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'image', 'name', 'cat', 'size', 'status'];
    totalAccounts: any;
    dataSource: any;
    errorMsg: any;

    constructor(
        private groupComponent: ProductGroupDetailComponent,
        private ngZone: NgZone,
        private productGroupService: ProductGroupService,
        private router: Router,
        private dialog: MatDialog,
        private location: Location
    ) {

    }

    ngOnInit() {
        let id = this.router.url.split(['/'][0]);
        this.groupId = Number(id[3]);
        if(this.groupId) this.loadProductGroup();
        else this.location.back();
    }

    loadProductGroup() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.productGroupService.get(this.groupId).subscribe(data => {
            this.ngZone.run(() => {
                this.isLoading.next(false);
                this.selectedProductGroup = data;
                this.dataSource.data = data.products?.data;
            });            
        });
    }


    addProductToGroup(modal) {
        this.dialog.open(modal, { width: '550px' });
    }

    closeModal() {
        this.dialog.closeAll();
    }

    toggleDrawer() {
        this.groupComponent.matDrawer.toggle();
    }
}