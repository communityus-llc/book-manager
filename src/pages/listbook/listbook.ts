import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { BookSFSConnector } from '../../providers/book-smartfox/book-connector';
import { BookBaseExtension } from '../../providers/book-smartfox/book-base-extensions';
import { BookSFSCmd } from '../../providers/book-smartfox/book-cmd';

/**
 * Generated class for the ListbookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listbook',
  templateUrl: 'listbook.html',
})
export class ListbookPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,

  ) {
  }

  onLoadData() {
    BookSFSConnector.getInstance().sendRequestUSER_GET_LIST_BOOK();

  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("MainPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      BookSFSConnector.getInstance().addListener("ListbookPage", response => {
        this.onExtensionResponse(response);
      });
      this.onLoadData();
    });
  }

  ionViewWillUnload() {
    BookSFSConnector.getInstance().removeListener("ListbookPage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    if (BookBaseExtension.getInstance().doCheckStatusParams(params)) {
      let data = BookBaseExtension.getInstance().doBaseExtension(cmd, params);
      if (cmd == BookSFSCmd.USER_GET_LIST_BOOK) {

      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

}
