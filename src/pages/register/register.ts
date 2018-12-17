import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserBean } from '../../providers/bean/UserBean';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { BookSFSConnector } from '../../providers/book-smartfox/book-connector';
import { BookBaseExtension } from '../../providers/book-smartfox/book-base-extensions';
import { BookSFSCmd } from '../../providers/book-smartfox/book-cmd';
import { UploadFileModule } from '../../providers/upload-image/upload-file';
import { UploadType } from '../../providers/upload-image/upload-type';
import { UserInfo } from '../../providers/bean/user-info';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  mUser: UserBean = new UserBean();
  userInfo: UserInfo = new UserInfo();

  password = "";
  rePassword = "";


  mLogoFile: any;
  mCoverFile: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
  }


  ionViewDidLoad() {
    this.mAppModule._LoadAppConfig().then(() => {
      BookSFSConnector.getInstance().addListener("ProfilePage", response => {
        this.onExtensionResponse(response);
      });
      // this.onLoadData();
    })
  }

  ionViewWillUnload() {
    BookSFSConnector.getInstance().removeListener('ProfilePage');
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    if (BookBaseExtension.getInstance().doCheckStatusParams(params)) {
      let data = BookBaseExtension.getInstance().doBaseExtension(cmd, params);
      if (cmd == BookSFSCmd.UPLOAD_IMAGE) {
        this.onExtensionUploadImage(data);
      }
      else if (cmd == BookSFSCmd.USER_REGISTER) {
        this.onExtensionUSER_REGISTER(data);
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onExtensionUploadImage(data) {
    this.mAppModule.hideLoading();
    if (data) {
      console.log(data);
      if (data.type == "1") {
        this.mUser.setAvatar(data.url);
      }
      else if (data.type == "2") {
        this.mUser.setCover(data.url);
      }
    } else {
      this.mAppModule.showToast("Upload thất bại");
    }
  }

  onExtensionUSER_REGISTER(data) {
    this.mAppModule.hideLoading();
    if (data) {
      this.mAppModule.showToast("Đăng ký thành công!");
      this.mAppModule.setUser(data);
      this.mUser = data;
      this.userInfo.setUsername(this.mUser.getUsername());
      this.userInfo.setPassword(this.mUser.getPassword());
      BookSFSConnector.getInstance().disconnect().then(() => {
        this.navCtrl.push("LoadingPage", { params: this.userInfo });

      })
    }
    else {
      this.mAppModule.showToast("Đăng ký thất bại!");
    }
  }

  onClickImage(type) {

    UploadFileModule.getInstance()._openFileInBrowser((res) => {
      if (res) {
        if (type == UploadType.LOGO) {
          this.mLogoFile = res.selectedFile;
          this.mUser.setAvatar(res.avatar);
          this.mAppModule.showLoadingNoduration().then(() => {
            UploadFileModule.getInstance()._onUploadFileInBrowser(this.mLogoFile, UploadType.LOGO, "true");

          });

        } else if (type == UploadType.COVER) {
          this.mCoverFile = res.selectedFile;
          this.mUser.setCover(res.avatar);
          this.mAppModule.showLoadingNoduration().then(() => {
            UploadFileModule.getInstance()._onUploadFileInBrowser(this.mCoverFile, UploadType.COVER, "true");

          });
        }
      }
    });

  }

  onClickRegister() {
    if ((this.password.trim() != "") && (this.password.trim() == this.rePassword.trim()) && this.mUser.getName().trim() != "" && this.mUser.getUsername().trim() != "") {
      this.mUser.setPassword(this.rePassword);
      this.mAppModule.showLoading().then(() => {
        BookSFSConnector.getInstance().sendRequestUSER_REGISTER(this.mUser);
      })
    }
    else if (this.password.trim() != this.rePassword.trim()) {
      this.mAppModule.showToast("Xác nhận mật khẩu chưa đúng");
    }
    else {
      this.mAppModule.showToast("Bạn chưa điền đủ thông tin đăng ký");
    }
  }



}
