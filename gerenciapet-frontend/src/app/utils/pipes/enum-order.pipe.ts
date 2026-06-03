import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "enumOrder",
	standalone: false,
})
export class EnumOrderPipe implements PipeTransform {
	transform(items: any[], enumType?: object): any[] {
		if (!Array.isArray(items) || !enumType) return items;

		const enumKeys = Object.keys(enumType).filter((k) => isNaN(Number(k)));

		return items.slice().sort((a, b) => {
			return enumKeys.indexOf(a.key) - enumKeys.indexOf(b.key);
		});
	}
}
