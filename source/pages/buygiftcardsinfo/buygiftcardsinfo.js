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
  }from "../../apis/giftcards.api";
  import{
    ApiUtil
  }from "../../apis/apiutil";

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
      giftcardsapi.giftcardlist({list_id:this.Base.options.id},(e)=>{
        this.Base.setMyData({
            cardlist:e
        })
      })
      giftcardsapi.giftcardinfo({id:this.Base.options.id},(e) => {
        e.howbuy = ApiUtil.HtmlDecode(e.howbuy)
        this.Base.setMyData({
          cardinfo:e
        })
      })
      giftcardsapi.coverbanner({id:this.Base.options.id},(e) => {
        this.Base.setMyData({
          cardbanner:e
        })
      })

      giftcardsapi.giftcardprice({id:this.Base.options.id},(e) => {
        this.Base.setMyData({
          cardprice:e
        })
      })
  
    }
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
 
  
  Page(body)