import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserBean } from '../../providers/bean/UserBean';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { BookBean } from '../../providers/bean/BookBean';

/**
 * Generated class for the BookDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-book-detail',
  templateUrl: 'book-detail.html',
})
export class BookDetailPage {

  mUser: UserBean;
  mBooks: BookBean = new BookBean();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,

  ) {
    this.mUser = this.mAppModule.getUser();
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
      this.navCtrl.push("LoadingPage");
      return;
    }
  }

}
