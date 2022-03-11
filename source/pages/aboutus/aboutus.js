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
          title: '关于我们',
        })
      super.onLoad(options);
      this.Base.setMyData({
        
      })
    }
    onMyShow() {
      var that = this;
      var instapi = new InstApi();
      instapi.aboutus({},(e)=>{
          this.Base.setMyData({
              aboutus:e
          })
      })
    }
  
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  
  
  Page(body)