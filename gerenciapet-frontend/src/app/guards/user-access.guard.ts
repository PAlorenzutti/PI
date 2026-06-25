import { UserService } from "../services/user.service";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";

@Injectable({
	providedIn: "root",
})
export class UserAccessGuard  {
	constructor(private router: Router, private userService: UserService) { }
	/**
	 * Este método controla as rotas de acesso de acordo com a ROLE do usuário.
	 * Aqui sim é definido a segurança do sistema. A ideia é que ele seja evoluido na medida que
	 * o sistema for crescendo e as ROLES forem bem definidas.
	 *
	 * A ideia do método é bem simples: retorna true se o usuário tiver acesso a rota, e false se não tiver.
	 */
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean {
		// const storedRole = localStorage.getItem('userRole');
		// const role = storedRole ? atob(storedRole) : null;

		let loggedUser = this.userService.getLoggedUser();
		const tipoUsuario = loggedUser.tipoUsuario;

		if (tipoUsuario === "ADMIN" || tipoUsuario === "TUTOR" || tipoUsuario === "EXTENSIONISTA") {
			return true;
		} else {
			if (
				state.url.includes("dashboard/usuario/editar") ||
				state.url.includes("dashboard/minha-area")
			) {
				return true;
			} else {
				this.router.navigate(["/dashboard"]);
				return false;
			}
		}
	}
}
