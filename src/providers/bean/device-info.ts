import { PLATFORM } from "../app-module/app-constants";
import { OneSignalManager } from "../core/plugin/onesignal-manager";
import { ParamsKey } from "../app-module/paramskeys";

export class DeviceInfo {
    private platform: number = PLATFORM.WEB;
    private name: string = "web";
    private onesignal_id: string = OneSignalManager.getInstance().getOneSignalID();

    constructor() {
    }

    fromObject(data) {
        if (data) {
            if ("platform" in data) this.platform = data.platform;
            if ("name" in data) this.name = data.name;
            if ("onesignal_id" in data) this.onesignal_id = data.onesignal_id;
        }
    }

    toSFSObject(obj): any {
        obj.putInt(ParamsKey.PLATFORM, this.getPlatform());
        obj.putUtfString(ParamsKey.NAME, this.getName());
        obj.putUtfString(ParamsKey.ONESIGNAL_ID, this.getOnesignalID());
        return obj;
    }

    getPlatform(): number {
        return this.platform;
    }
    setPlatform(platform: number) {
        this.platform = platform;
    }

    getName(): string {
        return this.name;
    }
    setName(name: string) {
        this.name = name;
    }

    getOnesignalID(): string {
        return this.onesignal_id;
    }
    setOnesignalID(onesignal_id: string) {
        this.onesignal_id = onesignal_id;
    }

}