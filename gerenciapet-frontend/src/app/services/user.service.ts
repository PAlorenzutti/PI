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
    /**
     * @author Andre Pacheco
     * Esse método busca o usuário logado através do método getAuthLoggedUser. Portanto, ele é uma
     * busca direta na API.  Ele retorna um Observable que pode ser tratado em qualquer lugar que o chame.
     * A ideia é que este método seja chamado logo após o usuário realizar o login.
     * Uma vez chamado, este método utiliza o serviço de Storage para salvar o usuário logado no localStorage
     * do navegador. A partir deste momento, sempre que for necessário recuperar o usuário logado, deve-se
     * chamar o método getLoggedUser() que está logo abaixo.
     */
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

                            // busca o usuário completo (com _links/href) por CPF e usa isso como currentUser
                            this.findByCpf(principal.cpf).subscribe({
                                next: (fullUserResp) => {
                                    // tenta criar User a partir do retorno completo da API
                                    UserService.currentUser = new User(fullUserResp);
                                    observer.next(principal.fullName);
                                    observer.complete();
                                },
                                error: (err) => {
                                    // fallback: usar o principal (pode não ter href)
                                    UserService.currentUser = new User(principal);
                                    observer.next(principal.fullName);
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

    /**
     * Esse método recupera as informações de um usuário logado que foi salvo no localStorage do navegador.
     * Sempre que for necessário recuperar o usuário logado, deve-se chamar esse método.
     * @author Andre Pacheco
     * @returns Retorna o usuário logado. Se não houver, retorna um usuário default (modo desenvolvimento)
     */
    public getLoggedUser() {
        if (UserService.currentUser == undefined) {
            return this.setDevModetUser();
        } else {
            return new User(UserService.currentUser);

        }
    }

    /**
     * Este método remove o usuário logado do storage. Ele deve ser chamado quando usuário realizar o logout.
     * @author Andre Pacheco
     */
    public removeLoggedUser() {
        UserService.currentUser = undefined;
    }

    /**
     * Este método retorna um usuário default para ser usado em desenvolvimento
     * @autor Andre Pacheco
     * @returns Retorna um usuário default para ser usado em desenvolvimento
     */
    private setDevModetUser(): User {
        return new User();
    }

    /**
     * Método para cadastrar um usuário no sistema utilizando a api-aberta,
     * ou seja, nao precisa estar logado para cadastrar
     * @author André Pacheco
     * @param user Usuario a ser cadastrado no sistema
     */
    public userLoginRegister(user: User): Observable<any> {
        return this.http.post(`${URL_API}/api-open/user-register`, user);
    }

    /**
     * @author Andre Pacheco
     * Este método busca um usuário logado usando o Spring Security
     */
    public getAuthLoggedUser(): Observable<any> {
        return this.http.get(`${URL_API}/api/user/logged-user`, { withCredentials: true });
    }

    public update(user: User, url: string): Observable<any> {
        return this.http.patch(url, user);
    }

    public findByCpf(cpf: string): Observable<any> {
        return this.http.get(
            `${URL_API}/api/user/search/findByCpf?cpf=${cpf}`
        );
    }

    public comparePasswords(
        cpf: string,
        password: string
    ): Observable<any> {
        const data = {
            cpf: cpf,
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

    /**
     * Método para buscar usuários cadastrados no sistema, utilizando paginação
     * @author Gabryel Batista
     * @param page página a ser buscada
     * @param itensPerPage Quantidade de usuários por página
     */

    public getAllPagedAndSorted(page: number, itensPerPage: number): Observable<any> {
        return this.http.get(
            `${URL_API}/api/user?page=${page}&size=${itensPerPage}&sort=fullName`
        );
    }

    /**
     * Método para atualizar se o usuário pode acessar o sistema.
     * Quando o acesso é liberado, remove automaticamente o token de verificação pendente.
     * @author Gabryel Batista
     * @param allowed Booleano que indica se o usuário pode acessar o sistema
     * @param userHref String com a url do usuário a ser alterado
     */
    public changeUserAccess(allowed: boolean, userHref: string): Observable<any> {
        // Extrai o ID do usuário da URL href
        const userId = userHref.split('/').pop();

        const data = {
            allowed: allowed,
        };

        return this.http.post(`${URL_API}/api/user/change-access/${userId}`, data);
    }

    /**
     * @author Eduarda Magesk
     * Method to change the allowed access of all users from a specific role
     * @param allowed
     * @param role
     * @returns
     */
    public changeAllowedAccessToAll(role: string, access: boolean): Observable<any> {
        return this.http.get(`${URL_API}/api/user/changeAllowedAccessToAll?role=${role}&access=${access}`);
    }

    /**
     * Método para atualizar a role do usuário
     * @author Gabryel Batista
     * @param role String com a role do usuário
     * @param url String com a url do usuário a ser alterado
     */
    public changeUserRole(role: string, url: string): Observable<any> {
        const data = {
            role: role,
        };
        return this.http.patch(url, data);
    }

    public delete(id: string): Observable<any> {
        return this.http.delete(`${URL_API}/api/user/delete/${id}`, {
            observe: "response",
        });
    }

    /**
     * @author Eduarda Magesk
     * Method to find users by full name
     * @param fullName
     * @param page
     * @param itensPerPage
     * @returns
     */
    public findByFullNameContaining(fullName: string, page: number, itensPerPage: number): Observable<any> {
        return this.http.get(
            `${URL_API}/api/user/search/findByFullNameContaining?fullName=${fullName}&page=${page}&size=${itensPerPage}&sort=date&sort=fullName`
        );
    }

    public verifyUser(token: string): Observable<any> {
        return this.http.get(`${URL_API}/api-open/user-verify?token=${token}`);
    }

    /**
     * Atualiza as informações do usuário logado armazenadas localmente (localStorage e currentUser).
     * Este método deve ser usado sempre que o usuário alterar seus dados no sistema.
     * **Atenção:** ele não realiza nenhuma chamada à API. É responsabilidade do desenvolvedor garantir
     * que os dados passados para este método correspondam exatamente aos dados enviados e salvos na API,
     * evitando inconsistências entre o armazenamento local e o servidor.
     *
     * @param updatedUser - Objeto com as informações atualizadas do usuário
     * @author Leticia Cardoso
     * @returns Retorna void; atualiza o usuário logado localmente
     */
    public updateCurrentUserLocally(updatedUser: User): void {
        UserService.currentUser?.updateUser(updatedUser);
    }

    public getUserByHref(href: string): Observable<User> {
        return this.http.get(href).pipe(
            map((userObj: any) => new User(userObj))
        );
    }
}
