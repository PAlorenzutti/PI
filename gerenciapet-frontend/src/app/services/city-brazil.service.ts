import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, timer } from "rxjs";
import { debounce, map } from "rxjs/operators";
import { URL_API } from "../utils/url-api";
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";

@Injectable({
	providedIn: "root",
})
export class CityBrazilService {
	constructor(private http: HttpClient) {}

	/**
	 * @author Eduarda Magesk
	 * Method to search for brazilian cities names that contains the name
	 * @param name the string needs to be the same as on the database
	 */
	public findByNameContainingIgnoreCase(name: string): Observable<any> {
		return this.http
			.get(
				`${URL_API}/api/city-brazil/search/findByNameContainingIgnoreCase?name=${name}`
			)
			.pipe(
				map((resp: any) =>
					resp["_embedded"]["city-brazil"]
						.map((pro: { name: any }) => pro.name)
						.slice(0, 8)
				)
			);
	}

	/**
	 * Usa o novo endpoint específico que já filtra por estado + fragmento de cidade.
	 * Endpoint esperado: /api/city-brazil/search/findByCityAndState?state={stateName}&city={cityFragment}
	 */
	public findByStateAndNameContaining(
		stateName: string,
		cityPart: string
	): Observable<string[]> {
		const state = (stateName || "").trim();
		const city = (cityPart || "").trim();
		if (!state || city.length < 1) return of([]);
		return this.http
			.get(
				`${URL_API}/api/city-brazil/search/findByCityAndState?state=${encodeURIComponent(
					state
				)}&city=${encodeURIComponent(city)}`
			)
			.pipe(
				map((resp: any) => {
					if (!resp || !resp._embedded) return [];
					// Ajuste conforme payload real do backend; assumindo _embedded["city-brazil"]
					return resp["_embedded"]["city-brazil"]
						.map((c: any) => c.name)
						.slice(0, 8);
				})
			);
	}

	public cityExistsValidator(): AsyncValidatorFn {
		return (control: AbstractControl) => {
			const value = (control.value || "").toString().trim();
			if (!value) return of(null); // required cuida
			if (value.length < 3) return of({ cityNotFound: true });
			return this.findByNameContainingIgnoreCase(value).pipe(
				debounce(() => timer(250)),
				map((cities: string[]) => {
					const exists = cities.some(
						(city) => city.toLowerCase() === value.toLowerCase()
					);
					return exists ? null : { cityNotFound: true };
				})
			);
		};
	}
}
