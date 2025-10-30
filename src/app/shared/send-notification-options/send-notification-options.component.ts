import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-send-notification-options',
  templateUrl: './send-notification-options.component.html',
  styleUrls: ['./send-notification-options.component.scss']
})
export class SendNotificationOptionsComponent implements OnInit {

  selectedOPtion:string=undefined;
  emailForm:UntypedFormGroup;
  constructor(public dialogRef: MatDialogRef<SendNotificationOptionsComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb:UntypedFormBuilder) {
    this.formInit()
  }
  
  formInit(){
    this.emailForm=this.fb.group({
      subject:['',Validators.required],
      body:['',Validators.required]
    })
  }

  ngOnInit(): void {
  }

  onDismiss(){
    this.dialogRef.close(null);
  }
  
  selectedAction(){
    if(this.selectedOPtion=="sms"||this.selectedOPtion=="whatsapp"){
      if(!this.emailForm.value.body){
        this.emailForm.markAllAsTouched();
        return;
      } 
      this.dialogRef.close({body:this.emailForm.value.body,contactMethod:this.selectedOPtion});
    }else if (this.selectedOPtion=="email"){
      if(this.emailForm.invalid){
        this.emailForm.markAllAsTouched();
        return;
      }
      this.dialogRef.close({subject:this.emailForm.value.subject,body:this.emailForm.value.body,contactMethod:this.selectedOPtion});
    }
  }

}
