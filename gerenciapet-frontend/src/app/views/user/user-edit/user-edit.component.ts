import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { faCirclePlus, faEye, faEyeSlash, faHandshakeAngle, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import User from "../../../models/User";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValidationFormsService } from "../../../services/validation-forms.service";
import { faCircleCheck, faAddressBook, faIdBadge, faIdCard } from "@fortawesome/free-regular-svg-icons";
import { ViaCepService } from "../../../services/via-cep.service";
import { AutocompleteService } from "../../../services/autocomplete.service";
import { RegisterService } from "../../../services/register.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-user-edit",
    templateUrl: "./user-edit.component.html",
    styleUrls: [],
    providers: [UserService],
})
export class UserEditComponent implements OnInit {
    public user: any;
    public editErrorVisible: boolean = false;
    public editSuccessVisible: boolean = false;

    /**************************ICONS USED ******************************/

    public iconsFa = {
        faUser,
        faHandshakeAngle,
        faCirclePlus,
        faIdBadge,
        faAddressBook,
        faIdCard,
        faPhone,
        faCircleCheck,
        faEye,
        faEyeSlash
    };

    /**************************ICONS USED ******************************/

    editForm!: FormGroup;
    editPassForm!: FormGroup;

    formErrors: any;
    formControls!: string[];
    submitted = false;

    public responseRegisterFlag?: string;

    incorrectPasswordFlag = true;
    incorrectNewPassFlag = false;

    // Controle de visibilidade das senhas
    showCurrentPassword = false;
    showNewPassword = false;
    showConfirmPassword = false;

    public listStatesBrazil: any;
    public listCitiesBrazil: any;

    constructor(
        public validationFormsService: ValidationFormsService,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private viaCepService: ViaCepService,
        private autocompleteService: AutocompleteService,
        private registerService: RegisterService,
        private router: Router,
    ) {
        this.formErrors = this.validationFormsService.errorMessages;
        this.createForm();
    }

    createForm() {
        this.editForm = this.formBuilder.group({
            fullName: ["", [Validators.required]],
            cpf: ["", [Validators.required, Validators.minLength(11)], this.registerService.cpfValidator()],

            // Contact
            phoneNumber: ["", [Validators.minLength(10)]],
            cellPhoneNumber: ["", [Validators.required, Validators.minLength(11)]],
            email: ["", [Validators.email]],

            // Address
            cep: ["", [Validators.required, Validators.minLength(8)]],
            street: ["", [Validators.required]],
            houseNumber: ["", [Validators.required]],
            addInfo: ["", []],
            neighborhood: ["", [Validators.required]],
            city: ["", [Validators.required]],
            state: ["", [Validators.required]],
            refPoint: ["", []],
        });

        this.formControls = Object.keys(this.editForm.controls);
        this.listStatesBrazil = this.autocompleteService.completeStateBrazil;
        this.listCitiesBrazil = this.autocompleteService.completeCityBrazil;

        this.editPassForm = this.formBuilder.group({
            password: ["", [Validators.required]],
            newPassword: [
                "",
                [
                    Validators.required,
                    Validators.minLength(
                        this.validationFormsService.formRules.passwordMin
                    ),
                    Validators.pattern(
                        this.validationFormsService.formRules.passwordPattern
                    ),
                ],
            ],
            confirmNewPassword: [
                "",
                [
                    Validators.required,
                    Validators.minLength(
                        this.validationFormsService.formRules.passwordMin
                    ),
                    Validators.pattern(
                        this.validationFormsService.formRules.passwordPattern
                    ),
                ],
            ]
        });

        this.editForm.get('cpf')?.disable();
    }

    ngOnInit() {
        let loggedUser = this.userService.getLoggedUser();

        this.editForm.patchValue({
            email: loggedUser.email,
            fullName: loggedUser.fullName,
            cpf: loggedUser.cpf,
            phoneNumber: loggedUser.phoneNumber,
            cellPhoneNumber: loggedUser.cellPhoneNumber,
            cep: loggedUser.address.cep,
            street: loggedUser.address.street,
            state: loggedUser.address.state,
            houseNumber: loggedUser.address.houseNumber,
            addInfo: loggedUser.address.addInfo,
            neighborhood: loggedUser.address.neighborhood,
            city: loggedUser.address.city,
            refPoint: loggedUser.address.refPoint,
        });

        this.userService.findByCpf(loggedUser.cpf).subscribe({
            next: (resp2) => {
                this.user = resp2;
            },
            error: (error) => {
                console.log(
                    "Nome de usuario nao encontrado. Provavelmente, voce esta no modo de desenvolvimento."
                );
                this.user = loggedUser;
            },
        });

        // this.editForm.controls["fullName"].markAsTouched();
        // this.editForm.controls["email"].markAsTouched();
        // this.editForm.controls["cpf"].markAsTouched();
        // this.editForm.controls["phoneNumber"].markAsTouched();
        // this.editForm.controls["cellPhoneNumber"].markAsTouched();
        // this.editForm.controls["cep"].markAsTouched();
        // this.editForm.controls["street"].markAsTouched();
        // this.editForm.controls["houseNumber"].markAsTouched();
        // this.editForm.controls["addInfo"].markAsTouched();
        // this.editForm.controls["neighborhood"].markAsTouched();
        // this.editForm.controls["city"].markAsTouched();
        // this.editForm.controls["refPoint"].markAsTouched();
    }

