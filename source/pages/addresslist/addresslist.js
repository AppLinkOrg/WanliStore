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
    MemberApi
  } from "../../apis/member.api.js";
  
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
      //options.id=5;
      super.onLoad(options);
      wx.setNavigationBarTitle({
        title: "地址管理"
      })
      this.Base.setMyData({
        choseid: this.Base.options.id==undefined?0:this.Base.options.id,
        chosetype: this.Base.options.chosetype
      })
    }
    onMyShow() {
      var that = this;
      var memberapi = new MemberApi();
      memberapi.addresslist({},(list)=>{
          this.Base.setMyData({
              list
          })
      })
    }
    chosedz(e){
        var id = e.currentTarget.id;
        this.Base.setMyData({
            choseid:id
        })
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.setData({
             address_id:id
           })
           wx.navigateBack({//返回
             delta: 1
           })
    }
  }
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad; 
  body.onMyShow = content.onMyShow;
  body.chosedz = content.chosedz;
  Page(body)