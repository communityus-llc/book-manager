import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BookSFSConnector } from '../../providers/book-smartfox/book-connector';
import { BookBaseExtension } from '../../providers/book-smartfox/book-base-extensions';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { NewsBean } from '../../providers/bean/NewsBean';
import { BookSFSCmd } from '../../providers/book-smartfox/book-cmd';
import { BUTTON_TYPE } from '../../providers/app-module/app-constants';

/**
 * Generated class for the ModalAddNewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-add-new',
  templateUrl: 'modal-add-new.html',
})
export class ModalAddNewPage {

  mNews: NewsBean = new NewsBean();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mViewController: ViewController
  ) {
  }


  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.push("ModalAddNewPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      BookSFSConnector.getInstance().addListener("ModalAddNewPage", response => {
        this.onExtensionResponse(response);
      });
    });
  }

  ionViewWillUnload() {
    BookSFSConnector.getInstance().removeListener("ModalAddNewPage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    if (BookBaseExtension.getInstance().doCheckStatusParams(params)) {
      let data = BookBaseExtension.getInstance().doBaseExtension(cmd, params);
      if (cmd == BookSFSCmd.USER_ADD_NEW) {
        this.onExtensionUSER_ADD_NEW(data);
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onExtensionUSER_ADD_NEW(data) {
    if (data && data.getNewID() > -1) {
      this.mViewController.dismiss({ data: data, type: BUTTON_TYPE.SAVE });
    }
  }


  onClickSaveNew() {
    this.mAppModule.showAlert("Bạn có chắc muốn lưu bản tin này?", res => {
      if (res == 1) {
        console.log(this.mNews);

        BookSFSConnector.getInstance().sendRequestUSER_ADD_NEW(this.mNews);
      }
    });
  }

}
