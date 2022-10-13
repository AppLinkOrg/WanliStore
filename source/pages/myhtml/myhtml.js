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
import { OrderApi } from "../../apis/order.api";
var WxParse = require('../../wxParse/wxParse');

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    wx.setNavigationBarTitle({
      title: '',
    })

    super.onLoad(options);
    this.Base.setMyData({
     
    })
  }
  onMyShow() {
    var that = this;
    var instinfo=this.Base.getMyData().instinfo
    // console.log(this.Base.getMyData().instinfo)
    content = that.Base.util.HtmlDecode(instinfo.myhtml);
    WxParse.wxParse('content', 'html', content, that, 10);

  }

}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;


Page(body)