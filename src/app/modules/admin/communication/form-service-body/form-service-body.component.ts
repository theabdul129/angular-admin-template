import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { SWALMIXIN } from "app/core/services/mixin.service";
import { BehaviorSubject, Observable } from "rxjs";
import { CommunicationService } from "../communication.service";

@Component({
  selector: "app-form-service-body",
  templateUrl: "./form-service-body.component.html",
})
export class FormServiceBodyComponent implements OnInit {
  userForm: UntypedFormGroup;
  @Input() selectedBodyService: any;
  @Input() serviceTemplate: any;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();

  public model = {
    editorData: ""
  };

  constructor(
    private communicationService: CommunicationService,
    private formBuilder: UntypedFormBuilder
  ) { }

  ngOnInit() { }

  onSubmit() {
    if (this.userForm.invalid) return;
    const payload = {
      id: this.userForm.controls.id.value,
      description: this.userForm.controls.description.value,
      textBody: this.userForm.controls.textBody.value,
      htmlBody: this.model.editorData,
      subject: this.userForm.controls.subject.value,
      footer: this.userForm.controls.footer.value
    };
    this.isLoading.next(true);
    this.communicationService.saveServiceBody(
      payload,
      this.serviceTemplate.id,
      this.selectedBodyService.id
    ).subscribe(data => {
      if (data.status != 200) return;
      SWALMIXIN.fire({
        icon: 'success',
        title: 'Your communication details has been saved.',
      });
      this.isLoading.next(false);
      this.selectedBodyService.id = payload.id;
      this.selectedBodyService.textBody = payload.textBody;
      this.selectedBodyService.description = payload.description;
      this.selectedBodyService.htmlBody = payload.htmlBody;
      this.selectedBodyService.subject = payload.subject;
      this.selectedBodyService.footer = payload.footer;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property === "selectedBodyService") {
        this.model.editorData = changes[property].currentValue.htmlBody;
        this.userForm = this.formBuilder.group({
          id: [
            changes[property].currentValue.id,
            Validators.compose([Validators.required])
          ],
          description: [
            changes[property].currentValue.description,
            Validators.compose([Validators.required])
          ],
          textBody: [
            changes[property].currentValue.textBody,
            Validators.compose([Validators.required])
          ],
          htmlBody: [changes[property].currentValue.htmlBody],
          subject: [
            changes[property].currentValue.subject,
            Validators.compose([Validators.required])
          ],
          footer: [changes[property].currentValue.footer]
        });
      }
    }
  }

}
