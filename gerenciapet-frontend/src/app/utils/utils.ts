import { HttpRequest } from "@angular/common/http";
import Constants, { Acronym, State } from "./constants";

export default class Utils {  
    /**
     * @author André Pacheco
     * Função auxiliar para converter um data de string no formato brasileiro para o formato
     * padrão que o Spring Boot aceita, ou seja, de dd-mm-aaaa ou dd/mm/aaaa para aaaa-mm-dd
     * @param dataStr String com formato dd-mm-aaaa ou dd/mm/aaaa
     * @param separador Separador da data. Por padrão é '/'
     */
    public static converterStrDate(
        dataStr: string,
        separador: string = "/"
    ): string {
        if (dataStr === "") {
            return "";
        }
        const stringSep = dataStr.split(separador, 3);
        return stringSep[2] + "-" + stringSep[1] + "-" + stringSep[0];
    }

	/**
	 * Método que parseia uma data do formato americano para brasileiro
	 * @param dataStr data a ser parseada
	 * @author André Pacheco
	 */
	public static dateToBr(dataStr: string): string {
		const stringSep = dataStr.split("-", 3);
		return stringSep[2] + "/" + stringSep[1] + "/" + stringSep[0];
	}

	/**
	 * Método para converter uma string base64 para blob
	 * @param b64Data
	 * @param contentType
	 * @param sliceSize
	 */
	public static base642Blob(
		b64Data: any,
		contentType = "image/png",
		sliceSize = 512
	) {
		const byteCharacters = atob(b64Data.split(",")[1]);
		const byteArrays = [];

		for (
			let offset = 0;
			offset < byteCharacters.length;
			offset += sliceSize
		) {
			const slice = byteCharacters.slice(offset, offset + sliceSize);

			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		const blob = new Blob(byteArrays, { type: contentType });
		return blob;
	}

	/**
	 * @author André Pacheco
	 * Função auxiliar para parsear os dados do formulario de filtros. ALguns deles, quando não preenchidos,
	 * retornam uma string vazia. Essa unção converte para undefined. Além disso, switchers não preenchidos,
	 * ao invés de retornar '', retornam false;
	 * @param dado Dado a ser convertido
	 * @param isBool Se o dado for booleano, outra ação é tomada
	 */
	public static parseFilter(dado: string, isBool: boolean): any {
		if (isBool) {
			if (dado.toString() === "" || dado.toString() === "false") {
				return false;
			} else {
				return true;
			}
		} else {
			if (dado === "") {
				return undefined;
			} else {
				return dado;
			}
		}
	}

	/** Método para calcular a idade de uma pessoa
	 * @param dataNascStr string com a data de nascimento
	 * @author André Pacheco
	 */
	public static getAge(bithDateStr: string): number {
		const birthDate = new Date(bithDateStr);
		const diffTime = Math.abs(Date.now() - birthDate.getTime());
		const age = Math.floor(diffTime / (1000 * 3600 * 24) / 365.25);
		return age;
	}

	public static requestUrlContains(str: string) {
		return (req: HttpRequest<any>) => req.url.includes(str)
	}

	public static getStateName(acronym : Acronym) : State {
		let stateEntry = Constants.BRAZILIAN_STATES_AND_ACRONYMS_CEP.find((stateInfo) => stateInfo[1] == acronym)
		if(stateEntry == undefined){
			//impossible 
			throw new Error(`${acronym} is an invalid acronym.`)
		}else{
			return stateEntry[0]
		}
	}

	public static getUfFromState(state : State) : Acronym {
		let stateEntry = Constants.BRAZILIAN_STATES_AND_ACRONYMS_CEP.find((stateInfo) => stateInfo[0] == state)
		if(stateEntry == undefined){
			//impossible 
			throw new Error(`${state} is an invalid state.`)
		}else{
			return stateEntry[1]
		}
	}

}
