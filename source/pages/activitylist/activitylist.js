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
    ActivitysApi
  } from "../../apis/activitys.api.js";
import{
  MemberApi
}from "../../apis/member.api";

  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
      wx.setNavigationBarTitle({
        title: "品鉴活动"
      })
      super.onLoad(options);
      this.Base.setMyData({
        nowindex: 1,
        overlay: true,
        specificationsinfo: null,
        number: 1
      })
    }
    onMyShow() {
      var that = this;
      var activitysApi = new ActivitysApi();
      var memberapi = new MemberApi();
      activitysApi.activitylist({},(list)=>{
        this.Base.setMyData({
          activitylist:list
        })
      })

      //判断用户是否登录
      memberapi.info({},(e)=>{
        this.Base.setMyData({
          member:e
        })
      })
    }

  
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;

  Page(body)