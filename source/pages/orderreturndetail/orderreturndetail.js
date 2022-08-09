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
import { MemberApi } from "../../apis/member.api";
import { MallApi } from "../../apis/mall.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    wx.setNavigationBarTitle({
      title: "售后详情"
    })
    this.Base.setMyData({
        address_id:0,
        store_id:0
    })
  }
  onMyShow() {
    var that = this;
    var orderapi = new OrderApi();
    var memberapi = new MemberApi();
    var mallapi = new MallApi();
  //   获取订单详情
    orderapi.orderinfo({id:this.Base.options.id},(info)=>{
      if(this.Base.getMyData().address_id>0){
          memberapi.addressinfo({id:this.Base.getMyData().address_id},(addressinfo)=>{
              info.address_name = addressinfo.name;
              info.address_mobile = addressinfo.mobile;
              info.address_address = addressinfo.address;
              this.Base.setMyData({
                  info
              })
          })
      }else {
          if(this.Base.getMyData().store_id>0){
              mallapi.storeinfo({id:this.Base.getMyData().store_id},(storeinfo)=>{
                  info.store_name = storeinfo.name;
                  info.store_address = storeinfo.address;
                  this.Base.setMyData({
                      info
                  })
              })
              
          }else {
              this.Base.setMyData({
                  info
              })
          }
        
      }
     
    })
  }
  switchtype(e){
      var orderstatus = e.currentTarget.id;
      this.Base.setMyData({
          orderstatus
      })
      this.onMyShow();
  }
 

 
  
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.switchtype = content.switchtype;
body.bindpay = content.bindpay;
body.cancelorder = content.cancelorder;
body.refundorder = content.refundorder;

Page(body)