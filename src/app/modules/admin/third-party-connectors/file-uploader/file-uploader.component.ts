import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Output,
} from '@angular/core';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent {
    @Output() selected = new EventEmitter();
    constructor(private cdr: ChangeDetectorRef) {}
    selectedFile;
    isImage: boolean = false;
    fileObjectUrl: any;

    onFileSelected(event: any): void {
        event.preventDefault();
        event.stopPropagation();
        this.selectedFile = event.target.files[0];
        this.isImage = this.isImageFile(this.selectedFile);
        this.fileObjectUrl = this.getFileObjectURL(this.selectedFile);
        if (this.selectedFile) {
            this.selected.emit(this.selectedFile);
            this.cdr.detectChanges();
        }
    }

    // Check if the file is an image
    isImageFile(file: File): boolean {
        return file.type.startsWith('image');
    }

    // Get a preview URL for image files
    getFileObjectURL(file: File): string | null {
        return this.isImageFile(file) ? URL.createObjectURL(file) : null;
    }

    // Format file size from bytes to a human-readable format
    formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    onFileDropped(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.selectedFile = files[0];
            this.selected.emit(this.selectedFile);
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }
}
