import { UserAccessGuard } from "./guards/user-access.guard";
import { HttpClientModule } from "@angular/common/http";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { LocationStrategy, PathLocationStrategy } from "@angular/common";
import { BrowserModule, Title } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { provideNgxMask } from "ngx-mask";
import { QRCodeModule } from "angularx-qrcode";
import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component";


import {
    DefaultFooterComponent,
    DefaultHeaderComponent,
    DefaultLayoutComponent,
} from "./containers";

import {
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
    TabsModule,
    TooltipModule,
    UtilitiesModule,
    WidgetModule,
    ToastModule,
    PopoverModule,
    CollapseModule,
    OffcanvasModule,
    AlertModule
} from "@coreui/angular";

import { IconModule, IconSetService } from "@coreui/icons-angular";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule, NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { ImageCropperModule } from "ngx-image-cropper";


const APP_CONTAINERS = [
    DefaultFooterComponent,
    DefaultHeaderComponent,
    DefaultLayoutComponent,
];

@NgModule({
	declarations: [AppComponent, ...APP_CONTAINERS],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		AvatarModule,
		BreadcrumbModule,
		FooterModule,
		DropdownModule,
		GridModule,
		HeaderModule,
		SidebarModule,
		IconModule,
		NavModule,
		ButtonModule,
		FormModule,
		UtilitiesModule,
		ButtonGroupModule,
		ReactiveFormsModule,
		SidebarModule,
		SharedModule,
		TabsModule,
		ListGroupModule,
		ProgressModule,
		BadgeModule,
		ListGroupModule,
		CardModule,
		FormModule,
		FormsModule,
		FontAwesomeModule,
		WidgetModule,
		IconModule,
		HttpClientModule,
		ModalModule,
		QRCodeModule,
		NgbModule,
		TooltipModule,
		ImageCropperModule,
		ToastModule,
		CollapseModule,
		PopoverModule,
		OffcanvasModule,
		AlertModule,
		NgbTypeahead,
	],
	providers: [
		{
			provide: LocationStrategy,
			useClass: PathLocationStrategy,
		},
		IconSetService,
		Title,
		UserAccessGuard,
		provideNgxMask()
	],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
