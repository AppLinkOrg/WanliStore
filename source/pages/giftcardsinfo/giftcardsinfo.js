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
    GiftcardsApi
  } from "../../apis/giftcards.api.js";
  import { ApiUtil } from "../../apis/apiutil";
  var WxParse = require('../../wxParse/wxParse.js');
  
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
      wx.setNavigationBarTitle({
        title: "礼品卡详情"
      })
      super.onLoad(options);
      this.Base.setMyData({
      })
      console.log("options是什么")
      console.log(this.Base.options)

    }
    onMyShow() {

      var that = this;
      var giftcardsapi = new GiftcardsApi();

      giftcardsapi.mygiftcardinfo({id:this.Base.options.id},(e)=>{
        console.log(e)
        e.howuse = ApiUtil.HtmlDecode(e.howuse)
        WxParse.wxParse('howuse' , 'html', e.howuse, that,10) 
        this.Base.setMyData({
          cardinfo: e
        })
      })
      
      
      // 赠送接口
      if(this.Base.options.mygiftcard_id != undefined || this.Base.options.u_member_id != undefined){
        giftcardsapi.sendmember({
          mygiftcard_id: this.Base.options.mygiftcard_id,
          u_member_id: this.Base.options.u_member_id
        })
      }
     
    }
    

    gotoTabbar(){
      wx.switchTab({
        url:'/pages/mall/mall?id='+this.Base.options.id
      })
    }
    

    // 分享
    onShareAppMessage(res){
      var giftcardsapi = new GiftcardsApi();
      var cardinfo = this.Base.getMyData().cardinfo;
      return{
        title:'请分享给你的好友',    // 转发标题
        path: '/pages/giftcardsinfo/giftcardsinfo?mygiftcard_id'+this.Base.options.id + '&' + 'u_member_id=' +  cardinfo.member_id,   // 当前页面 path ，必须是以 / 开头的完整路径 
      }
     
    }



  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.gotoTabbar = content.gotoTabbar;
  body.onShareAppMessagen= content.onShareAppMessage;

  Page(body)