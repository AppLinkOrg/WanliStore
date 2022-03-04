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
     
    }
    onMyShow() {
      var that = this;
      var mallapi = new MallApi();
      
      mallapi.goodsinfo({
        id: this.Base.options.id
      }, (info) => {
       
        this.Base.setMyData({
          info
        });
  
      });
  
    }

    tobuy(e){
      var data = this.Base.getMyData();
      var inventory = data.info.inventory;
      if(inventory<=0){
        this.Base.toast("没有库存啦~");
        return
      }
      wx.navigateTo({
        url: '/pages/ordersubmit/ordersubmit?goodsid='+this.Base.getMyData().info.id,
      })
    }
  
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.tobuy= content.tobuy;
  
  Page(body)