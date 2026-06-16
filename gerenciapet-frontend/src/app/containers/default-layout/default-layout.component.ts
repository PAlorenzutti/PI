import { UserService } from "src/app/services/user.service";
import { Component } from "@angular/core";
import User from "src/app/models/User";
import { navItems, navItemsRoleAdmin, navItemsRoleProfessional, navItemsRoleReceptionist, navItemsRoleUser } from "./_nav";

import { DEFAULT_ROLE } from "src/environments/environment";

@Component({
	selector: "app-dashboard",
	templateUrl: "./default-layout.component.html",
	providers: [UserService],
})
export class DefaultLayoutComponent {
	public navItems = navItems;
	public loggedUser!: User;
	

	constructor(private userService: UserService) {
		this.loggedUser = this.userService.getLoggedUser();
		this.changeNavItens();
	}

	ngOnInit() {}

	/**
	 * Método que troca o menu de navegação lateral de acordo com a ROLE do usuário logado
	 * Importante: não é ele que garante a segurança do sistema, apenas muda o menu de navegação
	 * Para garantir a segurança, é necessário definir o arquivo de guardas (guard.ts) e definir as rotas
	 * @author Andre Pacheco
	 */
	public changeNavItens(): void {
		if (this.loggedUser.tipoUsuario === "TutorCoordenador") {
			this.navItems = navItemsRoleAdmin;
		} else if (this.loggedUser.tipoUsuario === "MembroPet") {
			this.navItems = navItemsRoleProfessional;
		} else {
			this.navItems = navItemsRoleUser;
		}
	}
}
