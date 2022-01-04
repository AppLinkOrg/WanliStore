import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
import { ApiUtil } from "../../apis/apiutil";
var WxParse = require('../../wxParse/wxParse')
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    wx.setNavigationBarTitle({
      title: '关于我们',
    })
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.aboutus({},(aboutus)=>{
      aboutus.content = ApiUtil.HtmlDecode(aboutus.content);
      WxParse.wxParse('content', 'html', aboutus.content, that, 10);
      this.Base.setMyData({
        aboutus
      })
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
Page(body)