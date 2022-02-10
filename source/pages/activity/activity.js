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
  ActivitysApi
} from "../../apis/activitys.api.js";
import { ApiUtil } from "../../apis/apiutil";


var WxParse = require('../../wxParse/wxParse.js');

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    wx.setNavigationBarTitle({
      title: "活动详情"
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
    var activitysApi = new ActivitysApi();

    activitysApi.activityinfo({id:this.Base.options.id},(data)=>{
      data.content = ApiUtil.HtmlDecode(data.content)
      WxParse.wxParse('content' , 'html', data.content, that,10)
      this.Base.setMyData({
        data:data
      })
    })

    activitysApi.activitybanner({activity_id:this.Base.options.id},(data)=>{
      this.Base.setMyData({
        image:data
      })
    })
    
    activitysApi.information({activityname:this.Base.options.id},(data)=>{
      this.Base.setMyData({
        question:data
      })
    })

    activitysApi.select({contentname:3},(data)=>{
      this.Base.setMyData({
        select:data
      })
    })

  }


}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;

Page(body)