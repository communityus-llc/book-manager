import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { WiadsHttpClient } from './wiads-http-client';
import { Config } from "../core/app/config";
import { Platform, Loading, LoadingController } from 'ionic-angular';
import { BookSFSConnector, UserInfo, DeviceInfo } from '../book-smartfox/book-connector';
import { NetworkManager } from '../core/plugin/network-manager';
import { NetworkInterface } from '@ionic-native/network-interface';
import { DeviceManager } from '../core/plugin/device-manager';
import { Device } from '@ionic-native/device';
import { OneSignalManager } from '../core/plugin/onesignal-manager';
import { OneSignal } from '@ionic-native/onesignal';
import { NetworkConnectController } from '../core/network-connect/network-connect';
import { Network } from '@ionic-native/network';
import { StorageController } from '../core/storage';
import { Storage } from '@ionic/storage';
import { APPKEYS } from './app-keys';
import { LOGIN_TYPE } from './app-constants';
import { ParamsKey } from './paramskeys';

/*
  Generated class for the AppModuleProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppModuleProvider {
  private mHttpClient: WiadsHttpClient;
  private mAppConfig: Config;
  private mNetworkController: NetworkConnectController = new NetworkConnectController();
  mStorageController: StorageController = null;

  constructor(
    public http: HttpClient,
    public mAngularHttp: Http,
    public mNativeHttp: HTTP,
    private mPlatform: Platform,
    private mNetworkInterface: NetworkInterface,
    private mDevice: Device,
    private mOneSignal: OneSignal,
    private mNetwork: Network,
    public mStorage: Storage,
    private mLoadingController: LoadingController,
  ) {
    this.mNetworkController._setNetwork(this.mNetwork);
    this.mHttpClient = new WiadsHttpClient();
    this.mAppConfig = new Config();
    this.mStorageController = new StorageController();
    this.mStorageController.setStorage(mStorage);

  }

  getHttpClient() {
    return this.mHttpClient;
  }

  getAppConfig() {
    return this.mAppConfig;
  }

  getStoreController() {
    return this.mStorageController;
  }

  loginSucess() {
    return this.mStorageController.saveDataToStorage(APPKEYS.LOGIN_STATUS, true);
  }

  logout() {
    return this.mStorageController.removeKeyDataFromStorage(APPKEYS.LOGIN_STATUS);
  }

  addSFSResponeListener() {
    BookSFSConnector.getInstance().addListener("AppModuleProvider", response => {
      // this.onExtensionResponse(response);
    });
  }

  public _LoadAppConfig() {
    this.getHttpClient().createClient(this.mAngularHttp, this.mNativeHttp);
    return new Promise((resolve, reject) => {
      if (this.getAppConfig().hasData()) {
        return resolve();
      } else {
        this.getHttpClient()
          .getAngularHttp()
          .request("assets/data/app.json")
          .subscribe(
            response => {
              let dataObject = response.json();
              if (dataObject.config) {
                if (dataObject.config.get_config) {
                  this.mPlatform.ready().then(() => {
                    if (
                      this.mPlatform.platforms().indexOf("android") &&
                      dataObject.config.android
                    ) {
                      this.getHttpClient()
                        .getAngularHttp()
                        .request(dataObject.config.android)
                        .subscribe(
                          androidRes => {
                            this.onResponseConfig(androidRes.json());
                            return resolve();
                          },
                          error => {
                            this.onResponseConfig(dataObject);
                            return resolve();
                          }
                        );
                    }
                    if (
                      this.mPlatform.platforms().indexOf("ios") &&
                      dataObject.config.ios
                    ) {
                      this.getHttpClient()
                        .getAngularHttp()
                        .request(dataObject.config.ios)
                        .subscribe(
                          iosRes => {
                            this.onResponseConfig(iosRes.json());
                            return resolve();
                          },
                          error => {
                            this.onResponseConfig(dataObject);
                            return resolve();
                          }
                        );
                    }
                  });
                } else {
                  this.onResponseConfig(dataObject);
                  return resolve();
                }
              }
            },
            error => {
              return reject();
            }
          );
      }
    });
  }

  private onResponseConfig(dataObject) {

    this.getAppConfig().setData(dataObject);
    this.mHttpClient.onResponseConfig(dataObject);
    BookSFSConnector.getInstance().setData(dataObject["smartfox"]);

    NetworkManager.getInstance().setData(dataObject["network"]);
    NetworkManager.getInstance().setNetworkInterface(this.mNetworkInterface);

    DeviceManager.getInstance().setData(dataObject["device"]);
    DeviceManager.getInstance().setDevice(this.mDevice);

    OneSignalManager.getInstance().setData(dataObject["onesignal"]);
    OneSignalManager.getInstance().setOneSignal(this.mOneSignal);
  }

  newDeviceInfo = new DeviceInfo();
  doLoginByGuest() {
    return new Promise((resolve, reject) => {
      this.newDeviceInfo.onesignal_id = OneSignalManager.getInstance().getOneSignalID();
      this.newDeviceInfo.name = DeviceManager.getInstance().getDeviceName();
      this.newDeviceInfo.platform = DeviceManager.getInstance().getPlatform();
      BookSFSConnector.getInstance().loadingByGuest(this.newDeviceInfo).then(res => {
        BookSFSConnector.getInstance().addListenerForExtensionResponse();
        return resolve(res);
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  isLogin: boolean = false;
  onLoginSuccess(params) {
    this.isLogin = true;
    this.addSFSResponeListener();
    if (params) {
      let userdata = params["data"];
      console.log("userdata: ", userdata.getSFSObject());

    }
    OneSignalManager.getInstance().getOneSignalClientID().then((respone) => {
      BookSFSConnector.getInstance().sendInformationDeviceToServer(OneSignalManager.getInstance().getOneSignalID(), DeviceManager.getInstance().getDeviceName(), DeviceManager.getInstance().getPlatform());
    }).catch(err => { });
  }

  private mLoading: Loading = null;
  async showLoading(content?: string, cssClass?: string, duration?: number) {
    if (this.mLoading) {
      try {
        await this.mLoading.dismiss()
      } catch (error) { }
    }
    this.mLoading = this.mLoadingController.create({
      duration: duration ? duration : 3000,
      dismissOnPageChange: true,
      content: content ? content : "Waiting...!",
      cssClass: cssClass ? cssClass : ""
    });
    this.mLoading.present();
  }
  async showLoadingNoduration(content?: string, cssClass?: string) {
    if (this.mLoading) {
      try {
        await this.mLoading.dismiss()
      } catch (error) { }
    }
    this.mLoading = this.mLoadingController.create({
      dismissOnPageChange: true,
      content: content ? content : "Waiting...!",
      cssClass: cssClass ? cssClass : ""
    });
    this.mLoading.present();
  }
  public hideLoading(): void {
    if (this.mLoading) {
      this.mLoading.dismiss();
      this.mLoading = null;
    }
  }

}