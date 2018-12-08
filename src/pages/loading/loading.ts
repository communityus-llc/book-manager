import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DeviceManager } from '../../providers/core/plugin/device-manager';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { APPKEYS } from '../../providers/app-module/app-keys';
import { BookSFSConnector } from '../../providers/book-smartfox/book-connector';
import { UserInfo } from '../../providers/bean/user-info';

/**
 * Generated class for the LoadingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html',
})
export class LoadingPage {

  isLoadDataClub: boolean = false;
  isLoadDataLeague: boolean = false;

  userInfo: UserInfo = new UserInfo();
  constructor(

    public mSplashScreen: SplashScreen,
    public mPlatform: Platform,
    public mAppModule: AppModuleProvider,
    public mAlertController: AlertController,
    public navCtrl: NavController, public navParams: NavParams
  ) {
    this.onLoadParams();
  }


  ionViewDidLoad() {
    this.doLoadAppConfig();

  }

  ionViewWillUnload() {
    setTimeout(() => { this.mSplashScreen.hide(); }, 500);
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.userInfo = this.navParams.get("params");
    }
  }

  doLoadAppConfig() {
    this.mAppModule._LoadAppConfig().then(() => {
      this.onLoadConfigSucess();
    }).catch(() => {
      this.onLoadConfigFail();
    });
  }



  doSwitchToMainPage() {
    this.navCtrl.setRoot("MainPage", {}, {
      animate: false,
    });
  }

  onLoadConfigSucess() {
    this.mAppModule.getStoreController().getDataFromStorage(APPKEYS.USER_INFO).then((res) => {
      if (res) {
        let dataStorage = JSON.parse(res);
        this.userInfo.fromObject(dataStorage);
      }
      this.doConnectToServer();
    });
  }

  onLoadConfigFail() {
    this.mSplashScreen.hide();
    this.mAppModule.hideLoading();
    let alert = this.mAlertController.create();
    alert.setTitle("Network error!");
    alert.setMessage("Make sure that Wi-Fi or mobile data is turned on, then try again");
    alert.addButton({
      text: "Retry",
      handler: () => {
        this.onClickReloadConfig();
      }
    });
    alert.present();
  }

  onClickReloadConfig() {
    this.mAppModule.showLoading().then(() => {
      setTimeout(() => {
        this.doLoadAppConfig();
      }, 2000);
    });
  }

  doConnectToServer() {
    BookSFSConnector.getInstance().connect().then((res) => {
      this.onConnectSucess();
    }).catch((err) => {
      this.onConnectError(err);
    });
  }

  onConnectSucess() {
    if (this.userInfo.getUsername().trim() != "" || this.userInfo.getPassword().trim() != "") {
      this.mAppModule.doLogin(this.userInfo).then((params) => {
        this.mAppModule.onLoginSuccess(params);
        this.mAppModule.getStoreController().removeKeyDataFromStorage(APPKEYS.USER_INFO);
        this.mAppModule.getStoreController().saveDataToStorage(APPKEYS.USER_INFO, JSON.stringify(this.userInfo));
      }, error => {
        this.onLogginError(error);
      });
    } else {
      this.mAppModule.doLoginByGuest().then(params => {
        this.mAppModule.onLoginSuccess(params);

      })
    }
    this.doSwitchToMainPage();
  }

  onConnectError(err) {
    this.mSplashScreen.hide();
    let alert = this.mAlertController.create();
    alert.setTitle("Connection error!");
    alert.setMessage("Cannot connect to server, please check your internet connection and try again.");
    alert.addButton({
      text: "Retry",
      handler: () => {
        this.onClickReconnectToServer();
      }
    });
    alert.present();
  }

  onClickReconnectToServer() {
    this.mAppModule.showLoadingNoduration().then(() => {
      this.onLoadConfigSucess();
    });
  }

  onLogginError(err) {
    this.mAppModule.hideLoading();
    let alert = this.mAppModule.getAlertController().create();
    alert.setTitle("Thông báo");
    alert.setSubTitle("Đăng nhập thất bại");
    alert.setMessage("Sai tên đăng nhập hoặc mật khẩu");
    alert.addButton("Ok");
    alert.present();
  }

}
