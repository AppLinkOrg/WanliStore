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
        coverid: 1,
        coverindex: 0,
        priceid: 0,
        priceindex: -1,
        giftcardinfo_id:'',
        giftcardcover: '',
        giftcardprice_id: '',
        amount: '',
        cardid:this.Base.options.id==undefined?0:this.Base.options.id
      })
    }
    onMyShow() {
      var giftcardsapi = new GiftcardsApi();
 
    // 礼品卡详情
      giftcardsapi.giftcardinfo({id:this.Base.options.id},(e) => {
        e.howbuy = ApiUtil.HtmlDecode(e.howbuy)
        WxParse.wxParse('howbuy' , 'html', e.howbuy, this,10) 
        this.Base.setMyData({
          cardinfo:e
        })
      })

      // 礼品卡封面
      giftcardsapi.coverbanner({giftcardinfo_id:this.Base.options.id},(e) => {
        this.Base.setMyData({
          cardbanner:e
        })
      })

      // 礼品卡金额
      giftcardsapi.giftcardprice({giftcardinfo_id:this.Base.options.id},(e) => {
        this.Base.setMyData({
          cardprice:e
        })
      })
    }

    // 礼品卡封面选择
    selectcover(e){
      var coverindex = e.currentTarget.dataset.coverindex;
      var coverid = e.currentTarget.id;
      this.Base.setMyData({
        coverindex,
        coverid,
      })
    }

    // 礼品卡价格选择
    selectprice(e){
      var priceindex = e.currentTarget.dataset.priceindex;
      var priceid = e.currentTarget.id;
      var amount = this.Base.getMyData().cardprice[priceindex].cardprice;
      this.Base.setMyData({
        priceindex,
        priceid,
        amount,
      })
    }

    // 购买礼品卡
    paygiftcard(e){
      var data = this.Base.getMyData();
      var idx = this.Base.getMyData().cardinfo.id;
    
      
     if (data.priceid==0) {
      this.Base.toast('请选择电子卡价格')
      return
     }
     
      var giftcardsaip = new GiftcardsApi();
      var wechatapi = new WechatApi();
      var that = this;
      
      giftcardsaip.giftcardorder({
        giftcardinfo_id: this.Base.getMyData().cardinfo.id,
        giftcardcover_id: this.Base.getMyData().coverid,
        giftcardprice_id: this.Base.getMyData().priceid,
        amount: this.Base.getMyData().amount,
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