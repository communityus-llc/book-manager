

import { Headers } from "@angular/http";
import { HttpClient } from "../core/http/http-client";
import { ParamBuilder } from "../core/http/param-builder";
import md5 from "md5";
export class WiadsHttpClient extends HttpClient {
    mUrl = "";
    mClientKey = "";
    mToken: string = "";

    constructor() {
        super();
    }

    public onResponseConfig(data){
        if(data && data["http"]){
            let http = data["http"];
            let api_server = http["api_server"];
            this.mUrl = http[api_server]["host"];
            this.mClientKey = http["client_key"];
        }
    }

    createHeaders() {
        if (this.mUseNativeHttp) {
            this.mNativeHttp.setHeader(this.mUrl, 'client_key', this.mClientKey);
            this.mNativeHttp.setHeader(this.mUrl, 'Content-type', 'application/json; charset=utf-8');
        } else {
            this.mAngularHeader = new Headers({
                client_key: this.mClientKey,
                content_type: 'application/json; charset=utf-8'
            });
        }

    }

    public getAccessPointDetail(mac){
        return this.requestGet(this.mUrl + "/accesspoint/detail",ParamBuilder.builder()
            .add("mac", mac)
            .add("sign",md5(mac + this.mClientKey))
        )
    }

    public rebootDevice(mac){
        return this.requestPost(this.mUrl + "/accesspoint/reboot", ParamBuilder.builder()
            .add("mac", mac)
            .add("sign", md5(mac + this.mClientKey))
            .add("immediately", 1)
        );
    }


}