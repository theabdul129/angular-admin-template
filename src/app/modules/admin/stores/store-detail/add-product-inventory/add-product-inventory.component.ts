import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ProductInventory } from "app/models/productinventory";
import { StoreInventoryService } from "../inventory/store.inventory.service";


@Component({
  selector: "app-add-product-inventory",
  templateUrl: "./add-product-inventory.component.html",
  styleUrls: []
})
export class AddProductInventoryComponent implements OnInit {
  @Input() storeId;
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  productInventoryForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private storeInventoryService: StoreInventoryService
  ) { }

  ngOnInit() {
    if (this.productInventoryForm == undefined) {
      this.defineForm();
    }
  }

  defineForm() {
    this.productInventoryForm = this.formBuilder.group({
      quantity: [null, Validators.compose([Validators.required])],
      gtin: [null, Validators.compose([Validators.required])]
    });
  }

  onSubmit() {
    if (this.productInventoryForm.invalid) {
      return;
    }

    const payload: ProductInventory = {

      quantity: this.productInventoryForm.controls.quantity.value,
      product: { gtins: [this.productInventoryForm.controls.gtin.value] },
      unitPrice: 10,
      inventoryMatcher: "gtin"
    };

    this.storeInventoryService
      .addProduct(payload, this.storeId)
      .subscribe(data => {
        if (data.status === 200) {
          this.onSave.emit();
        }
      });
  }

}
