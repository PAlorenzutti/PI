import { DEFAULT_ROLE } from "../../environments/environment";
import Address from "./Address";
import Contact from "./Contact";

export default class User {

    public fullName: string = 'DEV_MODE';
    public passwd: string = '';
    public cpf: string = '';
    public email: string = '';
    public allowed: boolean = false;
    public role: string = DEFAULT_ROLE;
    public href: string = '';

    public address: Address = new Address();
    public phoneNumber: string = "";
    public cellPhoneNumber: string = "";

    constructor(object?: any) {
        if (object !== undefined) {
            this.updateUser(object);
        }
    }

	public updateUser(object : any){
		this.fullName = object.fullName?.toUpperCase() ?? "";
		this.email = object.email?.toLowerCase() ?? "";
		this.cpf = object.cpf;
		this.passwd = object.passwd;
		this.allowed = object.allowed;

		if (object.role !== undefined)
			this.role = object.role;

        if (object._links !== undefined) {
            this.href = object._links.self?.href || this.href;
        }
        else {
            this.href = object.href;
        }

        if (object.address == undefined) {
            this.address = new Address(object);
        }
        else {
            this.address = new Address(object.address);
        }

        this.phoneNumber = object.phoneNumber;
        this.cellPhoneNumber = object.cellPhoneNumber;
    }

    public print(): void {
        console.log("NomeCompleto: " + this.fullName);
        console.log("senha: " + this.passwd);
        console.log("email: " + this.email);
        console.log("cpf: " + this.cpf);
        console.log("allowed: " + this.allowed);
        console.log("role: " + this.role);

        this.address.print();

        console.log("phoneNumber: " + this.phoneNumber);
        console.log("cellPhoneNumber: " + this.cellPhoneNumber);
    }

	public isRegistrationComplete(): boolean {
        const a = this.address;
		return !(
			!this.cellPhoneNumber ||
			!a.street ||
			!a.houseNumber ||
			!a.neighborhood ||
			!a.city ||
			!a.state ||
			!a.cep
		);
    } 

    public getId(): string {
        if (this.href !== "") {
            let id = this.href.split("/").pop();
            if (id === undefined) return "0";
            else return id;
        }
        return "0";
    }

    public getAddressAsString(): string {
        if(this.isThereAnAdress()) {
            let address = this.address.street + ", " + this.address.houseNumber + ", " + this.address.neighborhood + ", " + this.address.city + ", " + this.address.state + ", " + this.address.cep;
		    return address;
        }
        return "-"
	}

    public isThereAnAdress(): boolean {
        if(this.address.street.length > 0 &&
           this.address.houseNumber.length > 0 &&
           this.address.neighborhood.length > 0 &&
           this.address.city.length > 0 &&
           this.address.state.length > 0 &&
           this.address.cep.length > 0) {

            return true;
        }
        return false;
    }
}
