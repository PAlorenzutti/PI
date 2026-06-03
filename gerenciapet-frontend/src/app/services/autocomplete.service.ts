import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { StateBrazilService } from "./state-brazil.service";
import { CityBrazilService } from "./city-brazil.service";

@Injectable({
	providedIn: "root",
})
export class AutocompleteService {
	constructor(
		private stateBrazilService: StateBrazilService,
		private cityBrazilService: CityBrazilService,
	) {}

	/**
	 * @author Eduarda Magesk
	 * Method to autocomplete brazilian states names using he term passed as a
	 * paramether. Must be used on inputs with [ngbTypeahead] from ng-bootstrap
	 */
	public completeStateBrazil = (nome: Observable<string>) => {
		return nome.pipe(
			debounceTime(500),
			distinctUntilChanged(),
			switchMap((term) =>
				this.stateBrazilService.findByNameContainingIgnoreCase(term)
			)
		);
	};

	/**
	 * @author Eduarda Magesk
	 * Method to autocomplete brazilian cities names using he term passed as a
	 * paramether. Must be used on inputs with [ngbTypeahead] from ng-bootstrap
	 */
	public completeCityBrazil = (nome: Observable<string>) => {
		return nome.pipe(
			debounceTime(500),
			distinctUntilChanged(),
			switchMap((term) =>
				this.cityBrazilService.findByNameContainingIgnoreCase(term)
			)
		);
    };
}
