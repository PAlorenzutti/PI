import { Pipe, PipeTransform } from "@angular/core";

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
