import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
} from "@angular/core";
import { Product } from "app/models/product";
import { InventoryService } from "app/modules/admin/inventory/inventory.service";

@Component({
  selector: "app-view-product",
  templateUrl: "./view-product.component.html"
})
export class ViewProductComponent implements OnInit {
  @Input() product;
  selectedProduct: Product;

  constructor(private productService: InventoryService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property === "product") {
        this.productService.get(this.product.id).subscribe(data => {
          this.selectedProduct = data;
        });
      }
    }
  }
}
