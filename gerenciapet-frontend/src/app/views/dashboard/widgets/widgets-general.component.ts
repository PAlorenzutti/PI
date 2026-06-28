import User from "../../../models/User";
import { Component, Input, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
    cilHospital,
    cilCalendar,
    cilPeople,
    cilBriefcase,
    cilAddressBook,
    cilMedicalCross,
    cilHealing,
} from "@coreui/icons";
import {
    faBandage,
    faChildren,
    faSprayCan,
    faUserDoctor,
    faUsers,
    faCalendarCheck,
    faCertificate,
    faCheckToSlot
} from "@fortawesome/free-solid-svg-icons";
import { UserService } from "../../../services/user.service";
import { GrupoPetService } from "../../../services/grupo-pet.service";
import { TutorService } from "../../../services/tutor.service";
import { URL_API } from "../../../utils/url-api";

@Component({
    selector: "app-widgets-general",
    templateUrl: "./widgets-general.component.html",
    providers: [TutorService]
})
export class WidgetsGeneralComponent implements OnInit {
    /***************************ICONS USED********************************/
    public icons = {
        cilCalendar,
        cilHospital,
        cilPeople,
        cilBriefcase,
        cilAddressBook,
        cilMedicalCross,
        cilHealing,
        faUsers,
        faUserDoctor,
        faBandage,
        faSprayCan,
        faCalendarCheck,
        faCertificate,
        faCheckToSlot
    };
    /**********************************************************************/

    public totalGrupos: number | undefined;
    public totalTutores: number | undefined;

    public totalEventos: number | undefined;
    public totalExtensionistas: number | undefined;

    public totalInscricoes: number | undefined;
    public totalCertificados: number | undefined;

    @Input()
    public loggedUser!: User;

    constructor(
        private userService: UserService,
        private grupoPetService: GrupoPetService,
        private tutorService: TutorService,
        private http: HttpClient
    ) { }

    ngOnInit() {
        if (this.loggedUser?.tipoUsuario === 'ADMIN') {
            this.grupoPetService.countGruposPet().subscribe({
                next: (count: number) => this.totalGrupos = count,
                error: () => this.totalGrupos = 0
            });

            this.userService.countTutores().subscribe({
                next: (count: number) => this.totalTutores = count,
                error: () => this.totalTutores = 0
            });
        } else if (this.loggedUser?.tipoUsuario === 'TUTOR') {
            this.tutorService.findByUserEmail(this.loggedUser.email).subscribe({
                next: (tutor: any) => {
                    if (tutor && tutor._links && tutor._links.grupoPetCoordena) {
                        this.tutorService.getGrupoPetByTutorHref(tutor._links.grupoPetCoordena.href).subscribe({
                            next: (grupo: any) => {
                                const grupoHref = grupo._links.self.href;
                                // Fetch eventos count
                                this.http.get<any>(`${grupoHref}/eventos`).subscribe({
                                    next: (res) => {
                                        this.totalEventos = res.page?.totalElements || (res._embedded?.evento ? res._embedded.evento.length : 0);
                                    },
                                    error: () => this.totalEventos = 0
                                });
                                // Fetch extensionistas count
                                this.http.get<any>(`${grupoHref}/membros`).subscribe({
                                    next: (res) => {
                                        this.totalExtensionistas = res.page?.totalElements || (res._embedded?.extensionista ? res._embedded.extensionista.length : (res._embedded?.extensionistas ? res._embedded.extensionistas.length : 0));
                                    },
                                    error: () => this.totalExtensionistas = 0
                                });
                            },
                            error: () => {
                                this.totalEventos = 0;
                                this.totalExtensionistas = 0;
                            }
                        });
                    }
                },
                error: () => {
                    this.totalEventos = 0;
                    this.totalExtensionistas = 0;
                }
            });
        } else if (this.loggedUser?.tipoUsuario === 'ALUNO' || this.loggedUser?.tipoUsuario === 'EXTENSIONISTA') {
            this.userService.getInscricoes(this.loggedUser.getId()).subscribe({
                next: (res: any) => {
                    this.totalInscricoes = res._embedded?.inscricoes ? res._embedded.inscricoes.length : (res._embedded?.inscricao ? res._embedded.inscricao.length : 0);
                },
                error: () => this.totalInscricoes = 0
            });

            this.http.get<any>(`${URL_API}/api/certificado/search/findByUser_Email?email=${this.loggedUser.email}`).subscribe({
                next: (res: any) => {
                    this.totalCertificados = res._embedded?.certificados ? res._embedded.certificados.length : (res._embedded?.certificado ? res._embedded.certificado.length : 0);
                },
                error: () => this.totalCertificados = 0
            });
        }
    }
}
