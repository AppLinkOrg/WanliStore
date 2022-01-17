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
  
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
  
      super.onLoad(options);
      wx.setNavigationBarTitle({
        title: "创建订单"
      })
      this.Base.setMyData({
          sendtype:'A'
      })
    }
    onMyShow() {
      var that = this;
      var mallapi = new MallApi();
  
      mallapi.goodsinfo({
        id: this.Base.options.goodsid
      }, (info) => {
       
        this.Base.setMyData({
          info
        });
  
      });
  
    }
    swtichsend(e){
        var sendtype = e.currentTarget.id
        this.Base.setMyData({
            sendtype:sendtype
        })
    }
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.swtichsend = content.swtichsend;
  
  Page(body)