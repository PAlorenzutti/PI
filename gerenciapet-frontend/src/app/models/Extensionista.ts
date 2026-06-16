import Aluno from "./Aluno";
import GrupoPet from "./GrupoPet";

export default class Extensionista extends Aluno {
    public dataIngresso?: Date;
    public bolsista: boolean = false;
    public grupoPet?: GrupoPet;

    constructor(object?: any) {
        super(object);
        if (object !== undefined) {
            this.updateExtensionista(object);
        }
    }

    public updateExtensionista(object: any) {
        this.dataIngresso = object.dataIngresso ? new Date(object.dataIngresso) : undefined;
        this.bolsista = object.bolsista ?? false;
        if (object.grupoPet) {
            this.grupoPet = object.grupoPet;
        }
    }
}
