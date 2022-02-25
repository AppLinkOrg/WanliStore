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
  
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
        wx.setNavigationBarTitle({
          title: '我的收益',
        })
      super.onLoad(options);
      this.Base.setMyData({
        nowindex: 1,
        overlay: true,
        specificationsinfo: null,
        number: 1
      })
    }
    onMyShow() {
      var that = this;
      var mallapi = new MallApi();
  
    }
    navigateback(e){
      wx.redirectTo({
        url:'/pages/shouyitixian/shouyitixian'
      })
    }
  
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.navigateback = content.navigateback;
  
  
  Page(body)