    public checkUserPassword(): void {
        this.userService
            .comparePasswords(this.user.cpf, this.editPassForm.value.password)
            .subscribe({
                next: (resp) => {
                    if (resp.state === "correct-password") {
                        this.incorrectPasswordFlag = false;
                    } else {
                        this.incorrectPasswordFlag = true;
                    }
                },
            });
    }

    public checkNewUserPassword(): void {
        this.incorrectNewPassFlag = this.editPassForm.value.newPassword !== this.editPassForm.value.confirmNewPassword;
    }

    public receiveFormData() {
        // Marca todos os campos como touched para exibir erros
        Object.keys(this.editForm.controls).forEach(key => {
            this.editForm.get(key)?.markAsTouched();
        });

        // Valida se o formulário é válido
        if (this.editForm.invalid) {
            return;
        }

        const url = this.user._links.self.href;
        let attUser: User;

        attUser = new User(this.editForm.getRawValue());
        attUser.role = this.userService.getLoggedUser().role;

        // console.log("Usuário a ser atualizado: ", attUser);

        this.formControls = Object.keys(this.editForm.controls);
        this.userService.update(attUser, url).subscribe({
            next: (resp) => {
                this.responseRegisterFlag = "success";
                this.toggleEditSuccess();
                this.userService.updateCurrentUserLocally(attUser);
            },
            error: (error) => {
                this.responseRegisterFlag = "error";
                this.toggleEditError();
            },
        });
    }

    public receiveFormPass() {
        // Marca todos os campos como touched para exibir erros
        Object.keys(this.editPassForm.controls).forEach(key => {
            this.editPassForm.get(key)?.markAsTouched();
        });

        // Valida se o formulário é válido e se a senha atual está correta
        if (this.editPassForm.invalid || this.incorrectPasswordFlag || this.incorrectNewPassFlag) {
            return;
        }

        const url = this.user._links.self.href;
        let attUser: User;

        attUser = new User(this.editForm.value);
        attUser.passwd = this.editPassForm.value.newPassword;
        attUser.role = this.userService.getLoggedUser().role;

        this.formControls = Object.keys(this.editPassForm.controls);
        this.userService.update(attUser, url).subscribe({
            next: (resp) => {
                this.responseRegisterFlag = "success";
                this.toggleEditSuccess();
            },
            error: (error) => {
                this.responseRegisterFlag = "error";
                this.toggleEditError();
            },
        });
    }

    public handleEditError(event: any) {
        this.editErrorVisible = event;
    }

    public toggleEditError() {
        this.editErrorVisible = !this.editErrorVisible;
    }

    public handleEditSuccess(event: any) {
        this.editSuccessVisible = event;
    }

    public toggleEditSuccess() {
        this.editSuccessVisible = !this.editSuccessVisible;
    }

    public toggleCompleteEditSuccess() {
        this.editSuccessVisible = !this.editSuccessVisible;
        this.router.navigate(['dashboard']);
    }

    isValid(ctrl: AbstractControl<any, any>) {
        if (ctrl.touched && ctrl.valid) return true;
        else if ((ctrl.touched || this.submitted) && ctrl.invalid) return false;
        else return undefined;
    }

    fetchAddressByCep() {
        const cepControl = this.editForm.get("cep");
        if (cepControl && cepControl.valid) {
            this.viaCepService.getAddress(cepControl.value).subscribe({
                next: (address) => {
                    this.editForm.patchValue({
                        street: address.street,
                        neighborhood: address.neighborhood,
                        city: address.city,
                        state: address.uf,
                    });
                },
                error: () => {
                    this.editForm.patchValue({
                        street: "",
                        neighborhood: "",
                        city: "",
                        state: "",
                        birthState: "",
                    });
                },
            });
        }
    }

    toggleCurrentPasswordVisibility() {
        this.showCurrentPassword = !this.showCurrentPassword;
    }

    toggleNewPasswordVisibility() {
        this.showNewPassword = !this.showNewPassword;
    }

    toggleConfirmPasswordVisibility() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }
}
