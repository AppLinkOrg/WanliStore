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
        totalamount:this.Base.options.totalamount==undefined?0:this.Base.options.totalamount,
        couponid:this.Base.options.couponid==undefined?0:this.Base.options.couponid,
        flag: this.Base.options.couponid==0?false:true,
      })
      
      console.log("这里")
      console.log(this.Base.getMyData())
    }
    onMyShow() {
      var that = this;
      var mallapi = new MallApi();
      var couponapi = new CouponApi();

      couponapi.mycoupon({},(e)=>{
        var data = this.Base.getMyData();
        var couponlist = e.filter(item =>{
          return item.usesstatus == 'A' && (item.manmoney*1) <= (data.totalamount*1)
        })
        this.Base.setMyData({
            couponlist
        })
      })
    }

    choseconpon(e){
      var data = this.Base.getMyData();
      var id = e.currentTarget.id;
      var flag = data.flag;
      console.log("这里")
      console.log(flag)
      console.log(data.couponid)
      console.log(id)
        if (flag==false) {
          if(id == data.couponid){
            flag=true
          }else{
            flag=true
          } 
        }else{
          if (id == data.couponid) {
            flag=false
          }
        }
        if(flag==false){
          id=0
        }
        this.Base.setMyData({
            couponid:id,
            flag
        })
        // var pages = getCurrentPages();
        // var prevPage = pages[pages.length - 2]; //上一个页面
        // prevPage.setData({
        //   couponid:id
        //    })
        //    wx.navigateBack({//返回
        //      delta: 1
        //    })
    }

    use(e){
      var data = this.Base.getMyData();
      var couponid  = data.couponid;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.setData({
          couponid
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
  body.choseconpon = content.choseconpon;
  body.use = content.use;
  
  
  Page(body)