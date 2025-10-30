import { UntypedFormControl, Validators } from '@angular/forms';


export class DeveloperApplications {

  static attributeLabels = {
    name: 'name',
    id: 'id',
    description: 'description',

  }
  id: any;
  name: string;
  description: string;
  scopes: string[];
  clientSecret:string
  clientId:string;

  /**
   * Constructor
   *
   * @param rec
   */
  constructor(rec?) {

    rec = rec || {};
    this.id = rec.id || ''
    this.name = rec.name || '';
    this.description = rec.description || '';
    this.scopes = rec.scopes || '';
    this.clientSecret = rec.clientSecret || ""
    this.clientId=rec.clientId || ""
  }

  public validationRules() {
    return {
      name: new UntypedFormControl('', Validators.required),
      clientId: new UntypedFormControl({value:'',disabled:true}),
      description: new UntypedFormControl('', Validators.required),
    };
  }
}
