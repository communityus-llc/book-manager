import { ParamsKey } from "../app-module/paramskeys";

export class Book {
    private 					bookID		:number     = 0;
	private 					price		:number     = 0;
	private 					state		:number     = 0;
	private 					type		:number     = 0;
	private 				timeCreated	    :number     = 0;
	
	private 				code		:string         = "";
	private 				thumbnail	:string         = "";
	private 				description	:string         = "";
    private 				name		:string         = "";

    
    

    public getBookID() {
		return this.bookID;
	}
	public setBookID(bookID: number) {
		this.bookID = bookID;
	}
	public getPrice() {
		return this.price;
	}
	public setPrice(price: number) {
		this.price = price;
	}
	public getState() {
		return this.state;
	}
	public setState(state: number) {
		this.state = state;
	}
	public getType() {
		return this.type;
	}
	public setType(type: number) {
		this.type = type;
	}
	public getTimeCreated() {
		return this.timeCreated;
	}
	public setTimeCreated( timeCreated: number) {
		this.timeCreated = timeCreated;
	}
	public getThumbnail() {
		return this.thumbnail;
	}
	public setThumbnail( thumbnail: string) {
		this.thumbnail = thumbnail;
	}
	public getDescription() {
		return this.description;
	}
	public setDescription( description: string) {
		this.description = description;
	}
	public getName() {
		return this.name;
	}
	public setName( name: string) {
		this.name = name;
	}
	public getCode() {
		return this.code;
	}
	public setCode( code: string) {
		this.code = code;
	}
   
}