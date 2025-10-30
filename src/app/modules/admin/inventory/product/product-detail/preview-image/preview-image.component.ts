import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'app/models/product';

@Component({
    selector: 'app-preview-image',
    templateUrl: './preview-image.component.html',
    styleUrls: ['./preview-image.component.scss'],
})
export class PreviewImageComponent implements OnInit {
    @Input() selectedImageUrl = '';
    @Input() title = '';
    @Input() description = '';
    @Input() product: Product;
    @Input() needArchive = false;
    @Output() closeModal = new EventEmitter();
    @Output() OnArchive=new EventEmitter()

    constructor() {}

    ngOnInit(): void {}

    close() {
        this.closeModal.emit();
    }

    Archive(){
      this.OnArchive.emit(this.product.id)
    }
}
