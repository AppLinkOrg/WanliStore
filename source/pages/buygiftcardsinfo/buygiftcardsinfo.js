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
import{
  WechatApi
}from "../../apis/wechat.api"
var WxParse = require('../../wxParse/wxParse.js');

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
        coverid:  0,
        giftcardinfo_id:'',
        giftcardprice_id: '',
        giftcardcover: '',
        amount: '',
        pay_time:''
      })
    }
    onMyShow() {
    //   var that = this;
      var giftcardsapi = new GiftcardsApi();
      giftcardsapi.giftcardtype({},(e)=>{
        this.Base.setMyData({
            cardtype:e
        })
      })
      giftcardsapi.giftcardlist({},(e)=>{
        this.Base.setMyData({
            cardlist:e
        })
      })
      giftcardsapi.giftcardinfo({id:this.Base.options.id},(e) => {
        e.howbuy = ApiUtil.HtmlDecode(e.howbuy)
        WxParse.wxParse('howbuy' , 'html', e.howbuy, this,10) 
        this.Base.setMyData({
          cardinfo:e
        })
      })
      giftcardsapi.coverbanner({giftcardinfo_id:this.Base.options.id},(e) => {
        this.Base.setMyData({
          cardbanner:e
        })
      })

      giftcardsapi.giftcardprice({giftcardinfo_id:this.Base.options.id},(e) => {
        this.Base.setMyData({
          cardprice:e
        })
      })

      giftcardsapi.giftcardorder({id:this.Base.options.id},(e)=>{
        this.Base.setMyData({
          cardorder:e
        })
      })
  
    }
    selectcover(e){
      
      var banner = this.Base.getMyData().cardbanner;
      var cover = e.currentTarget.id;
      var convercanner = banner[cover-1];
      this.Base.setMyData({
        coverid : convercanner.id -1
      })
    }
    selectprice(e){
      var money = e.currentTarget.id
      console.log(money)
      console.log(e)
      this.Base.setMyData({
        priceid : money
      })
    }
    paygiftcard(e){
      var data = this.Base.getMyData();
      var idx = this.Base.getMyData().cardinfo.id;
      console.log("这这这")
      console.log(idx)
      var giftcardsaip = new GiftcardsApi();
      var wechatapi = new WechatApi();
      var that = this;
      
      giftcardsaip.giftcardorder({    
        giftcardinfo_id: idx,
        giftcardcover_id:this.Base.getMyData().coverid,
        giftcardprice_id:this.Base.getMyData().priceid,
        amount: this.Base.getMyData().priceid * 100,
      },(ret)=>{
        if(ret.code=='0'){
          wechatapi.prepaygiftcard({id:ret.return},(payret)=>{
            payret.complete = function(e){
              if (e.errMsg == "requestPayment:ok") {
                wx.reLaunch({
                  url: '/pages/buygiftcardssuccess/buygiftcardssuccess?id='+ that.Base.options.id,
                })
              }
            }
            wx.requestPayment(payret);
          })
        }else {
          this.Base.toast(ret.result);
        }
      })
    }

  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.selectcover = content.selectcover;
  body.selectprice = content.selectprice;
  body.paygiftcard = content.paygiftcard;
  
  Page(body)