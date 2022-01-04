// pages/orderlist/orderlist.js
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
import {
  MemberApi
} from "../../apis/member.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    wx.showLoading({
      title: '正在加载',
    })
    this.Base.setMyData({
      choose: 'F', order_status:''
    })
    // setTimeout(()=>{
    //   var mallapi = new MallApi();
    //   mallapi.orderlist({ 
    //   }, (list) => { 
    //     this.Base.setMyData({
    //       list
    //     })
    //     wx.hideLoading({ 
    //     })
    //   })
    // },2000)
   
     
   
  }
  onMyShow() {
    var that = this;

    this.orderlist();
  }

  orderlist() {
  
    var mallapi = new MallApi();
   var order_status=this.Base.getMyData().order_status;

    if (order_status == 'F') {
      order_status = ''
    }
    mallapi.orderlist({
      order_status: order_status
    }, (list) => {
      
      this.Base.setMyData({
        list
      })
      wx.hideLoading({ 
      })
    })
  }

  bindchoose(e) {
    wx.showLoading({
      title: '正在加载',
    })
    this.Base.setMyData({
      choose: e.currentTarget.id,
      order_status:e.currentTarget.id
    })
    this.orderlist();
  }

  bindbutton(e) {
    var mallapi = new MallApi(); 
    var memberapi = new MemberApi(); 
    var order_id = e.currentTarget.id;

    var e=e.currentTarget.dataset;
    var type = e.type;
    var status = e.status;
    // var order_id=e.order.id;  
    var tj_member_id=e.order.tj_member_id;  
    var jifen=e.jifen;
    var integration = e.integration;
    var coupon_id = e.coupon_id;
    console.log(jifen);
    // return;
    
    if (type == 'A'||type=='E') {
       var content=type=='A'?"确认取消订单？":"确认货物已签收？";
       wx.showModal({
        content: content,
        success: (res) => {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            
            mallapi.cancelorder({
              status: status,
              id: order_id
            }, (ret) => {
              console.log(ret)

              if (type=='A') {

                mallapi.usecoupon({id:coupon_id,use_status:'A'},(ret3)=>{  
                  memberapi.addmemberjifen({jifen:integration,name:'商城支付订单取消积分退回'},(jifen)=>{
                    this.orderlist();
                  })
                })
              }else{

                // memberapi.addmemberjifen({jifen:jifen,name:'消费赠送积分'},(jifen)=>{
                //   this.orderlist();
                // })

                memberapi.addmemberjifen({jifen:jifen,name:'消费赠送积分',order_id:order_id},(back)=>{
                  if(back.code==0){
                    console.log("没进来？")
                    memberapi.addmemberjifen({jifen:jifen,name:'推荐人消费积分收益',member_id:tj_member_id,type:'A',order_id:order_id},(jifen2)=>{
                          console.log(jifen2,'没返回？')
                          if(jifen2.code==0){
                            this.orderlist();
                          }
                    })
                  } 
                })



              }


  
            })
          }
        }
      })

    }  
     if (type=='B') {
       console.log("去支付")
     }
     if (type=='C') {
      console.log("修改地址")
    }
    if (type=='D') {
      console.log("查看物流")
    }
    if (type=='F') {
      console.log("申请售后")
    }
    if (type=='G') {
      console.log("评价")
      wx.navigateTo({
        url: '/pages/evaluate/evaluate?order_id='+order_id,
      })
    }
  }

  bindtoast(e){
    this.Base.toast("您已修改过一次地址~");
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;

body.bindchoose = content.bindchoose;
body.orderlist = content.orderlist;

body.bindbutton = content.bindbutton;
body.bindtoast = content.bindtoast;

Page(body)