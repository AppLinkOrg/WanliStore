import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
import { MemberApi } from "../../apis/member.api";
import { FenxiaoApi } from "../../apis/fenxiao.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({
      totleamount:0
    })
  }
  onMyShow() {
    var that = this;
    this.Base.setMyData({
      u_member_id:this.Base.options.member_id
    })

    var memberapi = new MemberApi();
    memberapi.addmember({u_member_id:that.Base.getMyData().u_member_id},(e)=>{
      this.Base.setMyData({
        addmember:e
      })
    })

    var fenxiaoapi = new 	FenxiaoApi();
    var member_id = this.Base.getMyData().memberinfo.id
    fenxiaoapi.tixianlist({member_id:member_id},(e)=>{
      var totleamount=0
      for(let item of e){
        if (item.txstatus=='B') {
          totleamount = ( Number(totleamount) + Number(item.amount) ).toFixed(2);
        }
      }
      this.Base.setMyData({
        tixianlist:e,
        totleamount,
      })
    })

  }
  notdata() {
    this.Base.toast('暂未开放');
  }
  todetail(e){
    this.Base.toast('暂未开放');
  }
  phonecall(e){
    var data = this.Base.getMyData();
    console.log("data");
    console.log(data);
    var phone = data.instinfo.tel;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  }

  // sharefenxiao(e){
  //   this.onShareAppMessage();
  //   }
    // onShareAppMessage(res){
    //   if(res.from === 'button'){
    //     console.log('触发页面内的分享按钮',res.target);
    //   }else if(res.from === 'menu'){
    //     console.log('触发右上角的分享按钮')
    //   }
    //   return{
    //     title:'请分享给你的好友',    // 转发标题
    //     path: '/pages/mall/mall'   // 当前页面 path ，必须是以 / 开头的完整路径 
    //   }
     
    // }


}


var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.notdata = content.notdata;
body.todetail = content.todetail;
body.sharefenxiao =content.sharefenxiao;
body.onShareAppMessage = content.onShareAppMessage;
body.phonecall=content.phonecall;

Page(body)