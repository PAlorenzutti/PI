import { IconModule } from "@coreui/icons-angular";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PaginationModule } from "ngx-bootstrap/pagination";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { WidgetsGeneralComponent } from "./widgets/widgets-general.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { QRCodeModule } from "angularx-qrcode";

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
	TableModule,
	UtilitiesModule,
	WidgetModule,
	ModalModule,
} from "@coreui/angular";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
	declarations: [
		DashboardComponent,
		WidgetsGeneralComponent,
	],
	imports: [
		CommonModule,
		DashboardRoutingModule,
		FontAwesomeModule,
		AvatarModule,
		BadgeModule,
		BreadcrumbModule,
		ButtonGroupModule,
		ButtonModule,
		CardModule,
		DropdownModule,
		FooterModule,
		FormModule,
		ReactiveFormsModule,
		GridModule,
		HeaderModule,
		ListGroupModule,
		NavModule,
		ProgressModule,
		SharedModule,
		SidebarModule,
		TabsModule,
		TableModule,
		UtilitiesModule,
		WidgetModule,
		IconModule,
		ModalModule,
		QRCodeModule,
		PaginationModule.forRoot(),
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	providers: [],
})
export class DashboardModule {
	constructor() { }
}
