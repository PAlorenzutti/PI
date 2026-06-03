import User from "../../../models/User";
import { Component, Input } from "@angular/core";
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

@Component({
    selector: "app-widgets-general",
    templateUrl: "./widgets-general.component.html",
})
export class WidgetsGeneralComponent {
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

    public totalWomen: number | undefined;
    public totalChildren: number | undefined;
    public totalProfessionals: number | undefined;

    @Input()
    public loggedUser!: User;

    constructor(
    ) { }

    ngOnInit() {

    }
}
