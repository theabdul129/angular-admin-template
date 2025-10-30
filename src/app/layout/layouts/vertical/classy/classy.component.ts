import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { User } from 'app/core/user/user.types';
import { CoreUserService } from 'app/core/user/user.service';
import { AuthService, AuthState } from '@auth0/auth0-angular';
import { UserService } from 'app/modules/admin/users/user.service';
import { environment } from 'environments/environment';

@Component({
    selector     : 'classy-layout',
    templateUrl  : './classy.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ClassyLayoutComponent implements OnInit, OnDestroy
{
    isScreenSmall: boolean;
    navigation: Navigation;
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    userData: any;

    subscriberId:string;
    applicationIdentifier = environment.applicationIdentifier;
    styles = {
        bellButton: {
          root: {
            svg: {
              color: '#6c798e',
              width: '45px',
              height: '40px',
              fill: 'black',
            },
          },
          dot: {
            rect: {
              fill: 'rgb(221, 0, 49)',
              strokeWidth: '0.2',
              stroke: 'white',
              width: '3.5px',
              height: '3.5px',
            },
            left: '40%',
          },
        },
        header: {
          root: {
            backgroundColor: '',
            '&:hover': { backgroundColor: '' },
            '.some_class': { color: '' },
          },
        },
        layout: {
          root: {
            backgroundColor: '',
          },
        },
        popover: {
          arrow: {
            backgroundColor: '',
            border: '',
          },
        },
      };


    /**
     * Constructor
     */
    constructor(
        private _navigationService: NavigationService,
        private _userService: CoreUserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        public auth: AuthService,
        private userService: UserService,
        private authState: AuthState
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
      this.getAuthSubId();
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        // Subscribe to the user service
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

            this.userService.getMe().subscribe((data: any) => this.userData = data);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Get Auth Sub Id
     */

    private getAuthSubId(){
      this.authState.user$.subscribe(user => {
        if (user) {
            this.subscriberId = user?.sub;
        }
      })
    } 
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }


    sessionLoaded = (data: unknown) => {
      console.log('loaded', { data });
    };
}
