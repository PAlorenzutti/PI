import { URL_API } from "./../utils/url-api";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class LoginService {
	constructor(private http: HttpClient) {}

	public loginAuth(email: string, password: string): Observable<any> {
		const credentials = new FormData();
		credentials.append("email", email);
		credentials.append("password", password);

		return this.http.post(`${URL_API}/login`, credentials, { withCredentials: true });
	}

	public logout(): Observable<any> {
		return this.http.get(`${URL_API}/logout`);
	}

	public retrievePassword(email: string): Observable<any> {
		const body = {
			email: email,
		};
		return this.http.post(`${URL_API}/api-open/password-recovery`, body);
	}
}
