import { Component, Input, Output, EventEmitter } from "@angular/core";
import { HttpEventType } from "@angular/common/http";
import { MediaService } from "app/core/services/media.service";

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent  {

   @Output() onFileUpload: EventEmitter<any> = new EventEmitter();
    @Input() urlGenerationPath: string;


  files: any = [];
  progress: any = [];
  constructor(private mediaService: MediaService) {}

  uploadFile(event) {
  console.log(event)
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element)
      this.progress.push(0)
    }
  }
  deleteAttachment(index) {
    this.files.splice(index, 1)
  }

  uploadFiles(){
this.files.forEach((file, index) =>{
console.log(index)
 this.mediaService
      .generateFileUploadName(this.urlGenerationPath)
     .subscribe(data => {

      this.mediaService
          .getUploadPublicUrl({ fileName: data.body.fileUrl, contentType: file.type })
          .subscribe(data => {
            const signedUrl = data.body.url;
            const key = data.body.fileName;

            this.mediaService.upload(file.fileData, signedUrl, file.type).subscribe(events => {
              if (events.type === HttpEventType.UploadProgress) {
                this.progress[index] =
                  Math.round((events.loaded / events.total) * 100) + "%";
              } else if (events.type === HttpEventType.Response) {
                this.progress[index] = 0;
                this.onFileUpload.emit(key);
              }
            });
       });
      });



  });

  this.files = [];
  }

}
