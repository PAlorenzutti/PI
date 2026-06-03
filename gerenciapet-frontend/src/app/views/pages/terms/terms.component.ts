import { Component } from "@angular/core";
import { cilArrowLeft } from "@coreui/icons";

@Component({
	selector: "app-terms",
	templateUrl: "./terms.component.html",
	styleUrls: ["./terms.component.scss"],
})
export class TermsComponent {
	public icons = {
		cilArrowLeft,
	};

	ngOnInit() {}
}
