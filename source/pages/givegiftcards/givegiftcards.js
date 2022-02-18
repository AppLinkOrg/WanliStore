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
    GiftcardsApi
  } from "../../apis/giftcards.api.js";
  import { ApiUtil } from "../../apis/apiutil";
  
  
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
      wx.setNavigationBarTitle({
        title: "礼品卡详情"
      })
      super.onLoad(options);
      this.Base.setMyData({
         
      })
    }
    onMyShow() {
      var that = this;
      var giftcardsapi = new GiftcardsApi();
      giftcardsapi.mygiftcardinfo({id:this.Base.options.id},(e)=>{
        e.howuse = ApiUtil.HtmlDecode(e.howuse)
        this.Base.setMyData({
          cardinfo: e
        })
      })
    }
    

    

  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;

  Page(body)