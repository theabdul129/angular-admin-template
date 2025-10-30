import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthState } from '@auth0/auth0-angular';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    title = 'Sign in | bsktpay';
    /**
     * Constructor
     */
    constructor(private titleService: Title, private authState: AuthState)
    {
        this.titleService.setTitle(this.title);
    }


    ngOnInit(): void {

        this.authState.user$.subscribe(user => {
            if (user) {
                const userId = user?.sub
                if (userId) {                    
                    window.dataLayer = window.dataLayer || []
                    window.dataLayer.push({
                        user_id: userId
                      })
                }
            }
        })
    }
    
}
