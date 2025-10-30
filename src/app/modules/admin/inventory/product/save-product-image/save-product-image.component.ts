import {
    Component,
    OnInit,
    Input,
    Output,
    SimpleChanges,
    EventEmitter,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { Product } from 'app/models/product';
import { ProductImage } from 'app/models/productimage';
import { InventoryService } from '../../inventory.service';

@Component({
    selector: 'app-save-product-image',
    templateUrl: './save-product-image.component.html',
})
export class SaveProductImageComponent implements OnInit {
    @Input() productImage: ProductImage;
    @Input() product: Product;
    @Output() onSave: EventEmitter<any> = new EventEmitter();
    contentType = "product"

    form: UntypedFormGroup;
    formSubmitted: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inventory: InventoryService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        if (this.form == undefined) {
            this.defineForm();
        }
    }

    defineForm() {
        this.form = this.formBuilder.group({
            id: [null],
            url: [''],
            publicUrl: [''],
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const property in changes) {
            if (property === 'productImage') {
                if (this.form == undefined) {
                    this.defineForm();
                }
                if (changes[property].currentValue != null) {
                    this.form.patchValue({
                        id: changes[property].currentValue.id,
                        url: changes[property].currentValue.url,
                        publicUrl: changes[property].currentValue.publicUrl,
                    });
                }
            }
        }
    }

    onArchive() {
        this.inventory.archiveProductImage(this.productImage.id).subscribe(
            (data) => {
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Archived successfuly.',
                });
                this.dialog.closeAll();
                this.onSave.emit();
            },
            (error) => {
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
            }
        );
    }

    onImageUpload(fileName) {
        this.form.patchValue({
            publicUrl: fileName,
        });
        this.onSubmit();
    }



    onSubmit() {
        this.formSubmitted = true;
        if (this.form.invalid) return;
        const payload = {
            id:
                this.form.controls.id.value != null
                    ? this.form.controls.id.value
                    : 0,
            url: this.form.controls.url.value ? this.form.controls.url.value : this.form.controls.publicUrl.value,
            publicUrl: this.form.controls.publicUrl.value,
        };
        if (payload.id == 0) this.addImage(payload);
        else this.updateImage(payload);

    }

    addImage(payload) {
        this.inventory
            .addProductImage(payload, payload.id, this.product.id)
            .subscribe(
                (data) => {
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your product details have been saved.',
                    });
                    this.dialog.closeAll();
                    this.onSave.emit();
                    this.formSubmitted = false;
                    this.productImage = {
                        id: data.body.id,
                        url: data.body.url,
                        publicUrl: data.body.publicUrl,
                    };
                },
                (error) => {
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                }
            );
    }

    updateImage(payload) {
        this.inventory
            .updateProductImage(payload, payload.id, this.product.id)
            .subscribe(
                (data) => {
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your product details have been saved.',
                    });
                    this.dialog.closeAll();
                    this.onSave.emit();
                    this.formSubmitted = false;
                    this.productImage = {
                        id: data.body.id,
                        url: data.body.url,
                        publicUrl: data.body.publicUrl,
                    };
                },
                (error) => {
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                }
            );
    }
}
