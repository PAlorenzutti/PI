import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
    AlertModule,
    AvatarModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    FooterModule,
    FormModule,
    GridModule,
    HeaderModule,
    ListGroupModule,
    ModalModule,
    NavModule,
    ProgressModule,
    SharedModule,
    SidebarModule,
    TableModule,
    TabsModule,
    ToastModule,
    TooltipModule,
    UtilitiesModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxMaskDirective } from 'ngx-mask';

import { PipesModule } from '../../utils/pipes/pipes.module';
import { DefaultRoutingModule } from './default-routing.module';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { LoadingModalComponent } from './loading-modal/loading-modal.component';

@NgModule({
    declarations: [
        LoadingModalComponent,
        ErrorModalComponent,
    ],
    imports: [
        CommonModule,
        DefaultRoutingModule,
        ReactiveFormsModule,
        AvatarModule,
        BadgeModule,
        BreadcrumbModule,
        ButtonGroupModule,
        ButtonModule,
        CardModule,
        DropdownModule,
        FooterModule,
        FormModule,
        GridModule,
        HeaderModule,
        ListGroupModule,
        NavModule,
        ProgressModule,
        SharedModule,
        SidebarModule,
        TabsModule,
        UtilitiesModule,
        ModalModule,
        FontAwesomeModule,
        RouterModule,
        NgbModule,
        IconModule,
        TableModule,
        TooltipModule,
        ImageCropperModule,
        ProgressModule,
        ToastModule,
        AlertModule,
        PipesModule,
        NgxMaskDirective
    ],
	exports: [
        LoadingModalComponent,
        ErrorModalComponent,
    ],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DefaultModule { }
