import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, AlertController, Content } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { BookSFSConnector } from '../../providers/book-smartfox/book-connector';
import { BookBaseExtension } from '../../providers/book-smartfox/book-base-extensions';
import { BookSFSCmd } from '../../providers/book-smartfox/book-cmd';
import { LOGIN_TYPE, BUTTON_TYPE } from '../../providers/app-module/app-constants';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserInfo } from '../../providers/bean/user-info';
import { APPKEYS } from '../../providers/app-module/app-keys';
import { UserBean } from '../../providers/bean/UserBean';
import { BookBean } from '../../providers/bean/BookBean';
import { NewsBean } from '../../providers/bean/NewsBean';
import { OrderBean } from '../../providers/bean/OrderBean';
import { Utils } from '../../providers/core/app/utils';

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
  @ViewChild(Content) myContent: Content;


  listTitle: any;
  mContact: any;

  username: string = "";
  password: string = "";

  loginType: number = 0;

  userInfo: UserInfo = new UserInfo();

  mUser: UserBean;

  aboutUs = "Website của chúng tôi đem đến cho bạn nhiều sự lựa chọn với nhiều loại thể loại sách khác nhau: Khoa Học, Văn Học, Sách Giáo Khoa, Anh Ngữ và nhiều thể loại sách khác. Các bạn có thể đến trực tiếp cửa hàng hoặc mua hàng qua website, rất mong muốn được phục vụ các bạn."


  listBooks: Array<BookBean> = [];
  listBooksFilter: Array<BookBean> = [];


  listNews: Array<NewsBean> = [];
  listOrders: Array<OrderBean> = [];

  listBooksHome: Array<BookBean> = [];
  listNewsHome: Array<NewsBean> = [];

  listBooksOrder: Array<BookBean> = [];


  menuSelected: number = 0;
  listMenu: Array<{ id: number, name: string }> = [
    { id: 0, name: "Trang chủ" },
    { id: 1, name: "Đơn hàng" },
    { id: 2, name: "Danh mục sách" },
    { id: 3, name: "Bản tin" },
    { id: 4, name: "Giỏ hàng" }
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
      this.mContact = this.mAppModule.getAppConfig().get("contact");
    })
  }

  onLoadData() {
    BookSFSConnector.getInstance().sendRequestUSER_GET_LIST_BOOK();
    BookSFSConnector.getInstance().sendRequestUSER_GET_LIST_NEW();
    if (this.mUser && this.mUser.getRole() == 2) {
      BookSFSConnector.getInstance().sendRequestUSER_GET_LIST_ORDER();
    } else if (this.mUser && this.mUser.getRole() == 1) {
      BookSFSConnector.getInstance().sendRequestUSER_GET_LIST_ORDER(this.mUser.getUserID());
    }

  }

  onLoadFourBook() {
    for (let i = 0; i < 4; i++) {
      this.listBooksHome.push(this.listBooks[i]);
    }
  }

  onLoadThreeNew() {
    for (let i = 0; i < 3; i++) {
      this.listNewsHome.push(this.listNews[i]);
    }
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

  ionViewDidEnter() {
    this.slides.startAutoplay();
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
      else if (cmd == BookSFSCmd.USER_ADD_ORDER) {
        this.onExtensionUSER_ADD_ORDER(data);
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onExtensionUSER_GET_LIST_BOOK(data) {
    if (data) {
      console.log(data);
      data.sort((b, a) => {
        return a.getTimeCreated() - b.getTimeCreated();
      });
      this.listBooks = data;
      this.listBooksFilter = data;
      this.onLoadFourBook();
    }

  }

  onExtensionUSER_GET_LIST_NEW(data) {
    if (data) {
      console.log(data);
      data.sort((b, a) => {
        return a.getTimeCreated() - b.getTimeCreated();
      });
      this.listNews = data;
      this.onLoadThreeNew();
    }
  }

  onExtensionUSER_GET_LIST_ORDER(data) {
    if (data) {
      console.log(data);
      data.sort((b, a) => {
        return a.getTimeCreated() - b.getTimeCreated();
      });
      this.listOrders = data;
    }
  }

  onExtensionUSER_ADD_ORDER(data) {
    if (data) {
      console.log(data);
      this.listOrders.unshift(data);

      this.mAppModule.showToast("Tạo đơn hàng thành công")
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
    this.myContent.scrollToTop(200);
    this.menuSelected = 3;
  }

  onClickLogin() {
    this.userInfo.setUsername(this.username);
    this.userInfo.setPassword(this.password);

    BookSFSConnector.getInstance().disconnect().then(() => {
      this.navCtrl.push("LoadingPage", { params: this.userInfo });

    })
  }

  onClickRegister() {
    this.navCtrl.push("RegisterPage");
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


  onClickNew(item: NewsBean) {
    if (this.mUser.getRole() == 2) {
      this.mAppModule.showModal("ModalNewPage", { params: item }, res => {
        if (res) {
          if (res.type == BUTTON_TYPE.DELETE) {
            let index = this.listNews.findIndex(item => {
              return item.getNewID() == res.data.getNewID();
            });

            if (index > -1) {
              this.listNews.splice(index, 1);
            }
          }
        }
      });
    }
    else if (this.mUser.getRole() == 1) {
      this.navCtrl.push("NewDetailPage", { params: item });
    }
  }

  onClickAddNew() {
    this.mAppModule.showModal("ModalAddNewPage", null, res => {
      if (res) {
        if (res.type == BUTTON_TYPE.SAVE) {
          this.listNews.unshift(res.data);
        }
      }
    });
  }


  onClickBook(item: BookBean) {
    if (this.mUser.getRole() == 2) {
      this.mAppModule.showModal("ModalBookPage", { params: item }, res => {
        if (res) {
          if (res.type == BUTTON_TYPE.DELETE) {
            let index = this.listBooks.findIndex(item => {
              return item.getBookID() == res.data.getBookID();
            });
            if (index > -1) {
              this.listBooks.splice(index, 1);
            }
          }
        }
      });
    }
    else {
      this.navCtrl.push("BookDetailPage", { params: item });
    }
  }

  onClickAddBook() {
    this.mAppModule.showModal("ModalAddBookPage", null, res => {
      if (res) {
        if (res.type == BUTTON_TYPE.SAVE) {
          this.listBooks.unshift(res.data);
        }
      }
    });
  }

  onClickGoToShop() {
    this.myContent.scrollToTop(200);
    this.menuSelected = 4;
  }

  totalOrder: number = 0;
  onCaculateTotal() {
    this.totalOrder = 0;
    this.listBooksOrder.forEach(item => {
      this.totalOrder = this.totalOrder + (item.getPrice() * item.getState());
    });
  }

  onClickAddOrder() {
    this.mAppModule.showAlert("Bạn có chắc muốn tạo đơn hàng này?", res => {
      if (res == 1) {
        let order = new OrderBean();
        order.setUserID(this.mUser.getUserID());
        order.setUserName(this.mUser.getName());
        order.setMoney(this.totalOrder);

        BookSFSConnector.getInstance().sendRequestUSER_ADD_ORDER(order);
      }
    })

  }




  onClickNewInHome(item: NewsBean) {
    this.navCtrl.push("NewDetailPage", { params: item });
  }

  onClickBookInHome(item: BookBean) {
    this.navCtrl.push("BookDetailPage", { params: item });
  }

  onAdd(item: BookBean) {
    if (item.getState() < 1) {
      item.setState(1);
    } else {
      let index = item.getState() + 1;
      item.setState(index);
    }

    if (this.listBooksOrder.length > 0) {
      let index = this.listBooksOrder.findIndex(book => {
        return book.getBookID() == item.getBookID();
      });
      if (index == -1) {
        this.listBooksOrder.push(item);
      }
    }
    this.onCaculateTotal();
  }

  onMinus(item: BookBean) {
    if (item.getState() < 1) {
      item.setState(0);
    } else {
      let index = item.getState() - 1;
      item.setState(index);
    }

    if (this.listBooksOrder.length > 0) {
      let index = this.listBooksOrder.findIndex(book => {
        return book.getBookID() == item.getBookID();
      });
      if (item.getState() <= 0) {
        this.listBooksOrder.splice(index, 1);
      }
    }
    this.onCaculateTotal();
  }

  onBuy(item: BookBean) {
    item.setState(1);
    this.listBooksOrder.push(item);
    this.onCaculateTotal();
  }

  searchQuery: string = "";
  oldSearchQuery: string = "";

  doSearchLocal() {
    if (this.searchQuery.trim() != '') {
      this.listBooksFilter = this.listBooks.filter(item => {
        return Utils.bodauTiengViet(item.getName().toLowerCase()).includes(this.searchQuery);
      })
    } else {
      this.listBooksFilter = this.listBooks;
    }
  }

  onClickProfile(){
    this.navCtrl.push("ProfilePage");
  }
}
