import { Component } from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	ValidationErrors,
	Validators,
} from "@angular/forms";
import { ValidationFormsService } from "../../../services/validation-forms.service";
import { Router } from "@angular/router";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import User from "./../../../models/User";
import { UserService } from "./../../../services/user.service";

import { cilUserFollow } from "@coreui/icons";
import { RegisterService } from "../../../services/register.service";


@Component({
	selector: "app-user-new",
	templateUrl: "./user-new.component.html",
	styleUrls: [],
	providers: [ValidationFormsService, UserService],
})
export class UserNewComponent {
	successVisible = false;
    errorVisible = false;
    loadingVisible = false

    public registerErrorMessage = ""

	/**************************ICONS USED ******************************/
	public icons = { cilUserFollow };
	public iconsFa = { faCirclePlus };
	/**************************ICONS USED ******************************/
	user?: User;

	simpleForm!: FormGroup;
	formErrors: any;
	formControls!: string[];
	submitted = false;
	public responseRegisterFlag?: string;

	constructor(
		private userService: UserService,
		private router: Router,
		private formBuilder: FormBuilder,
		public validationFormsService: ValidationFormsService,
		private registerService: RegisterService,
	) {
		this.formErrors = this.validationFormsService.errorMessages;
		this.createForm();
	}

    createForm() {
        this.simpleForm = this.formBuilder.group(
            {
                fullName: ["", [Validators.required]],
                email: ["", [Validators.email]],
                cpf: ["", [Validators.required, Validators.minLength(11)], this.registerService.cpfValidator()],
                role: ["", []],
				allowed: [true],
            },
        );

        this.formControls = Object.keys(this.simpleForm.controls);
    }

	onReset() {
		this.submitted = false;
		this.createForm();
	}

	onValidate() {
		this.submitted = true;
		return this.simpleForm.status === "VALID";
	}

	onSubmit() {
		if (this.onValidate()) {
			//atribuição dos valores do formulário para o modelo "user"
            this.user = new User(this.simpleForm.value);
            if (!this.user.email) this.user.email = null as any;

            this.loadingVisible = true;

			//CHAMADA PARA O SERVIÇO DE CADASTRO DE USUÁRIO
			this.userService.userRegisterDashboard(this.user).subscribe({
				next : (response) => {
                    //exibe modal de sucesso
                    this.loadingVisible = false;
                    if (response.status == "registered") {
                        this.toggleSuccessModal();
                    } else {
                        this.toggleErrorModal();
                    }
					this.onReset();

				},
				error : (error) => {
                    //exibe modal de erro
                    this.loadingVisible = false;
					this.onReset();
					this.toggleErrorModal();
				}
			});
		}
	}

	toggleSuccessModal() {
		this.successVisible = !this.successVisible;
	}

	handleSuccessModalChange(event: any) {
		this.successVisible = event;
	}

	toggleErrorModal() {
		this.errorVisible = !this.errorVisible;
	}

	handleErrorModalChange(event: any) {
		this.errorVisible = event;
	}

	isValid(ctrl: AbstractControl<any, any>) {
		if (ctrl.touched && ctrl.valid) return true;
		else if ((ctrl.touched || this.submitted) && ctrl.invalid) return false;
		else return undefined;
	}
}
