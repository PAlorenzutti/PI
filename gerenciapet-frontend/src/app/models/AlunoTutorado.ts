import User from "./User";
import Inscricao from "./Inscricao";

export default class AlunoTutorado extends User {
    public matricula: string = '';
    public inscricoes: Inscricao[] = [];

    constructor(object?: any) {
        super(object);
        if (object !== undefined) {
            this.updateAlunoTutorado(object);
        }
    }

    public updateAlunoTutorado(object: any) {
        this.matricula = object.matricula ?? '';
        if (object.inscricoes) {
            this.inscricoes = object.inscricoes;
        }
    }
}
