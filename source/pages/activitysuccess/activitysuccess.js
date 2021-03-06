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
  
      super.onLoad(options);
      this.Base.setMyData({
        nowindex: 1,
        overlay: true,
        specificationsinfo: null,
        number: 1,
        activity_id: this.Base.options.id==undefined?0:this.Base.options.id,
      })
    }
    onMyShow() {
      var that = this;
      var mallapi = new MallApi();
      console.log("options的值");
      console.log(this.Base.options);
    }
    navBack(e){
      wx.navigateBack({
        delta:2
      }) 
    }




  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.navBack = content.navBack;
  
  Page(body)