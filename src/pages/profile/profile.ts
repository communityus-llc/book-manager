import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserBean } from '../../providers/bean/UserBean';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { BookSFSConnector } from '../../providers/book-smartfox/book-connector';
import { BookBaseExtension } from '../../providers/book-smartfox/book-base-extensions';
import { BookSFSCmd } from '../../providers/book-smartfox/book-cmd';

import md5 from 'md5';
import { UploadFileModule } from '../../providers/upload-image/upload-file';
import { UploadType } from '../../providers/upload-image/upload-type';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  mUser: UserBean;

  isChange: boolean = false;

  mLogoFile: any;
  mCoverFile: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
    this.mUser = this.mAppModule.getUser();
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
      else if (cmd == BookSFSCmd.USER_UPDATE_INFO) {
        this.onExtensionUSER_UPDATE_INFO(data);
      }
    } else {
      this.mAppModule.showParamsMessage(params);
    }
  }

  onExtensionUploadImage(data) {
    this.mAppModule.hideLoading();
    if (data) {
      console.log(data);
      this.isChange = true;
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

  onExtensionUSER_UPDATE_INFO(data) {
    if (data) {
      this.mAppModule.setUser(data);
      this.navCtrl.pop();
    }
  }

  onClickChange(index) {
    if (index == 1) {
      this.mAppModule.showPromptChangeProfile("Tên hiển thị", "Chỉnh sửa tên hiển thị", res => {
        if (res) {
          this.isChange = true;
          this.mUser.setName(res[0]);
        }
      })
    }
    else if (index == 2) {
      this.mAppModule.showPromptChangeProfile("Số điện thoại", "Thay đổi số điện thoại", res => {
        if (res) {
          this.isChange = true;
          this.mUser.setPhone(res[0]);
        }
      })
    }
    else if (index == 3) {
      this.mAppModule.showPromptChangeProfile("Địa chỉ email", "Thay đổi địa chỉ email", res => {
        if (res) {
          this.isChange = true;
          this.mUser.setEmail(res[0]);
        }
      })
    }
    else if (index == 4) {
      this.mAppModule.showPromptChangePassword("Đổi mật khẩu", "Thay đổi mật khẩu", res => {
        if (res) {
          if (md5(res[0]) == this.mUser.getPassword()) {
            this.mUser.setPassword(md5(res[1]));
            this.isChange = true;
          }
          else {
            this.mAppModule.showToast("Mật khẩu hiện tại không đúng");
          }
        }
      })
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

  onClickChangeProfile() {
    console.log(this.mUser);
    BookSFSConnector.getInstance().sendRequestUSER_UPDATE_INFO(this.mUser);
  }

}
