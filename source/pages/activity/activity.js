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
      var mallapi = new MallApi();
  
      mallapi.goodsinfo({
        id: this.Base.options.id
      }, (info) => {
        var typelist = info.specifications_type;
        for (var i = 0; i < typelist.length; i++) {
          var list = typelist[i].specificationslist;
          typelist[i].choose = 0;
          // for(var j=0;j<list.length;j++){
          //   list[j].choose=false;
          // }
        }
  
        this.Base.setMyData({
          info
        });
  
      });
  
    }

  
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;

  Page(body)