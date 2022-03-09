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
import { GiftcardsApi } from "../../apis/giftcards.api";
import { CouponApi } from "../../apis/coupon.api";


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
          tihuoren_id:0,
          store_id:0,
          beizhu:'',
          youhui:0,
          couponprice:0,
          lipin:0,
          yunfei:0,
          amount:0,
          totalamount:0,
          giftcardid:0,
          liping:0,
          couponid:0,
          keyongcoupon:0,
      })
    }
    onMyShow() {
      var that = this;
      var mallapi = new MallApi();
      console.log("有神")
      console.log(this.Base.Page)
     
      
      // console.log(giftcardid)
      mallapi.goodsinfo({
        id: this.Base.options.goodsid
      }, (info) => {
        this.Base.setMyData({
          info
        });

        var couponapi = new CouponApi();
        console.log("couponid有么")
        console.log(this.Base.getMyData().couponid)
        if(this.Base.getMyData().couponid >0){
          couponapi.couponinfo({id:this.Base.getMyData().couponid},(e)=>{
            this.Base.setMyData({
              couponinfo:e
            })
          })
        }
        
        couponapi.mycoupon({},(e)=>{
          var data=this.Base.getMyData();
          console.log('data有什么')
          console.log(data)
        let keys = Object.keys(e)
        var arr = e.filter(item =>{
        return item.usesstatus == 'A' && (item.manmoney*1)<=(data.totalamount*1)
         })
      console.log("arr是什么")
      console.log(arr.length);
      var keyongcoupon=arr.length
          this.Base.setMyData({
            keyongcoupon:keyongcoupon
          })
        })
      console.log("keyongcoupon赋值了吗")
      console.log(this.Base.getMyData().keyongcoupon)
        var giftcardsapi = new 	GiftcardsApi();
        console.log("giftcardid有么")
        console.log(this.Base.getMyData().giftcardid)
        if(this.Base.getMyData().giftcardid>0 ){
        giftcardsapi.mygiftcardinfo({id:this.Base.getMyData().giftcardid},(giftcardinfo)=>{
          // this.Base.getMyData().giftcardinfo.yue
          this.Base.setMyData({
            giftcardinfo
          })
          this.getsum();
        })
      }
        this.getsum();
      });


      var memberapi = new MemberApi();
      console.log(this.Base.getMyData().address_id,'达到');
      console.log(this.Base.getMyData().tihuoren_id,'达到');
      // 如果是商家配送的话
      if(this.Base.getMyData().address_id==0 && this.Base.getMyData().sendtype=='A' ){

        var memberinfo = this.Base.getMyData().memberinfo;
        console.log("member是什么")
        console.log(memberinfo)
        this.Base.setMyData({
          address_id:memberinfo.address_id
        })
      }
      if(this.Base.getMyData().address_id>0 && this.Base.getMyData().sendtype=='A'){
        memberapi.addressinfo({id:this.Base.getMyData().address_id,status:'A'},(addressinfo)=>{
          this.Base.setMyData({
            addressinfo
          })
        })
      }
      if(this.Base.getMyData().tihuoren_id>0 && this.Base.getMyData().sendtype=='B'){
        memberapi.addressinfo({id:this.Base.getMyData().tihuoren_id},(addressthr)=>{
          this.Base.setMyData({
            addressthr
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
      console.log("有什么")
      console.log(data)
      console.log(this.Base.options)
      var info = data.info;
      var sendtype = data.sendtype;
      var yunfei = sendtype=='A'?Number(info.yunfei).toFixed(2):Number(0).toFixed(2);
      var amount = 0;
      var totalamount = 0;
      var youhui = 0;
      var lipin = 0;
      var liping = 0;
      var couponprice = 0;
      // 商品总价，商品价格+邮费
      totalamount = Number(info.price).toFixed(2);

      // 优惠券使用
      if(data.couponid>0){
        if(data.couponinfo.type == 'A'){
          couponprice = data.couponinfo.amount
        }
        if(data.couponinfo.type == 'B'){
          couponprice = (totalamount * (1- data.couponinfo.zhekou / 100) ).toFixed(2)
        } 
      }
      // 礼品卡使用
      // 1、礼品卡使用金额
      if(data.giftcardid>0){
        var cardyue = data.giftcardinfo.yue;
        var cardid =data.giftcardinfo.id;
        if(data.couponid>0){
          var price = Number(totalamount)-Number(couponprice).toFixed(2)
          if(cardyue*1 > price*1){
            liping = price
          }else{
            liping = cardyue
          }
        }else{
          console.log("这个怎么样？")
          console.log(cardyue)
          console.log(totalamount)
          if(cardyue *1 > totalamount*1){
            liping = totalamount
          }else{
            liping = cardyue
          }
        }
        // 2、礼品卡余额
        if(data.giftcardid >0){
          if(data.couponid >0){
            lipin=(Number(cardyue) - Number(totalamount) + Number(couponprice)).toFixed(2);
          }else{
            lipin = (Number(cardyue) - Number(totalamount)).toFixed(2);
          }
        }
    }
    // 总优惠金额
    youhui = (Number(couponprice)+ Number(liping)).toFixed(2);
    // 最终付款金额
      amount =Number( totalamount - youhui).toFixed(2);

      this.Base.setMyData({
        liping,
        lipin,
        couponprice,
        totalamount,
        yunfei,
        youhui,
        amount,
        cardyue,
        cardid,
      })

    }
    // 创建订单
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
      // 创建订单
      orderapi.createorder({    
        goods_id:this.Base.options.goodsid,
        sendtype:data.sendtype,
        price:data.info.price,
        youhui:data.youhui,
        couponprice:data.couponprice,
        lipin:data.liping,
        yunfei:data.yunfei,
        amount:data.amount,
        totalamount:data.totalamount,
        store_id:data.store_id,
        address_id:data.address_id,
        beizhu:data.beizhu,
        mygiftcard_id:data.cardid,
        mycoupons_id:data.couponid
      },(ret)=>{
        console.log("手机号")
        console.log(ret)
        var data = this.Base.getMyData();
        var that = this;
      // 判断需要支付的金额是否大于0
        if(data.amount !=0){
          if(ret.code=='0'){
            wechatapi.prepay({id:ret.return},(payret)=>{
              payret.complete = function(e){
                if (e.errMsg == "requestPayment:ok") {
                  wx.reLaunch({
                    url: '/pages/paysuccess/paysuccess?amount='+data.amount,
                  })
                }else{
                  console.log("没有付款")
                  // var data = that.Base.getMyData();
                  var couponid=0
                  var giftcardid=0
                  that.Base.setMyData({
                    giftcardid,
                    couponid
                  })
                  
                }
              }
              wx.requestPayment(payret);
            })
          }else {
            this.Base.toast(ret.result);
          }
        }else{
          // 不走支付
          var orderapi = new OrderApi();
          var data = this.Base.getMyData();
          console.log("data有什么")
          console.log(data)
          console.log(data.id)
          console.log(this.Base.options.id)
          // 更新订单状态
          orderapi.updateorder({
            id:ret.return
          })
          wx.reLaunch({
            url: '/pages/paysuccess/paysuccess?amount='+data.amount,
          })
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