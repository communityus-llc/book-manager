import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { OrderBean } from '../../providers/bean/OrderBean';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { BookSFSConnector } from '../../providers/book-smartfox/book-connector';
import { BookBaseExtension } from '../../providers/book-smartfox/book-base-extensions';
import { BookSFSCmd } from '../../providers/book-smartfox/book-cmd';
import { UserBean } from '../../providers/bean/UserBean';
import { ORDER_TYPE } from '../../providers/app-module/app-constants';


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

  mUser: UserBean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mViewController: ViewController
  ) {
    this.mUser = this.mAppModule.getUser();
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mOrder = this.navParams.get("params");
    }
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.push("ModalOrderPage");
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      BookSFSConnector.getInstance().addListener("ModalOrderPage", response => {
        this.onExtensionResponse(response);
      });
    });

  }

  ionViewWillUnload() {
    BookSFSConnector.getInstance().removeListener("ModalOrderPage");
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
      this.mViewController.dismiss();
    }
  }



  onClickCompleteOrder() {
    this.mAppModule.showAlert("Bạn có chắc muốn hoàn thành hóa đơn hàng này?", res => {
      if (res == 1) {
        this.mOrder.setState(ORDER_TYPE.COMPLETE);
        BookSFSConnector.getInstance().sendRequestUSER_UPDATE_ORDER(this.mOrder);
      }
    });
  }

  onClickConfirmOrder() {
    this.mAppModule.showAlert("Bạn có chắc muốn xác nhận hóa đơn hàng này?", res => {
      if (res == 1) {
        this.mOrder.setState(ORDER_TYPE.CONFIRMED);
        BookSFSConnector.getInstance().sendRequestUSER_UPDATE_ORDER(this.mOrder);
      }
    });
  }

  onClickCancelOrder() {
    this.mAppModule.showAlert("Bạn có chắc muốn hủy đơn hàng này?", res => {
      if (res == 1) {
        this.mOrder.setState(ORDER_TYPE.CANCEL);
        BookSFSConnector.getInstance().sendRequestUSER_UPDATE_ORDER(this.mOrder);
      }
    });
  }



}
