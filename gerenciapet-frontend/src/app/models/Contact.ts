export default class Contact {
    public phoneNumber: string = "";
    public cellPhoneNumber: string = "";
    public email: string = "";

    constructor(object ?: any) {
        if(object !== undefined){
            this.updateContact(object);
        }
    }

    public updateContact(object : any){
        this.phoneNumber = object.phoneNumber;
        this.cellPhoneNumber = object.cellPhoneNumber;
        this.email = object.email;
    }

    public print(): void {
        console.log("phoneNumber: " + this.phoneNumber);
        console.log("cellPhoneNumber: " + this.cellPhoneNumber);
        console.log("email: " + this.email);
    }
}