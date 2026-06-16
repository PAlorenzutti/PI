export default class User {
    public id: number = 0;
    public nome: string = '';
    public email: string = '';
    public senha?: string = '';
    public dataNascimento: string = '';
    public isEstudanteUfes: boolean = false;
    public tipoUsuario: string = 'ALUNO';
    public href: string = '';

    constructor(object?: any) {
        if (object !== undefined) {
            this.updateUser(object);
        }
    }

    public updateUser(object: any) {
        this.id = object.id ?? 0;
        this.nome = object.nome ?? '';
        this.email = object.email ?? '';
        this.senha = object.senha;
        this.dataNascimento = object.dataNascimento ?? '';
        this.isEstudanteUfes = object.isEstudanteUfes ?? false;
        this.tipoUsuario = object.tipoUsuario ?? (object.siape ? 'TUTOR' : (object.bolsista !== undefined ? 'EXTENSIONISTA' : 'ALUNO'));

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
