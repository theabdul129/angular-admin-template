import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { PackageDimension } from 'app/models/packagedimension';
import { Product } from 'app/models/product';
import Swal from 'sweetalert2';
import { InventoryService } from '../../inventory.service';

@Component({
  selector: 'app-save-product-package',
  templateUrl: './save-product-package.component.html'
})
export class SaveProductPackageComponent implements OnInit {

  @Input() packageDimension: PackageDimension;
  @Input() product: Product;
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  form: UntypedFormGroup;
  isLoading: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private inventory: InventoryService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    if (this.form == undefined) this.defineForm();
  }

  defineForm() {
    this.form = this.formBuilder.group({
      id: [null],
      height: [null, Validators.compose([Validators.required])],
      length: [null, Validators.compose([Validators.required])],
      width: [null, Validators.compose([Validators.required])],
      dimensionUom: [null, Validators.compose([Validators.required])],
      weight: [null, Validators.compose([Validators.required])],
      weightUom: [null, Validators.compose([Validators.required])]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property === 'packageDimension') {
        if (this.form == undefined) {
          this.defineForm();
        }
        if (changes[property].currentValue != null) {
          this.form.patchValue({
            id: changes[property].currentValue.id,
            height: changes[property].currentValue.height,
            length: changes[property].currentValue.length,
            width: changes[property].currentValue.width,
            dimensionUom: changes[property].currentValue.dimensionUom,
            weight: changes[property].currentValue.weight,
            weightUom: changes[property].currentValue.weightUom
          });
        }
      }
    }
  }

  onArchive() {
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
        this.inventory
          .archivePackageDimension(this.packageDimension.id)
          .subscribe(data => {
            if(data.status != 200) return;
            SWALMIXIN.fire({
              icon: 'success',
              title: 'Archived successfuly.',
            });
            if (data.status === 200) this.onSave.emit();
          }, error => {
            SWALMIXIN.fire({
              icon: 'error',
              title: error.error.errorMessage,
            });
          });
      }
    });
  }

  onSubmit() {
    this.isLoading = true;
    const payload: PackageDimension = {
      id: this.form.controls.id.value != null ? this.form.controls.id.value : 0,
      height: this.form.controls.height.value,
      width: this.form.controls.width.value,
      length: this.form.controls.length.value,
      dimensionUom: this.form.controls.dimensionUom.value,
      weight: this.form.controls.weight.value,
      weightUom: this.form.controls.weightUom.value,
      volume:
        this.form.controls.height.value *
        this.form.controls.width.value *
        this.form.controls.length.value,
      volumeUom: this.form.controls.dimensionUom.value
    };

    this.inventory
      .savePackageDimension(payload, payload.id, this.product.id)
      .subscribe(data => {
        this.isLoading = false;
        if(data.status != 200) return;
        SWALMIXIN.fire({
          icon: 'success',
          title: 'Your package details have been saved.',
        });
          this.dialog.closeAll();
          this.onSave.emit();
          this.packageDimension = {
            id: data.body.id,
            height: data.body.height,
            width: data.body.width,
            length: data.body.length,
            dimensionUom: data.body.dimensionUom,
            weight: data.body.weight,
            weightUom: data.body.weightUom,
            volume: data.body.volume,
            volumeUom: data.body.volumeUom
          };
      }, error => {
        this.isLoading = false;
        SWALMIXIN.fire({
          icon: 'error',
          title: error.error.errorMessage,
        });
      });
  }

}
