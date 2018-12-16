import { SfsClientBaseExtension } from "../core/smartfox/sfs-client-extension";
import { ParamsKey } from "../app-module/paramskeys";
import { BookSFSCmd } from "./book-cmd";
import { BookBean } from "../bean/BookBean";
import { NewsBean } from "../bean/NewsBean";
import { OrderBean } from "../bean/OrderBean";
import { BookSFSConnector } from "./book-connector";

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
        if (cmd == BookSFSCmd.USER_GET_LIST_BOOK) {
            return this.onExtensionUSER_GET_LIST_BOOK(params);
        }
        else if (cmd == BookSFSCmd.USER_ADD_BOOK) {
            return this.onExtensionUSER_ADD_BOOK(params);
        }
        else if (cmd == BookSFSCmd.USER_UPDATE_BOOK) {
            return this.onExtensionUSER_UPDATE_BOOK(params);
        }
        else if (cmd == BookSFSCmd.USER_DELETE_BOOK) {
            return this.onExtensionUSER_DELETE_BOOK(params);
        }

        else if (cmd == BookSFSCmd.USER_GET_LIST_NEW) {
            return this.onExtensionUSER_GET_LIST_NEW(params);
        }
        else if (cmd == BookSFSCmd.USER_UPDATE_NEW) {
            return this.onExtensionUSER_UPDATE_NEW(params);
        }
        else if (cmd == BookSFSCmd.USER_ADD_NEW) {
            return this.onExtensionUSER_ADD_NEW(params);
        }
        else if (cmd == BookSFSCmd.USER_DELETE_NEW) {
            return this.onExtensionUSER_DELETE_NEW(params);
        }

        else if (cmd == BookSFSCmd.USER_GET_LIST_ORDER) {
            return this.onExtensionUSER_GET_LIST_ORDER(params);
        }
        else if (cmd == BookSFSCmd.USER_UPDATE_ORDER) {
            return this.onExtensionUSER_UPDATE_ORDER(params);
        }
        else if (cmd == BookSFSCmd.USER_ADD_ORDER) {
            return this.onExtensionUSER_ADD_ORDER(params);
        }
        else if (cmd == BookSFSCmd.USER_DELETE_ORDER) {
            return this.onExtensionUSER_DELETE_ORDER(params);
        }

        else if (cmd == BookSFSCmd.UPLOAD_IMAGE) {
            return this.onExtensionUPLOAD_IMAGE(params);
        }

    }

    public onExtensionUSER_GET_LIST_BOOK(params) {
        let data = this.doParseArrayExtensions(params);
        let array = data.array;
        let arrayObject: Array<BookBean> = [];
        for (let i = 0; i < array.size(); i++) {
            let sfsObject = array.getSFSObject(i);
            let object = new BookBean();
            object.fromSFSObject(sfsObject);
            arrayObject.push(object);
        }
        return arrayObject;
    }

    public onExtensionUSER_UPDATE_BOOK(params) {
        let data = this.doParseInfo(params);
        let info = data.info;
        let object = new BookBean();
        object.fromSFSObject(info);
        return object;
    }

    public onExtensionUSER_ADD_BOOK(params) {
        let data = this.doParseInfo(params);
        let info = data.info;
        let object = new BookBean();
        object.fromSFSObject(info);
        return object;
    }

    public onExtensionUSER_DELETE_BOOK(params) {
        let data = this.doParseInfo(params);
        let info = data.info;
        let object = new BookBean();
        object.fromSFSObject(info);
        return object;
    }


    public onExtensionUSER_GET_LIST_NEW(params) {
        let data = this.doParseArrayExtensions(params);
        let array = data.array;
        let arrayObject: Array<NewsBean> = [];
        for (let i = 0; i < array.size(); i++) {
            let sfsObject = array.getSFSObject(i);
            let object = new NewsBean();
            object.fromSFSObject(sfsObject);
            arrayObject.push(object);
        }
        return arrayObject;
    }

    public onExtensionUSER_UPDATE_NEW(params) {
        let data = this.doParseInfo(params);
        let info = data.info;
        let object = new NewsBean();
        object.fromSFSObject(info);
        return object;
    }

    public onExtensionUSER_ADD_NEW(params) {
        let data = this.doParseInfo(params);
        let info = data.info;
        let object = new NewsBean();
        object.fromSFSObject(info);
        return object;
    }

    public onExtensionUSER_DELETE_NEW(params) {
        let data = this.doParseInfo(params);
        let info = data.info;
        let object = new NewsBean();
        object.fromSFSObject(info);
        return object;
    }


    public onExtensionUSER_GET_LIST_ORDER(params) {
        let data = this.doParseArrayExtensions(params);
        let array = data.array;
        let arrayObject: Array<OrderBean> = [];
        for (let i = 0; i < array.size(); i++) {
            let sfsObject = array.getSFSObject(i);
            let object = new OrderBean();
            object.fromSFSObject(sfsObject);
            arrayObject.push(object);
        }
        return arrayObject;
    }

    public onExtensionUSER_UPDATE_ORDER(params) {
        let data = this.doParseInfo(params);
        let info = data.info;
        let object = new OrderBean();
        object.fromSFSObject(info);
        return object;
    }

    public onExtensionUSER_ADD_ORDER(params) {
        let data = this.doParseInfo(params);
        let info = data.info;
        let object = new OrderBean();
        object.fromSFSObject(info);
        return object;
    }

    public onExtensionUSER_DELETE_ORDER(params) {
        let data = this.doParseInfo(params);
        let info = data.info;
        let object = new OrderBean();
        object.fromSFSObject(info);
        return object;
    }

    public onExtensionUPLOAD_IMAGE(params) {
        let data = this.doParseArrayExtensions(params);
        let array = data.array;
        let type;

        if (data.content.containsKey("__type")) {
            type = data.content.getUtfString("__type");
        }

        let url: any;
        if (array && type != 4) {
            url = "http://" + BookSFSConnector.getInstance().getSFSHost() + ":" + BookSFSConnector.getInstance().getSFSPort() + "/" + array.getSFSObject(0).getUtfString(ParamsKey.URL);
        }

        if (type == 4) {
            url = [];
            for (let i = 0; i < array.size(); i++) {
                let source = "http://" + BookSFSConnector.getInstance().getSFSHost() + ":" + BookSFSConnector.getInstance().getSFSPort() + "/" + array.getSFSObject(i).getUtfString(ParamsKey.URL);
                url.push(source);
            }
        }
        return { url: url, type: type };
    }
}