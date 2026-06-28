import { Component, OnInit } from '@angular/core';
import { faStar, faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ExtensionistaService } from '../../../services/extensionista.service';
import { UserService } from '../../../services/user.service';
import { EventoService } from '../../../services/evento.service';

@Component({
  selector: 'app-evento-notas',
  templateUrl: './evento-notas.component.html',
  styleUrls: ['./evento-notas.component.scss'],
  providers: [ExtensionistaService, UserService, EventoService]
})
export class EventoNotasComponent implements OnInit {

  public faIcons = { faStar, faArrowLeft, faEdit };
  
  public loading = true;
  public hasGrupoPet = false;
  public eventos: any[] = [];
  
  public selectedEvento: any = null;
  public inscricoes: any[] = [];
  public loadingInscricoes = false;

  public modalVisible = false;
  public selectedInscricao: any = null;
  public novaNota: number | null = null;
  public saving = false;

  constructor(
    private extensionistaService: ExtensionistaService,
    private userService: UserService,
    private eventoService: EventoService
  ) { }

  ngOnInit(): void {
    const user = this.userService.getLoggedUser?.();
    if (!user || user.tipoUsuario !== 'EXTENSIONISTA') {
      this.hasGrupoPet = false;
      this.loading = false;
      return;
    }

    this.extensionistaService.findByUserEmail(user.email).subscribe({
      next: (ext: any) => {
        if (ext && ext._links && ext._links.grupoPet) {
          this.extensionistaService.getGrupoPetByExtensionistaHref(ext._links.grupoPet.href).subscribe({
            next: (grupo: any) => {
              this.hasGrupoPet = true;
              this.loadEventos(grupo._links.self.href);
            },
            error: () => this.loading = false
          });
        } else {
          this.loading = false;
        }
      },
      error: () => this.loading = false
    });
  }

  loadEventos(grupoPetHref: string) {
    this.userService.getByUrl(`${grupoPetHref}/eventos`).subscribe({
      next: (res: any) => {
        this.eventos = res._embedded?.evento || [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  selecionarEvento(evento: any) {
    this.selectedEvento = evento;
    this.loadingInscricoes = true;
    this.inscricoes = [];
    
    // Buscar inscrições deste evento
    this.userService.getByUrl(evento._links.inscricoes.href).subscribe({
      next: (res: any) => {
        const inscricoes = res._embedded?.inscricoes || [];
        if (inscricoes.length === 0) {
          this.loadingInscricoes = false;
          return;
        }

        let loadedCount = 0;
        inscricoes.forEach((inscricao: any) => {
          this.userService.getByUrl(inscricao._links.user.href).subscribe({
            next: (userData: any) => {
              inscricao.userData = userData;
              this.inscricoes.push(inscricao);
              loadedCount++;
              if (loadedCount === inscricoes.length) {
                this.loadingInscricoes = false;
              }
            },
            error: () => {
              loadedCount++;
              if (loadedCount === inscricoes.length) this.loadingInscricoes = false;
            }
          });
        });
      },
      error: () => this.loadingInscricoes = false
    });
  }

  voltarParaEventos() {
    this.selectedEvento = null;
    this.inscricoes = [];
  }

  abrirModalNota(inscricao: any) {
    this.selectedInscricao = inscricao;
    this.novaNota = inscricao.nota ?? null;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
    this.selectedInscricao = null;
    this.novaNota = null;
  }

  salvarNota() {
    if (!this.selectedInscricao || this.novaNota === null || this.novaNota < 0 || this.novaNota > 100) return;
    this.saving = true;

    const hrefParts = this.selectedInscricao._links.self.href.split('/');
    const id = hrefParts[hrefParts.length - 1];

    this.userService.atualizarNota(id, this.novaNota).subscribe({
      next: () => {
        this.selectedInscricao.nota = this.novaNota;
        this.saving = false;
        this.closeModal();
      },
      error: (err) => {
        console.error('Erro ao salvar nota', err);
        this.saving = false;
        this.closeModal();
      }
    });
  }
}
