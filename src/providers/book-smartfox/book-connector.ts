import { SFSConnector } from "../core/smartfox/sfs-connector";
import { PLATFORM, LOGIN_TYPE } from "../app-module/app-constants";
import { OneSignalManager } from "../core/plugin/onesignal-manager";
import { ParamsKey } from "../app-module/paramskeys";
import md5 from 'md5';
import moment from 'moment';
import { SFSEvent } from "../core/smartfox/sfs-events";
import { BookSFSCmd } from "./book-cmd";

var SFS2X = window['SFS2X'];

export class SFSUser {
    public static ROLE_PLAYER: number = 1;
    public static ROLE_CLUB_MANAGER: number = 3;
    public static ROLE_STADIUM_MANAGER: number = 2;


    username: string = "";
    password: string = "";
    role: number = -1;
    user_id: number = -1;
    phone: string = "";
    nick_name: string = "";

    constructor() {

    }

    onSFSUserInfoResponse(sfsObject) {
        if (sfsObject) {
            this.role = sfsObject.getInt('role');
            this.user_id = sfsObject.getInt('user_id');
            this.phone = sfsObject.getUtfString('phone');
            this.nick_name = sfsObject.getUtfString('nick_name');
        }
    }

    public getRole(): number {
        return this.role;
    }
}

export class Listener {
    name: string = "";
    method: any = () => { };
}

export class DeviceInfo {
    platform: number = PLATFORM.WEB;
    name: string = "web";
    onesignal_id: string = OneSignalManager.getInstance().getOneSignalID();

    constructor() {
    }

    fromObject(data) {
        if (data) {
            if ("platform" in data) this.platform = data.platform;
            if ("name" in data) this.name = data.name;
            if ("onesignal_id" in data) this.onesignal_id = data.onesignal_id;
        }
    }

    toSFSObject(obj) {
        obj.putInt(ParamsKey.PLATFORM, this.platform);
        obj.putUtfString(ParamsKey.NAME, this.name);
        obj.putUtfString(ParamsKey.ONESIGNAL_ID, this.onesignal_id);
        return obj;
    }

}

export class UserInfo {
    phone: string = "";
    facebook_id: string = "";
    username: string = "";
    password: string = "";

    constructor() {

    }

    fromObject(data) {
        if (data) {
            if ("phone" in data) this.phone = data.phone;
            if ("facebook_id" in data) this.facebook_id = data.facebook_id;
            if ("username" in data) this.username = data.username;
            if ("password" in data) this.password = data.password;
        }
    }

    toSFSObject(sfsobject, type) {
        if (type == LOGIN_TYPE.DEVICE) {
            return sfsobject;
        } else if (type == LOGIN_TYPE.PHONE) {
            sfsobject.putUtfString(ParamsKey.PHONE, this.phone);
            return sfsobject;
        } else if (type == LOGIN_TYPE.FACEBOOK) {
            sfsobject.putUtfString(ParamsKey.FACEBOOK_ID, this.facebook_id);
            return sfsobject;
        } else if (type == LOGIN_TYPE.USERNAME_PASSWORD) {
            sfsobject.putUtfString(ParamsKey.USERNAME, this.username);
            sfsobject.putUtfString(ParamsKey.PASSWORD, md5(this.password));
            return sfsobject;
        } else {
            return sfsobject;
        }
    }
}

export class BookSFSConnector extends SFSConnector {
    mSFSUser: SFSUser = new SFSUser();
    public mSFSUserRoom;
    public mListeners: Map<string, any> = new Map<string, any>();
    mPingIntervalID = -1;

    public mBook: string = "book.";

    public addListener(key: string, func: any): void {
        this.mListeners.set(key, func);
    }

    public removeListener(key: string): void {
        this.mListeners.delete(key);
    }

    public removeAllListener(): void {
        this.mListeners.clear();
    }

    public dispatchEvent(event): void {
        this.mListeners.forEach((val, key) => {
            val(event);
        });
    }

    public getSessionToken() {
        return this.mSFSClient.sessionToken;
    }


    private static _instance: BookSFSConnector = null;
    private constructor() {
        super();
    }
    public static getInstance(): BookSFSConnector {
        if (this._instance == null) {
            this._instance = new BookSFSConnector();
        }
        return this._instance;
    }

    public getSFSUser(): SFSUser {
        return this.mSFSUser;
    }

    public setData(data): void {
        super.setData(data);
        this.onResponseDataConfig(data);
    }

    private onResponseDataConfig(data): void {
        if (!data) return;
        if ('smartfox_server' in data) {
            let serverConfig = data[data['smartfox_server']];
            if (serverConfig) {
                if ('host' in serverConfig) this.setSFSHost(serverConfig['host']);
                if ('port' in serverConfig) this.setSFSPort(serverConfig['port']);
                if ('zone' in serverConfig) this.setSFSZone(serverConfig['zone']);
                if ('debug' in serverConfig) this.setSFSDebug(serverConfig['debug']);
            }
        }
    }

