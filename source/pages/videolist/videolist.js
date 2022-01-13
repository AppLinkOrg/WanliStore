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
    OnlinevideoApi
  } from "../../apis/onlinevideo.api.js";
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
  
      super.onLoad(options);
       wx.setNavigationBarTitle({
        title: "在线视频"
      })
    }
    onMyShow() {
      var that = this;
      var api = new OnlinevideoApi();
      api.list({},(list)=>{
        this.Base.setMyData({
          list
        })
      })
  
    }
  
  
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  
  Page(body)