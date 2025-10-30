import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { InventoryService } from '../../../inventory.service';

@Component({
  selector: 'app-save-child-product-category',
  templateUrl: './save-child-product-category.component.html',
})
export class SaveChildProductCategoryComponent implements OnInit {

  @Input() productCategory: any;
  @Input() parentProductCategoryId: any;
  @Output() onSave: EventEmitter<any> = new EventEmitter();
  productCategoryForm: UntypedFormGroup;
  formSubmitted: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private productService: InventoryService
  ) { }

  ngOnInit() {
    if (this.productCategoryForm == undefined) {
      this.defineForm();
    }
  }

  defineForm() {
    this.productCategoryForm = this.formBuilder.group({
      id: [
        null
      ],
      name: [
        '',
        Validators.compose([Validators.required])
      ],
      description: [
        null
      ]
    });
  }


  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property === 'productCategory') {
        if (this.productCategoryForm == undefined) {
          this.defineForm();
        }
        if (changes[property].currentValue != null) {
          this.productCategoryForm.patchValue({
            id: changes[property].currentValue.id,
            name: changes[property].currentValue.name,
            description: changes[property].currentValue.description
          });

        }
      }
    }
  }

  onArchive() {
    this.productService
      .archiveProductCategory(this.productCategory.id)
      .subscribe(data => {
        if(data.status != 200) return;
        SWALMIXIN.fire({
          icon: 'success',
          title: 'Archived successfuly.',
        });
        this.onSave.emit();
      }, error => {
        SWALMIXIN.fire({
          icon: 'error',
          title: error.error.errorMessage,
        });
      });
  }


  onSubmit() {
    this.formSubmitted = true;
    if (this.productCategoryForm.invalid) return;
    const payload = {
      id: this.productCategoryForm.controls.id.value != null ? this.productCategoryForm.controls.id.value : 0,
      name: this.productCategoryForm.controls.name.value,
      description: this.productCategoryForm.controls.description.value,
      parentProductCategory: { id: this.parentProductCategoryId }
    };
    this.productService
      .saveProductCategory(payload, payload.id)
      .subscribe(data => {
        if(data.status != 200) return;
        SWALMIXIN.fire({
          icon: 'success',
          title: 'Your category details have been saved.',
        });
          this.onSave.emit();
          this.productCategory = {
            id: data.body.id,
            name: data.body.name,
            description: data.body.description
          };
          this.formSubmitted = false;
      }, error => {
        SWALMIXIN.fire({
          icon: 'error',
          title: error.error.errorMessage,
        });
      });
  }

}
