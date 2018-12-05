import { SfsClientBaseExtension } from "../core/smartfox/sfs-client-extension";
import { ParamsKey } from "../app-module/paramskeys";

export class BookBaseExtension extends SfsClientBaseExtension {
    public static _instance: BookBaseExtension = null;
    private mDebug: boolean = true;
    constructor() {
        super();
    }

    public static getInstance(): BookBaseExtension {
        if (this._instance == null) {
            this._instance = new BookBaseExtension();
        }
        return this._instance;
    }

    public doBaseExtension(cmd, params) {
        if (this.doCheckStatusParams(params)) {
            return this.resolveParamsWithCMD(cmd, params);
        } else {
            return params.getUtfString(ParamsKey.MESSAGE);
        }
    }

    public resolveParamsWithCMD(cmd, params) {

    }
}