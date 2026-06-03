import { Component } from "@angular/core";
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    Validators,
} from "@angular/forms";
import { Router } from "@angular/router";

import { cilArrowLeft } from "@coreui/icons";

import { UserService } from "./../../../services/user.service";
import { ValidationFormsService } from "../../../services/validation-forms.service";

import User from "./../../../models/User";
import { RegisterService } from "../../../services/register.service";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

/** passwords must match - custom validator */
export class PasswordValidators {
    static confirmPassword(control: AbstractControl): ValidationErrors | null {
        const password = control.get("password");
        const confirm = control.get("confirmPassword");
        if (password?.valid && password?.value === confirm?.value) {
            confirm?.setErrors(null);
            return null;
        }
        confirm?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
    }
}

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
    providers: [ValidationFormsService, UserService],
})
export class RegisterComponent {
    /**************************ICONS USED ******************************/

    public icons = { cilArrowLeft, faEye, faEyeSlash };

    /**************************ICONS USED ******************************/

    public user?: User;
    public registerForm!: FormGroup;
    public submitted = false;
    public formErrors: any;
    public formControls!: string[];

    constructor(
        private registerService: RegisterService,
        private userService: UserService,
        private router: Router,
        private formBuilder: FormBuilder,
        public validationFormsService: ValidationFormsService
    ) {
        this.formErrors = this.validationFormsService.errorMessages;
        this.createForm();
    }

    public RegisterSuccessVisible = false;
    public RegisterErrorVisible = false;
    public RegisterInProgressVisible = false;
    public DatabaseErrorVisible = false;
    public SendEmailErrorVisible = false;
    public showPassword = false;
    public showConfirmPassword = false;

    public createForm() {
        this.registerForm = this.formBuilder.group(
            {
                fullName: ["", [Validators.required]],
                email: ["", [Validators.email]],
                cpf: ["", [Validators.required, Validators.minLength(11)], this.registerService.cpfValidator()],
                password: [
                    "",
                    [
                        Validators.required,
                        Validators.minLength(
                            this.validationFormsService.formRules.passwordMin
                        ),
                        Validators.pattern(
                            this.validationFormsService.formRules
                                .passwordPattern
                        ),
                    ],
                ],
                confirmPassword: [
                    "",
                    [
                        Validators.required,
                        Validators.minLength(
                            this.validationFormsService.formRules.passwordMin
                        ),
                        Validators.pattern(
                            this.validationFormsService.formRules
                                .passwordPattern
                        ),
                    ],
                ],
                accept: [false, [Validators.requiredTrue]],
            },
            { validators: [PasswordValidators.confirmPassword] }
        );
        this.formControls = Object.keys(this.registerForm.controls);
    }

    isValid(ctrl: AbstractControl<any, any>) {
        if (ctrl.touched && ctrl.valid) return true;
        else if ((ctrl.touched || this.submitted) && ctrl.invalid) return false;
        else return undefined;
    }

    public onReset() {
        this.submitted = false;
        this.registerForm.reset();
    }

    public onValidate() {
        this.submitted = true;
        return this.registerForm.status === "VALID";
    }

    //função que faz a chamada para o método http se o formulário for válido
    public onSubmit() {
        if (this.onValidate()) {
            this.toggleRegisterInProgressVisible();

            //atribuição dos valores do formulário para o modelo "user"

            this.user = new User();
            this.user.fullName = this.registerForm.value.fullName;
            this.user.passwd = this.registerForm.value.password;
            this.user.email = this.registerForm.value.email || null;
            this.user.cpf = this.registerForm.value.cpf;
            this.user.allowed = true;
            this.user.role = "USER";
            //  CHAMADA PARA O SERVIÇO DE CADASTRO DE USUÁRIO

            this.userService.userLoginRegister(this.user).subscribe({
                next: (response) => {
                    console.log("resposta:", response);
                    if (response.status === "registered") {
                        this.toggleRegisterInProgressVisible();
                        this.toggleRegisterSuccess();
                        this.onReset();
                    } else if (response.status === "not-allowed") {
                        this.toggleRegisterInProgressVisible();
                        this.toggleRegisterError();
                    } else if (response.status === "db-problem") {
                        this.toggleRegisterInProgressVisible();
                        this.toggleDatabaseError();
                    } else if (response.status === "lack-of-user-terms" || response.status === "email-service-error") {
                        this.toggleRegisterInProgressVisible();
                        // this.toggleSendEmailError();
                        this.onReset();
                    }
                },
            });
        }
    }

    public toggleRegisterSuccess() {
        this.RegisterSuccessVisible = !this.RegisterSuccessVisible;
    }

    public handleRegisterSuccess(event: any) {
        this.RegisterSuccessVisible = event;
    }

    public toggleRegisterError() {
        this.RegisterErrorVisible = !this.RegisterErrorVisible;
    }

    public handleRegisterError(event: any) {
        this.RegisterErrorVisible = event;
    }

    public toggleRegisterInProgressVisible() {
        this.RegisterInProgressVisible = !this.RegisterInProgressVisible;
    }

    public handleRegisterInProgressVisible(event: any) {
        this.RegisterInProgressVisible = event;
    }

    public toggleDatabaseError() {
        this.DatabaseErrorVisible = !this.DatabaseErrorVisible;
    }

    public handleDatabaseError(event: any) {
        this.DatabaseErrorVisible = event;
    }

    public toggleSendEmailError() {
        this.SendEmailErrorVisible = !this.SendEmailErrorVisible;
    }

    public handleSendEmailError(event: any) {
        this.SendEmailErrorVisible = event;
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }
}
