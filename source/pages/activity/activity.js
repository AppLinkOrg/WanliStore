// pages/goodsinfo/goodsinfo.js
// pages/mall/mall.js
import {
  AppBase
} from "../../appbase";
import {
  OrderApi
} from "../../apis/order.api.js";
import {
  WechatApi
} from "../../apis/wechat.api.js";
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
    this.Base.setMyData({
      paytype:'A',
      orderno:0,
      price:0,
      refund_time:0,
      statusbaoming:'A',
      refund_id:0
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
      for(let item of data){
        item.value='';
      }
      this.Base.setMyData({
        question:data
      })
    })

  }

  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e);
    var question = this.Base.getMyData().question;
    var idx = e.currentTarget.id;
    var index = e.detail.value;
    question[idx].value = question[idx].options[index].name;
    this.Base.setMyData({
      question
    })
  }

  bindKeyInput(e) {
    var question = this.Base.getMyData().question;
    var id = e.currentTarget.id;
    question[id].value = e.detail.value
    this.Base.setMyData({
      question
    })
  }

  formSubmit(e) {
    var question = this.Base.getMyData().question;
console.log(question)
    var activitysApi = new ActivitysApi();
    activitysApi.baomingxingxi({
      activity_id:this.Base.options.id,
   
      phone:this.Base.getMyData().memberinfo.mobile,
      question: JSON.stringify(question),
    },(data)=>{
      this.Base.setMyData({
        baoming:data
      })
    })
    var baoming = this.Base.getMyData().baoming;
    console.log('zheshishenm ' +baoming)
    console.log(e)
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  }

  bindpay(){
    var data = this.Base.getMyData();
    var orderapi = new OrderApi();
    var wechatapi = new WechatApi();
    orderapi.createorder({
      activity_id:this.Base.options.name,
      paytype:data.paytype,
      orderno:data.orderno,
      price:data.price,
      refund_time:data.refund_id,
      statusbaoming:data.statusbaoming,
      refund_id:data.refund_id
    },(ret)=>{
      if(ret.code=='0'){
        wechatapi.prepay({id:ret.return},(payret)=>{
          payret.complete = function(e){
            if (e.errMsg == "requestPayment:ok") {
              wx.reLaunch({
                url: '/pages/paysuccess/paysuccess?amount='+data.amount,
              })
            }
          }
          wx.requestPayment(payret);
        })
      }else {
        this.Base.toast(ret.result);
      }
    })
  }
}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bindPickerChange = content.bindPickerChange;
body.bindKeyInput = content.bindKeyInput;
body.formSubmit = content.formSubmit;

Page(body)