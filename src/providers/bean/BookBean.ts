import { ParamsKey } from "../app-module/paramskeys";

export class BookBean {
    private 					bookID		: number = 0;
	private 					price		: number = 0;
	private 					state		: number = 0;
	private 					type		: number = 0;
	private     				timeCreated	: number = 0;
	
	private 				code		: string = "";
	private 				thumbnail	: string = "";
	private 				description	: string = "";
	private 				name		: string = "";
	
	

	public toSFSObject(obj): any {
		
		obj.putInt(ParamsKey.BOOK_ID, this.getBookID());
		obj.putInt(ParamsKey.PRICE, Number(this.getPrice()));
		obj.putInt(ParamsKey.STATE, this.getState());
		obj.putInt(ParamsKey.TYPE, this.getType());
		obj.putLong(ParamsKey.TIME_CREATED, this.getTimeCreated());
		
		obj.putUtfString(ParamsKey.CODE, this.getCode());
		obj.putUtfString(ParamsKey.NAME, this.getName());
		obj.putUtfString(ParamsKey.THUMBNAIL, this.getThumbnail());
		obj.putUtfString(ParamsKey.DESCRIPTION, this.getDescription());
		
		return obj;
	}

	public fromSFSObject(object : any) {
		if (object == null) return;
		
		if (object.containsKey(ParamsKey.BOOK_ID)) 			this.setBookID(object.getInt(ParamsKey.BOOK_ID));
		if (object.containsKey(ParamsKey.PRICE)) 			this.setPrice(object.getInt(ParamsKey.PRICE));
		if (object.containsKey(ParamsKey.STATE)) 			this.setState(object.getInt(ParamsKey.STATE));
		if (object.containsKey(ParamsKey.TYPE)) 			this.setType(object.getInt(ParamsKey.TYPE));
		if (object.containsKey(ParamsKey.TIME_CREATED)) 	this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
		
		if (object.containsKey(ParamsKey.NAME)) 			this.setName(object.getUtfString(ParamsKey.NAME));
		if (object.containsKey(ParamsKey.CODE)) 			this.setCode(object.getUtfString(ParamsKey.CODE));
		if (object.containsKey(ParamsKey.THUMBNAIL)) 		this.setThumbnail(object.getUtfString(ParamsKey.THUMBNAIL));
		if (object.containsKey(ParamsKey.DESCRIPTION)) 		this.setDescription(object.getUtfString(ParamsKey.DESCRIPTION));
		
	}


	
	
	public getBookID() {
		return this.bookID;
	}
	public setBookID(bookID : number) {
		this.bookID = bookID;
	}
	public getPrice() {
		return this.price;
	}
	public setPrice(price : number) {
		this.price = price;
	}
	public getState() {
		return this.state;
	}
	public setState(state : number) {
		this.state = state;
	}
	public getType() {
		return this.type;
	}
	public setType(type : number) {
		this.type = type;
	}
	public getTimeCreated() {
		return this.timeCreated;
	}
	public setTimeCreated(timeCreated : number) {
		this.timeCreated = timeCreated;
	}
	public getThumbnail() {
		return this.thumbnail;
	}
	public setThumbnail(thumbnail : string) {
		this.thumbnail = thumbnail;
	}
	public getDescription() {
		return this.description;
	}
	public setDescription(description : string) {
		this.description = description;
	}
	public getName() {
		return this.name;
	}
	public setName(name : string) {
		this.name = name;
	}
	public getCode() {
		return this.code;
	}
	public setCode(code : string) {
		this.code = code;
	}
}