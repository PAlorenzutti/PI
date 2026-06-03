export default class Constants {
	// *********** CONSTANTES DO LOCAL STORAGE ******************
	
	static readonly STORAGE_CONFIG: string = "config";

	static readonly STORAGE_LOGGED_USER: string = "loggedUser";

	// *******************************************************************************

	static readonly YES: string = "S";

	static readonly NO: string = "N";

	static readonly IGNORED: string = "I";

	static readonly DO_NOT_KNOW: string = "NÃO SABE";

	static readonly NONE: string = "NENHUMA";

	static readonly NOT_INFORMED: string = "NÃO INFORMADO";

	static readonly NOT_APPLICABLE: string = "NÃO SE APLICA";

	// ************************ BRAZILIAN STATES *************************************

	static readonly BRAZILIAN_STATES_AND_ACRONYMS_CEP = [
		["ACRE", "AC"],
		["ALAGOAS", "AL"],
		["AMAPÁ", "AP"],
		["AMAZONAS", "AM"],
		["BAHIA", "BA"],
		["CEARÁ", "CE"],
		["DISTRITO FEDERAL", "DF"],
		["ESPÍRITO SANTO", "ES"],
		["GOIÁS", "GO"],
		["MARANHÃO", "MA"],
		["MATO GROSSO", "MT"],
		["MATO GROSSO DO SUL", "MS"],
		["MINAS GERAIS", "MG"],
		["PARÁ", "PA"],
		["PARAÍBA", "PB"],
		["PARANÁ", "PR"],
		["PERNAMBUCO", "PE"],
		["PIAUÍ", "PI"],
		["RIO DE JANEIRO", "RJ"],
		["RIO GRANDE DO NORTE", "RN"],
		["RIO GRANDE DO SUL", "RS"],
		["RONDÔNIA", "RO"],
		["RORAIMA", "RR"],
		["SANTA CATARINA", "SC"],
		["SÃO PAULO", "SP"],
		["SERGIPE", "SE"],
		["TOCANTINS", "TO"],
	] as const;

	// *********************************** USER ROLES ***********************************

	static readonly ADMIN: string = "ADMIN";

	static readonly SUPER: string = "SUPER";

	static readonly USER: string = "USER";

	static readonly PROFESSIONAL: string = "PROFESSIONAL";


    // *********************************** SCHOLARITY ***********************************

    static readonly SCHOLARITY = {
        "NN": 'NENHUMA',
        "FI": 'ENS. FUNDAMENTAL INCOMPL.',
        "FC": 'ENS. FUNDAMENTAL COMPL.',
        "MI": 'ENS. MÉDIO INCOMPL.',
        "MC": 'ENS. MÉDIO COMPL.',
        "SI": 'ENS. SUPERIOR INCOMPL.',
        "SC": 'ENS. SUPERIOR COMPL.',
    }
}

export type Acronym = typeof Constants.BRAZILIAN_STATES_AND_ACRONYMS_CEP[number][1]
export type State = typeof Constants.BRAZILIAN_STATES_AND_ACRONYMS_CEP[number][0]
