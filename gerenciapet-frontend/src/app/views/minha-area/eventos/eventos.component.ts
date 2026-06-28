import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { GrupoPetService } from '../../../services/grupo-pet.service';
import { faCalendarAlt, faSearch, faArrowRight, faArrowLeft, faCheckCircle, faEye, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-eventos-aluno',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
  providers: [UserService, GrupoPetService]
})
export class EventosComponent implements OnInit {

  public faIcons = { faCalendarAlt, faSearch, faArrowRight, faArrowLeft, faCheckCircle, faEye, faPlusCircle, faTrash };

  public loadingMyInscricoes: boolean = true;
  public myInscricoes: any[] = [];
  
  public loadingGrupos: boolean = true;
  public gruposPet: any[] = [];
  
  public selectedGrupoPet: any = null;
  public loadingEventos: boolean = false;
  public eventosDisponiveis: any[] = [];

  public selectedEventoToView: any = null;
  public viewModalVisible: boolean = false;

  public eventoToEnroll: any = null;
  public enrollConfirmModalVisible: boolean = false;
  public enrollSuccessModalVisible: boolean = false;
  public enrollErrorModalVisible: boolean = false;
  public errorMessage: string = '';

  public inscricaoToUnenroll: any = null;
  public unenrollConfirmModalVisible: boolean = false;

  public loggedUser: any;
  public loggedUserId: string = '0';

  constructor(
    private userService: UserService,
    private grupoPetService: GrupoPetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.loggedUser = this.userService.getLoggedUser?.();
    if (this.loggedUser && this.loggedUser.email) {
      this.userService.findByEmail(this.loggedUser.email).subscribe({
        next: (user: any) => {
          if (user._links && user._links.self) {
            const parts = user._links.self.href.split('/');
            this.loggedUserId = parts[parts.length - 1];
            this.loadMyInscricoes();
            this.loadGruposPet();
          }
        },
        error: () => {
          this.loadingMyInscricoes = false;
          this.loadingGrupos = false;
        }
      });
    }
  }

  loadMyInscricoes() {
    this.loadingMyInscricoes = true;
    this.userService.getInscricoes(this.loggedUserId).subscribe({
      next: (response: any) => {
        const inscricoes = response._embedded?.inscricoes || response._embedded?.inscricao || [];
        this.myInscricoes = inscricoes;
        
        // Buscar detalhes do evento para cada inscrição usando o HATEOAS link
        this.myInscricoes.forEach((inscricao: any) => {
          const eventoUrl = inscricao._links?.evento?.href;
          if (eventoUrl) {
            this.userService.getByUrl(eventoUrl).subscribe((evento: any) => {
              inscricao.evento = evento;
            });
          }
        });
        
        this.loadingMyInscricoes = false;
      },
      error: () => {
        this.myInscricoes = [];
        this.loadingMyInscricoes = false;
      }
    });
  }

  loadGruposPet() {
    this.loadingGrupos = true;
    // Loading all for simplicity, can be paginated if needed
    this.grupoPetService.getAllPagedAndSorted(0, 100).subscribe({
      next: (response: any) => {
        this.gruposPet = response._embedded?.grupoPet || [];
        this.loadingGrupos = false;
      },
      error: () => {
        this.gruposPet = [];
        this.loadingGrupos = false;
      }
    });
  }

  selectGrupoPet(grupo: any) {
    this.selectedGrupoPet = grupo;
    let grupoPetId = 0;
    if (grupo._links && grupo._links.self) {
      const parts = grupo._links.self.href.split('/');
      grupoPetId = parseInt(parts[parts.length - 1], 10);
    } else if (grupo.id) {
      grupoPetId = grupo.id;
    }

    this.loadingEventos = true;
    this.grupoPetService.getEventos(grupoPetId).subscribe({
      next: (response: any) => {
        // filter only events that are ABERTO or EM_ANDAMENTO
        const todosEventos = response._embedded?.evento || [];
        this.eventosDisponiveis = todosEventos.filter((e: any) => e.status !== 'ENCERRADO');
        this.loadingEventos = false;
      },
      error: () => {
        this.eventosDisponiveis = [];
        this.loadingEventos = false;
      }
    });
  }

