import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class StorageService {
	constructor() {}

	public saveData(key: string, data: any) {
		localStorage.setItem(key, JSON.stringify(data));
    }

	public getData(key: string): any {
		return JSON.parse(localStorage.getItem(key) || "{}");
	}

	public removeData(key: string) {
		localStorage.removeItem(key);
	}

	public clearData() {
		localStorage.clear();
	}
}
