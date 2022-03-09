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
import { GiftcardsApi } from "../../apis/giftcards.api";
  
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
      wx.setNavigationBarTitle({
        title: '兑换历史',
      })
      super.onLoad(options);
      this.Base.setMyData({
      })
    }
    onMyShow() {
      var that = this;
      var giftcardsapi = new GiftcardsApi();
      giftcardsapi.mygiftcardlist({cardtype:'B'},(e)=>{
          this.Base.setMyData({
            mygiftcardlist:e
          })
      })
    }
  
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  
  
  Page(body)