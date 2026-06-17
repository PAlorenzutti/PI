import User from "./User";
import GrupoPet from "./GrupoPet";

export default class Tutor {
    public id: number = 0;
    public siape: string = '';
    public departamento: string = '';
    public grupoPetCoordena?: GrupoPet;
    public user?: User;
    public href: string = '';

    constructor(object?: any) {
        if (object !== undefined) {
            this.updateTutor(object);
        }
    }

    public updateTutor(object: any) {
        this.id = object.id ?? 0;
        this.siape = object.siape ?? '';
        this.departamento = object.departamento ?? '';
        if (object.grupoPetCoordena) {
            this.grupoPetCoordena = object.grupoPetCoordena;
        }
        if (object.user) {
            this.user = new User(object.user);
        }

        if (object._links !== undefined) {
            this.href = object._links.self?.href || this.href;
        } else {
            this.href = object.href ?? '';
        }
    }

    public getId(): string {
        if (this.id !== 0) return this.id.toString();
        if (this.href !== "") {
            let id = this.href.split("/").pop();
            if (id === undefined) return "0";
            else return id;
        }
        return "0";
    }
}
