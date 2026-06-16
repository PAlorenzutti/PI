import AlunoTutorado from "./AlunoTutorado";
import Evento from "./Evento";
import Certificado from "./Certificado";
import { StatusInscricao } from "./enums/StatusInscricao";

export default class Inscricao {
    public id: number = 0;
    public dataInscricao?: Date;
    public frequencia: number = 0;
    public nota: number = 0;
    public status: StatusInscricao = StatusInscricao.MATRICULADO;
    public aluno?: AlunoTutorado;
    public evento?: Evento;
    public certificado?: Certificado;
    public href: string = '';

    constructor(object?: any) {
        if (object !== undefined) {
            this.updateInscricao(object);
        }
    }

    public updateInscricao(object: any) {
        this.id = object.id ?? 0;
        this.dataInscricao = object.dataInscricao ? new Date(object.dataInscricao) : undefined;
        this.frequencia = object.frequencia ?? 0;
        this.nota = object.nota ?? 0;
        this.status = object.status ?? StatusInscricao.MATRICULADO;

        if (object._links !== undefined) {
            this.href = object._links.self?.href || this.href;
        } else {
            this.href = object.href ?? '';
        }

        if (object.aluno) {
            this.aluno = object.aluno;
        }
        if (object.evento) {
            this.evento = object.evento;
        }
        if (object.certificado) {
            this.certificado = object.certificado;
        }
    }
}
