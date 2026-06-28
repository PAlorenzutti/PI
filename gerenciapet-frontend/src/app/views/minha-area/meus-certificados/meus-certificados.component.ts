import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { faCertificate, faDownload } from '@fortawesome/free-solid-svg-icons';
import { URL_API } from '../../../utils/url-api';
import { CertificadoPdfService } from '../../../services/pdf/certificado-pdf.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-meus-certificados',
  templateUrl: './meus-certificados.component.html',
  styleUrls: ['./meus-certificados.component.scss']
})
export class MeusCertificadosComponent implements OnInit {

  public faIcons = { faCertificate, faDownload };
  public loading: boolean = true;
  public certificados: any[] = [];
  public loggedUser: any;
  public gerandoId: string | null = null; // para mostrar loading em um botão específico

  constructor(
    private userService: UserService,
    private pdfService: CertificadoPdfService
  ) { }

  ngOnInit(): void {
    this.loggedUser = this.userService.getLoggedUser?.();
    if (this.loggedUser && this.loggedUser.email) {
      this.loadCertificados(this.loggedUser.email);
    } else {
      this.loading = false;
    }
  }

  loadCertificados(email: string) {
    this.userService.getByUrl(`${URL_API}/api/certificado/search/findByUser_Email?email=${email}`).subscribe({
      next: (res: any) => {
        this.certificados = res._embedded?.certificados || res._embedded?.certificado || [];
        this.loading = false;
      },
      error: () => {
        this.certificados = [];
        this.loading = false;
      }
    });
  }

  async baixarPdf(cert: any) {
    this.gerandoId = cert.codigoValidacao;

    try {
      // 1. Buscar o Usuário
      const userUrl = cert._links?.user?.href;
      const user = userUrl ? await firstValueFrom(this.userService.getByUrl(userUrl)) : null;
      
      let inscricao = null;
      let evento = null;
      let nomeTutor = 'Tutor Coordenador';
      let siglaGrupoPet = '';

      if (cert.tipo === 'HORAS_COMPLEMENTARES') {
        const inscricaoUrl = cert._links?.inscricao?.href;
        if (inscricaoUrl) {
          inscricao = await firstValueFrom(this.userService.getByUrl(inscricaoUrl));
          const eventoUrl = inscricao._links?.evento?.href;
          if (eventoUrl) {
            evento = await firstValueFrom(this.userService.getByUrl(eventoUrl));
            
            // Buscar Nome do Tutor
            try {
              const grupoPetUrl = evento._links?.grupoPet?.href;
              if (grupoPetUrl) {
                const grupoPet: any = await firstValueFrom(this.userService.getByUrl(grupoPetUrl));
                siglaGrupoPet = grupoPet.sigla || '';
                const tutorUrl = grupoPet._links?.tutorCoordenador?.href;
                if (tutorUrl) {
                  const tutor: any = await firstValueFrom(this.userService.getByUrl(tutorUrl));
                  const tutorUserUrl = tutor._links?.user?.href;
                  if (tutorUserUrl) {
                    const tutorUser: any = await firstValueFrom(this.userService.getByUrl(tutorUserUrl));
                    if (tutorUser && tutorUser.nome) {
                      nomeTutor = tutorUser.nome;
                    }
                  }
                }
              }
            } catch (e) {
              console.warn("Could not fetch tutor name", e);
            }
          }
        }
      } else {
         // HORAS_EXTENSAO
         try {
             const userId = userUrl.split('/').pop();
             const extRes: any = await firstValueFrom(this.userService.getByUrl(`${URL_API}/api/extensionista/search/findByUser_Id?userId=${userId}`));
             const ext = extRes._embedded?.extensionistas?.[0] || extRes._embedded?.extensionista?.[0];
             if (ext && ext._links?.grupoPet?.href) {
                const grupoPet: any = await firstValueFrom(this.userService.getByUrl(ext._links.grupoPet.href));
                siglaGrupoPet = grupoPet.sigla || '';
                const tutorUrl = grupoPet._links?.tutorCoordenador?.href;
                if (tutorUrl) {
                  const tutor: any = await firstValueFrom(this.userService.getByUrl(tutorUrl));
                  const tutorUserUrl = tutor._links?.user?.href;
                  if (tutorUserUrl) {
                    const tutorUser: any = await firstValueFrom(this.userService.getByUrl(tutorUserUrl));
                    if (tutorUser && tutorUser.nome) {
                      nomeTutor = tutorUser.nome;
                    }
                  }
                }
             }
         } catch(e) {
             console.warn("Could not fetch tutor name for extensionista", e);
         }
      }

      this.pdfService.gerarCertificado(cert, user, inscricao, evento, nomeTutor, siglaGrupoPet);
    } catch (error) {
      console.error("Erro ao gerar PDF", error);
      // Fallback in case of error
      this.pdfService.gerarCertificado(cert, null, null, null, 'Tutor Coordenador', '');
    } finally {
      this.gerandoId = null;
    }
  }
}
