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
      title: '快递单号',
    })
    super.onLoad(options);
    this.Base.setMyData({
       order_id:this.Base.options.id,
       returntype:this.Base.options.returntype
    })
  }
  onMyShow() {
    var that = this;
    
   

  }

  getorder(e){
    let value = e.detail.value
    console.log(e);
    this.Base.setMyData({
      order_number:value
    })
  }


  getkuaidi(e){
    console.log(e);
    let value = e.detail.value
    this.Base.setMyData({
      order_name:value
    })
  }

  sumitBtn(){
    var data = this.Base.getMyData()
    let order_name= data.order_name
    let order_number= data.order_number
    let order_id = data.order_id
    let returntype = data.returntype
    if (!!order_name) {
    } else {
      this.Base.toast('请输入快递公司');
      return
    }

    if (order_number <= 0) {
      this.Base.toast('请输入快递单号');
      return
    }
    var orderapi = new OrderApi();
    orderapi.updatereturnorder({
      kuaidigongsi:order_name,
      kuaidi_id:order_number,
      returnorder_id:order_id,
      returntype
    },res => {
      console.log(res);
      if (res.code == '0') {
        this.Base.toast('提交成功')
        wx.navigateBack({
          delta: 1,
        })
      } else {
        this.Base.toast(res.result);
      }
    })



  }
}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.getorder = content.getorder;
body.getkuaidi = content.getkuaidi;
body.sumitBtn = content.sumitBtn;

Page(body)