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
  }from"../../apis/fenxiao.api.js"
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
        wx.setNavigationBarTitle({
          title: '收益明细',
        })
      super.onLoad(options);
      var myDate = new Date();
      var year=myDate.getFullYear();
      var month=myDate.getMonth()>9?myDate.getMonth().toString():'0'+(myDate.getMonth()+1);

      this.Base.setMyData({
        nowindex: 1,
        overlay: true,
        specificationsinfo: null,
        number: 1,
        date: year+'-'+ month,
      })
    }
    onMyShow() {
      var that = this;
      var mallapi = new MallApi();
      var fenxiaoapi = new FenxiaoApi();
      var date = this.Base.getMyData().date;
      var date_from = date+"-01";
      var year = date.split("-")[0];
          var month = date.split("-")[1]; 
          var days = new Date(year,month,0).getDate();
      var date_to = date+"-"+days;
      fenxiaoapi.fenxiaojilu({
        shijian_from:date_from,
        shijian_to:date_to
      },(e)=>{
        this.Base.setMyData({
          fenxiaojilu:e
        })
      })
    }
  
    bindDateChange(e){
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        date: e.detail.value
      })
      this.onMyShow();
    }

  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.bindDateChange=content.bindDateChange;
  
  
  Page(body)