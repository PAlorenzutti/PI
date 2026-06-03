export class Page<T> {

    public readonly size: number;

    constructor(public readonly data : readonly T[], public  readonly totalElements: number,
                public readonly totalPages: number, public readonly number : number){
        
        this.size = data.length;
    }
}