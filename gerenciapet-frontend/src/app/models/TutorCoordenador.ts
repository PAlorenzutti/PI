import User from "./User";
import GrupoPet from "./GrupoPet";

export default class TutorCoordenador extends User {
    public siape: string = '';
    public departamento: string = '';
    public grupoPetCoordena?: GrupoPet;

    constructor(object?: any) {
        super(object);
        if (object !== undefined) {
            this.updateTutorCoordenador(object);
        }
    }

    public updateTutorCoordenador(object: any) {
        this.siape = object.siape ?? '';
        this.departamento = object.departamento ?? '';
        if (object.grupoPetCoordena) {
            this.grupoPetCoordena = object.grupoPetCoordena;
        }
    }
}
