import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { TutorService } from "../../../services/tutor.service";
import { ExtensionistaService } from "../../../services/extensionista.service";
import { faCirclePlus, faEye, faEyeSlash, faHandshakeAngle, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import User from "../../../models/User";
import Extensionista from "../../../models/Extensionista";
import Tutor from "../../../models/Tutor";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValidationFormsService } from "../../../services/validation-forms.service";
import { faCircleCheck, faAddressBook, faIdBadge, faIdCard } from "@fortawesome/free-regular-svg-icons";
import { RegisterService } from "../../../services/register.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-user-edit",
    templateUrl: "./user-edit.component.html",
    styleUrls: [],
    providers: [UserService, TutorService, ExtensionistaService],
})
export class UserEditComponent implements OnInit {
    public user: any;
    public tutorUrl?: string;
    public extensionistaUrl?: string;
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

    constructor(
        public validationFormsService: ValidationFormsService,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private tutorService: TutorService,
        private extensionistaService: ExtensionistaService,
        private registerService: RegisterService,
        private router: Router,
    ) {
        this.formErrors = this.validationFormsService.errorMessages;
        this.createForm();
    }

    createForm() {
        this.editForm = this.formBuilder.group({
            nome: ["", [Validators.required]],
            dataNascimento: ["", [Validators.required]],
            isEstudanteUfes: [false],
            email: ["", [Validators.email]],
            matricula: [""],
            siape: [""],
            departamento: [""],
            bolsista: [false],
        });

        this.formControls = Object.keys(this.editForm.controls);

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

        this.userService.findByEmail(loggedUser.email).subscribe({
            next: (resp2: any) => {
                this.user = resp2;
                this.editForm.patchValue({
                    email: this.user.email,
                    nome: this.user.nome,
                    dataNascimento: this.user.dataNascimento,
                    isEstudanteUfes: this.user.isEstudanteUfes,
                    matricula: this.user.matricula
                });

                if (this.user.tipoUsuario === 'TUTOR') {
                    this.tutorService.findByUserEmail(this.user.email).subscribe({
                        next: (tutor: any) => {
                            if (tutor && tutor._links) {
                                this.tutorUrl = tutor._links.self.href;
                                this.editForm.patchValue({
                                    siape: tutor.siape,
                                    departamento: tutor.departamento
                                });
                            }
                        }
                    });
                } else if (this.user.tipoUsuario === 'EXTENSIONISTA') {
                    this.extensionistaService.findByUserEmail(this.user.email).subscribe({
                        next: (ext: any) => {
                            if (ext && ext._links) {
                                this.extensionistaUrl = ext._links.self.href;
                                this.editForm.patchValue({
                                    bolsista: ext.bolsista
                                });
                            }
                        }
                    });
                }
            },
            error: (error: any) => {
                console.log("Nome de usuario nao encontrado.");
                this.user = loggedUser;
            },
        });
    }

    public checkUserPassword(): void {
        this.userService
            .comparePasswords(this.user.email, this.editPassForm.value.password)
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

        // Fix Spring Data REST self-link bug with polymorphism where it uses the subclass name
        let url = this.user._links.self.href;
        url = url.replace(/\/api\/[a-zA-Z]+\//, '/api/user/');

        const formValue = this.editForm.getRawValue();
        const mergedData = { ...this.user, ...formValue };

        let finalUser = new User(mergedData);
        const idMatch = url.match(/\/(\d+)$/);
        if (idMatch) {
            finalUser.id = parseInt(idMatch[1], 10);
        }

        this.formControls = Object.keys(this.editForm.controls);
        this.userService.update(finalUser, url).subscribe({
            next: (resp) => {
                this.userService.updateCurrentUserLocally(finalUser);

                // Update specific fields for Tutor or Extensionista
                if (this.user.tipoUsuario === 'TUTOR' && this.tutorUrl) {
                    const tutorPayload = {
                        siape: this.editForm.value.siape,
                        departamento: this.editForm.value.departamento
                    };
                    this.userService.update(tutorPayload as any as User, this.tutorUrl).subscribe({
                        next: () => {
                            this.responseRegisterFlag = "success";
                            this.toggleEditSuccess();
                        },
                        error: () => {
                            this.responseRegisterFlag = "error";
                            this.toggleEditError();
                        }
                    });
                } else if (this.user.tipoUsuario === 'EXTENSIONISTA' && this.extensionistaUrl) {
                    const extPayload = {
                        bolsista: this.editForm.value.bolsista
                    };
                    this.userService.update(extPayload as any as User, this.extensionistaUrl).subscribe({
                        next: () => {
                            this.responseRegisterFlag = "success";
                            this.toggleEditSuccess();
                        },
                        error: () => {
                            this.responseRegisterFlag = "error";
                            this.toggleEditError();
                        }
                    });
                } else {
                    this.responseRegisterFlag = "success";
                    this.toggleEditSuccess();
                }
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

        let url = this.user._links.self.href;
        url = url.replace(/\/api\/[a-zA-Z]+\//, '/api/user/');

        const formValue = this.editForm.getRawValue();
        const mergedData = { ...this.user, ...formValue };

        let attUser = new User(mergedData);
        const idMatch = url.match(/\/(\d+)$/);
        if (idMatch) {
            attUser.id = parseInt(idMatch[1], 10);
        }
        attUser.senha = this.editPassForm.value.newPassword;

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
