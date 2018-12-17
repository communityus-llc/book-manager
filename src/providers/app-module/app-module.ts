import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { WiadsHttpClient } from './wiads-http-client';
import { Config } from "../core/app/config";
import { Platform, Loading, LoadingController, ToastController, AlertController, ModalController } from 'ionic-angular';
import { BookSFSConnector } from '../book-smartfox/book-connector';
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
import { ParamsKey } from './paramskeys';
import { UserBean } from '../bean/UserBean';
import { DeviceInfo } from '../bean/device-info';
import { UserInfo } from '../bean/user-info';

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

  private mUser: UserBean;

  newDeviceInfo = new DeviceInfo();


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
    private mToastController: ToastController,
    public mAlertController: AlertController,
    public mModalController: ModalController,

  ) {
    this.mNetworkController._setNetwork(this.mNetwork);
    this.mHttpClient = new WiadsHttpClient();
    this.mAppConfig = new Config();
    this.mStorageController = new StorageController();
    this.mStorageController.setStorage(mStorage);
    this.mUser = new UserBean();

  }

  public getAlertController(): AlertController {
    return this.mAlertController;
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

  public getUser(): UserBean {
    return this.mUser;
  }
  public setUser(user: UserBean) {
    this.mUser = user;
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

  doLogin(userInfo: UserInfo) {
    return new Promise((resolve, reject) => {
      this.newDeviceInfo.setOnesignalID(OneSignalManager.getInstance().getOneSignalID())
      this.newDeviceInfo.setName(DeviceManager.getInstance().getDeviceName());
      this.newDeviceInfo.setPlatform(DeviceManager.getInstance().getPlatform());

      BookSFSConnector.getInstance().login(this.newDeviceInfo, userInfo).then((params) => {
        BookSFSConnector.getInstance().addListenerForExtensionResponse();
        return resolve(params);
      }).catch((err) => {
        return reject(err);
      });
    });
  }


  doLoginByGuest() {
    return new Promise((resolve, reject) => {
      this.newDeviceInfo.setOnesignalID(OneSignalManager.getInstance().getOneSignalID())
      this.newDeviceInfo.setName(DeviceManager.getInstance().getDeviceName());
      this.newDeviceInfo.setPlatform(DeviceManager.getInstance().getPlatform());

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
      console.log(userdata.getDump());
      if (userdata.getInt(ParamsKey.LOGIN_TYPE) == 3) {
        this.showToast("Đăng nhập thành công", 2000, "top");
      }

      if (userdata.getInt(ParamsKey.LOGIN_TYPE) == 4) {
        this.showToast("Chế độ khách", 2000, "top");
      }
      let sfsUserData = userdata.getSFSObject(ParamsKey.CONTENT);
      this.mUser.fromSFSObject(sfsUserData);
      console.log(this.mUser);
      // let roomToJoin = userdata.getUtfString(ParamsKey.ROOM);
      // BookSFSConnector.getInstance().requestJoinRoom(roomToJoin);
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

  showToast(message: string, duration?: number, position?: string) {
    this.mToastController
      .create({
        message: message,
        duration: duration ? duration : 2000,
        position: position ? position : "bottom"
      })
      .present();
  }

  public showModal(page, params?: any, callback?: any): void {
    let modal = this.mModalController.create(page, params ? params : null);
    modal.present();
    modal.onDidDismiss(data => {
      if (callback) {
        callback(data);
      }
    });
  }

  public showParamsMessage(params) {
    this.showToast(params.getUtfString(ParamsKey.MESSAGE));
  }

  public showAlertDisConnect() {
    let alert = this.mAlertController.create();
    alert.setTitle("Network error!");
    alert.setMessage(
      "Make sure that Wi-Fi or mobile data is turned on, then try again"
    );
    alert.addButton({
      text: "Retry",
      handler: () => {

      }
    });
    alert.present();
  }

  public doSaveUserInfoIntoStorage(userInfo: UserInfo) {
    // this.BookUserInfoInfo = userInfo;
    return this.mStorageController.saveDataToStorage(
      "book_user_info",
      JSON.stringify(userInfo)
    );
  }

  public showAlert(title: string, callback: any) {
    let alert = this.mAlertController.create();
    alert.setTitle(title);
    alert.addButton({
      text: "Cancel",
      role: "cancel",
      handler: () => {
        callback(0);
      }
    });

    alert.addButton({
      text: "OK",
      handler: () => {
        callback(1);
      }
    });
    alert.present();
  }

  public showPromptChangeProfile(title: string, message: string, callback: any) {
    let alert = this.mAlertController.create();
    alert.setTitle(title);
    alert.setMessage(message);
    alert.addButton({
      text: "Cancel",
      role: "cancel",
      handler: () => {
        callback();
      }
    });

    alert.addButton({
      text: "OK",
      handler: data => {
        callback(data);
      }
    });

    alert.addInput({
      placeholder: "Nhập thông tin mới",
      type: "text"
    });

    alert.present();
  }

  public showPromptChangePassword(
    title: string,
    message: string,
    callback: any
  ) {
    let alert = this.mAlertController.create();
    alert.setTitle(title);
    alert.setMessage(message);
    alert.addButton({
      text: "Cancel",
      role: "cancel",
      handler: () => {
        callback();
      }
    });

    alert.addButton({
      text: "OK",
      handler: data => {
        callback(data);
      }
    });

    alert.addInput({
      placeholder: "Mật khẩu cũ",
      type: "password"
    });
    alert.addInput({
      placeholder: "Mật khẩu mới",
      type: "password"
    });

    alert.present();
  }

}
