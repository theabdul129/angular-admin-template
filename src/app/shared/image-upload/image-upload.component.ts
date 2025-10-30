import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { MediaService } from 'app/core/services/media.service';
import { ProductCategoryService } from '../../modules/admin/inventory/product-category/category.service';
import { InventoryService } from '../../modules/admin/inventory/inventory.service';
import { AdvertService } from '../../modules/admin/marketing/advert.service';
import { map } from 'rxjs/operators';
import { BusinessAccountService } from 'app/modules/admin/business-accounts/business-account.service';

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
})
export class ImageUploadComponent implements OnInit {
    fileDatas: [File] = null;
    previewUrl: any = [];
    fileUploadProgress: string = null;
    uploadedFilePath: string = null;
    showUpload = false;
    mimeType: String;
    @Input() contentType: string;
    @Input() contentId: string;
    @Input() publicImageUrl: string;

    @Output() onImageUpload: EventEmitter<any> = new EventEmitter();

    constructor(
        private mediaService: MediaService,
        private productCategoryService: ProductCategoryService,
        private inventoryService: InventoryService,
        private advertService: AdvertService,
        private businessService: BusinessAccountService
    ) { }

    ngOnInit() {
        if (this.publicImageUrl != null) {
            this.previewUrl.push(this.publicImageUrl);
        }
    }

    fileProgress(fileInput: any) {
        if (/\.(jpe?g|png)$/i.test(fileInput.target.files[0].name) === true) {
            this.fileDatas = fileInput.target.files as [File];
            this.preview();
            for (var i = 0, file; file = this.fileDatas[i]; i++){
                
               
                this.OnUploadImage(file);
            
            
            }
       } else {
          //  alert("Invalid file Format.");
          return;
        }

    }

    preview() {
        // Show preview
        for (var i = 0, file; file = this.fileDatas[i]; i++) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (_event) => {
                this.previewUrl.push(reader.result);
            };
        }
        this.showUpload = true;
    }

    OnUploadImage(fileData) {
        let mimeType = fileData.type;
        this.fileUploadProgress = '0%';
        var fileName;
        switch (this.contentType) {
            case 'category':
                fileName = this.productCategoryService
                    .generateImageUrl(this.contentId)
                    .pipe(
                        map((val) => {
                            return val.url;
                        })
                    );
                break;
            case 'product':
                fileName = this.inventoryService
                    .generateProductImageUrl(this.contentId)
                    .pipe(
                        map((val) => {
                            return val.url;
                        })
                    );
                break;
            case 'business-account':
                fileName = this.businessService
                    .generateImageUrl(this.contentId)
                    .pipe(
                        map((val) => {
                            return val.url;
                        })
                    );
                break;
            case 'advert':
                fileName = this.advertService
                    .generateMediaUrl(this.contentId, mimeType)
                    .pipe(
                        map((val) => {
                            return val.url;
                        })
                    );
                break;
        }

        fileName.subscribe((url) => {
            this.mediaService
                .getUploadPublicUrl({ fileUrl: url, contentType: mimeType })
                .subscribe((data) => {
                    const signedUrl = data.body.url;
                    const key = data.body.fileName;
                    this.mediaService
                        .upload(fileData, signedUrl, mimeType)
                        .subscribe((events) => {
                            if (events.type === HttpEventType.UploadProgress) {
                                this.fileUploadProgress =
                                    Math.round(
                                        (events.loaded / events.total) * 100
                                    ) + '%';
                            } else if (events.type === HttpEventType.Response) {
                                this.fileUploadProgress = '';

                                this.onImageUpload.emit(key);
                            }
                        });
                });
        });
    }
}
