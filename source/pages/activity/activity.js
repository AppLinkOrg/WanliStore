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
// var WxParse = require('../../wxParse/wxParse.js');

class Content extends AppBase {
  constructor() {
    super();
  }

    /**
     * 生命周期函数--监听页面加载
     */
  onLoad(options) {
    this.Base.Page = this;
    this.Base.ActivitysApi = this.ActivitysApi
    wx.setNavigationBarTitle({
      title: "活动详情"
    })
    this.Base.setMyData({
      paytype:'A',
      orderno:0,
      price:0,
      statusbaoming:'D',
      refund_id:0,
      aa:''
  })
    super.onLoad(options);
    this.Base.setMyData({
      nowindex: 1,
      overlay: true,
      specificationsinfo: null,
      number: 1
    })
  }
  
    /**
     * 生命周期函数--监听页面显示
     */
  onMyShow() {
    var that = this;
    var activitysApi = new ActivitysApi();
    var aa = this.Base.getMyData().data;
    // 活动详情内容
    activitysApi.activityinfo({id:this.Base.options.id},(data)=>{
      // 将HTML中的符号转义，不然会以文本的形式输出
      data.content = ApiUtil.HtmlDecode(data.content)
      // WxParse.wxParse('content' , 'html', data.content, that,10) 
      console.log("这里")
      console.log(data)
      this.Base.setMyData({
        data:data
      })
    })

    // 活动详情内容banner
    activitysApi.activitybanner({activity_id:this.Base.options.id},(data)=>{
      this.Base.setMyData({
        image:data
      })
    })
    
    // 报名信息
    activitysApi.information({activityname:this.Base.options.id},(data)=>{
      for(let item of data){
        item.value='';
      } 
      console.log(data)
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
    console.log(e)
    this.Base.setMyData({
      question
    })
  }

  formSubmit(e) {
    var data = this.Base.getMyData();
    console.log("我要")
    console.log(data)
    var wechatapi = new WechatApi();
    var activitysApi = new ActivitysApi();
    var question = this.Base.getMyData().question;
    console.log(question)
    var that = this;
    console.log("知道哈师范")
    console.log(e)
    // 判断内容是否填完
    let keys = Object.keys(question)
    var arr = question.filter(item =>{
      return item.value.length == 0 && item.write == 'A'
    })
    if(arr.length>0){
    this.Base.toast('内容未填写完');
      return
    }
    console.log(arr);
    if(data.data.price < 0){
      data.statusbaoming = 'A'
     }
  activitysApi.baomingxingxi({
    // activity_id:this.Base.options.name,
    paytype:data.paytype,
    price:data.price,
    statusbaoming: data.statusbaoming,
    refund_id:data.refund_id,
    activity_id:this.Base.options.id,
    phone:this.Base.getMyData().memberinfo.mobile,
    question: JSON.stringify(question),
    money: data.data.price,
  },(ret)=>{
    console.log("在那")
    console.log(ret)
    if(this.money > 0){
      if(ret.code=='0'){
        wechatapi.baomingpay({id:ret.return},(payret)=>{
          payret.complete = function(e){
            if (e.errMsg == "requestPayment:ok") {
              wx.reLaunch({
                url: '/pages/activitysuccess/activitysuccess?id='+that.Base.options.id,
              })
            }
          }
          // 发起微信支付
            wx.requestPayment(payret);                     
        })
      }else {
        this.Base.toast(ret.result);
      }
    }else{
      wx.reLaunch({
        url: '/pages/activitysuccess/activitysuccess?id='+that.Base.options.id,
      })
    }
    
    
  })
    console.log('form发生了submit事件，携带数据为：', e.detail.value)  
  }

  removebaoming(e) {
    var that = this;
    var id = e.currentTarget.id;
    var wechatapi = new WechatApi();
    var data = this.Base.getMyData().data
    var money = data.price
    console.log('上辅导班')
    console.log(data)
    wx.showModal({
      content:'确定取消报名',
      success:(ret)=>{
        if(that.money > 0 ){
          if(ret.confirm){
            wechatapi.refundactivity({id:data.baomingid.id},(ret)=>{
                if(ret.code>=0){
                  wx.navigateBack({
                    delta: 1
                  })
                    that.Base.toast('订单退款成功');
                    that.onMyShow();
                }else {
                    that.Base.toast(ret.result);
                }
            })
          }
        }else{
          that.Base.toast('订单退款成功');
        }
        
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
body.removebaoming = content.removebaoming;
body.bindpay = content.bindpay;


Page(body)