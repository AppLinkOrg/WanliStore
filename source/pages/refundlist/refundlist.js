import {
    AppBase
  } from "../../appbase";
  import {
    ApiConfig
  } from "../../apis/apiconfig";
  import {
    InstApi
  } from "../../apis/inst.api.js";
import { OrderApi } from "../../apis/order.api";
import { WechatApi } from "../../apis/wechat.api";
  
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
      //options.id=5;
      super.onLoad(options);
      wx.setNavigationBarTitle({
        title: "待取货"
      })
      this.Base.setMyData({
        orderstatus:this.Base.options.type==undefined?'':this.Base.options.type
      })
    }
    onMyShow() {
      var that = this;
      var orderapi = new OrderApi();
      orderapi.orderlist({orderstatus:"D"},(list)=>{
        this.Base.setMyData({
            list
        })
      })
    }
    
    quhuo(e){
        var that = this;
        var id = e.currentTarget.id;
        var orderapi = new OrderApi();
        wx.showModal({
            title:'订单提示',
            content:'已确认收到商品',
            success:(ret)=>{
                if(ret.confirm){
                    orderapi.shouhuo({id:id},(ret)=>{
                        that.Base.setMyData({
                            orderstatus:'F'
                        })
                        wx.navigateTo({
                          url: '/pages/orderlist/orderlist?type='+this.Base.getMyData().orderstatus,
                        })
                    })
                }
            }
        })
    
    }
  }
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad; 
  body.onMyShow = content.onMyShow;
  body.quhuo = content.quhuo;
  Page(body)