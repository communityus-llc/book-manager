import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderBean } from '../../providers/bean/OrderBean';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { BookSFSConnector } from '../../providers/book-smartfox/book-connector';
import { BookBaseExtension } from '../../providers/book-smartfox/book-base-extensions';
import { BookSFSCmd } from '../../providers/book-smartfox/book-cmd';


/**
 * Generated class for the ModalOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-order',
  templateUrl: 'modal-order.html',
})
export class ModalOrderPage {

  mOrder: OrderBean = new OrderBean();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mOrder = this.navParams.get("params");
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
    });

  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    if (BookBaseExtension.getInstance().doCheckStatusParams(params)) {
      let data = BookBaseExtension.getInstance().doBaseExtension(cmd, params);
      if (cmd == BookSFSCmd.USER_UPDATE_ORDER) {
        this.onExtensionUSER_UPDATE_ORDER(data);
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onExtensionUSER_UPDATE_ORDER(data) {
    if (data) {
      this.mOrder.setState(data.getState());
    }
  }

  ionViewWillUnload() {
    BookSFSConnector.getInstance().removeListener("MainPage");
  }

  onClickCompleteOrder() {
    this.mAppModule.showAlert("Bạn có chắc muốn hoàn thành hóa đơn hàng này?", res => {
      if (res == 1) {
        this.mOrder.setState(2);
        BookSFSConnector.getInstance().sendRequestUSER_UPDATE_ORDER(this.mOrder);
      }
    });
  }

  onClickConfirmOrder() {
    this.mAppModule.showAlert("Bạn có chắc muốn xác nhận hóa đơn hàng này?", res => {
      if (res == 1) {
        this.mOrder.setState(1);
        BookSFSConnector.getInstance().sendRequestUSER_UPDATE_ORDER(this.mOrder);
      }
    });
  }

  onClickCancelOrder() {
    this.mAppModule.showAlert("Bạn có chắc muốn hủy đơn hàng này?", res => {
      if (res == 1) {
        this.mOrder.setState(0);
        BookSFSConnector.getInstance().sendRequestUSER_UPDATE_ORDER(this.mOrder);
      }
    });
  }



}
