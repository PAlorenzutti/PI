import { Component, OnInit } from '@angular/core';
import { faCertificate, faArrowLeft, faUserGraduate, faUsers, faFileSignature } from '@fortawesome/free-solid-svg-icons';
import { TutorService } from '../../../services/tutor.service';
import { UserService } from '../../../services/user.service';
import { EventoService } from '../../../services/evento.service';

@Component({
  selector: 'app-evento-certificado',
  templateUrl: './evento-certificado.component.html',
  styleUrls: ['./evento-certificado.component.scss'],
  providers: [TutorService, UserService, EventoService]
})
export class EventoCertificadoComponent implements OnInit {

  public faIcons = { faCertificate, faArrowLeft, faUserGraduate, faUsers, faFileSignature };
  
  public loading = true;
  public hasGrupoPet = false;
  
  public eventos: any[] = [];
  public extensionistas: any[] = [];
  
  public selectedEvento: any = null;
  public inscricoes: any[] = [];
  public loadingInscricoes = false;

  constructor(
    private tutorService: TutorService,
    private userService: UserService,
    private eventoService: EventoService
  ) { }

  ngOnInit(): void {
    const user = this.userService.getLoggedUser?.();
    if (!user || user.tipoUsuario !== 'TUTOR') {
      this.hasGrupoPet = false;
      this.loading = false;
      return;
    }

    this.tutorService.findByUserEmail(user.email).subscribe({
      next: (tutor: any) => {
        if (tutor && tutor._links && tutor._links.grupoPetCoordena) {
          this.tutorService.getGrupoPetByTutorHref(tutor._links.grupoPetCoordena.href).subscribe({
            next: (grupo: any) => {
              this.hasGrupoPet = true;
              this.loadEventos(grupo._links.self.href);
              this.loadExtensionistas(grupo._links.self.href);
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

  loadExtensionistas(grupoPetHref: string) {
    this.userService.getByUrl(`${grupoPetHref.split('/grupoPet')[0]}/extensionista/search/findByGrupoPetId?grupoPetId=${grupoPetHref.split('/').pop()}&projection=comUser`).subscribe({
      next: (res: any) => {
        this.extensionistas = res._embedded?.extensionistas || res._embedded?.extensionista || [];
        
        // Verifica se cada extensionista já tem certificado
        this.extensionistas.forEach(ext => {
          if (ext.user || ext.email) {
            const email = ext.user?.email || ext.email;
            if (email) {
              const url = `${grupoPetHref.split('/grupoPet')[0]}/certificado/search/findByUser_Email?email=${email}`;
              this.userService.getByUrl(url).subscribe({
                next: (certRes: any) => {
                  const certs = certRes._embedded?.certificados || certRes._embedded?.certificado || [];
                  // Verifica se tem algum do tipo HORAS_EXTENSAO
                  const certExtensao = certs.find((c: any) => c.tipo === 'HORAS_EXTENSAO');
                  if (certExtensao) {
                    ext.certificadoData = certExtensao;
                  }
                },
                error: () => {}
              });
            }
          }
        });
      },
      error: () => {}
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
          
          // Verificar se tem certificado
          this.userService.getByUrl(inscricao._links.certificado.href).subscribe({
            next: (certData: any) => { inscricao.certificadoData = certData; },
            error: () => { inscricao.certificadoData = null; }
          }).add(() => {
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
        });
      },
      error: () => this.loadingInscricoes = false
    });
  }

  voltarParaDashboard() {
    this.selectedEvento = null;
    this.inscricoes = [];
  }

  public modalVisible = false;
  public targetToEmit: any = null;
  public emitType: 'ALUNO' | 'EXTENSIONISTA' | null = null;
  public saving = false;

  public successModalVisible = false;
  public successMessage = '';

  abrirModalEmitir(target: any, type: 'ALUNO' | 'EXTENSIONISTA') {
    this.targetToEmit = target;
    this.emitType = type;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
    this.targetToEmit = null;
    this.emitType = null;
  }

  closeSuccessModal() {
    this.successModalVisible = false;
  }

  confirmarEmissao() {
    if (!this.targetToEmit || !this.emitType) return;
    this.saving = true;
    
    if (this.emitType === 'ALUNO') {
      const id = this.targetToEmit._links.self.href.split('/').pop();
      this.userService.emitirCertificadoAluno(id).subscribe({
        next: (res: any) => {
          this.targetToEmit.certificadoData = res;
          this.saving = false;
          this.closeModal();
          this.successMessage = 'Certificado de Horas Complementares emitido com sucesso!';
          this.successModalVisible = true;
        },
        error: () => {
          this.saving = false;
          this.closeModal();
        }
      });
    } else if (this.emitType === 'EXTENSIONISTA') {
      const id = this.targetToEmit.id || this.targetToEmit._links.self.href.split('/').pop();
      this.userService.emitirCertificadoExtensionista(id).subscribe({
        next: (res: any) => {
          this.targetToEmit.certificadoData = res || true; // Set to display the badge
          this.saving = false;
          this.closeModal();
          this.successMessage = 'Certificado de Horas de Extensão emitido com sucesso!';
          this.successModalVisible = true;
        },
        error: () => {
          this.saving = false;
          this.closeModal();
        }
      });
    }
  }
}
