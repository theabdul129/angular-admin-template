import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import { CatchmentProductInformation } from "app/models/catchmentproductinformation";
import { InventoryService } from "../../../inventory.service";

@Component({
  selector: 'app-view-catchment-product-information',
  templateUrl: './view-catchment-product-information.component.html',

})
export class ViewCatchmentProductInformationComponent implements OnInit {

  @Input() product;
  @Input() catchmentArea;
  selectedProduct: CatchmentProductInformation;
  constructor(private inventory: InventoryService) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property === "product" || property === "catchmentArea" && this.product && this.catchmentArea) {
        this.inventory.getCatchmentInfo(this.product.id, this.catchmentArea.id).subscribe(data => {
          this.selectedProduct = data;
        });
      }
    }
  }

}
