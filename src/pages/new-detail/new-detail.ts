import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserBean } from '../../providers/bean/UserBean';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { NewsBean } from '../../providers/bean/NewsBean';

/**
 * Generated class for the NewDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-detail',
  templateUrl: 'new-detail.html',
})
export class NewDetailPage {

  mUser: UserBean;
  mNews: NewsBean = new NewsBean();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
  ) {
    this.mUser = this.mAppModule.getUser();
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
      this.navCtrl.push("LoadingPage");
      return;
    }
  }

}
