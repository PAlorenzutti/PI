import TutorCoordenador from "./TutorCoordenador";
import MembroPet from "./MembroPet";
import Evento from "./Evento";

export default class GrupoPet {
    public id: number = 0;
    public sigla: string = '';
    public descricao: string = '';
    public tutorCoordenador?: TutorCoordenador;
    public membros: MembroPet[] = [];
    public eventos: Evento[] = [];
    public href: string = '';

    constructor(object?: any) {
        if (object !== undefined) {
            this.updateGrupoPet(object);
        }
    }

    public updateGrupoPet(object: any) {
        this.id = object.id ?? 0;
        this.sigla = object.sigla ?? '';
        this.descricao = object.descricao ?? '';
        
        if (object._links !== undefined) {
            this.href = object._links.self?.href || this.href;
        } else {
            this.href = object.href ?? '';
        }

        if (object.tutorCoordenador) {
            this.tutorCoordenador = object.tutorCoordenador;
        }
        if (object.membros) {
            this.membros = object.membros;
        }
        if (object.eventos) {
            this.eventos = object.eventos;
        }
    }
}
