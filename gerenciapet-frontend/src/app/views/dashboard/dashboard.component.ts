import { UserService } from './../../services/user.service';


import { Component } from "@angular/core";
import { Router } from "@angular/router";
import User from '../../models/User';


@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	providers: [UserService],
})
export class DashboardComponent {
	public flagError: boolean;
	public loggedUser!: User;

	public registerWarningVisible = false;

	constructor(
		private userService: UserService,
		private router: Router,
	) {
		this.flagError = false;
		this.loggedUser = this.userService.getLoggedUser();

		this.registerWarningVisible = !this.loggedUser.isRegistrationComplete();
	}

	ngOnInit() {}

	public setFlagError(valor: boolean) {
		this.flagError = valor;
	}

	goToCompleteRegistration() {
		this.registerWarningVisible = false;
		this.router.navigate(['dashboard/usuario/editar']);
	}
}
