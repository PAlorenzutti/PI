
import { Component } from "@angular/core";
import { navItemsAdmin, navItemsTutor, navItemsExtensionista, navItemsAluno } from "./_nav";
import { UserService } from "../../services/user.service";
import User from "../../models/User";


@Component({
	selector: "app-dashboard",
	templateUrl: "./default-layout.component.html",
	providers: [UserService],
})
export class DefaultLayoutComponent {
	public navItems: any[] = [];
	public loggedUser!: User;

	constructor(private userService: UserService) {
		this.loggedUser = this.userService.getLoggedUser();
		this.changeNavItens();
	}

	ngOnInit() {}

	public changeNavItens(): void {
		if (this.loggedUser.tipoUsuario === "ADMIN") {
			this.navItems = navItemsAdmin;
		} else if (this.loggedUser.tipoUsuario === "TUTOR") {
			this.navItems = navItemsTutor;
		} else if (this.loggedUser.tipoUsuario === "EXTENSIONISTA") {
			this.navItems = navItemsExtensionista;
		} else {
			this.navItems = navItemsAluno;
		}
	}
}
