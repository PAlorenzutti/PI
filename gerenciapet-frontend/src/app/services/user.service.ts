import { StorageService } from "./storage.service";
import { Injectable } from "@angular/core";
import { URL_API } from "./../utils/url-api";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import User from "./../models/User";
import { DEFAULT_ROLE } from "../../environments/environment";

@Injectable({
    providedIn: "root",
})
export class UserService {
    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) { }

    private static currentUser?: User = undefined;

    public setLoggedUser() {
        // Se não houver ninguém logado, vamos usar o usuário de desenvolvimento
        // Em produção, o sistema nunca poderá acessar o modo desenvolvimento.
        let devUser = this.setDevModetUser();

        return new Observable((observer) => {
            this.getAuthLoggedUser().subscribe({
                next: (resp) => {
                    // console.log("Usuário logado (set): ", resp);
                    try {
                        if (resp.fullName) {
                            UserService.currentUser = devUser;
                            // localStorage.setItem('userRole', btoa(resp.principal.role));
                            observer.next(DEFAULT_ROLE);
                            observer.complete();
                        } else {
                            // pega o principal retornado pelo endpoint de auth
                            const principal = resp.principal;
                            // busca o usuário completo (com _links/href) por email e usa isso como currentUser
                            this.findByEmail(principal.username || principal.email).subscribe({
                                next: (fullUserResp: any) => {
                                    // tenta criar User a partir do retorno completo da API
                                    UserService.currentUser = new User(fullUserResp);
                                    observer.next(principal.nome || principal.fullName || principal.username);
                                    observer.complete();
                                },
                                error: (err: any) => {
                                    // fallback: usar o principal (pode não ter href)
                                    UserService.currentUser = new User(principal);
                                    observer.next(principal.nome || principal.fullName || principal.username);
                                    observer.complete();
                                },
                            });
                        }
                    } catch (error) {
                        UserService.currentUser = devUser;
                        // localStorage.setItem('userRole', btoa(devUser.role));
                        observer.next(DEFAULT_ROLE);
                        observer.complete();
                    }
                },
                error: (error) => {
                    console.log("Não foi possível encontrar o usuário logado");
                    UserService.currentUser = devUser
                    observer.next(DEFAULT_ROLE);
                    observer.complete();
                },
            });
        });
    }


    public getLoggedUser() {
        if (UserService.currentUser == undefined) {
            return this.setDevModetUser();
        } else {
            return new User(UserService.currentUser);

        }
    }

    public removeLoggedUser() {
        UserService.currentUser = undefined;
    }

    private setDevModetUser(): User {
        return new User();
    }

    public userLoginRegister(user: User): Observable<any> {
        return this.http.post(`${URL_API}/api-open/user-register`, user);
    }

    public getAuthLoggedUser(): Observable<any> {
        return this.http.get(`${URL_API}/api/user/logged-user`, { withCredentials: true });
    }

    public update(user: User, url: string): Observable<any> {
        return this.http.patch(url, user);
    }

    public findByEmail(email: string): Observable<any> {
        return this.http.get(
            `${URL_API}/api/user/search/findByEmail?email=${email}`
        );
    }

    public comparePasswords(
        email: string,
        password: string
    ): Observable<any> {
        const data = {
            email: email,
            password: password,
        };
        return this.http.post(`${URL_API}/api/user/compare-passwords`, data);
    }

    public userRegisterDashboard(user: User): Observable<any> {
        return this.http.post(`${URL_API}/api-open/new-user-register`, user);
    }

    public logout(): Observable<any> {
        return this.http.get(`${URL_API}/logout`);
    }

    public getAllPagedAndSorted(page: number, itensPerPage: number): Observable<any> {
        return this.http.get(
            `${URL_API}/api/user?page=${page}&size=${itensPerPage}&sort=nome`
        );
    }


    public changeUserRole(role: string, url: string): Observable<any> {
        const data = {
            tipoUsuario: role,
        };
        return this.http.patch(url, data);
    }

    public delete(id: string): Observable<any> {
        return this.http.delete(`${URL_API}/api/user/delete/${id}`, {
            observe: "response",
        });
    }

    public findByFullNameContaining(fullName: string, page: number, itensPerPage: number): Observable<any> {
        return this.http.get(
            `${URL_API}/api/user/search/findByNomeContainingIgnoreCase?nome=${fullName}&page=${page}&size=${itensPerPage}&sort=nome`
        );
    }

    public verifyUser(token: string): Observable<any> {
        return this.http.get(`${URL_API}/api-open/user-verify?token=${token}`);
    }

    public updateCurrentUserLocally(updatedUser: User): void {
        UserService.currentUser?.updateUser(updatedUser);
    }

    public getUserByHref(href: string): Observable<User> {
        return this.http.get(href).pipe(
            map((userObj: any) => new User(userObj))
        );
    }

    public countTutores(): Observable<number> {
        return this.http.get(`${URL_API}/api/tutor?size=1`).pipe(
            map((response: any) => response.page.totalElements)
        );
    }
}
