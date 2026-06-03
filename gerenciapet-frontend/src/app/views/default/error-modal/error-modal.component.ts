import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-error-modal',
    templateUrl: './error-modal.component.html',
})
export class ErrorModalComponent {

    @Input() public modalErrorFlag: boolean = false;
    @Input() public errorMessage: string = '';
    @Output() public errorFlagEvent = new EventEmitter<boolean>();

    constructor() {}

    public closeModal() {
        this.errorFlagEvent.emit(false);
    }
}
