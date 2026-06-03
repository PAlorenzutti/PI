import { Pipe, PipeTransform } from "@angular/core";

/**
 * Pipe criado para parsear um timestamp no formato string.
 * @param data Timestamp em formato de string, ex: 2026-01-12T14:18:35 ou 2026-01-12 14:18:35
 * @return A data e hora, em formato de string, no padrão brasileiro
 * ex: 12/01/2026 14:18:35
 */
@Pipe({
    name: "datetimeStr",
})
export class DatetimeStrPipe implements PipeTransform {
    public transform(datetimeStr?: string): string {
        if (datetimeStr === null || datetimeStr === undefined || datetimeStr === "") return "";

        const normalized = datetimeStr.trim().replace('T', ' ');

        const parts = normalized.split(' ');
        if (parts.length < 2) return "";

        const datePart = parts[0];
        const timePart = parts[1];

        const dateSep = datePart.split("-");
        if (dateSep.length !== 3) return "";

        return `${dateSep[2]}/${dateSep[1]}/${dateSep[0]} ${timePart}`;
    }
}
