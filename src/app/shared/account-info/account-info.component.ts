import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "account-info",
    templateUrl: "./account-info.component.html"
})
export class AccountInformationComponent implements OnInit {

    @Input() data: any;
    @Input() title: any;
    @Input() link: any;

    ngOnInit() { }
}
