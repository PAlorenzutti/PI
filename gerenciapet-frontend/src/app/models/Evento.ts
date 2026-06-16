import GrupoPet from "./GrupoPet";
import Inscricao from "./Inscricao";
import { StatusEvento } from "./enums/StatusEvento";
import { TipoEvento } from "./enums/TipoEvento";

export default class Evento {
    public id: number = 0;
    public nome: string = '';
    public descricao: string = '';
    public perfilAlunoEsperado: string = '';
    public cargaHorariaTotal: number = 0;
    public vagasDisponiveis: number = 0;
    public dataInicio?: Date;
    public dataFim?: Date;
    public horarios: string = '';
    public status: StatusEvento = StatusEvento.ABERTO;
    public tipo: TipoEvento = TipoEvento.CURSO;
    public grupoPet?: GrupoPet;
    public inscricoes: Inscricao[] = [];
    public href: string = '';

    constructor(object?: any) {
        if (object !== undefined) {
            this.updateEvento(object);
        }
    }

    public updateEvento(object: any) {
        this.id = object.id ?? 0;
        this.nome = object.nome ?? '';
        this.descricao = object.descricao ?? '';
        this.perfilAlunoEsperado = object.perfilAlunoEsperado ?? '';
        this.cargaHorariaTotal = object.cargaHorariaTotal ?? 0;
        this.vagasDisponiveis = object.vagasDisponiveis ?? 0;
        this.dataInicio = object.dataInicio ? new Date(object.dataInicio) : undefined;
        this.dataFim = object.dataFim ? new Date(object.dataFim) : undefined;
        this.horarios = object.horarios ?? '';
        this.status = object.status ?? StatusEvento.ABERTO;
        this.tipo = object.tipo ?? TipoEvento.CURSO;

        if (object._links !== undefined) {
            this.href = object._links.self?.href || this.href;
        } else {
            this.href = object.href ?? '';
        }

        if (object.grupoPet) {
            this.grupoPet = object.grupoPet;
        }
        if (object.inscricoes) {
            this.inscricoes = object.inscricoes;
        }
    }
}
