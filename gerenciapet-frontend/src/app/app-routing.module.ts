import { UserAccessGuard } from "./guards/user-access.guard";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DefaultLayoutComponent } from "./containers";
import { Page404Component } from "./views/pages/page404/page404.component";
import { Page500Component } from "./views/pages/page500/page500.component";
import { LoginComponent } from "./views/pages/login/login.component";
import { RegisterComponent } from "./views/pages/register/register.component";
import { TermsComponent } from "./views/pages/terms/terms.component";
import { PolicyComponent } from "./views/pages/policy/policy.component";

const routes: Routes = [
	{
		path: "",
		redirectTo: "login",
		pathMatch: "full",
	},
	{
		path: "dashboard",
		component: DefaultLayoutComponent,
		data: {
			title: "Início",
		},
		children: [
			{
				path: "",
				loadChildren: () =>
					import("./views/dashboard/dashboard.module").then(
						(m) => m.DashboardModule
					),
			},
			{
				path: "pages",
				loadChildren: () =>
					import("./views/pages/pages.module").then(
						(m) => m.PagesModule
					),
			},
			{
				path: "usuario",
				loadChildren: () =>
					import("./views/user/user.module").then(
						(m) => m.UserModule
					),
				canActivate: [UserAccessGuard],
			},
			{
				path: "cadastrar",
				loadChildren: () =>
					import("./views/cadastrar/cadastrar.module").then(
						(m) => m.CadastrarModule
					),
				canActivate: [UserAccessGuard],
			},
			{
				path: "visualizar",
				loadChildren: () =>
					import("./views/visualizar/visualizar.module").then(
						(m) => m.VisualizarModule
					),
				canActivate: [UserAccessGuard],
			},
			{
				path: "meu-pet",
				loadChildren: () =>
					import("./views/meu-pet/meu-pet.module").then(
						(m) => m.MeuPetModule
					),
				canActivate: [UserAccessGuard],
			},
			{
				path: "eventos",
				loadChildren: () =>
					import("./views/eventos/eventos.module").then(
						(m) => m.EventosModule
					),
				canActivate: [UserAccessGuard],
			},
			{
				path: "minha-area",
				loadChildren: () =>
					import("./views/minha-area/minha-area.module").then(
						(m) => m.MinhaAreaModule
					),
				canActivate: [UserAccessGuard],
			},
			{
				path: "desempenho",
				loadChildren: () =>
					import("./views/desempenho/desempenho.module").then(
						(m) => m.DesempenhoModule
					),
				canActivate: [UserAccessGuard],
			},
		],
	},
	{
		path: "500",
		component: Page500Component,
		data: {
			title: "Page 500",
		},
	},
	{
		path: "login",
		component: LoginComponent,
		data: {
			title: "Login Page",
		},
	},
	{
		path: "register",
		component: RegisterComponent,
		data: {
			title: "Register Page",
		},
	},
	{
		path: "register",
		component: RegisterComponent,
		data: {
			title: "Register Page",
		},
	},
	{
		path: "terms",
		component: TermsComponent,
		data: {
			title: "Terms Page",
		},
	},
	{
		path: "policy",
		component: PolicyComponent,
		data: {
			title: "Policy Page",
		},
	},
	{
		path: "**",
		pathMatch: "full",
		component: Page404Component,
		data: {
			title: "Page 404",
		},
	},
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: "top",
            anchorScrolling: "enabled",
            initialNavigation: "enabledBlocking",
            // relativeLinkResolution: 'legacy'
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule { }
