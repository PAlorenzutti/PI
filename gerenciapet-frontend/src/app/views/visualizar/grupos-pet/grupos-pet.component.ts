import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { PageChangedEvent, PaginationModule } from "ngx-bootstrap/pagination";
import { GrupoPetService } from "../../../services/grupo-pet.service";
import { UserService } from "../../../services/user.service";
import GrupoPet from "../../../models/GrupoPet";
import { CommonModule } from "@angular/common";
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grupos-pet',
  templateUrl: './grupos-pet.component.html',
  styleUrl: './grupos-pet.component.scss',
  providers: [GrupoPetService, UserService]
})
export class GruposPetComponent implements OnInit {

    public loggedUserTipo: string = "";

    public gruposPet: any[] = [];
    public alterationResp: string = "";
    public failureFlag: boolean = false;
    public selectedGrupoPet: any = null;
    public flagModalDelete: boolean = false;
    public faIcons = { faTrash, faPenToSquare };

    public itemsPerPage: number; 
    public totalItems: number = 0;
    public currentPage: number; 
    public maxPageLinks: number; 
    public totalPages?: number; 
    public modalLoadingFlag: boolean = false; 

    public searchSettingsForm: FormGroup;

    constructor(
        private grupoPetService: GrupoPetService, 
        private userService: UserService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
        this.itemsPerPage = 10;
        this.maxPageLinks = 10;
        this.currentPage = 1;

        this.searchSettingsForm = this.formBuilder.group({
            sigla: [""],
        });
    }

    ngOnInit() {
        const logged = this.userService.getLoggedUser?.();
        if (logged) {
            this.loggedUserTipo = logged.tipoUsuario;
        }

        this.getGruposPet(this.currentPage);
    }

    public canManage(): boolean {
        return this.loggedUserTipo === "ADMIN";
    }

    public pageChange(event: PageChangedEvent): void {
        this.currentPage = event.page;
        this.getGruposPet(this.currentPage);
    }

    public getGruposPet(page: number) {
        this.modalLoadingFlag = true;
        this.grupoPetService.findBySiglaContaining(this.searchSettingsForm.value.sigla, page - 1, this.itemsPerPage).subscribe({
            next: (response: any) => {
                this.gruposPet = response._embedded.grupoPet as any[];
                this.totalItems = response.page.totalElements;
                this.totalPages = response.page.totalPages;
                this.modalLoadingFlag = false;
            },
            error: (error: any) => {
                this.failureFlag = true;
                this.modalLoadingFlag = false;
            },
        });
    }

    public searchGruposBySigla() {
        this.getGruposPet(this.currentPage);
    }

    public editGrupo(grupo: any): void {
        this.router.navigate(['/dashboard/cadastrar/grupo-pet'], { queryParams: { sigla: grupo.sigla } });
    }

    public preDeleteGrupo(grupo: any): void {
        this.selectedGrupoPet = grupo;
        this.flagModalDelete = true;
    }

    public closeDeleteModal(): void {
        this.flagModalDelete = false;
        this.selectedGrupoPet = null;
    }

    public confirmDeleteGrupo(): void {
        if (this.selectedGrupoPet) {
            const id = new GrupoPet(this.selectedGrupoPet).getId();
            this.modalLoadingFlag = true;
            
            this.grupoPetService.delete(id).subscribe({
                next: (response: any) => {
                    this.alterationResp = "grupo-deleted";
                    this.getGruposPet(this.currentPage);
                    this.modalLoadingFlag = false;
                    this.closeDeleteModal();
                },
                error: (error: any) => {
                    this.alterationResp = "grupo-delete-error";
                    this.modalLoadingFlag = false;
                    this.closeDeleteModal();
                },
            });
        }
    }
}
