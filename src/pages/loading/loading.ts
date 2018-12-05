import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DeviceManager } from '../../providers/core/plugin/device-manager';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { APPKEYS } from '../../providers/app-module/app-keys';
import { UserInfo, BookSFSConnector } from '../../providers/book-smartfox/book-connector';

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
  constructor(

    public mSplashScreen: SplashScreen,
    public mPlatform: Platform,
    public mAppModule: AppModuleProvider,
    public mAlertController: AlertController,
    public navCtrl: NavController, public navParams: NavParams
  ) { }


  ionViewDidLoad() {
    this.mPlatform.ready().then(() => {
      this.onPlatformReady();
    });
  }

  ionViewWillUnload() {
    setTimeout(() => { this.mSplashScreen.hide(); }, 500);
  }

  onPlatformReady() {
    DeviceManager.getInstance().setInMobileDevice(!(this.mPlatform.is('core') || this.mPlatform.is('mobileweb')));
    if (DeviceManager.getInstance().isInMobileDevice()) {
      DeviceManager.getInstance().setPlatform(this.mPlatform.is("android") ? 1 : 2);
    }
    this.doLoadAppConfig();
  }

  doLoadAppConfig() {
    this.mAppModule._LoadAppConfig().then(() => {
      this.onLoadConfigSucess();
    }).catch(() => {
      this.onLoadConfigFail();
    });
  }



  doSwitchToTabsPage() {
    this.navCtrl.setRoot("MainPage", {}, {
      animate: false,
    });
  }

  doSwitchToBoardingPage() {
    // this.navCtrl.setRoot("MainPage", {}, {
    //   animate: false
    // });
  }


  onLoadConfigSucess() {
    this.mAppModule.getStoreController().getDataFromStorage(APPKEYS.USER_INFO).then((res) => {
      if (res) {
        let dataStorage = JSON.parse(res);
        if (dataStorage.login_type == 4) {
          this.doConnectToServer();
        } else {
          let userInfo: UserInfo = dataStorage;
          this.doConnectToServer(userInfo);
        }
      } else {
        this.doConnectToServer();
        // this.doSwitchToBoardingPage();
      }
    });
    // this.mAppModule.getHistoryKeysTemplate();
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

  doConnectToServer(userInfo?: UserInfo) {
    BookSFSConnector.getInstance().connect().then((res) => {     
      if (userInfo) {
        this.onConnectSucess(userInfo);
      } else {
        this.onGuestConnectSucess();
      }
    }).catch((err) => {
      this.onConnectError(err);
    });
  }

  onConnectSucess(userinfo: UserInfo) {
    // this.mAppModule.doLogin(userinfo).then((params) => {
    //   this.onLoginSucess(params);
    // }, error => {
    //   this.doSwitchToBoardingPage();
    // });
  }

  onGuestConnectSucess() {
    this.mAppModule.doLoginByGuest().then(params => {
      this.mAppModule.onLoginSuccess(params);
      this.doSwitchToTabsPage();
    }, error => {
      // this.doSwitchToBoardingPage();
    });
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

}
