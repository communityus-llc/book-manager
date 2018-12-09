import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BookSFSConnector } from '../../providers/book-smartfox/book-connector';
import { BookBaseExtension } from '../../providers/book-smartfox/book-base-extensions';
import { BookSFSCmd } from '../../providers/book-smartfox/book-cmd';
import { BUTTON_TYPE } from '../../providers/app-module/app-constants';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { BookBean } from '../../providers/bean/BookBean';

/**
 * Generated class for the ModalAddBookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-add-book',
  templateUrl: 'modal-add-book.html',
})
export class ModalAddBookPage {

  mBooks: BookBean = new BookBean();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mViewController: ViewController
  ) {
  }


  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.push("ModalAddBookPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      BookSFSConnector.getInstance().addListener("ModalAddBookPage", response => {
        this.onExtensionResponse(response);
      });
    });
  }

  ionViewWillUnload() {
    BookSFSConnector.getInstance().removeListener("ModalAddBookPage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    if (BookBaseExtension.getInstance().doCheckStatusParams(params)) {
      let data = BookBaseExtension.getInstance().doBaseExtension(cmd, params);
      if (cmd == BookSFSCmd.USER_ADD_BOOK) {
        this.onExtensionUSER_ADD_BOOK(data);
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onExtensionUSER_ADD_BOOK(data) {
    if (data && data.getBookID() > -1) {
      this.mViewController.dismiss({ data: data, type: BUTTON_TYPE.SAVE });
    }
  }


  onClickSaveBook() {
    this.mAppModule.showAlert("Bạn có chắc muốn lưu sách này?", res => {
      if (res == 1) {
        console.log(this.mBooks);

        BookSFSConnector.getInstance().sendRequestUSER_ADD_BOOK(this.mBooks);
      }
    });
  }

}
