import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "age",
})
export class AgePipe implements PipeTransform {

	transform(dataNascStr: string): number {
		const dataNasc = new Date(dataNascStr);
		const difTempo = Math.abs(Date.now() - dataNasc.getTime());
		const idade = Math.floor(difTempo / (1000 * 3600 * 24) / 365.25);
		return idade;
	}
}
