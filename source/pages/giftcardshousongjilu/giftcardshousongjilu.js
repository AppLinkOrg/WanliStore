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
import { GiftcardsApi } from "../../apis/giftcards.api";
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
        title: "收送记录"
      })
  
      super.onLoad(options);
      this.Base.setMyData({
        typelist:[
            {name:'已收到',value:'E'},
            {name:'已赠送',value:'C'}
        ],
        flag: 'E',
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
      var giftcardsapi = new GiftcardsApi();
      giftcardsapi.mygiftcardlist({isuse:this.Base.getMyData().flag},(e)=>{
        this.Base.setMyData({
            list:e
        })
      })
      giftcardsapi.zhengsongjilu({},(e)=>{
        var data = this.Base.getMyData()
        console.log("这这这")
        console.log(this.Base.getMyData())
        var shoudaojilu = e.filter(item =>{
          return item.member_id == data.memberinfo.id
        })
        var zengsongjilu = e.filter(item =>{
          return item.u_member_id == data.memberinfo.id
        })
        this.Base.setMyData({
          shousong:e,
          shoudaojilu,
          zengsongjilu
        })
      })
    }
    switchtype(e){
      var that = this;
        console.log("这这这")
        console.log(e)
        var id = e.currentTarget.id
        this.Base.setMyData({
            flag: id
        })
        that.onMyShow()
      }
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.switchtype = content.switchtype;
  
  
  Page(body)