  clearSelectedGrupoPet() {
    this.selectedGrupoPet = null;
    this.eventosDisponiveis = [];
  }

  viewEvento(evento: any) {
    this.selectedEventoToView = evento;
    this.viewModalVisible = true;
  }

  closeViewModal() {
    this.viewModalVisible = false;
    this.selectedEventoToView = null;
  }

  matricular(evento: any) {
    this.eventoToEnroll = evento;
    this.enrollConfirmModalVisible = true;
  }

  confirmEnroll() {
    if (!this.loggedUserId || this.loggedUserId === '0') {
      this.enrollConfirmModalVisible = false;
      this.enrollErrorModalVisible = true;
      return;
    }

    const eventoHref = this.eventoToEnroll?._links?.self?.href;
    if (!eventoHref) {
      this.enrollConfirmModalVisible = false;
      this.enrollErrorModalVisible = true;
      return;
    }

    this.userService.matricular(this.loggedUserId, eventoHref).subscribe({
      next: () => {
        this.enrollConfirmModalVisible = false;
        this.enrollSuccessModalVisible = true;
        this.loadMyInscricoes(); // Atualiza a tabela "Meus Eventos"
        
        // Atualizar a lista de eventos para refletir as vagas
        if (this.selectedGrupoPet) {
          this.selectGrupoPet(this.selectedGrupoPet);
        }
      },
      error: (err) => {
        this.enrollConfirmModalVisible = false;
        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Não foi possível realizar a matrícula. Verifique se não há conflitos ou falta de vagas.';
        }
        this.enrollErrorModalVisible = true;
        console.error(err);
      }
    });
  }

  closeConfirmModal() {
    this.enrollConfirmModalVisible = false;
    this.eventoToEnroll = null;
  }

  closeSuccessModal() {
    this.enrollSuccessModalVisible = false;
    this.eventoToEnroll = null;
  }

  closeErrorModal() {
    this.enrollErrorModalVisible = false;
    this.eventoToEnroll = null;
  }

  desmatricular(inscricao: any) {
    this.inscricaoToUnenroll = inscricao;
    this.unenrollConfirmModalVisible = true;
  }

  confirmUnenroll() {
    if (!this.inscricaoToUnenroll || !this.inscricaoToUnenroll._links?.self?.href) {
      this.unenrollConfirmModalVisible = false;
      this.enrollErrorModalVisible = true;
      return;
    }

    const hrefParts = this.inscricaoToUnenroll._links.self.href.split('/');
    const inscricaoId = hrefParts[hrefParts.length - 1];

    this.userService.desmatricular(inscricaoId).subscribe({
      next: () => {
        this.unenrollConfirmModalVisible = false;
        this.loadMyInscricoes(); // Refresh list
        
        // Atualizar vagas nos eventos
        if (this.selectedGrupoPet) {
          this.selectGrupoPet(this.selectedGrupoPet);
        }
      },
      error: (err) => {
        this.unenrollConfirmModalVisible = false;
        this.enrollErrorModalVisible = true;
        console.error(err);
      }
    });
  }

  closeUnenrollConfirmModal() {
    this.unenrollConfirmModalVisible = false;
    this.inscricaoToUnenroll = null;
  }

  getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'MATRICULADO': return 'primary';
      case 'APROVADO': return 'success';
      case 'REPROVADO': return 'danger';
      case 'ABERTO': return 'success';
      case 'EM_ANDAMENTO': return 'warning';
      case 'ENCERRADO': return 'secondary';
      default: return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    if (!status) return 'Indefinido';
    return status.replace('_', ' ');
  }
}
