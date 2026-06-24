import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { faPlus, faPenToSquare, faTrash, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { UserService } from '../../../services/user.service';
import { TutorService } from '../../../services/tutor.service';
import { ExtensionistaService } from '../../../services/extensionista.service';
import { EventoService } from '../../../services/evento.service';

@Component({
  selector: 'app-evento-list',
  templateUrl: './evento-list.component.html',
  styleUrls: ['./evento-list.component.scss'],
  providers: [TutorService, ExtensionistaService, EventoService]
})
export class EventoListComponent implements OnInit {

  public faIcons = { faPlus, faPenToSquare, faTrash, faCalendarAlt };

  public loading = true;
  public hasGrupoPet = false;
  public eventos: any[] = [];
  public grupoHref?: string;

  public eventoToDelete?: any;
  public visibleDeleteModal = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private tutorService: TutorService,
    private extensionistaService: ExtensionistaService,
    private eventoService: EventoService
  ) { }

  ngOnInit(): void {
    this.checkUserGrupoPetAndLoad();
  }

  checkUserGrupoPetAndLoad() {
    const loggedUser = this.userService.getLoggedUser?.();
    if (!loggedUser) {
      this.hasGrupoPet = false;
      this.loading = false;
      return;
    }

    const fetchEventos = () => {
      if (this.grupoHref) {
        this.http.get<any>(`${this.grupoHref}/eventos`).subscribe({
          next: (res) => {
            this.eventos = res._embedded?.evento || [];
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
      } else {
        this.loading = false;
      }
    };

    if (loggedUser.tipoUsuario === 'TUTOR') {
      this.tutorService.findByUserEmail(loggedUser.email).subscribe({
        next: (tutor: any) => {
          if (tutor && tutor._links && tutor._links.grupoPetCoordena) {
            this.tutorService.getGrupoPetByTutorHref(tutor._links.grupoPetCoordena.href).subscribe({
              next: (grupo: any) => {
                this.hasGrupoPet = true;
                this.grupoHref = grupo._links.self.href;
                fetchEventos();
              },
              error: () => { this.loading = false; }
            });
          } else {
            this.loading = false;
          }
        },
        error: () => { this.loading = false; }
      });
    } else if (loggedUser.tipoUsuario === 'EXTENSIONISTA') {
      this.extensionistaService.findByUserEmail(loggedUser.email).subscribe({
        next: (ext: any) => {
          if (ext && ext._links && ext._links.grupoPet) {
            this.extensionistaService.getGrupoPetByExtensionistaHref(ext._links.grupoPet.href).subscribe({
              next: (grupo: any) => {
                this.hasGrupoPet = true;
                this.grupoHref = grupo._links.self.href;
                fetchEventos();
              },
              error: () => { this.loading = false; }
            });
          } else {
            this.loading = false;
          }
        },
        error: () => { this.loading = false; }
      });
    } else {
      this.hasGrupoPet = false;
      this.loading = false;
    }
  }

  getEventoId(evento: any): string {
    const href = evento._links.self.href;
    return href.substring(href.lastIndexOf('/') + 1);
  }

  editEvento(evento: any) {
    const id = this.getEventoId(evento);
    this.router.navigate(['/dashboard/eventos/editar', id]);
  }

  confirmDelete(evento: any) {
    this.eventoToDelete = evento;
    this.visibleDeleteModal = true;
  }

  deleteEvento() {
    if (this.eventoToDelete) {
      this.eventoService.delete(this.eventoToDelete._links.self.href).subscribe({
        next: () => {
          this.visibleDeleteModal = false;
          this.checkUserGrupoPetAndLoad();
        },
        error: () => {
          this.visibleDeleteModal = false;
          alert('Erro ao excluir evento');
        }
      });
    }
  }

  closeDeleteModal() {
    this.visibleDeleteModal = false;
    this.eventoToDelete = undefined;
  }
}
