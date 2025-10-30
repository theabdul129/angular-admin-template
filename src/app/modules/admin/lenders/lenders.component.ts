import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lenders',
  templateUrl: './lenders.component.html',
})
export class LendersComponent implements OnInit {
  title = 'Lenders | bsktpay';
  constructor( private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }

}
