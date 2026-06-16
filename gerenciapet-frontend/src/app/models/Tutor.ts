import User from "./User";
import GrupoPet from "./GrupoPet";

export default class Tutor extends User {
    public siape: string = '';
    public departamento: string = '';
    public grupoPetCoordena?: GrupoPet;

    constructor(object?: any) {
        super(object);
        if (object !== undefined) {
            this.updateTutor(object);
        }
    }

    public updateTutor(object: any) {
        this.siape = object.siape ?? '';
        this.departamento = object.departamento ?? '';
        if (object.grupoPetCoordena) {
            this.grupoPetCoordena = object.grupoPetCoordena;
        }
    }
}
