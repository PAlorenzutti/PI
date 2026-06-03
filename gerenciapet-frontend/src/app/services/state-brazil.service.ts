import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, timer } from "rxjs";
import { debounce, map } from "rxjs/operators";
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { URL_API } from "../utils/url-api";

@Injectable({
	providedIn: "root",
})
export class StateBrazilService {
	constructor(private http: HttpClient) {}

	/**
	 * @author Eduarda Magesk
	 * Method to search for brazilian states names that contains the name
	 * @param name the string needs to be the same as on the database
	 */
	public findByNameContainingIgnoreCase(name: string): Observable<any> {
		return this.http
			.get(
				`${URL_API}/api/state-brazil/search/findByNameContainingIgnoreCase?name=${name}`
			)
			.pipe(
				map((resp: any) =>
					resp["_embedded"]["state-brazil"]
						.map((est: { name: string }) => est.name)
						.slice(0, 5)
				)
			);
	}

	/**
	 * Validador assíncrono para nome de estado (case-insensitive) com regra:
	 * - vazio: null (deixa required atuar)
	 * - < 3 caracteres: erro stateNotFound
	 * - caso não haja match exato no retorno: erro stateNotFound
	 */
	public stateExistsValidator(): AsyncValidatorFn {
		return (control: AbstractControl) => {
			const value = (control.value || "").toString().trim();
			if (!value) return of(null);
			if (value.length < 3) return of({ stateNotFound: true });
			return this.findByNameContainingIgnoreCase(value).pipe(
				debounce(() => timer(250)),
				map((states: string[]) => {
					const exists = states.some(
						(s) => s.toLowerCase() === value.toLowerCase()
					);
					return exists ? null : { stateNotFound: true };
				})
			);
		};
	}
}
