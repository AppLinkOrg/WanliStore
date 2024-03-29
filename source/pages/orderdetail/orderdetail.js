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
import { MemberApi } from "../../apis/member.api";
import { MallApi } from "../../apis/mall.api";
import {
  ApiUtil
} from "../../apis/apiutil.js";
  class Content extends AppBase {
    timer=null;

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
          address_id:0,
          store_id:0
      })
      
    }
    onMyShow() {
      var that = this;
      var orderapi = new OrderApi();
      var memberapi = new MemberApi();
      var mallapi = new MallApi();
    //   获取订单详情
      orderapi.orderinfo({id:this.Base.options.id},(info)=>{
        if(this.Base.getMyData().address_id>0){
            memberapi.addressinfo({id:this.Base.getMyData().address_id},(addressinfo)=>{
                info.address_name = addressinfo.name;
                info.address_mobile = addressinfo.mobile;
                info.address_region = addressinfo.region;
                info.address_address = addressinfo.address;
                this.Base.setMyData({
                    info
                })
            })
        }else {
            if(this.Base.getMyData().store_id>0){
                mallapi.storeinfo({id:this.Base.getMyData().store_id},(storeinfo)=>{
                    info.store_name = storeinfo.name;
                    info.store_address = storeinfo.address;
                    this.Base.setMyData({
                        info
                    })
                })
                
            }else {
                this.Base.setMyData({
                    info
                })
            }
          
        }
        if (info.orderstatus=='A') {
          that.daojishi()
        }


      })
    }
    onHide(){
      let end = setInterval(function () { }, 10000);
      for (let i = 1; i <= end; i++) {
          clearInterval(i);
      }
    }
    switchtype(e){
        var orderstatus = e.currentTarget.id;
        this.Base.setMyData({
            orderstatus
        })
        this.onMyShow();
    }
    bindpay(){
        var that = this;
        var info = this.Base.getMyData().info;
        var wechatapi = new WechatApi();
        if(this.Base.getMyData().address_id>0 && this.Base.getMyData().address_id!=info.address_id){
            wx.showModal({
                title:'提示',
                content:'地址有改变，是否要改变地址',
                success:(res)=>{
                    if(res.confirm){
                        that.xiugaidz();
                    }else {
                        wechatapi.prepay({id:info.id},(payret)=>{
                          wx.showModal({
                            title: '测试',
                            content: JSON.stringify(payret),
                            })  ;
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
                }

            })
            return
        }
        if(this.Base.getMyData().store_id>0 && this.Base.getMyData().store_id!=info.store_id){
            wx.showModal({
                title:'提示',
                content:'自提地址有改变，是否要改变自提地址',
                success:(res)=>{
                    if(res.confirm){
                        that.xiugaidz();
                    }else {
                        wechatapi.prepay({id:info.id},(payret)=>{
                          wx.showModal({
                            title: '测试',
                            content: JSON.stringify(payret),
                            })  ;
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
                }

            })
            return
        }
        wechatapi.prepay({id:info.id},(payret)=>{
          wx.showModal({
            title: '测试',
            content: JSON.stringify(payret),
            })  ;
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
    cancelorder2(){
      var that = this;
      var info = this.Base.getMyData().info;
      var orderapi = new OrderApi();
      orderapi.cancelorder({id:info.id},(ret)=>{
        that.onMyShow();
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
    xiugaidz(){
        var that = this;
        var info = this.Base.getMyData().info;
        var address_id = info.address_id;
        var store_id = info.store_id;
        if(this.Base.getMyData().address_id>0){
            address_id=this.Base.getMyData().address_id;
        }
        if(info.sendtype=='A' && this.Base.getMyData().address_id==0){
            that.Base.toast('请先选择地址');
            return
        }
        if(this.Base.getMyData().store_id>0){
            store_id=this.Base.getMyData().store_id;
        }
        if(info.sendtype=='B' && this.Base.getMyData().store_id==0){
            that.Base.toast('请先选择自提地址');
            return
        }
        var orderapi = new OrderApi();
        wx.showModal({
            title:'订单提示',
            content:'是否要修改地址',
            success:(ret)=>{
                if(ret.confirm){
                    orderapi.updateaddress({id:info.id,address_id:address_id,store_id:store_id},(ret)=>{
                        that.Base.toast('修改地址成功');
                        that.onMyShow();
                    })
                }
            }
        })
    }
    shanchuorder(e){
        var that = this;
        var info = this.Base.getMyData().info;
        var orderapi = new OrderApi();
        wx.showModal({
            title:'订单提示',
            content:'是否要删除该订单',
            success:(ret)=>{
                if(ret.confirm){
                    orderapi.deleteorder({id:info.id},(ret)=>{
                        that.Base.toast('删除成功');
                       wx.navigateBack({
                         delta: 0,
                       })
                    })
                }
            }
        })
    }
    daojishi(){
      var that =this
      var info=this.Base.getMyData().info
      var submit_time = info.submit_time   //提交时间
      var instinfo=this.Base.getMyData().instinfo
      var time=instinfo.time;
      var cancel_time=time*60*1000

      var new_time=new Date().getTime() //现在时间
      var sub_time=new Date(submit_time.replace(/-/g, '/')).getTime()
  
      console.log(new_time,'new_time');
      console.log(sub_time,'sub_time');
  
      var differ_time2=new_time-sub_time
      var differ_time=cancel_time-differ_time2

      console.log(differ_time,'cancel_time',cancel_time,new_time,sub_time);
  
      this.timer = setInterval(()=> {
        if (differ_time<=0) {
          // 这个订单结束
          console.log('进来了');
          that.cancelorder2()
          // clearInterval(that.timer)
          let end = setInterval(function () { }, 10000);
      for (let i = 1; i <= end; i++) {
          clearInterval(i);
      }
          return
        }else{
             var str = ApiUtil.Timedata(differ_time)
         differ_time=differ_time*1-1000
  
         if (str=='') {
          that.Base.setMyData({str:'0秒'})
          // clearInterval(that.timer)
          let end = setInterval(function () { }, 10000);
      for (let i = 1; i <= end; i++) {
          clearInterval(i);
      }
         
         }else{
          that.Base.setMyData({str})
         }
        
        console.log('fff',differ_time);
        }
      },1000)
      
    }
    onUnload(){
      console.log("onUnload!!! " +this.timer);
      // clearInterval(this.timer);
      let end = setInterval(function () { }, 10000);
      for (let i = 1; i <= end; i++) {
          clearInterval(i);
      }
    }
  
  }
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad; 
  body.onMyShow = content.onMyShow;
  body.switchtype = content.switchtype;
  body.bindpay = content.bindpay;
  body.cancelorder = content.cancelorder;
  body.cancelorder2 = content.cancelorder2;
  body.refundorder = content.refundorder;
  body.shouhuo = content.shouhuo;
  body.xiugaidz = content.xiugaidz;
  body.shanchuorder = content.shanchuorder;
  body.daojishi = content.daojishi;
  Page(body)