import { ParamsKey } from "../app-module/paramskeys";
import md5 from 'md5';

export class UserInfo {
    private username: string = "";
    private password: string = "";

    constructor() {
    }

    fromObject(data) {
        if (data) {
            if ("username" in data) this.username = data.username;
            if ("password" in data) this.password = data.password;
        }
    }

    toSFSObject(obj): any {
        obj.putUtfString(ParamsKey.USERNAME, this.getUsername());
        obj.putUtfString(ParamsKey.PASSWORD, md5(this.getPassword()));
        return obj;
    }

    getUsername(): string {
        return this.username;
    }
    setUsername(username: string) {
        this.username = username;
    }

    getPassword(): string {
        return this.password;
    }
    setPassword(password: string) {
        this.password = password;
    }
}