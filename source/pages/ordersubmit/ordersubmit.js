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
    OrderApi
  } from "../../apis/order.api.js";
  import {
    WechatApi
  } from "../../apis/wechat.api.js";
  import {
    MemberApi
  } from "../../apis/member.api.js";
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
  
      super.onLoad(options);
      wx.setNavigationBarTitle({
        title: "创建订单"
      })
      this.Base.setMyData({
          sendtype:'A',
          address_id:0,
          store_id:0,
          beizhu:'',
          youhui:0,
          couponprice:0,
          lipin:0,
          yunfei:0,
          amount:0,
          totalamount:0,
      })
    }
    onMyShow() {
      var that = this;
      var mallapi = new MallApi();
  
      mallapi.goodsinfo({
        id: this.Base.options.goodsid
      }, (info) => {
       
        this.Base.setMyData({
          info
        });
        this.getsum();
      });
      var memberapi = new MemberApi();
      console.log(this.Base.getMyData().address_id,'达到');
      if(this.Base.getMyData().address_id==0 && this.Base.getMyData().sendtype=='A' ){
        var memberinfo = this.Base.getMyData().memberinfo;
        this.Base.setMyData({
          address_id:memberinfo.address_id
        })
      }
      if(this.Base.getMyData().address_id>0 && this.Base.getMyData().sendtype=='A'){
        memberapi.addressinfo({id:this.Base.getMyData().address_id},(addressinfo)=>{
          this.Base.setMyData({
            addressinfo
          })
        })
      }
      if(this.Base.getMyData().store_id>0 && this.Base.getMyData().sendtype=='B'){
        mallapi.storeinfo({id:this.Base.getMyData().store_id},(storeinfo)=>{
          this.Base.setMyData({
            storeinfo
          })
        })
      }
     
    }
    swtichsend(e){
        var sendtype = e.currentTarget.id
        this.Base.setMyData({
            sendtype:sendtype
        })
        this.getsum();
    }
    beizhuFn(e){
      this.Base.setMyData({
        beizhu:e.detail.value
      })
    }
    getsum(){
      var data = this.Base.getMyData();
      var info = data.info;
      var sendtype = data.sendtype;
      var yunfei = sendtype=='A'?Number(info.yunfei).toFixed(2):Number(0).toFixed(2);
      var amount = 0;
      var totalamount = 0;
      var youhui = 0;

      totalamount = (Number(info.price)+Number(yunfei)).toFixed(2);
      youhui = (Number(data.couponprice)+Number(data.lipin)).toFixed(2);
      amount =Number( totalamount - youhui).toFixed(2);
      this.Base.setMyData({
        amount,
        totalamount,
        youhui,
        yunfei
      })

    }
    bindpay(){
      var data = this.Base.getMyData();
      
      if(data.sendtype=='A' && data.address_id<=0){
           this.Base.toast('请选择地址');
           return
      }
      if(data.sendtype=='B' && data.store_id<=0){
        this.Base.toast('请选择门店地址');
        return
   
      }
      var orderapi = new OrderApi();
      var wechatapi = new WechatApi();
      orderapi.createorder({    
        goods_id:this.Base.options.goodsid,
        sendtype:data.sendtype,
        price:data.info.price,
        youhui:data.youhui,
        couponprice:data.couponprice,
        lipin:data.lipin,
        yunfei:data.yunfei,
        amount:data.amount,
        totalamount:data.totalamount,
        store_id:data.store_id,
        address_id:data.address_id,
        beizhu:data.beizhu
      },(ret)=>{
        if(ret.code=='0'){
          wechatapi.prepay({id:ret.return},(payret)=>{
            payret.complete = function(e){
              if (e.errMsg == "requestPayment:ok") {
                wx.reLaunch({
                  url: '/pages/paysuccess/paysuccess?amount='+data.amount,
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
  body.swtichsend = content.swtichsend;
  body.bindpay = content.bindpay;
  body.beizhuFn = content.beizhuFn;
  body.getsum = content.getsum;
  
  Page(body)