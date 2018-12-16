
import { HttpClient, HttpRequest, HttpParams, HttpHeaders } from "@angular/common/http";
import { BookSFSConnector } from "../book-smartfox/book-connector";

export class UploadFileModule {
    public static _instance: UploadFileModule = null;

    public http: HttpClient = null;

    constructor() { }

    public _initiallize(http: HttpClient) {
        this.setHttp(http);
    }

    public setHttp(http: HttpClient) {
        this.http = http;
    }

    public static getInstance(): UploadFileModule {
        if (this._instance == null) {
            this._instance = new UploadFileModule();
        }
        return this._instance;
    }


    /**resize: true - false */
    public _onUploadFileInBrowser(selectedFile: any, type: any, resize: string, key?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (selectedFile) {
                var formData: FormData = new FormData();
                formData.append("file", selectedFile);

                var headers: HttpHeaders = new HttpHeaders();
                headers.append('Content-Type', null);
                headers.append('Accept', 'multipart/form-data');

                var httpParams: HttpParams = new HttpParams();
                httpParams = httpParams.append('sessHashId', BookSFSConnector.getInstance().getSessionToken());
                httpParams = httpParams.append('__type', type + "");
                httpParams = httpParams.append('__resize', resize);
                httpParams = httpParams.append('__command', "upload_image");
                if (key) httpParams = httpParams.append('__key', key);

                console.log(httpParams);

                const req = new HttpRequest('POST', "http://" + BookSFSConnector.getInstance().getSFSHost() + ":" + BookSFSConnector.getInstance().getSFSPort() + "/BlueBox/SFS2XFileUpload?sessHashId=" + BookSFSConnector.getInstance().getSessionToken(), formData, {
                    reportProgress: true,
                    responseType: 'text',
                    params: httpParams,
                    headers: headers
                });

                console.log("request: ", req);

                this.http.request(req).subscribe(data => {
                    console.log("upload data : ", data);
                    resolve(data);
                });

            } else {
                reject("Please select file first");
            }
        })
    }

    public _openFileInBrowser(callback: any) {
        let input = document.createElement("input");
        input.type = "file";
        input.onchange = (data) => {
            let file = input.files[0];
            if (file.type.startsWith("image")) {
                var reader = new FileReader();
                reader.addEventListener("load", (image) => {
                    let avatar = image.target["result"];
                    callback({ selectedFile: file, avatar: avatar });
                })
                reader.readAsDataURL(file);

            } else {
                callback();
            }
        }
        document.body.appendChild(input);
        input.click();
    }

    public _onUploadFilesInBrowser(selectedFile: Array<any>, type: any, resize: string, key?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (selectedFile) {
                var formData: FormData = new FormData();

                selectedFile.forEach(file => {
                    formData.append("file", file.file);
                });

                var headers: HttpHeaders = new HttpHeaders();
                headers.append('Content-Type', null);
                headers.append('Accept', 'multipart/form-data');

                var httpParams: HttpParams = new HttpParams();
                httpParams = httpParams.append('sessHashId', BookSFSConnector.getInstance().getSessionToken());
                httpParams = httpParams.append('__type', type + "");
                httpParams = httpParams.append('__resize', resize);
                httpParams = httpParams.append('__command', "upload_image");

                if (key) httpParams = httpParams.append('__key', key);

                const req = new HttpRequest('POST', "http://" + BookSFSConnector.getInstance().getSFSHost() + ":" + BookSFSConnector.getInstance().getSFSPort() + "/BlueBox/SFS2XFileUpload?sessHashId=" + BookSFSConnector.getInstance().getSessionToken(), formData, {
                    reportProgress: true,
                    responseType: 'text',
                    params: httpParams,
                    headers: headers
                });

                console.log("request: ", req);

                this.http.request(req).subscribe(data => {
                    console.log("upload data : ", data);
                    resolve(data);
                });

            } else {
                reject("Please select file first");
            }
        })
    }
}