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
  import{
    CouponApi
  }from "../../apis/coupon.api.js"
  

  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
      wx.setNavigationBarTitle({
        title: "优惠券"
      })
      super.onLoad(options);
      this.Base.setMyData({
        nowindex: 1,
        overlay: true,
        specificationsinfo: null,
        number: 1,
        goodsid: this.Base.options.goodsid==undefined?0:this.Base.options.goodsid,
      })

    }
    onMyShow() {
      var that = this;
      var mallapi = new MallApi();
      var couponapi = new CouponApi();

      couponapi.mycoupon({},(e)=>{
        this.Base.setMyData({
            couponlist:e
        })
      })
    }

    chosedz(e){
        var id = e.currentTarget.id;
        this.Base.setMyData({
            giftcardid:id
        })
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.setData({
            giftcardid:id
           })
           wx.navigateBack({//返回
             delta: 1
           })
    }
  
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.chosedz = content.chosedz;
  
  
  Page(body)