import {ChangeDetectorRef, Component, Input} from '@angular/core';
import { CustomerService } from '../../customer.service';
import { BasicActions } from 'app/shared/basic-actions';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-customer-sequence',
    templateUrl: './customer-sequence.component.html',
    styleUrls: ['./customer-sequence.component.scss'],
})
export class CustomerSequenceComponent extends BasicActions{
    @Input() accountNumber:string=undefined;
    activities = [];
    iconsList=[ 
        { action:"email",icon:'heroicons_solid:mail' },
        { action:"phone_call",icon:'heroicons_solid:phone' },
        { action:"in_person_meeting",icon:'heroicons_solid:users' },
        { action:"sms",icon:'heroicons_solid:annotation' },
    ]
    /**
     * Constructor
     */
    constructor(private customerService: CustomerService,private cdr:ChangeDetectorRef) {
        super('');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.getCustomerSequence(this.accountNumber);
    }

    /**
     * On Destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        if (this._subscriptions.getData) {
            this._subscriptions.getData.unsubscribe();
        }
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Get Customer Sequence 
     * @param accountNumber
     */

    getCustomerSequence(accountNumber){
        this._subscriptions.getData = this.customerService.retrieveCustomerSequence(accountNumber)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
            next:(resp:any )=>{
                this.activities=resp;
                this.addIcons();
                this.cdr.detectChanges();
            },error:(err)=>{
                console.log();
                
            }
        })
    }

    addIcons(){ 
        for(let activity of this.activities){
            let iconMatched:boolean=false
            for(let icon of this.iconsList){
                if(activity.action==icon.action){
                    activity.icon=icon.icon;
                    iconMatched=true;
                    break;
                }
            }
            if(!iconMatched)activity.icon='heroicons_solid:star';
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    removeUnderScore(str : String){
        return str?.replace(/_/g, ' ');
    }
}