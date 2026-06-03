import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { PaginationModule } from "ngx-bootstrap/pagination";

import { UserRoutingModule } from "./user-routing.module";
import { UserViewerComponent } from "./user-viewer/user-viewer.component";
import { UserEditComponent } from "./user-edit/user-edit.component";

import { IconModule, IconSetService } from "@coreui/icons-angular";
import { NgxMaskDirective } from "ngx-mask";


// CoreUI Modules
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
	NavModule,
	ProgressModule,
	SharedModule,
	SidebarModule,
	TabsModule,
	UtilitiesModule,
	ModalModule,
	TableModule,
} from "@coreui/angular";
import { RouterModule } from "@angular/router";
import { UserNewComponent } from "./user-new/user-new.component";

@NgModule({
	declarations: [UserViewerComponent, UserEditComponent, UserNewComponent],
	imports: [
		CommonModule,
		UserRoutingModule,
		FormModule,
		ReactiveFormsModule,
		AvatarModule,
		BadgeModule,
		IconModule,
		BreadcrumbModule,
		ButtonGroupModule,
		ButtonModule,
		CardModule,
		DropdownModule,
		FooterModule,
		GridModule,
		HeaderModule,
		ListGroupModule,
		NavModule,
		NgxMaskDirective,
		NgbTypeahead,
		ProgressModule,
		SharedModule,
		SidebarModule,
		TabsModule,
		FontAwesomeModule,
		UtilitiesModule,
		ModalModule,
		FormsModule,
		RouterModule,
		TableModule,
		ButtonGroupModule,
		ButtonModule,
		PaginationModule.forRoot(),
		DropdownModule,
		IconModule,
		FormModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModule {}
