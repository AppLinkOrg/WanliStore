// pages/goodsinfo/goodsinfo.js
// pages/mall/mall.js
import {
    AppBase
  } from "../../appbase";
  import {
    ApiConfig
  } from "../../apis/apiconfig";
  import{
    GiftcardsApi
  }from "../../apis/giftcards.api"

  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
      wx.setNavigationBarTitle({
        title: '礼品卡',
      })
      super.onLoad(options);
      this.Base.setMyData({
        
      })
    }
    onMyShow() {
    //   var that = this;
      var giftcardsapi = new GiftcardsApi();
      giftcardsapi.giftcardtype({type_id:this.Base.options.id},(e)=>{
        this.Base.setMyData({
            cardtype:e
        })
      })
      giftcardsapi.giftcardlist({list_is:this.Base.options.id},(e)=>{
        this.Base.setMyData({
            cardlist:e
        })
      })
    }

  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;

  Page(body)