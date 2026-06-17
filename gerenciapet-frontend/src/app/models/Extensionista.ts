import User from "./User";
import GrupoPet from "./GrupoPet";

export default class Extensionista {
    public id: number = 0;
    public dataIngresso?: Date;
    public bolsista: boolean = false;
    public grupoPet?: GrupoPet;
    public user?: User;
    public href: string = '';

    constructor(object?: any) {
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
