// pages/goodsinfo/goodsinfo.js
// pages/mall/mall.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
import {
  MallApi
} from "../../apis/mall.api.js";
import {
  OrderApi
} from "../../apis/order.api";
import {
  MemberApi
} from "../../apis/member.api";
var WxParse = require('../../wxParse/wxParse');

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
    wx.setNavigationBarTitle({
      title: '个人信息',
    })
    let list = [{
      id: 0,
      value: '未知',
    }, {
      id: 1,
      value: '男',
    }, {
      id: 2,
      value: '女'
    }]
    let nickName = this.Base.options.nickName;
    this.Base.setMyData({
      gender: list,
      avatarUrl: "",
      nickName
    });
  }
  onMyShow() {
    var that = this;
  }
  bin_inp(e) {
    console.log(e)
    this.Base.setMyData({
      nickName: e.detail.value
    })
  }
  bindpic(e) {
    var that = this;
    const {
      avatarUrl
    } = e.detail
    this.Base.setMyData({
      avatarUrl
    })
    let uploadpath = this.Base.getMyData().uploadpath;
    this.Base.uploadAvatarUrl("member", avatarUrl, (ret) => {
      console.log(ret)
      that.Base.setMyData({
        avatarUrl: uploadpath + 'member/' + ret
      });
    }, undefined);
  }
  getUserProfile(e) {
    console.log(e.detail.value)
    var str = `是否确认修改`;
    var memberapi = new MemberApi();
    var that = this;
    wx.showModal({
      title: '修改提示',
      content: str,
      success: (res) => {
        console.log(res);
        if (res.confirm) {
          memberapi.updatamb({
            nickName: that.Base.getMyData().nickName || that.Base.getMyData().memberinfo.nickName,
            avatarUrl: that.Base.getMyData().avatarUrl || that.Base.getMyData().memberinfo.avatarUrl,
          }, () => {
            wx.switchTab({
              url: '/pages/my/my'
            })
          });
        }
      },
      fail: (res) => {

      },
    });
  }


}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.getUserProfile = content.getUserProfile;
body.bindpic = content.bindpic;
body.bin_inp = content.bin_inp;
Page(body)