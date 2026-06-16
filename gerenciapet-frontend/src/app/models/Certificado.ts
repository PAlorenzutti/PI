import { TipoCertificado } from "./enums/TipoCertificado";
import Inscricao from "./Inscricao";


export default class Certificado {
    public id: number = 0;
    public codigoValidacao: string = '';
    public dataEmissao?: Date;
    public tipo: TipoCertificado = TipoCertificado.HORAS_COMPLEMENTARES;
    public inscricao?: Inscricao;
    public href: string = '';

    constructor(object?: any) {
        if (object !== undefined) {
            this.updateCertificado(object);
        }
    }

    public updateCertificado(object: any) {
        this.id = object.id ?? 0;
        this.codigoValidacao = object.codigoValidacao ?? '';
        this.dataEmissao = object.dataEmissao ? new Date(object.dataEmissao) : undefined;
        this.tipo = object.tipo ?? TipoCertificado.HORAS_COMPLEMENTARES;

        if (object._links !== undefined) {
            this.href = object._links.self?.href || this.href;
        } else {
            this.href = object.href ?? '';
        }

        if (object.inscricao) {
            this.inscricao = object.inscricao;
        }
    }
}
