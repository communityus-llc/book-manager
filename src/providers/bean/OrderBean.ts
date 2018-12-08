import { ParamsKey } from "../app-module/paramskeys";

export class OrderBean {
    private 					orderID			: number = -1;
	private 					userID			: number = -1;
	private 					money			: number =  0;
	private 					state			: number = 0;
	private 					type			: number = 0;
	private     				timeCreated		: number = 0;
	private     				orderName		: string = "";
	private     				userName		: string = "";
	private     				description		: string = "";
	
	
	public toSFSObject(obj) : any{
		obj.putInt(ParamsKey.ORDER_ID, this.getOrderID());
		obj.putInt(ParamsKey.USER_ID, this.getUserID());
		obj.putInt(ParamsKey.MONEY, this.getMoney());
		obj.putInt(ParamsKey.STATE, this.getState());
		obj.putInt(ParamsKey.TYPE, this.getType());
		obj.putLong(ParamsKey.TIME_CREATED, this.getTimeCreated());
		obj.putUtfString(ParamsKey.ORDER_NAME, this.getOrderName());
		obj.putUtfString(ParamsKey.USER_NAME, this.getUserName());
		obj.putUtfString(ParamsKey.DESCRIPTION, this.getDescription());

		return obj;
	}


	public fromSFSObject(object)  {
		if (object == null) return;
		
		if (object.containsKey(ParamsKey.ORDER_ID)) 		this.setOrderID(object.getInt(ParamsKey.ORDER_ID));
		if (object.containsKey(ParamsKey.USER_ID)) 			this.setUserID(object.getInt(ParamsKey.USER_ID));
		if (object.containsKey(ParamsKey.MONEY)) 			this.setMoney(object.getInt(ParamsKey.MONEY));
		if (object.containsKey(ParamsKey.STATE)) 			this.setState(object.getInt(ParamsKey.STATE));
		if (object.containsKey(ParamsKey.TYPE)) 			this.setType(object.getInt(ParamsKey.TYPE));
		if (object.containsKey(ParamsKey.TIME_CREATED)) 	this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
		if (object.containsKey(ParamsKey.ORDER_NAME)) 		this.setOrderName(object.getUtfString(ParamsKey.ORDER_NAME));
		if (object.containsKey(ParamsKey.USER_NAME))		this.setUserName(object.getUtfString(ParamsKey.USER_NAME));
		if (object.containsKey(ParamsKey.DESCRIPTION)) 		this.setDescription(object.getUtfString(ParamsKey.DESCRIPTION));
	}

	
	public getOrderID() {
		return this.orderID;
	}

	public setOrderID(orderID : number) {
		this.orderID = orderID;
	}

	public getUserID() {
		return this.userID;
	}
	public setUserID(userID : number) {
		this.userID = userID;
	}
	public getMoney() {
		return this.money;
	}
	public setMoney(money : number) {
		this.money = money;
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
	public getOrderName() {
		return this.orderName;
	}
	public setOrderName( orderName : string ) {
		this.orderName = orderName;
	}
	public getUserName() {
		return this.userName;
	}
	public setUserName( userName : string ) {
		this.userName = userName;
	}
	public getDescription() {
		return this.description;
	}
	public setDescription( description : string ) {
		this.description = description;
	}
}