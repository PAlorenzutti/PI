import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-loading-modal',
    templateUrl: './loading-modal.component.html',
})

export class LoadingModalComponent {

    //flag to active or not the modal
    @Input() modalLoadingFlag: boolean = false;

    //flag to active or not the progress bar
    @Input() progressBarFlag: boolean = false;
    @Input() progressBarValue: number = 0;
    @Input() progressBarMessage: string = "";


    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.modalLoadingFlag !== undefined && changes.modalLoadingFlag.currentValue == false) {
            this.progressBarFlag = false;
            this.progressBarValue = 0;
            this.progressBarMessage = "";
        }
    }
}
