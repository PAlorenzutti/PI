import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { UserService } from "../../../services/user.service";
import User from "../../../models/User";

@Component({
    selector: "app-user-viewer",
    templateUrl: "./user-viewer.component.html",
    styleUrls: [],
    providers: [UserService],
})
export class UserViewerComponent implements OnInit {

    public loggedUserTipo: string = "";
    public loggedUserHref?: string;


    public users: any[] = [];
    public alterationResp: string;
    public failureFlag: boolean = false;
    public selectedUser: any = {
        allowed: false,
        tipoUsuario: "ALUNO",
    };
    public flagModalEdit: boolean = false;

    public itemsPerPage: number; // Define quantos elementos serao retornados por paginas
    public totalItems: number = 0; // Total de itens a ser exibidos na tabela
    public currentPage: number; // página atualmente selecionada
    public maxPageLinks: number; // maximo de links que a pagina pode exibir (os boxes com os numeros)
    public totalPages?: number; // o numero de paginas retornadas pela requisicao
    public modalLoadingFlag: boolean = false; // flag para mostrar o modal de loading

    public userSettingsForm: FormGroup;

    constructor(private userService: UserService, private formBuilder: FormBuilder) {
        this.itemsPerPage = 10;
        this.maxPageLinks = 10;
        this.currentPage = 1;
        this.alterationResp = "";

        this.userSettingsForm = this.formBuilder.group({
            allowedAccessToAll: [],
            fullName: [""],
            tipoUsuario: ["ALUNO"],
        })
    }

    ngOnInit() {
        this.modalLoadingFlag = true;

        const logged = this.userService.getLoggedUser?.();

        if (logged) {
            this.loggedUserTipo = logged.tipoUsuario;
            this.loggedUserHref = logged.href;
        }

        this.getUsersByName(this.currentPage);
    }

    public canManage(target: any): boolean {
        if (!this.loggedUserTipo) return false;
        const isSelf = this.loggedUserHref && target?._links?.user?.href === this.loggedUserHref;
        if (isSelf) return false;
        if (this.loggedUserTipo === "ADMIN" || this.loggedUserTipo === "TUTOR") return true;
        if (this.loggedUserTipo === "EXTENSIONISTA") {
            return target?.tipoUsuario !== "ADMIN" && target?.tipoUsuario !== "TUTOR" && target?.tipoUsuario !== "EXTENSIONISTA";
        }
        return false;
    }

    /**
     * @author Gabryel Batista
     * Método para mudar de página na tabela de usuários
     * @param event Captura o evento de mudança de página
     *
     */
    public pageChange(event: PageChangedEvent): void {
        this.currentPage = event.page;
        this.getUsersByName(this.currentPage);
    }

    /**
     * @author Gabryel Batista
     * Método para alterar o acesso de um usuário ao sistema
     * @param user Um objeto com os dados do usuário a ser alterado
     */
    public changeUserAccess(): void {
        this.modalLoadingFlag = true;
        this.selectedUser.allowed = !this.selectedUser.allowed;

        this.userService
            .changeUserAccess(
                this.selectedUser.allowed,
                this.selectedUser._links.user.href
            )
            .subscribe({
                next: (response) => {
                    this.alterationResp = "allowed-saved";
                    this.modalLoadingFlag = false;
                },
                error: (error) => {
                    this.alterationResp = "allowed-error";
                    console.log(error);
                    this.modalLoadingFlag = false;
                },
            });
    }

    /**
     * @author Andre Pacheco
     * Método para selecionar um usuário para ser editado
     * @param user Objeto com os dados do usuário a ser editado
     * @returns void
     */
    public setSelectedUser(user: any): void {
        this.selectedUser = user;
        this.flagModalEdit = true;
    }

    /**
     * Método para fechar o modal de gerenciamento do usuário
     */
    public closeEditModal(): void {
        this.flagModalEdit = false;
    }

    /**
     * @author Gabryel Batista (modificado por André Pacheco)
     * Método para alterar a role de um usuário no sistema
     * @param user Um objeto com os dados do usuário a ser alterado
     */
    public changeUserRole(): void {
        this.modalLoadingFlag = true;
        this.userService
            .changeUserRole(
                this.selectedUser.tipoUsuario,
                this.selectedUser._links.user.href
            )
            .subscribe({
                next: (response) => {
                    this.alterationResp = "role-saved";
                    this.modalLoadingFlag = false;
                },
                error: (error) => {
                    this.alterationResp = "role-error";
                    console.log(error);
                    this.modalLoadingFlag = false;
                },
            });
    }

    /**
     * @author Gabryel Batista (modificado por André Pacheco)
     * Método para deletar um usuário do sistema
     * @param user Obeto com os dados do usuário a ser deletado
     */
    public deleteUser(user: any): void {
        const id = new User(user).getId();

        this.modalLoadingFlag = true;
        this.alterationResp = "user-deleted";
        this.userService.delete(id).subscribe({
            next: (response) => {
                this.alterationResp = "user-deleted";
                this.getUsersByName(this.currentPage);
                this.modalLoadingFlag = false;
            },
            error: (error) => {
                this.alterationResp = "user-delete-error";
                this.modalLoadingFlag = false;
            },
        });
    }

    /**
     * @author Eduarda Magesk
     * Method to get all users found by name
     * @param page
     */
    public getUsersByName(page: number) {
        this.modalLoadingFlag = true;
        // console.log(this.userSettingsForm.value);
        this.userService.findByFullNameContaining(this.userSettingsForm.value.fullName, page - 1, this.itemsPerPage).subscribe({
            next: (response) => {
                this.users = response._embedded.user as any[];
                this.totalItems = response.page.totalElements;
                this.totalPages = response.page.totalPages;
                this.modalLoadingFlag = false;
            },
            error: (error) => {
                this.failureFlag = true;
                this.modalLoadingFlag = false;
            },
        });

    }

    /**
     * @author Eduarda Magesk
     * Method to search users by name
     */
    public searchUsersByName() {
        this.getUsersByName(this.currentPage);
    }
}
