// pages/goodsinfo/goodsinfo.js
// pages/mall/mall.js
import {
    AppBase
  } from "../../appbase";
  import {
    OrderApi
  } from "../../apis/order.api.js";
  import {
    WechatApi
  } from "../../apis/wechat.api.js";
  import {
    ApiConfig
  } from "../../apis/apiconfig";
  import {
    InstApi
  } from "../../apis/inst.api.js";
  import {
    ActivitysApi
  } from "../../apis/activitys.api.js";
  import { ApiUtil } from "../../apis/apiutil";
  var WxParse = require('../../wxParse/wxParse.js');
  
  class Content extends AppBase {
    constructor() {
      super();
    }
  
      /**
       * 生命周期函数--监听页面加载
       */
    onLoad(options) {
      this.Base.Page = this;
      this.Base.ActivitysApi = this.ActivitysApi
      var that = this;
      var activitysApi = new ActivitysApi();
      var aa = this.Base.getMyData();
      var times = ApiUtil.FormatDateTime(new Date());
      wx.setNavigationBarTitle({
        title: "购买历史"
      })
     wx.setBackgroundColor({
       backgroundColor: '#eeeeee',
     })
      super.onLoad(options);
      this.Base.setMyData({
        nowindex: 1,
        overlay: true,
        specificationsinfo: null,
        number: 1
      })
      

  
      
     
    }
    
      /**
       * 生命周期函数--监听页面显示
       */
    onMyShow() {
      var that = this;
      var activitysApi = new ActivitysApi();
      
      
  
  
    }
  
  
  
  

  
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  
  
  Page(body)