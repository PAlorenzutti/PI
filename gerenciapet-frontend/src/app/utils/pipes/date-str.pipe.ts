import { Pipe, PipeTransform } from "@angular/core";

/**
 * @author André Pacheco
 * Pipe criado para parsear uma dada no formato string.
 * @param data Data em formato de string, ex: 1942-07-17
 * @return A data, também em formato de string, mas no padrão brasileiro
 * ex: 17/07/1942
 */
@Pipe({
	name: "dateStr",
})
export class DateStrPipe implements PipeTransform {
	public transform(dataStr?: string): string {
		if(dataStr === null || dataStr === undefined || dataStr == "") return "";
		const stringSep = dataStr.split("-", 3);
		return stringSep[2] + "/" + stringSep[1] + "/" + stringSep[0];
	}
}
