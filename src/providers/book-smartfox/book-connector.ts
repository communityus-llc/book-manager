import { SFSConnector } from "../core/smartfox/sfs-connector";
import { LOGIN_TYPE } from "../app-module/app-constants";
import { ParamsKey } from "../app-module/paramskeys";
import md5 from 'md5';
import moment from 'moment';
import { SFSEvent } from "../core/smartfox/sfs-events";
import { BookSFSCmd } from "./book-cmd";
import { DeviceInfo } from "../bean/device-info";
import { UserInfo } from "../bean/user-info";
import { NewsBean } from "../bean/NewsBean";
import { BookBean } from "../bean/BookBean";
import { OrderBean } from "../bean/OrderBean";

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

    public login(deviceInfo: DeviceInfo, userInfo: UserInfo) {
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

            let today = moment(new Date()).format('YYYY-MM-DD');
            let sign = md5(today + deviceInfo.getOnesignalID());
            params.putUtfString(ParamsKey.SIGN, sign);

            params.putInt(ParamsKey.LOGIN_TYPE, 3);

            let userInfoSFSObject = new SFS2X.SFSObject();
            let deviceInfoSFSObject = new SFS2X.SFSObject();

            params.putSFSObject(ParamsKey.DEVICE_INFO, deviceInfo.toSFSObject(deviceInfoSFSObject));

            params.putSFSObject(ParamsKey.USER_INFO, userInfo.toSFSObject(userInfoSFSObject));

            console.log("dum", params.getDump());

            this.mSFSClient.send(new SFS2X.LoginRequest("", "", params, this.getSFSZone()));
        });

    }

    public loadingByGuest(deviceInfo: DeviceInfo) {
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

            console.log("login 2");

            let params = new SFS2X.SFSObject();

            let today = moment(new Date()).format("YYYY-MM-DD");
            let sign = md5(today + deviceInfo.getOnesignalID());

            params.putInt(ParamsKey.LOGIN_TYPE, LOGIN_TYPE.DEVICE);
            params.putUtfString(ParamsKey.ONESIGNAL_ID, sign);
            params.putUtfString(ParamsKey.DEVICE_NAME, deviceInfo.getName());

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

    requestJoinRoom(roomName: string) {
        this.mSFSUserRoom = roomName;
        return new Promise((resolve, reject) => {
            this.mSFSClient.removeEventListener(SFSEvent.ROOM_JOIN, () => { });
            this.mSFSClient.removeEventListener(SFSEvent.ROOM_JOIN_ERROR, () => { });
            this.mSFSClient.addEventListener(SFSEvent.ROOM_JOIN, (eventParams) => {
                return resolve(eventParams);
            });
            this.mSFSClient.addEventListener(SFSEvent.ROOM_JOIN_ERROR, (eventParams) => {
                return reject(eventParams);
            });
            this.mSFSClient.send(new SFS2X.JoinRoomRequest(roomName));
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

    public sendRequestUSER_GET_LIST_BOOK() {
        let params = new SFS2X.SFSObject();


        this.send(this.mBook + BookSFSCmd.USER_GET_LIST_BOOK, params);
    }

    public sendRequestUSER_UPDATE_BOOK(book: BookBean) {
        let params = new SFS2X.SFSObject();
        params = book.toSFSObject(params);

        this.send(this.mBook + BookSFSCmd.USER_UPDATE_BOOK, params);
    }

    public sendRequestUSER_ADD_BOOK(book: BookBean) {
        let params = new SFS2X.SFSObject();
        params = book.toSFSObject(params);

        this.send(this.mBook + BookSFSCmd.USER_ADD_BOOK, params);
    }

    public sendRequestUSER_DELETE_BOOK(bookID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.BOOK_ID, bookID);

        this.send(this.mBook + BookSFSCmd.USER_DELETE_BOOK, params);
    }


    public sendRequestUSER_GET_LIST_NEW() {
        let params = new SFS2X.SFSObject();


        this.send(this.mBook + BookSFSCmd.USER_GET_LIST_NEW, params);
    }

    public sendRequestUSER_UPDATE_NEW(news: NewsBean) {
        let params = new SFS2X.SFSObject();
        params = news.toSFSObject(params);

        this.send(this.mBook + BookSFSCmd.USER_UPDATE_NEW, params);
    }

    public sendRequestUSER_ADD_NEW(news: NewsBean) {
        let params = new SFS2X.SFSObject();
        params = news.toSFSObject(params);

        this.send(this.mBook + BookSFSCmd.USER_ADD_NEW, params);
    }

    public sendRequestUSER_DELETE_NEW(newID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.NEW_ID, newID);

        this.send(this.mBook + BookSFSCmd.USER_DELETE_NEW, params);
    }


    public sendRequestUSER_GET_LIST_ORDER(userID?: number) {
        let params = new SFS2X.SFSObject();
        if (userID) params.putInt(ParamsKey.USER_ID, userID);

        this.send(this.mBook + BookSFSCmd.USER_GET_LIST_ORDER, params);
    }

    public sendRequestUSER_UPDATE_ORDER(order: OrderBean) {
        let params = new SFS2X.SFSObject();
        params = order.toSFSObject(params);

        this.send(this.mBook + BookSFSCmd.USER_UPDATE_ORDER, params);
    }

    public sendRequestUSER_ADD_ORDER(order: OrderBean) {
        let params = new SFS2X.SFSObject();
        params = order.toSFSObject(params);

        this.send(this.mBook + BookSFSCmd.USER_ADD_ORDER, params);
    }

    public sendRequestUSER_DELETE_ORDER(orderID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.ORDER_ID, orderID);

        this.send(this.mBook + BookSFSCmd.USER_DELETE_ORDER, params);
    }

}
