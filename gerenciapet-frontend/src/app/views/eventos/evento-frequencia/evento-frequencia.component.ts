import { Component, OnInit } from '@angular/core';
import { faClipboardList, faArrowLeft, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { ExtensionistaService } from '../../../services/extensionista.service';
import { UserService } from '../../../services/user.service';
import { EventoService } from '../../../services/evento.service';

@Component({
  selector: 'app-evento-frequencia',
  templateUrl: './evento-frequencia.component.html',
  styleUrls: ['./evento-frequencia.component.scss'],
  providers: [ExtensionistaService, UserService, EventoService]
})
export class EventoFrequenciaComponent implements OnInit {

  public faIcons = { faClipboardList, faArrowLeft, faCheckSquare };
  
  public loading = true;
  public hasGrupoPet = false;
  public eventos: any[] = [];
  
  public selectedEvento: any = null;
  public inscricoes: any[] = [];
  public loadingInscricoes = false;

  public modalVisible = false;
  public selectedInscricao: any = null;
  
  // Lista de datas do evento e estado de presença
  public diasEvento: { data: string, checked: boolean }[] = [];

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

  abrirModalFrequencia(inscricao: any) {
    this.selectedInscricao = inscricao;
    this.diasEvento = [];
    
    if (this.selectedEvento.dataInicio && this.selectedEvento.dataFim) {
      const d1 = new Date(this.selectedEvento.dataInicio + 'T00:00:00'); // Trata timezone local
      const d2 = new Date(this.selectedEvento.dataFim + 'T00:00:00');
      
      const diasPresentesMarcados = inscricao.diasPresentes ? inscricao.diasPresentes.split(',') : [];

      let diasPermitidos = [0,1,2,3,4,5,6]; 
      
      if (this.selectedEvento.tipo === 'CURSO' && this.selectedEvento.horarios.includes('|')) {
        const metadados = this.selectedEvento.horarios.split('|')[0].trim();
        diasPermitidos = metadados.split(',').map((num: string) => parseInt(num));
      }
      let currentDate = new Date(d1.getTime());
      
      while (currentDate <= d2) {
        
        if (diasPermitidos.includes(currentDate.getDay())) {
            const dataLocalStr = `${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            
            this.diasEvento.push({
              data: dataLocalStr,
              checked: diasPresentesMarcados.includes(dataLocalStr)
            });
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    this.modalVisible = true;
  }

  closeModal() {
    this.handleModalVisibleChange(false);
  }

  handleModalVisibleChange(visible: boolean) {
    this.modalVisible = visible;

    if (!visible) {
      this.selectedInscricao = null;
      this.diasEvento = [];
    }
  }

  togglePresenca(dia: any) {
    dia.checked = !dia.checked;
  }

  salvarFrequencia() {
    if (!this.selectedInscricao) return;

    const totalDias = this.diasEvento.length;
    if (totalDias === 0) {
      this.closeModal();
      return;
    }

    const presentes = this.diasEvento.filter(d => d.checked);
    const frequencia = (presentes.length / totalDias) * 100;
    const diasPresentesStr = presentes.map(d => d.data).join(',');

    const hrefParts = this.selectedInscricao._links.self.href.split('/');
    const id = hrefParts[hrefParts.length - 1];

    const payload = {
      frequencia: Math.round(frequencia), // Salva valor arredondado
      diasPresentes: diasPresentesStr
    };

    this.userService.atualizarFrequencia(id, payload).subscribe({
      next: () => {
        // Atualiza na view
        this.selectedInscricao.frequencia = payload.frequencia;
        this.selectedInscricao.diasPresentes = diasPresentesStr;
        this.closeModal();
      },
      error: (err) => {
        console.error('Erro ao salvar frequência', err);
        this.closeModal();
      }
    });
  }
}
