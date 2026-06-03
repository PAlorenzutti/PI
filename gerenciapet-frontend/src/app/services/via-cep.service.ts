import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import Constants, { Acronym, State } from "../utils/constants";
import Utils from "../utils/utils";

export type CepAddress = {
	street : string,
	neighborhood: string,
	uf : Acronym,
	state : State,
	city : string,
}

type GetAddressResponseType = {
	logradouro : string
	bairro : string
	localidade : string
	uf : Acronym,
	erro : boolean
}

@Injectable({
	providedIn: "root",
})
export class ViaCepService {
	private baseUrl = "https://viacep.com.br/ws";

	constructor(private http: HttpClient) {}

	getAddress(cep: string): Observable<CepAddress> {
		return this.http.get<GetAddressResponseType>(`${this.baseUrl}/${cep}/json/`).pipe(
			map((data) => {
				if(data.erro === true){
					throw new Error("There was an error while retrieving the address.")
				}else{
					return {
						street: data.logradouro,
						neighborhood : data.bairro,
						city : data.localidade,
						uf : data.uf,
						state : Utils.getStateName(data.uf),
					}
				}
			})
		);
	}
}
