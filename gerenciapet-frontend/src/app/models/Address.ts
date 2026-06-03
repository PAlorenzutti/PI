export default class Address {
	public street: string = "";
	public houseNumber: string = "";
	public addInfo: string = "";
	public neighborhood: string = "";
	public city: string = "";
	public state: string = "";
	public refPoint: string = "";
	public cep: string = "";

    constructor(object?: any) {
        if (object !== undefined) {
            this.updateAddress(object);
        }
    }

	public updateAddress(object : any){
		this.street = object.street?.toUpperCase() ?? "";
		this.houseNumber = object.houseNumber;
		this.addInfo = object.addInfo;
		this.neighborhood = object.neighborhood?.toUpperCase() ?? "";
        this.city = object.city?.toUpperCase() ?? "";
        this.state = object.state?.toUpperCase() ?? "";
		this.refPoint = object.refPoint;
		this.cep = object.cep;
	}

    public print(): void {
        console.log("street: " + this.street);
        console.log("houseNumber: " + this.houseNumber);
        console.log("addInfo: " + this.addInfo);
        console.log("neighborhood: " + this.neighborhood);
        console.log("city: " + this.city);
        console.log("state: " + this.state);
        console.log("refPoint: " + this.refPoint);
        console.log("cep: " + this.cep);
    }
}
