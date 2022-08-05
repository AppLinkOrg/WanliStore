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
import{
  FenxiaoApi
}from"../../apis/fenxiao.api.js"
import {
  OrderApi
} from "../../apis/order.api.js";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    wx.setNavigationBarTitle({
      title: "评价详情"
    })
    this.Base.setMyData({
      pingjia_id:this.Base.options.id
    })
    console.log(this.Base.options.id,'我在这呢');
  }
  onMyShow() {
    var that = this;
    var orderapi = new OrderApi();
    orderapi.pingjiaxinagqing({id:this.Base.options.id},(info)=>{
      this.Base.setMyData({
          info
      })
    })

    orderapi.pingjiatupianxiangqing({
      id:this.Base.options.id
    },(pingjiaimg)=>{
      this.Base.setMyData({
        pingjiaimg
      })
  })
  }

 

}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;


Page(body)