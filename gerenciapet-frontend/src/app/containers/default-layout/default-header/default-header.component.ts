import { UserService } from "src/app/services/user.service";
import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { HeaderComponent } from "@coreui/angular";
import { LoginService } from "src/app/services/login.service";

@Component({
	selector: "app-default-header",
	templateUrl: "./default-header.component.html",
	providers: [LoginService, UserService],
})
export class DefaultHeaderComponent extends HeaderComponent {
	@Input()
	sidebarId: string = "sidebar";

	constructor(
		private loginService: LoginService,
		private router: Router,
		private userService: UserService,
	) {
		super();
	}

	/**
	 * Método que realiza o logout do usuário
	 * @author Andre Pacheco
	 */
	public logout(): void {
		this.loginService.logout().subscribe({
			next: (resp) => {
				console.log("Logout realizado com sucesso!");
			},
			error: (e) => {
				if (e.status == 200) {
					console.log("Logout realizado com sucesso!");
				} else {
					console.log("Erro ao realizar logout!");
					console.log(e);
				}
			},
		});
		this.userService.removeLoggedUser();
		this.router.navigate(["/login"]);
	}
}
