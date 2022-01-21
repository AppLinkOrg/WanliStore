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
        title: "退款售后"
      })
    }
    onMyShow() {
      var that = this;
      var orderapi = new OrderApi();
      orderapi.orderlist({orderstatus:"R"},(list)=>{
        this.Base.setMyData({
            list
        })
      })
    }
  }
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad; 
  body.onMyShow = content.onMyShow;
  Page(body)