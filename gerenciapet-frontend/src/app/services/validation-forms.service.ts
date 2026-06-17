import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { of } from "rxjs";

@Injectable({
	providedIn: "root",
})

export class ValidationFormsService {
	errorMessages: any;

    formRules = {
        nonEmpty: "^[a-zA-Z0-9_-]+([_-][a-zA-Z0-9]+)*$",
        passwordMin: 6,
        passwordPattern: "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}",
    };

    formErrors = {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        accept: false,
    };

    constructor() {
        this.errorMessages = {
            fullName: {
                required: "O nome completo é obrigatório",
            },
            email: {
                required: "O e-mail é obrigatório",
                email: "Endereço de email inválido",
            },
            password: {
                required: "A senha é obrigatória",
                pattern:
                    "A senha deve conter: números, letras maiúsculas e minúsculas",
                minLength: `A senha deve ter ${this.formRules.passwordMin} caracteres ou mais`,
            },
            confirmPassword: {
                required: "A confirmação de senha é requerida",
                passwordMismatch: "As senhas devem ser iguais",
            },
            accept: {
                requiredTrue: "Você tem que aceitar nossos termos de uso",
            },
        };
    }

    public wrapAsyncValidator(fn: AsyncValidatorFn, skipAsyncValidation: boolean): AsyncValidatorFn{
        return (control: AbstractControl) => {
            return skipAsyncValidation ? of(null) : fn(control);
        }
    }
}
