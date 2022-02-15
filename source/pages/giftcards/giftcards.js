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
        title: "礼品卡"
      })
      super.onLoad(options);
      this.Base.setMyData({
        typelist:[
          {name:'我的礼品卡',value:'A'},
          {name:'兑换礼品卡',value:'B'}
      ],
      flag : 'A',
      })
    }
    onMyShow() {
      var that = this;
      var mallapi = new MallApi();

  
    }
    switchtype(e){
      
      this.Base.setMyData({
          orderstatus
      })
      this.onMyShow();
    }
  
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;

  Page(body)