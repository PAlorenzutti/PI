import User from "../../../models/User";
import { Component, Input, OnInit } from "@angular/core";
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
    faPersonBreastfeeding,
    faSprayCan,
    faUserDoctor,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { UserService } from "../../../services/user.service";
import { GrupoPetService } from "../../../services/grupo-pet.service";

@Component({
    selector: "app-widgets-general",
    templateUrl: "./widgets-general.component.html",
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
        faChildren,
        faPersonBreastfeeding,
        faBandage,
        faSprayCan,
    };
    /**********************************************************************/

    public totalGrupos: number | undefined;
    public totalTutores: number | undefined;

    @Input()
    public loggedUser!: User;

    constructor(
        private userService: UserService,
        private grupoPetService: GrupoPetService
    ) { }

    ngOnInit() {
        this.grupoPetService.countGruposPet().subscribe({
            next: (count: number) => this.totalGrupos = count,
            error: () => this.totalGrupos = 0
        });

        this.userService.countTutores().subscribe({
            next: (count: number) => this.totalTutores = count,
            error: () => this.totalTutores = 0
        });
    }
}
