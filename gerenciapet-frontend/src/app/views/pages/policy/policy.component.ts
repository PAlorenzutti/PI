import { Component } from "@angular/core";
import { cilArrowLeft } from "@coreui/icons";

@Component({
	selector: "app-policy",
	templateUrl: "./policy.component.html",
	styleUrls: ["./policy.component.scss"],
})
export class PolicyComponent {
	public icons = {
		cilArrowLeft,
	};

	ngOnInit() {}
}
