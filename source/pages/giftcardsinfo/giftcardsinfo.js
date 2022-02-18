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
    }
    onMyShow() {
      var that = this;
      var giftcardsapi = new GiftcardsApi();
      giftcardsapi.mygiftcardinfo({id:this.Base.options.id},(e)=>{
        e.howuse = ApiUtil.HtmlDecode(e.howuse)
        this.Base.setMyData({
          cardinfo: e
        })
      })
    }
    

    gotoTabbar(){
      wx.switchTab({
        url:'/pages/mall/mall'
      })
    }
    
    onShareAppMessage(res){
      if(res.from === 'button'){
        console.log('触发页面内的分享按钮',res.target);
      }else if(res.from === 'menu'){
        console.log('触发右上角的分享按钮')
      }
      return{
        title:'请分享给你的好友',    // 转发标题
        path: '/pages/giftcardsinfo/giftcardsinfo?id=' + this.Base.options.id,     // 当前页面 path ，必须是以 / 开头的完整路径 
      }
    }
  

    


// onShareAppMessage(res) {
//   if (res.from === 'button') {
//     console.log("来自页面内转发按钮");
//     console.log(res.target);
//     return {
//       title: this.data.shareTitle,
//       path: '/pages/giftcardsinfo/giftcardsinfo?id' + wx.getStorageSync('openId') + this.Base.options.id,
//     }
//   } else {
//     console.log("来自右上角转发菜单")
//     console.log(res);
//     return {
//       title: this.data.shareTitle,
//       path: '/pages/giftcardsinfo/giftcardsinfo?id' + this.Base.options.id,
//     }
//   }


// }


  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.gotoTabbar = content.gotoTabbar;
  body.onShareAppMessagen= content.onShareAppMessage;
  body.onShareAppMessage = content.onShareAppMessage;

  Page(body)