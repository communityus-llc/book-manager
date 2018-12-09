import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BookBean } from '../../providers/bean/BookBean';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { BookSFSConnector } from '../../providers/book-smartfox/book-connector';
import { BookBaseExtension } from '../../providers/book-smartfox/book-base-extensions';
import { BookSFSCmd } from '../../providers/book-smartfox/book-cmd';
import { BUTTON_TYPE } from '../../providers/app-module/app-constants';

/**
 * Generated class for the ModalBookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-book',
  templateUrl: 'modal-book.html',
})
export class ModalBookPage {

  mBooks: BookBean = new BookBean();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mViewController: ViewController
  ) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mBooks = this.navParams.get("params");
      console.log(this.mBooks);
      
    }
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.push("ModalBookPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      BookSFSConnector.getInstance().addListener("ModalBookPage", response => {
        this.onExtensionResponse(response);
      });
    });
  }

  ionViewWillUnload() {
    BookSFSConnector.getInstance().removeListener("ModalBookPage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    if (BookBaseExtension.getInstance().doCheckStatusParams(params)) {
      let data = BookBaseExtension.getInstance().doBaseExtension(cmd, params);
      if (cmd == BookSFSCmd.USER_UPDATE_BOOK) {
        this.onExtensionUSER_UPDATE_BOOK(data);
      }
      else if (cmd == BookSFSCmd.USER_DELETE_BOOK) {
        this.onExtensionUSER_DELETE_BOOK(data);
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onExtensionUSER_UPDATE_BOOK(data) {
    console.log(data);
    
    if (data && data.getBookID() > -1) {
      this.mViewController.dismiss({ data: data, type: BUTTON_TYPE.UPDATE });
    }
  }

  onExtensionUSER_DELETE_BOOK(data) {
    if (data && data.getBookID() > -1) {
      this.mViewController.dismiss({ data: data, type: BUTTON_TYPE.DELETE });
    }
  }

  onClickSaveBook() {
    this.mAppModule.showAlert("Bạn có chắc muốn lưu sách này?", res => {
      if (res == 1) {
        console.log(this.mBooks);

        BookSFSConnector.getInstance().sendRequestUSER_UPDATE_BOOK(this.mBooks);
      }
    });
  }

  onClickDeleteBook() {
    this.mAppModule.showAlert("Bạn có chắc muốn xóa sách này?", res => {
      if (res == 1) {
        console.log(this.mBooks);

        BookSFSConnector.getInstance().sendRequestUSER_DELETE_BOOK(this.mBooks.getBookID());
      }
    });
  }
}
