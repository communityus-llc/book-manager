import { ParamsKey } from "../app-module/paramskeys";

export class NewsBean {
    private 					newID		: number = 0;
	private 					userID		: number = 0;
	private 					state		: number = 0;
	private 					type		: number = 0;
	private     				timeCreated	: number = 0;
	private     				title		: string = "";
	private     				thumbnail	: string = "";
	private     				description	: string = "";


	

	public toSFSObject(obj): any {
		
		obj.putInt(ParamsKey.NEW_ID, this.getNewID());
		obj.putInt(ParamsKey.USER_ID, this.getUserID());
		obj.putInt(ParamsKey.STATE, this.getState());
		obj.putInt(ParamsKey.TYPE, this.getType());
		obj.putLong(ParamsKey.TIME_CREATED, this.getTimeCreated());
		obj.putUtfString(ParamsKey.TITLE, this.getTitle());
		obj.putUtfString(ParamsKey.THUMBNAIL, this.getThumbnail());
		obj.putUtfString(ParamsKey.DESCRIPTION, this.getDescription());
		
		return obj;
	}


	public fromSFSObject(object: any) {
		if (object == null) return;
		if (object.containsKey(ParamsKey.NEW_ID)) 			this.setNewID(object.getInt(ParamsKey.NEW_ID));
		if (object.containsKey(ParamsKey.USER_ID)) 			this.setUserID(object.getInt(ParamsKey.USER_ID));
		if (object.containsKey(ParamsKey.STATE)) 			this.setState(object.getInt(ParamsKey.STATE));
		if (object.containsKey(ParamsKey.TYPE)) 			this.setType(object.getInt(ParamsKey.TYPE));
		if (object.containsKey(ParamsKey.TIME_CREATED)) 	this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
		if (object.containsKey(ParamsKey.THUMBNAIL)) 		this.setThumbnail(object.getUtfString(ParamsKey.THUMBNAIL));
		if (object.containsKey(ParamsKey.TITLE)) 			this.setTitle(object.getUtfString(ParamsKey.TITLE));
		if (object.containsKey(ParamsKey.DESCRIPTION)) 		this.setDescription(object.getUtfString(ParamsKey.DESCRIPTION));
	}


	
	public getNewID() {
		return this.newID;
	}

	public setNewID(newID : number) {
		this.newID = newID;
	}

	public getUserID() {
		return this.userID;
	}

	public setUserID(userID : number) {
		this.userID = userID;
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

	public getTitle() {
		return this.title;
	}

	public setTitle(title : string) {
		this.title = title;
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

}