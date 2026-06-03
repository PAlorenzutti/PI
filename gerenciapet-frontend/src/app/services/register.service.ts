import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { URL_API } from "../utils/url-api";
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class RegisterService {
    constructor(private http: HttpClient) { }

    public cpfValidator(): AsyncValidatorFn {
        return (control: AbstractControl) => {
            const digits = (control.value ?? '').toString().replace(/\D/g, '');

            if (!digits) return of(null);
            if (digits.length < 11) return of(null);
            if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
                return of({ cpfInvalid: true } as ValidationErrors);
            }

            const calc = (len: number) => {
                let sum = 0, weight = len + 1;
                for (let i = 0; i < len; i++) sum += +digits[i] * (weight--);
                const r = sum % 11;
                return r < 2 ? 0 : 11 - r;
            };

            const d1 = calc(9), d2 = calc(10);
            return of(d1 === +digits[9] && d2 === +digits[10] ? null : { cpfInvalid: true });
        };
    }
}
