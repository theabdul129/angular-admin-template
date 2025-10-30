import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-',
    templateUrl: './documentation.component.html'
})

export class DocumentationComponent implements OnInit {
    title = 'Documentation | bsktpay';
    constructor( private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }
}