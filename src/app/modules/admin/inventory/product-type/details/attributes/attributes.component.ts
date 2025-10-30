import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { ProductTypeService } from "../../product-type.service";
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { ProductTypeDetailComponent } from "../details.component";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: 'productTypeAttributes',
    templateUrl: './attributes.component.html'
})
export class ProductTypeAttributesComponent implements OnInit {

    selectedType: any;
    form: UntypedFormGroup;
    productId;
    isEdit: boolean;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    private productComponent: ProductTypeDetailComponent;
    errorMsg: any;
    displayedColumns: string[] = ['sr', 'name', 'type', 'action'];
    dataSource: any;
    totalAccounts: any;
    pageSize: number = 10;
    pageNumber: number = 0;
    attributes: any;
    attribute = new UntypedFormControl();

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
    constructor(
        private productTypeService: ProductTypeService,
        private formBuilder: UntypedFormBuilder,
        private route: Router,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.productId = Number(id[4]);
        this.loadData();
        this.getAttributes();
    }

    getAttributes() {
        this.productTypeService.allProductAttributes(0, 500).subscribe(data => this.attributes = data.data);
    }

    loadData() {
        this.dataSource = new MatTableDataSource();
        this.productTypeService.getProductType(this.productId).subscribe((data: any) => {
            this.dataSource.data = data.attributes;
            this.attribute.setValue(data.attributes.map((item)=>item.id));
        })
    }

    toggleDrawer() {
        this.productComponent.matDrawer.toggle();
    }

    onSubmit() {
        this.saveData();
    }

    saveData() {
        this.isLoading.next(true);
        let payload = [];
        this.attribute.value.map((el:any)=> {
            payload.push({ id: el});
        })
        this.productTypeService
            .createAttribute(payload, this.productId)
            .subscribe(data => {
                this.isLoading.next(false);
                this.closeModal();
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Your attribute details have been saved.',
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

    closeModal() {
        this.dialog.closeAll();
    }

    openType(modal, data) {
        this.selectedType = data;
        this.dialog.open(modal, { width: '350px' });
    }
}