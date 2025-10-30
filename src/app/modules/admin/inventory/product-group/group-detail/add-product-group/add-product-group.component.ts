import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { SWALMIXIN } from "app/core/services/mixin.service";
import { ProductGroup } from "app/models/productgroup";
import { ProductGroupService } from "../../product-group.service";

@Component({
  selector: "app-add-product-group",
  templateUrl: "./add-product-group.component.html",
  styleUrls: []
})
export class AddProductToGroupComponent implements OnInit {

  @Input() productGroup: ProductGroup;
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  productInventoryForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private productGroupService: ProductGroupService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    if (this.productInventoryForm == undefined) {
      this.defineForm();
    }
  }

  defineForm() {
    this.productInventoryForm = this.formBuilder.group({
      productId: [null, Validators.compose([Validators.required])]
    });
  }

  onSubmit() {
    if (this.productInventoryForm.invalid) return;
    const payload = {
      id: this.productInventoryForm.value.productId.id
    };
    this.productGroupService
      .addProduct(payload, this.productGroup.id)
      .subscribe(data => {
        if(data.status != 200) return;
        SWALMIXIN.fire({
          icon: 'success',
          title: 'Your product details have been saved.',
        });
        this.dialog.closeAll();
        this.onSave.emit();
      }, error => {
        SWALMIXIN.fire({
          icon: 'error',
          title: error.error.errorMessage,
        });
      });
  }

}
