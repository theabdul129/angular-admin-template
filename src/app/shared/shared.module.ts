import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { SaveAddressComponent } from './address/save-address.component';
import { SearchAddressComponent } from './search/address/search.address.component';
import { SearchPostcodeComponent } from './search/postcode/search.postcode.component';
// import { CalendarComponent } from './calendar/calendar.component';
// import { CalendarModule } from 'angular-calendar';
import { SearchBusinessAccountCollaboratorsComponent } from './search/business-account-collaborators/search.business.account.collaborators.component';
import { SearchProductCategoryComponent } from './search/product-category/search.product.category.component';
import { SearchProductComponent } from './search/product/search.product.component';
import { SearchProductBrandComponent } from './search/product-brand/search.product.brand.component';
import { SearchCountryComponent } from './search/country/search.country.component';
import { SearchProductTagComponent } from './search/product-tag/search.product.tag.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { SearchCatchmentAreaComponent } from './search/catchment-area/search.catchment.area.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { SearchBusinessAccountComponent } from './search/business-account/business-account.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { AccountInformationComponent } from './account-info/account-info.component';
import { RouterModule } from '@angular/router';
import { ProductInformationComponent } from './product-info/product-info.component';
import { DecimaNumberDirective } from 'app/directives/decimal-number.directive';
import { InfoDialogComponent } from './dialogs/info-dialog/info-dialog.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SendNotificationOptionsComponent} from "./send-notification-options/send-notification-options.component"
import { MediaService } from 'app/core/services/media.service';
import { SearchService } from 'app/core/search/search.service';
import { FuseAlertModule } from '@fuse/components/alert';
import { SaveDeliveryAddressComponent } from './save-delivery-address/save-delivery-address.component';

const components = [
    SaveAddressComponent,
    SearchPostcodeComponent,
    SearchAddressComponent,
    // CalendarComponent,
    SearchBusinessAccountCollaboratorsComponent,
    SearchProductComponent,
    SearchProductCategoryComponent,
    SearchProductBrandComponent,
    SearchCountryComponent,
    SearchProductTagComponent,
    ImageUploadComponent,
    SearchCatchmentAreaComponent,
    UploadFileComponent,
    SearchBusinessAccountComponent,
    AccountInformationComponent,
    ProductInformationComponent,
    InfoDialogComponent,
    DecimaNumberDirective,
    SendNotificationOptionsComponent,
    SaveDeliveryAddressComponent
]

@NgModule({
    declarations: components,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClipboardModule,
        MaterialModule,
        // CalendarModule,
        NgxIntlTelInputModule,
        RouterModule,
        FuseAlertModule
    ],
    providers:[ MediaService,SearchService,],
    exports: [...components, CommonModule],
})

export class SharedModule { }
