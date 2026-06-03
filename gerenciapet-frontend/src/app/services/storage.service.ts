import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class StorageService {
	constructor() {}

	/**
	 * @author Andre Pacheco
	 * Este método salva um dado no localStorage do navegador que pode ser acessado de qualquer
	 * ponto da aplicação. O dado é salvo em formato JSON.
	 * @param key string que representa a chave de acesso do dado
	 * @param data objeto a ser salvo
	 */
	public saveData(key: string, data: any) {
		localStorage.setItem(key, JSON.stringify(data));
	}

	/**
	 * @author Andre Pacheco
	 * Este método recupera um dado no localStorage do navegador que pode ser acessado de qualquer
	 * ponto da aplicação. O dado é parseado para o formato JSON.
	 * @param key string que representa a chave de acesso do dado
	 */
	public getData(key: string): any {
		return JSON.parse(localStorage.getItem(key) || "{}");
	}

	/**
	 * @author Andre Pacheco
	 * Este método remove um dado no localStorage do navegador. Só utilize-o se você souber o que está fazendo.
	 * @param key string que representa a chave de acesso do dado
	 */
	public removeData(key: string) {
		localStorage.removeItem(key);
	}

	/**
   * @author Andre Pacheco
     Este método limpa todo e qualquer dado do localStorage do navegador. Só utilize-o se você souber o que está fazendo.
   */
	public clearData() {
		localStorage.clear();
	}
}
