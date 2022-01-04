// pages/orderinfo/orderinfo.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { MemberApi } from "../../apis/member.api.js";
import { WechatApi } from "../../apis/wechat.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    wx.setNavigationBarTitle({
      title: '会员',
    })
    this.Base.setMyData({
      checkidx:0,
      ischeck:false,
    })
  }
  onMyShow() {
    var that = this;
    var memberapi = new MemberApi;
    memberapi.recharge({},(recharge)=>{
      this.Base.setMyData({
        recharge
      })
    })
    memberapi.memberprivileges({},(memberprivileges)=>{
      this.Base.setMyData({
        memberprivileges
      })
    })
  }
  choserecharge(e){
    var idx = e.currentTarget.id;
    this.Base.setMyData({
      checkidx:idx
    })
  }
  checkxieyi(){
    var ischeck = this.Base.getMyData().ischeck;
    ischeck=ischeck?false:true;
    this.Base.setMyData({
      ischeck
    })
  }
  toxieyi(){
    wx.navigateTo({
      url: '/pages/memberxieyi/memberxieyi',
    })
  }
  tobuy(){
    var ischeck = this.Base.getMyData().ischeck;
    var checkidx = this.Base.getMyData().checkidx;
    var recharge = this.Base.getMyData().recharge;
    if(ischeck==false){
      this.Base.toast('请阅读并同意《RITUS会员服务协议》');
      return
    }
    var recharge_id = recharge[checkidx].id;
    var amount = recharge[checkidx].amount;
    var money = recharge[checkidx].money;
    var memberapi = new MemberApi();
    var wechatapi = new WechatApi();
    memberapi.addchongzhi({
      recharge_id:recharge_id,
      amount:amount,
      money:money
    },(ret)=>{
      if(ret.code=='0'){
        wechatapi.prepay2({id:ret.return},(paymet)=>{
          paymet.complete = function (e) {
            if (e.errMsg == "requestPayment:ok") {
                 wx.showModal({
                   content:'充值成功',
                   showCancel:false,
                   success(){}
                 })
            }
          }
          wx.requestPayment(paymet)
        })
      }
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.choserecharge = content.choserecharge;
body.checkxieyi = content.checkxieyi;
body.toxieyi = content.toxieyi;
body.tobuy = content.tobuy;
Page(body)