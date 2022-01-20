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
      //options.id=5;
      super.onLoad(options);
      wx.setNavigationBarTitle({
        title: "门店自提"
      })
      this.Base.setMyData({
        choseid: this.Base.options.id==undefined?0:this.Base.options.id,
        chosetype: this.Base.options.chosetype
      })
    }
    onMyShow() {
      var that = this;
      var mallapi = new MallApi();
      mallapi.storelist({},(list)=>{
          this.Base.setMyData({
              list
          })
      })
      mallapi.usestore({},(usestore)=>{
        this.Base.setMyData({
            usestore
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
             store_id:id
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