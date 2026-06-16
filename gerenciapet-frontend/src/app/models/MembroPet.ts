import AlunoTutorado from "./AlunoTutorado";
import GrupoPet from "./GrupoPet";

export default class MembroPet extends AlunoTutorado {
    public dataIngresso?: Date;
    public bolsista: boolean = false;
    public grupoPet?: GrupoPet;

    constructor(object?: any) {
        super(object);
        if (object !== undefined) {
            this.updateMembroPet(object);
        }
    }

    public updateMembroPet(object: any) {
        this.dataIngresso = object.dataIngresso ? new Date(object.dataIngresso) : undefined;
        this.bolsista = object.bolsista ?? false;
        if (object.grupoPet) {
            this.grupoPet = object.grupoPet;
        }
    }
}
