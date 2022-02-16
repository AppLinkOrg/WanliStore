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
        price: '',
        giftcardcover: '',
        amount: '',
        orderstatus: 'A',
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

      giftcardsapi.giftcardorder({id:this.Base.options.id},(e)=>{
        this.Base.setMyData({
          cardorder:e
        })
      })
  
    }
    selectcover(e){
      var cover = e.currentTarget.id
      console.log(e)
      this.Base.setMyData({
        coverid : e.currentTarget.id - 1
      })
    }
    selectprice(e){
      var money = e.currentTarget.id
      console.log(money)
      console.log(e)
    }
    paygiftcard(e){
      var data = this.Base.getMyData();
      var idx = this.Base.getMyData().cardinfo.id;
      console.log("这这这")
      console.log(idx)
      var giftcardsaip = new GiftcardsApi();
      var wechatapi = new WechatApi();
      giftcardsaip.giftcardorder({    
        giftcardinfo_id: this.idx,
        price: data.price,
        giftcardcover:data.giftcardcover,
        amount:data.amount,
        orderstatus: data.orderstatus
      },(ret)=>{
        if(ret.code=='0'){
          wechatapi.prepaygiftcard({id:ret.return},(payret)=>{
            payret.complete = function(e){
              if (e.errMsg == "requestPayment:ok") {
                wx.reLaunch({
                  url: '/pages/buygiftcardssuccess/buygiftcardssuccess',
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