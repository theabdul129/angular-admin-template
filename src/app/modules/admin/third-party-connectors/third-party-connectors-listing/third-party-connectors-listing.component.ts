import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-third-party-connectors-listing',
    templateUrl: './third-party-connectors-listing.component.html',
    styleUrls: ['./third-party-connectors-listing.component.scss'],
})
export class ThirdPartyConnectorsListingComponent implements OnInit {
    reaInitialize: boolean = false;
    pageTitle: string = undefined;
    connector: 'google-analytics' | 'mail-chimp' |'google-drive' |'Fb-Google-Ad'= undefined;
    sourceType: string;

    connectorsList = [
        {
            label: 'Google analytics',
            imageUrl: 'assets/images/google-analytics.png',
            formEnv: 'google-analytics',
            sourceName:'Google analytics',
            description:'certified'
        },
        {
            label: 'Google AdWords',
            imageUrl: 'assets/images/google-ads-logo.svg',
            formEnv: 'Fb-Google-Ad',
            sourceName:'Google AdWords',
            description:'certified'
        },
        {
            label: 'Facebook advertising',
            imageUrl: 'assets/images/facebook-round-color-icon.webp',
            formEnv: 'Fb-Google-Ad',
            sourceName:'Facebook advertising',
            description:'certified'
        },
        {
            label: 'Orders',
            imageUrl: 'assets/images/order_icon.jpeg',
            formEnv: 'google-drive',
            sourceName:'Orders',
            description:'certified'
        },
        {
            label: 'Customers Leads',
            imageUrl: 'assets/images/order_icon.jpeg',
            formEnv: 'google-drive',
            // sourceName:'Customers Leads',
            sourceName:'customer_leads',
            description:'certified'
        },
        {
            label: 'Web Inquiry',
            imageUrl: 'assets/images/order_icon.jpeg',
            formEnv: 'google-drive',
            sourceName:'Web Inquiry',
            description:'certified'
        },
        {
            label: 'Financial renew information',
            imageUrl: 'assets/images/order_icon.jpeg',
            formEnv: 'google-drive',
            sourceName:'Financial renew information',
            description:'certified'
        },
        {
            label: 'Finance quotation',
            imageUrl: 'assets/images/order_icon.jpeg',
            formEnv: 'google-drive',
            sourceName:'Finance quotation',
            description:'certified'
        },
        {
            label: 'Service booking',
            imageUrl: 'assets/images/order_icon.jpeg',
            formEnv: 'google-drive',
            sourceName:'Service booking',
            description:'certified'
        },
        {
            label: 'Stock',
            imageUrl: 'assets/images/order_icon.jpeg',
            formEnv: 'google-drive',
            sourceName:'Stock',
            description:'certified'
        },
        {
            label: 'Customers',
            imageUrl: 'assets/images/order_icon.jpeg',
            formEnv: 'google-drive',
            sourceName:'Customers',
            description:'certified'
        },
    ];

    constructor(private router: Router) {}
    ngOnInit(): void {}

    goToForm(env: 'google-analytics' | 'mail-chimp'|'google-drive' |'Fb-Google-Ad',page:string='', sourceType: string = '') {
        this.reaInitialize = false;
        if(!env) return;
        if (env == 'google-analytics') {
            this.connector = 'google-analytics';
            this.pageTitle = 'Connect to Google Analytics';
            this.reaInitialize = true;
        } else if (env == 'mail-chimp') {
            this.connector = 'mail-chimp';
            this.pageTitle = 'Connect to Mailchimp';
            this.reaInitialize = true;
        }else if (env=='google-drive'){
          this.connector=env;
          this.pageTitle=`Connect to ${page}`;
          this.reaInitialize=true;
          this.sourceType = sourceType;
        }else if (env=='Fb-Google-Ad'){
          this.connector=env;
          this.pageTitle=`Connect to ${page}`;
          this.reaInitialize=true;
          this.sourceType = sourceType;
        }
    }

    cancel() {
        this.reaInitialize = false;
    }
}
