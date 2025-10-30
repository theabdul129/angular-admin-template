import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-payments',
    templateUrl: './finance.component.html',
})
export class financeComponent implements OnInit {
    title = 'Finance | bsktpay';
    constructor(private titleService: Title) {}

    ngOnInit(): void {
        this.titleService.setTitle(this.title);
    }
}
