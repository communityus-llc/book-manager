import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';

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

  listNews: any;
  listTitle: any;
  mContact: any;

  listBook: Array<any> = [
    {id: 1, name: "Đi tìm lẽ sống", description: "Đi tìm lẽ sống đơn giản là đi tìm cách sống", thumbnail: "./assets/imgs/book3.jpg"},
    {id: 2, name: "Đi tìm lẽ sống", description: "Đi tìm lẽ sống đơn giản là đi tìm cách sống", thumbnail: "./assets/imgs/book3.jpg"},
    {id: 3, name: "Đi tìm lẽ sống", description: "Đi tìm lẽ sống đơn giản là đi tìm cách sống", thumbnail: "./assets/imgs/book3.jpg"},
    {id: 4, name: "Đi tìm lẽ sống", description: "Đi tìm lẽ sống đơn giản là đi tìm cách sống", thumbnail: "./assets/imgs/book3.jpg"},
  ]

  selected: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
    this.onLoadConfig();
  }

  onLoadConfig() {
    this.mAppModule._LoadAppConfig().then(() => {
      this.listTitle = this.mAppModule.getAppConfig().get("titleText")
      this.listNews = this.mAppModule.getAppConfig().get("listNews");
      this.mContact = this.mAppModule.getAppConfig().get("contact");
      console.log(this.mContact);

    })
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.navCtrl.setRoot("LoadingPage");
      return;
    }
    // this.slides.startAutoplay();
  }

  slideChanged(item) {
    this.selected = item.realIndex + 1;
    this.slides.startAutoplay();
  }

  onClickDot(item) {
    this.selected = item.id;
    this.slides.slideTo(this.selected - 1);
  }

}
