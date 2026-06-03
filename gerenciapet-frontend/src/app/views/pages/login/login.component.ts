import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { faUser, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { ValidationFormsService } from "../../../services/validation-forms.service";
import { UserService } from "./../../../services/user.service";
import { LoginService } from "./../../../services/login.service";

import { cilBook } from "@coreui/icons";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    providers: [ValidationFormsService, LoginService, UserService],
})
export class LoginComponent implements OnInit {
    /**************************ICONS USED ******************************/
    public icons = { cilBook, faUser, faLock, faEye, faEyeSlash };
    /**************************ICONS USED ******************************/

    public submitted = false;
    public formErrors: any;
    public retrievePasswordForm!: FormGroup;
    public loginForm: FormGroup;
    public formControls!: string[];

    //Variáveis de visualização dos modais de erros e de sucesso
    public LoginErrorVisible = false;
    public RetrievePasswordVisible = false;
    public SuccessRetrieveVisible = false;
    public ErrorRetrieveVisible = false;
    public spinnerVisible = false;
    public showPassword = false;
    public loginErrorMessage = "";

    constructor(
        private LoginService: LoginService,
        private authForm: FormBuilder,
        private router: Router,
        private formBuilder: FormBuilder,
        public validationFormsService: ValidationFormsService,
        private userService: UserService,
    ) {
        this.formErrors = this.validationFormsService.errorMessages;

        this.loginForm = this.authForm.group({
            cpf: ["", [Validators.required]],
            password: ["", [Validators.required]],
        });

        this.retrievePasswordForm = this.formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
        });
        this.formControls = Object.keys(this.retrievePasswordForm.controls);
    }

    ngOnInit() { }

    //Chamada para o serviço de login
    public getAuthForm() {
        this.toggleSpinnerVisible();
        this.LoginService.loginAuth(
            this.loginForm.get("cpf")?.value,
            this.loginForm.get("password")?.value
        ).subscribe({
            next: (response) => {
                this.toggleSpinnerVisible();
                if (response.status == "user-authenticated") {
                    this.userService.setLoggedUser().subscribe({
                        next: (resp) => {
                            this.router.navigate(["/dashboard"]);
                        },
                    });
                } else if (response.status == "user-not-found") {
                    this.loginErrorMessage =
                        "O usuário que você digitou não está cadastrado no sistema. Verifique se você digitou tudo corretamente.";
                    this.toggleLoginError();
                } else if (response.status == "user-not-verified") {
                    this.loginErrorMessage =
                        "Você ainda não verificou seu e-mail. Por favor, verifique seu e-mail e clique no link de verificação que foi enviado durante o cadastro. Se não recebeu, entre em contato com a equipe do Gerencia PET.";
                    this.toggleLoginError();
                } else if (response.status == "user-not-allowed") {
                    this.loginErrorMessage =
                        "Você não possui permissão para acessar o sistema. Por favor, entre em contato com a equipe do Gerencia PET.";
                    this.toggleLoginError();
                } else if (response.status == "authentication-fail") {
                    this.loginErrorMessage =
                        "O nome de usuário e/ou a senha está incorreto. Verifique se você digitou tudo corretamente. Caso não lembre sua senha, clique em Esqueci minha senha para recuperá-la.";
                    this.toggleLoginError();
                }
            },
            error: (err) => {
                this.toggleSpinnerVisible();
                this.loginErrorMessage =
                    "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde. Se o erro persistir, entre em contato com a equipe do Gerencia PET";
                this.toggleLoginError();
            },
        });
    }

    //Chamada para o serviço de recuperação de senha
    public retrievePassword() {
        this.toggleSpinnerVisible();
        this.LoginService.retrievePassword(
            this.retrievePasswordForm.get("email")?.value
        ).subscribe({
            next: (response) => {
                this.toggleSpinnerVisible();
                if (response.status == "sent") {
                    this.toggleRetrievePassword();
                    this.toggleSuccessRetrieve();
                } else if (response.status == "user-not-registered") {
                    this.toggleRetrievePassword();
                    this.toggleErrorRetrieve();
                }
            },
            error: (err) => {
                this.toggleSpinnerVisible();
                if (err.error.text == "sent") {
                    this.toggleRetrievePassword();
                    this.toggleSuccessRetrieve();
                }
                else {
                    this.toggleRetrievePassword();
                    this.loginErrorMessage =
                        "Ocorreu um erro ao recuperar o e-mail, por favor entre em contato com a equipe do Gerencia PET.";
                    this.toggleLoginError();
                }
            },
        });
    }

    public toggleRetrievePassword() {
        this.RetrievePasswordVisible = !this.RetrievePasswordVisible;
    }

    public handleRetrievePassword(event: any) {
        this.RetrievePasswordVisible = event;
    }

    public toggleSuccessRetrieve() {
        this.SuccessRetrieveVisible = !this.SuccessRetrieveVisible;
    }

    public handleSuccessRetrieve(event: any) {
        this.SuccessRetrieveVisible = event;
    }

    public toggleErrorRetrieve() {
        this.ErrorRetrieveVisible = !this.ErrorRetrieveVisible;
    }

    public handleErrorRetrieve(event: any) {
        this.ErrorRetrieveVisible = event;
    }

    public toggleLoginError() {
        this.LoginErrorVisible = !this.LoginErrorVisible;
    }

    public handleLoginError(event: any) {
        this.LoginErrorVisible = event;
    }

    public toggleSpinnerVisible() {
        this.spinnerVisible = !this.spinnerVisible;
    }

    public handleSpinnerVisible(event: any) {
        this.spinnerVisible = event;
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
}
