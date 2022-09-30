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
        title: '评价列表',
      })
      super.onLoad(options);
      this.Base.setMyData({
          goods_id:this.Base.options.goods_id==undefined?0:this.Base.options.goods_id,
      })
    }
    onMyShow() {
      var that = this;
      var data = this.Base.getMyData()
      var mallApi = new MallApi();
      var orderapi = new OrderApi();
      mallApi.pingjialistc({
        goods_id:data.goods_id
      },(e)=>{
        var data = this.Base.getMyData();
        console.log("data.goods_id是什么",e)
        console.log(data.goods_id)
        var pingjialist = e.filter(item =>{
          return item.goods_id == data.goods_id
        })
          this.Base.setMyData({
            orderpingjia:e,
            pingjialist
          })
      })
      orderapi.pingjiaimg({},(e)=>{
          var data = this.Base.getMyData();
          var pingjia_id = data.orderpingjia.id;
          var pingjiaimg = e.filter(item =>{
              return e.pingjia_id == pingjia_id
          })
          this.Base.setMyData({
            pingjiaimg:e
          })
      })
  
    }
   

  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  
  Page(body)