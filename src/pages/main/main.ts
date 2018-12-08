import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, AlertController } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { BookSFSConnector } from '../../providers/book-smartfox/book-connector';
import { BookBaseExtension } from '../../providers/book-smartfox/book-base-extensions';
import { BookSFSCmd } from '../../providers/book-smartfox/book-cmd';
import { LOGIN_TYPE } from '../../providers/app-module/app-constants';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserInfo } from '../../providers/bean/user-info';
import { APPKEYS } from '../../providers/app-module/app-keys';
import { UserBean } from '../../providers/bean/UserBean';
import { BookBean } from '../../providers/bean/BookBean';
import { NewsBean } from '../../providers/bean/NewsBean';
import { OrderBean } from '../../providers/bean/OrderBean';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  @ViewChild(Slides) slides: Slides;

  listNew: any;
  listTitle: any;
  mContact: any;

  username: string = "";
  password: string = "";

  loginType: number = 0;

  userInfo: UserInfo = new UserInfo();

  mUser: UserBean;

  listBook: Array<any> = [
    { id: 1, name: "Đi tìm lẽ sống", description: "Đi tìm lẽ sống đơn giản là đi tìm cách sống", thumbnail: "./assets/imgs/book3.jpg" },
    { id: 2, name: "Đi tìm lẽ sống", description: "Đi tìm lẽ sống đơn giản là đi tìm cách sống", thumbnail: "./assets/imgs/book3.jpg" },
    { id: 3, name: "Đi tìm lẽ sống", description: "Đi tìm lẽ sống đơn giản là đi tìm cách sống", thumbnail: "./assets/imgs/book3.jpg" },
    { id: 4, name: "Đi tìm lẽ sống", description: "Đi tìm lẽ sống đơn giản là đi tìm cách sống", thumbnail: "./assets/imgs/book3.jpg" },
  ]


  listBooks: Array<BookBean> = [];
  listNews: Array<NewsBean> = [];
  listOrders: Array<OrderBean> = [];


  menuSelected: number = 0;
  listMenu: Array<{ id: number, name: string }> = [
    { id: 0, name: "Trang chủ" },
    { id: 1, name: "Đơn hàng" },
    { id: 2, name: "Danh mục sách" },
    { id: 3, name: "Bản tin" }
  ]

  selected: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mSplashScreen: SplashScreen,
    public mAlertController: AlertController,


  ) {
    this.mUser = this.mAppModule.getUser();
    this.onLoadConfig();
  }

  onLoadConfig() {
    this.mAppModule._LoadAppConfig().then(() => {
      this.listTitle = this.mAppModule.getAppConfig().get("titleText")
      this.listNew = this.mAppModule.getAppConfig().get("listNews");
      this.mContact = this.mAppModule.getAppConfig().get("contact");
    })
  }

  onLoadData() {
    BookSFSConnector.getInstance().sendRequestUSER_GET_LIST_BOOK();
    BookSFSConnector.getInstance().sendRequestUSER_GET_LIST_NEW();
    BookSFSConnector.getInstance().sendRequestUSER_GET_LIST_ORDER();

  }

  ionViewDidLoad() {

    if (!this.mAppModule.isLogin) {
      this.navCtrl.push("LoadingPage");
      return;
    }

    this.mAppModule._LoadAppConfig().then(() => {
      BookSFSConnector.getInstance().addListener("MainPage", response => {
        this.onExtensionResponse(response);
      });
      this.onLoadData();
    });

  }

  ionViewWillUnload() {
    BookSFSConnector.getInstance().removeListener("MainPage");
  }


  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    if (BookBaseExtension.getInstance().doCheckStatusParams(params)) {
      let data = BookBaseExtension.getInstance().doBaseExtension(cmd, params);
      if (cmd == BookSFSCmd.USER_GET_LIST_BOOK) {
        this.onExtensionUSER_GET_LIST_BOOK(data);
      }
      else if (cmd == BookSFSCmd.USER_GET_LIST_NEW) {
        this.onExtensionUSER_GET_LIST_NEW(data);
      }
      else if (cmd == BookSFSCmd.USER_GET_LIST_ORDER) {
        this.onExtensionUSER_GET_LIST_ORDER(data);
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onExtensionUSER_GET_LIST_BOOK(data) {
    if (data) {
      console.log(data);

      this.listBooks = data;
    }

  }

  onExtensionUSER_GET_LIST_NEW(data) {
    if (data) {
      console.log(data);

      this.listNews = data;
    }
  }

  onExtensionUSER_GET_LIST_ORDER(data) {
    if (data) {
      console.log(data);

      this.listOrders = data;
    }
  }

  slideChanged(item) {
    this.selected = item.realIndex;
    this.slides.startAutoplay();
  }

  onClickDot(item) {
    this.selected = item.id;
    this.slides.slideTo(this.selected);
  }

  onClickSeeMore() {
    this.navCtrl.push("ListbookPage");
  }

  onClickLogin() {
    this.userInfo.setUsername(this.username);
    this.userInfo.setPassword(this.password);

    BookSFSConnector.getInstance().disconnect().then(() => {
      this.navCtrl.push("LoadingPage", { params: this.userInfo });

    })
  }

  onClickLogout() {
    BookSFSConnector.getInstance().disconnect().then(() => {
      this.mAppModule.getStoreController().removeKeyDataFromStorage(APPKEYS.USER_INFO).then(() => {
        this.navCtrl.push("LoadingPage");
      })
    })
  }

  onClickMenu(item) {
    this.menuSelected = item.id
  }

  onClickOrder(item: OrderBean) {
    this.mAppModule.showModal("ModalOrderPage", { params: item });
  }
}
