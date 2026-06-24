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
    faCalendarCheck
} from "@fortawesome/free-solid-svg-icons";
import { UserService } from "../../../services/user.service";
import { GrupoPetService } from "../../../services/grupo-pet.service";
import { TutorService } from "../../../services/tutor.service";

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
        faCalendarCheck
    };
    /**********************************************************************/

    public totalGrupos: number | undefined;
    public totalTutores: number | undefined;

    public totalEventos: number | undefined;
    public totalExtensionistas: number | undefined;

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
        }
    }
}
