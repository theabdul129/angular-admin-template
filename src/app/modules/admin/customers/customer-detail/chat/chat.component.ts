import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { CustomerDetailComponent } from '../customer-detail.component';
import { NgIf } from '@angular/common';

@Component({
    selector       : 'chat',
    templateUrl    : './chat.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [NgIf,RouterOutlet,MatIconModule],
    styleUrls:['./chat.component.scss']
})
export class ChatComponent implements OnInit
{
    innerWidth:number=window.innerWidth;
    /**
     * Constructor
     */
    constructor(private customerComponent: CustomerDetailComponent)
    {
    }

    ngOnInit(): void {
        if(this.innerWidth<769)this.toggleDrawer();
    }


  toggleDrawer() {
    this.customerComponent.matDrawer.toggle();
  }

    
}