    public login(login_type: number, device_info: DeviceInfo, userinfo: UserInfo) {
        if (SFS2X == null || SFS2X == undefined) {
            SFS2X = window['SFS2X'];
        }

        return new Promise((resolve, reject) => {
            this.mSFSClient.removeEventListener(SFSEvent.LOGIN, () => { });
            this.mSFSClient.removeEventListener(SFSEvent.LOGIN_ERROR, () => { });
            this.mSFSClient.addEventListener(SFSEvent.LOGIN, (eventParams) => {
                return resolve(eventParams);
            });
            this.mSFSClient.addEventListener(SFSEvent.LOGIN_ERROR, (eventParams) => {
                return reject(eventParams);
            });

            console.log("login 1");

            let params = new SFS2X.SFSObject();
            let userInfoSFSObject = new SFS2X.SFSObject();
            let deviceInfoSFSObject = new SFS2X.SFSObject();
            let today = moment(new Date()).format('YYYY-MM-DD');
            let sign = md5(today + device_info.onesignal_id);
            params.putInt(ParamsKey.LOGIN_TYPE, login_type);
            params.putSFSObject(ParamsKey.DEVICE_INFO, device_info.toSFSObject(deviceInfoSFSObject));
            params.putUtfString(ParamsKey.SIGN, sign);
            params.putSFSObject(ParamsKey.USER_INFO, userinfo.toSFSObject(userInfoSFSObject, login_type));

            if (this.mDebug) {
                console.log("params..", params.getDump());
            }
            this.mSFSClient.send(new SFS2X.LoginRequest("", "", params, this.getSFSZone()));
        });

    }

    public loadingByGuest(device_info: DeviceInfo){
        if (SFS2X == null || SFS2X == undefined) {
            SFS2X = window['SFS2X'];
        }  
        return new Promise((resolve, reject) => {
            this.mSFSClient.removeEventListener(SFSEvent.LOGIN, () => { });
            this.mSFSClient.removeEventListener(SFSEvent.LOGIN_ERROR, () => { });
            this.mSFSClient.addEventListener(SFSEvent.LOGIN, (eventParams) => {
                return resolve(eventParams);
            });
            this.mSFSClient.addEventListener(SFSEvent.LOGIN_ERROR, (eventParams) => {
                return reject(eventParams);
            });
            let params = new SFS2X.SFSObject();

            let today = moment(new Date()).format("YYYY-MM-DD");
            let sign = md5(today + device_info.onesignal_id);
           
            params.putInt(ParamsKey.LOGIN_TYPE, LOGIN_TYPE.DEVICE);
            params.putUtfString(ParamsKey.ONESIGNAL_ID, sign);
            params.putUtfString(ParamsKey.DEVICE_NAME, device_info.name);

            console.log("params..", params.getDump());

            this.mSFSClient.send(new SFS2X.LoginRequest("", "", params, this.getSFSZone()));
            

        })
    }


    public sendInformationDeviceToServer(oneSignalID: string, deviceName: string, deviecPlatform: number): void {
        if (SFS2X == null || SFS2X == undefined) {
            SFS2X = window['SFS2X'];
        }
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DEVICE_PLATFORM, deviecPlatform);
        params.putUtfString(ParamsKey.DEVICE_NAME, deviceName);
        params.putUtfString(ParamsKey.ONESIGNAL_ID, oneSignalID);


        this.send("book. " + BookSFSCmd.UPDATE_LOGIN_DEVICE, params);
    }


    public addListenerForExtensionResponse() {

        this.mSFSClient.removeEventListener(SFSEvent.EXTENSION_RESPONSE, () => { });
        this.mSFSClient.removeEventListener(SFSEvent.CONNECTION_LOST, () => { });
        this.mSFSClient.removeEventListener(SFSEvent.CONNECTION_RESUME, () => { });

        this.mSFSClient.addEventListener(SFSEvent.EXTENSION_RESPONSE, (eventParams) => {
            this.onExtensionResponse(eventParams);
        });

        this.mSFSClient.addEventListener(SFSEvent.CONNECTION_LOST, (eventParams) => {
            var eventsP = {
                cmd: SFSEvent.CONNECTION_LOST,
                params: new SFS2X.SFSObject()
            }
            this.onExtensionResponse(eventsP);
        });

        this.mSFSClient.addEventListener(SFSEvent.CONNECTION_RESUME, (eventParams) => {
            var eventsP = {
                cmd: SFSEvent.CONNECTION_RESUME,
                params: new SFS2X.SFSObject()
            }
            this.onExtensionResponse(eventsP);
        });
    }

    public onExtensionResponse(eventParams) {
        if (this.mDebug) {
            console.log("EXTENSION_RESPONSE : " + eventParams.cmd, eventParams.params.getDump());
        }
        this.dispatchEvent(eventParams);
    }

    public sendRequestLogin(username: string) {
        let params = new SFS2X.SFSObject();
        params.putUtfString(ParamsKey.USERNAME, username);

        if (this.mDebug) {
            console.log("params login ..", params.getDump());
        }
        this.send(this.mBook + BookSFSCmd.LOGIN, params);
    }
}
