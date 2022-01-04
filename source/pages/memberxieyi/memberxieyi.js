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
      title: 'RITUS会员服务协议',
    })
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.info({},(info)=>{
      info.huiyuanxieyi = ApiUtil.HtmlDecode(info.huiyuanxieyi);
      WxParse.wxParse('content', 'html', info.huiyuanxieyi, that, 10);
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
Page(body)