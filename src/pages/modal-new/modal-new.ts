import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NewsBean } from '../../providers/bean/NewsBean';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { BookSFSConnector } from '../../providers/book-smartfox/book-connector';
import { BookBaseExtension } from '../../providers/book-smartfox/book-base-extensions';
import { BookSFSCmd } from '../../providers/book-smartfox/book-cmd';
import { BUTTON_TYPE } from '../../providers/app-module/app-constants';

/**
 * Generated class for the ModalNewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-new',
  templateUrl: 'modal-new.html',
})
export class ModalNewPage {

  mNews: NewsBean = new NewsBean();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mViewController: ViewController
  ) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mNews = this.navParams.get("params");
      console.log(this.mNews);
      
    }
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.push("ModalNewPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      BookSFSConnector.getInstance().addListener("ModalNewPage", response => {
        this.onExtensionResponse(response);
      });
    });
  }

  ionViewWillUnload() {
    BookSFSConnector.getInstance().removeListener("ModalNewPage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    if (BookBaseExtension.getInstance().doCheckStatusParams(params)) {
      let data = BookBaseExtension.getInstance().doBaseExtension(cmd, params);
      if (cmd == BookSFSCmd.USER_UPDATE_NEW) {
        this.onExtensionUSER_UPDATE_NEW(data);
      }
      else if (cmd == BookSFSCmd.USER_DELETE_NEW) {
        this.onExtensionUSER_DELETE_NEW(data);
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onExtensionUSER_UPDATE_NEW(data) {
    console.log(data);
    
    if (data && data.getNewID() > -1) {
      this.mViewController.dismiss({ data: data, type: BUTTON_TYPE.UPDATE });
    }
  }

  onExtensionUSER_DELETE_NEW(data) {
    if (data && data.getNewID() > -1) {
      this.mViewController.dismiss({ data: data, type: BUTTON_TYPE.DELETE });
    }
  }

  onClickSaveNew() {
    this.mAppModule.showAlert("Bạn có chắc muốn lưu bản tin này?", res => {
      if (res == 1) {
        console.log(this.mNews);

        BookSFSConnector.getInstance().sendRequestUSER_UPDATE_NEW(this.mNews);
      }
    });
  }

  onClickDeleteNew() {
    this.mAppModule.showAlert("Bạn có chắc muốn xóa bản tin này?", res => {
      if (res == 1) {
        console.log(this.mNews);

        BookSFSConnector.getInstance().sendRequestUSER_DELETE_NEW(this.mNews.getNewID());
      }
    });
  }

}
