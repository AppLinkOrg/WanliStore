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
        typelist:[
          {name:'可使用',value:'A'},
          {name:'已使用',value:'B'},
          {name:'已失效',value:'C'}
      ],
      flag: 'A',
      inputValue: '',
      inputpawValue: ''
      })
    }
    onMyShow() {
      var couponapi = new  CouponApi();
      var data = this.Base.getMyData();
      couponapi.mycoupon({},(e)=>{
        var keshiyonglist = e.filter(item =>{
          return item.usesstatus == 'A'
        })
        var shiyonglist = e.filter(item =>{
          return item.usesstatus == 'B'
        })
        var shixiaolist = e.filter(item =>{
          return item.usesstatus == 'C'
        })
          this.Base.setMyData({
            coupon:e,
            keshiyonglist,
            shiyonglist,
            shixiaolist

          })
        
      })
    }

    switchtype(e){
      console.log("这这这")
      console.log(e)
      var id = e.currentTarget.id
      this.Base.setMyData({
          flag: id
      })
    }

    usecoupon(e){
        wx.switchTab({
            url:'/pages/mall/mall'
          })
    }
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.switchtype = content.switchtype;
  body.usecoupon = content.usecoupon;
  
  Page(body)