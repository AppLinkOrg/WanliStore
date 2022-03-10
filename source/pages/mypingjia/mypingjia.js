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
  
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
      wx.setNavigationBarTitle({
        title: '我的评价',
      })
  
      super.onLoad(options);
      this.Base.setMyData({
       
      })
    }
    onMyShow() {
      var that = this;
      var orderapi = new OrderApi();
      var data = that.Base.getMyData();
      console.log("data有什么")
      console.log(data)
      orderapi.orderpingjia({member_id:data.memberinfo.id},(e)=>{
        this.Base.setMyData({
            pingjialist:e
        })
      })

      orderapi.pingjiaimg({},(e)=>{
        var data = this.Base.getMyData();
        var pingjia_id = data.orderpingjia;
        var pingjiaimg = e.filter(item =>{
            return e.pingjia_id == pingjia_id
        })
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