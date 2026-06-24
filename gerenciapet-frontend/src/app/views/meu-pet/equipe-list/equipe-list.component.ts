import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { TutorService } from '../../../services/tutor.service';
import { ExtensionistaService } from '../../../services/extensionista.service';
import { faPlus, faEdit, faTrash, faArrowLeft, faUsers } from '@fortawesome/free-solid-svg-icons';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-equipe-list',
  templateUrl: './equipe-list.component.html',
  styleUrl: './equipe-list.component.scss',
  providers: [UserService, TutorService, ExtensionistaService]
})
export class EquipeListComponent implements OnInit {

  public faIcons = { faPlus, faEdit, faTrash, faArrowLeft, faUsers };

  public hasGrupoPet: boolean = false;
  public loading: boolean = true;
  public grupoPet: any;
  public extensionistas: any[] = [];
  
  public itemsPerPage: number = 10;
  public totalItems: number = 0;
  public currentPage: number = 1;

  public deleteModalVisible: boolean = false;
  public extensionistaToDelete: any = null;

  constructor(
    private userService: UserService,
    private tutorService: TutorService,
    private extensionistaService: ExtensionistaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTutorData();
  }

  loadTutorData() {
    this.loading = true;
    const logged = this.userService.getLoggedUser?.();
    if (logged && logged.email) {
      this.tutorService.findByUserEmail(logged.email).subscribe({
        next: (tutor: any) => {
          if (tutor && tutor._links && tutor._links.grupoPetCoordena) {
            this.tutorService.getGrupoPetByTutorHref(tutor._links.grupoPetCoordena.href).subscribe({
              next: (grupo: any) => {
                this.hasGrupoPet = true;
                this.grupoPet = grupo;
                this.loadExtensionistas(this.currentPage);
              },
              error: () => {
                this.hasGrupoPet = false;
                this.loading = false;
              }
            });
          } else {
            this.hasGrupoPet = false;
            this.loading = false;
          }
        },
        error: () => {
          this.hasGrupoPet = false;
          this.loading = false;
        }
      });
    } else {
      this.hasGrupoPet = false;
      this.loading = false;
    }
  }

  loadExtensionistas(page: number) {
    if (!this.grupoPet) return;
    
    // Extract ID from href
    let grupoPetId = 0;
    if (this.grupoPet._links && this.grupoPet._links.self) {
      const parts = this.grupoPet._links.self.href.split('/');
      grupoPetId = parseInt(parts[parts.length - 1], 10);
    } else if (this.grupoPet.id) {
      grupoPetId = this.grupoPet.id;
    }

    this.extensionistaService.findByGrupoPetId(grupoPetId, page - 1, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.extensionistas = response._embedded.extensionista || [];
        this.totalItems = response.page.totalElements;
        this.loading = false;
      },
      error: () => {
        this.extensionistas = [];
        this.totalItems = 0;
        this.loading = false;
      }
    });
  }

  pageChange(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.loadExtensionistas(this.currentPage);
  }

  goToNew() {
    this.router.navigate(['/dashboard/meu-pet/equipe/novo']);
  }

  selectDeletedExtensionista(ext: any) {
    this.extensionistaToDelete = ext;
    this.deleteModalVisible = true;
  }

  toggleDeleteModal() {
    this.deleteModalVisible = !this.deleteModalVisible;
    if (!this.deleteModalVisible) {
      this.extensionistaToDelete = null;
    }
  }

  deleteExtensionista() {
    if (this.extensionistaToDelete) {
      let extId = 0;
      if (this.extensionistaToDelete._links && this.extensionistaToDelete._links.self) {
        const parts = this.extensionistaToDelete._links.self.href.split('/');
        extId = parseInt(parts[parts.length - 1], 10);
      } else if (this.extensionistaToDelete.id) {
        extId = this.extensionistaToDelete.id;
      }

      this.loading = true;
      this.extensionistaService.delete(extId).subscribe({
        next: () => {
          this.toggleDeleteModal();
          this.loadExtensionistas(this.currentPage);
        },
        error: () => {
          this.toggleDeleteModal();
          this.loading = false;
        }
      });
    }
  }
}
