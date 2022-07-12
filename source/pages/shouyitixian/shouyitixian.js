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
    FenxiaoApi
  }from "../../apis/fenxiao.api.js"
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
  
      super.onLoad(options);
      this.Base.setMyData({
        nowindex: 1,
        overlay: true,
        specificationsinfo: null,
        number: 1,
        amount:this.Base.options.amount==undefined?'0':this.Base.options.amount,
        inputValue:0,
        keyixianprice:this.Base.options.amount==undefined?'0':this.Base.options.amount
      })
    }
    onMyShow() {
      var that = this;
      console.log("可提现")
      console.log(this.Base.options)
      console.log(this.Base.getMyData())
      var fenxiaoapi = new FenxiaoApi();
      fenxiaoapi.tixianlist({},(e)=>{
        that.Base.setMyData({
          tixianlist:e
        })
      })
    }
    navigateback(e){
      wx.redirectTo({
        url:'/pages/myshouyi/myshouyi'
      })
    }

    bindKeyInput(e){
      var inputValue= e.detail.value
      this.Base.setMyData({
        inputValue
      })  
    }

    allamount(e){
      var data=this.Base.getMyData();
      var inputValue=data.amount;
      this.Base.setMyData({
        inputValue
      })
    }
    tixianbut(e){
      var data=this.Base.getMyData();
      var fenxiaoapi = new FenxiaoApi();
      var keyixianprice = 0;
      if(data.inputValue <=0){
        this.Base.toast('请输入金额')
      }else if(Number(data.inputValue)<=Number(data.amount)){
        fenxiaoapi.tixianupdata({amount:data.inputValue},(e)=>{
          console.log("e有什么")
          console.log(e)
          if(e.code=='0'){
            wx.navigateTo({
              url: '/pages/tixiansuccess/tixiansuccess?keyixianprice='+data.keyixianprice,
            })
          }
        })
        this.Base.toast('提现成功')

        keyixianprice = data.amount-data.inputValue
        this.Base.setMyData({
          keyixianprice
        })
      }else{
        this.Base.toast('超出可提现金额，请重新输入')
      }
      
      this.Base.setMyData({

      })
    }
  
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.navigateback = content.navigateback;
  body.bindKeyInput=content.bindKeyInput;
  body.tixianbut=content.tixianbut;
  body.allamount=content.allamount;
  Page(body)