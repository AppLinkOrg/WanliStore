import {
    AppBase
  } from "../../appbase";
  import {
    ApiConfig
  } from "../../apis/apiconfig";
  import {
    InstApi
  } from "../../apis/inst.api.js";
import { OrderApi } from "../../apis/order.api";
import { WechatApi } from "../../apis/wechat.api";
  
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
      //options.id=5;
      super.onLoad(options);
      wx.setNavigationBarTitle({
        title: "我的订单"
      })
      this.Base.setMyData({
      })
    }
    onMyShow() {
      var that = this;
      var orderapi = new OrderApi();
      orderapi.orderinfo({id:this.Base.options.id},(info)=>{
        this.Base.setMyData({
            info
        })
      })
    }
    switchtype(e){
        var orderstatus = e.currentTarget.id;
        this.Base.setMyData({
            orderstatus
        })
        this.onMyShow();
    }
    bindpay(){
        var info = this.Base.getMyData().info;
        var wechatapi = new WechatApi();
        wechatapi.prepay({id:info.id},(payret)=>{
            payret.complete = function(e){
                if (e.errMsg == "requestPayment:ok") {
                    wx.reLaunch({
                      url: '/pages/paysuccess/paysuccess?amount='+info.amount,
                    })
                  }
            }
            wx.requestPayment(payret);
        })
    }
    cancelorder(){
        var that = this;
        var info = this.Base.getMyData().info;
        var orderapi = new OrderApi();
        wx.showModal({
            title:'订单提示',
            content:'是否要取消该订单',
            success:(ret)=>{
                if(ret.confirm){
                    orderapi.cancelorder({id:info.id},(ret)=>{
                        that.Base.toast('订单取消成功');
                        that.onMyShow();
                    })
                }
            }
        })
    }
    refundorder(){
        var that = this;
        var id = this.Base.getMyData().info.id;
        var wechatapi = new WechatApi();
        wx.showModal({
            title:'订单提示',
            content:'是否要申请退款？',
            success:(ret)=>{
                if(ret.confirm){
                    wechatapi.refund({id:id},(ret)=>{
                        if(ret.code>=0){
                            that.Base.toast('订单退款成功');
                            that.onMyShow();
                        }else {
                            that.Base.toast(ret.result);
                        }
                       
                    })
                }
            }
        })
    }
    shouhuo(){
        var that = this;
        var info = this.Base.getMyData().info;
        var orderapi = new OrderApi();
        wx.showModal({
            title:'订单提示',
            content:'已确认收到商品',
            success:(ret)=>{
                if(ret.confirm){
                    orderapi.shouhuo({id:info.id},(ret)=>{
                        that.onMyShow();
                    })
                }
            }
        })
    }
  }
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad; 
  body.onMyShow = content.onMyShow;
  body.switchtype = content.switchtype;
  body.bindpay = content.bindpay;
  body.cancelorder = content.cancelorder;
  body.refundorder = content.refundorder;
  body.shouhuo = content.shouhuo;
  Page(body)