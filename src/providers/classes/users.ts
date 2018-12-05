import { ParamsKey } from "../app-module/paramskeys";

export class User {
    private 				loginType	    :number     = 0;
	private 				money		    :number     = 0;
	private 				role		    :number     = 0;
	private 				state		    :number     = 0;
	private 				type		    :number     = 0;
	private					userID		    :number     = 0;
	private 				timeCreated	    :number     = 0;
	private 				avatar		    :string     = "";
	private 				birthday	    :string     = "";
	private 				cover		    :string     = "";
	private 				description	    :string     = "";
	private 				email		    :string     = "";
	private 				facebookID	    :string     = "";
	private 				googleID	    :string     = "";
	private 				name		    :string     = "";
	private 				password	    :string     = "";
	private 				phone		    :string     = "";
	private 				username	    :string     = "";
    

    public toSFSObject(obj): any {
        obj.putInt(ParamsKey.MONEY, this.getMoney());
        obj.putInt(ParamsKey.ROLE, this.getRole());
        obj.putInt(ParamsKey.STATE, this.getState());
        obj.putInt(ParamsKey.TYPE, this.getType());
        obj.putInt(ParamsKey.USER_ID, this.getUserID());
        obj.putLong(ParamsKey.TIME_CREATED, this.getTimeCreated());
        obj.putUtfString(ParamsKey.AVATAR, this.getAvatar());
        obj.putUtfString(ParamsKey.BIRTHDAY, this.getBirthday());
        obj.putUtfString(ParamsKey.COVER, this.getCover());
        obj.putUtfString(ParamsKey.DESCRIPTION, this.getDescription());
        obj.putUtfString(ParamsKey.EMAIL, this.getEmail());
        obj.putUtfString(ParamsKey.FACEBOOK_ID, this.getFacebookID());
        obj.putUtfString(ParamsKey.GOOGLE_ID, this.getGoogleID());
        obj.putUtfString(ParamsKey.NAME, this.getName());
        obj.putUtfString(ParamsKey.PASSWORD, this.getPassword());
        obj.putUtfString(ParamsKey.PHONE, this.getPhone());
        obj.putUtfString(ParamsKey.USERNAME, this.getUsername());
        return obj;
    }

    public fromSFSObject(object: any) {
        if ((object == null)) {
            return;
        }

        if (object.containsKey(ParamsKey.MONEY)) {
            this.setMoney(object.getInt(ParamsKey.MONEY));
        }

        if (object.containsKey(ParamsKey.ROLE)) {
            this.setRole(object.getInt(ParamsKey.ROLE));
        }

        if (object.containsKey(ParamsKey.STATE)) {
            this.setState(object.getInt(ParamsKey.STATE));
        }

        if (object.containsKey(ParamsKey.TYPE)) {
            this.setType(object.getInt(ParamsKey.TYPE));
        }

        if (object.containsKey(ParamsKey.USER_ID)) {
            this.setUserID(object.getInt(ParamsKey.USER_ID));
        }

        if (object.containsKey(ParamsKey.TIME_CREATED)) {
            this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
        }

        if (object.containsKey(ParamsKey.AVATAR)) {
            this.setAvatar(object.getUtfString(ParamsKey.AVATAR));
        }

        if (object.containsKey(ParamsKey.BIRTHDAY)) {
            this.setBirthday(object.getUtfString(ParamsKey.BIRTHDAY));
        }

        if (object.containsKey(ParamsKey.COVER)) {
            this.setCover(object.getUtfString(ParamsKey.COVER));
        }

        if (object.containsKey(ParamsKey.DESCRIPTION)) {
            this.setDescription(object.getUtfString(ParamsKey.DESCRIPTION));
        }

        if (object.containsKey(ParamsKey.EMAIL)) {
            this.setEmail(object.getUtfString(ParamsKey.EMAIL));
        }

        if (object.containsKey(ParamsKey.FACEBOOK_ID)) {
            this.setFacebookID(object.getUtfString(ParamsKey.FACEBOOK_ID));
        }

        if (object.containsKey(ParamsKey.GOOGLE_ID)) {
            this.setGoogleID(object.getUtfString(ParamsKey.GOOGLE_ID));
        }

        if (object.containsKey(ParamsKey.NAME)) {
            this.setName(object.getUtfString(ParamsKey.NAME));
        }

        if (object.containsKey(ParamsKey.PASSWORD)) {
            this.setPassword(object.getUtfString(ParamsKey.PASSWORD));
        }

        if (object.containsKey(ParamsKey.PHONE)) {
            this.setPhone(object.getUtfString(ParamsKey.PHONE));
        }

        if (object.containsKey(ParamsKey.USERNAME)) {
            this.setUsername(object.getUtfString(ParamsKey.USERNAME));
        }


    }



    public getLoginType() {
		return this.loginType;
	}

	public setLoginType(loginType: number) {
		this.loginType = loginType;
	}

	public getMoney() {
		return this.money;
	}

	public setMoney(money: number) {
		this.money = money;
	}

	public getRole() {
		return this.role;
	}

	public setRole(role: number) {
		this.role = role;
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

	public getUserID() {
		return this.userID;
	}

	public setUserID(userID: number) {
		this.userID = userID;
	}

	public getTimeCreated() {
		return this.timeCreated;
	}

	public setTimeCreated(timeCreated: number) {
		this.timeCreated = timeCreated;
	}

	public getAvatar() {
		return this.avatar;
	}

	public setAvatar(avatar: string) {
		this.avatar = avatar;
	}

	public getBirthday() {
		return this.birthday;
	}

	public setBirthday(birthday: string) {
		this.birthday = birthday;
	}

	public getCover() {
		return this.cover;
	}

	public setCover(cover: string) {
		this.cover = cover;
	}

	public getDescription() {
		return this.description;
	}

	public setDescription(description: string) {
		this.description = description;
	}

	public getEmail() {
		return this.email;
	}

	public setEmail(email: string) {
		this.email = email;
	}

	public getFacebookID() {
		return this.facebookID;
	}

	public setFacebookID(facebookID: string) {
		this.facebookID = facebookID;
	}

	public getGoogleID() {
		return this.googleID;
	}

	public setGoogleID(googleID: string) {
		this.googleID = googleID;
	}

	public getName() {
		return this.name;
	}

	public setName(name: string) {
		this.name = name;
	}

	public getPassword() {
		return this.password;
	}

	public setPassword(password: string) {
		this.password = password;
	}

	public getPhone() {
		return this.phone;
	}

	public setPhone(phone: string) {
		this.phone = phone;
	}

	public getUsername() {
		return this.username;
	}

	public setUsername(username: string) {
		this.username = username;
	}

}