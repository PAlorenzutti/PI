import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { IconSetService } from "@coreui/icons-angular";
import { iconSubset } from "./icons/icon-subset";
import { Title } from "@angular/platform-browser";
import { cilWarning } from "@coreui/icons";
import { UserService } from "./services/user.service";

@Component({
	selector: "app-root",
	template: `<router-outlet *ngIf="userData"></router-outlet>`,
})
export class AppComponent implements OnInit {
	title = "Gerencia PET";

	constructor(
		private router: Router,
		private titleService: Title,
		private iconSetService: IconSetService,
		private userService: UserService
	) {
		titleService.setTitle(this.title);
		// iconSet singleton
		iconSetService.icons = { cilWarning, ...iconSubset };
	}
	public userData: boolean = false; // Espera obter dados do usuario, para renderizar o resto da página

	ngOnInit(): void {
		this.userService.setLoggedUser()
				.subscribe({
					next: () => {
							this.userData = true
						},
					error: () => {
						this.userData = true;
					}
				})
		this.router.events.subscribe((evt) => {
			if (!(evt instanceof NavigationEnd)) {
				return;
			}
		});
	}
}
