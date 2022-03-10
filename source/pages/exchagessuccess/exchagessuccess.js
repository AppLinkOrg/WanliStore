// pages/exchagessuccess/exchagessuccess.js

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
  
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
      super.onLoad(options);
      this.Base.setMyData({
        flag:this.Base.options.flag==undefined?'A':this.Base.options.flag,
      })
    }
    onMyShow() {
      var that = this;
      var mallapi = new MallApi();
  
    }
    navigateback(e){
      // var flag=this.Base.getMyData().flag;
      // var pages = getCurrentPages();//获取页面栈
      // var currPage = pages[pages.length -1];//当前页面
      // var prevPage = pages[pages.leng-2]//上一个页面
      // prevPage.setData({
      //   type:flag
      // })
      wx.navigateBack({
        delta:1
      })
    }




  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.navigateback=content.navigateback;
  
  Page(body)