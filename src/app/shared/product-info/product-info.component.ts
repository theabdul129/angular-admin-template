import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "product-info",
    templateUrl: "./product-info.component.html"
})
export class ProductInformationComponent implements OnInit {

    @Input() data: any;
    ngOnInit() { }
}
