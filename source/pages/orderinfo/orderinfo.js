// pages/orderinfo/orderinfo.js
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
import {
  WechatApi
} from "../../apis/wechat.api.js";
 
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
      alltype:this.Base.options.type
      // paymentmethodlist:[{name:'微信支付',status:'A'},{name:'钱包支付',status:'B'}],
      // paymentmethod:'A',
      // paymentmethod_name:'微信支付',
    })
  }
  onMyShow() {
    var that = this;
    var mallapi = new MallApi();

    mallapi.orderinfo({
      id: this.Base.options.id
    }, (info) => {

      mallapi.addressinfo({
        id: info.address_id
      }, (address) => {
        this.Base.setMyData({
          addressinfo: address,
          info: info,
          list:info.order_item
        })
        wx.hideLoading()
      })


    })


  }

  bindpaymentmethod(e){
    var paymentmethodlist=this.Base.getMyData().paymentmethodlist;
    console.log(e);
    this.Base.setMyData({
      paymentmethod:paymentmethodlist[e.detail.value].status,
      paymentmethod_name:paymentmethodlist[e.detail.value].name,
    })
  }

  bindbutton(e) {
    var that =this;
    var mallapi = new MallApi();
    var memberapi = new MemberApi(); 
    var type = e.currentTarget.dataset.type;
    var status = e.currentTarget.dataset.status;
    var info=this.Base.getMyData().info;
    // console.log(btn_type);
    var id = this.Base.options.id;

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
              id: id
            }, (ret) => {
             
              if (type=='A') {
                mallapi.usecoupon({id:that.Base.getMyData().info.coupon_id,use_status:'A'},(ret3)=>{  
                  memberapi.addmemberjifen({jifen:that.Base.getMyData().info.integration,name:'商城支付订单取消积分退回',order_id:id},(jifen)=>{

                  }) 
                })
              }
              else{

                memberapi.addmemberjifen({jifen:info.jifen,name:'消费赠送积分',order_id:id},(jifen)=>{
                  if(jifen.code==0){
                    console.log("没进来？")
                    memberapi.addmemberjifen({jifen:info.jifen,name:'下级消费积分收益',member_id:info.tj_member_id,type:'A',order_id:id},(jifen2)=>{
                          console.log(jifen2,'没返回？')
                    })
                  } 
                })

              }

              if(that.Base.getMyData().alltype==0){ 
                that.onMyShow(); 
              }else{
                wx.navigateBack({
                  delta: 0,
                })
              }
            
              
              
            })
          }
        }
      })

    }  
     if (type=='B') {
       console.log("去支付")
          var huaweiApi=new HuaweiApi();
       if(info.payment_method=='B'){
        console.log("走公对公")
        wx.showModal({
          content: '确认已支付货款？',
          success: (res) => {
            if (res.cancel) {
              //点击取消,默认隐藏弹框
            } else {
              // mallapi.cancelorder({
              //   status: 'B',
              //   id: id
              // }, (ret) => {
                
                huaweiApi.sendsmstest({orderno:info.orderno},(ret)=>{ 
                  mallapi.usecoupon({id:that.Base.getMyData().info.id,use_status:'B'},(ret3)=>{ 
                    // that.Base.toast("支付成功")  
                    that.onMyShow();
                  })
                })
               
              // })
            }
          }
        })
       }else{
        var wechatapi=new WechatApi();  
        wechatapi.prepay({id:this.Base.options.id},(payret)=>{
          console.log(payret,'支付回调');
    
          payret.complete = function (e) {
            if (e.errMsg == "requestPayment:ok") { 
             
              // that.onMyShow();
              mallapi.usecoupon({id:that.Base.getMyData().info.id,use_status:'B'},(ret3)=>{ 
               that.Base.toast("支付成功")  
               that.onMyShow();
             })
                
            }else{
              that.Base.toast("支付失败");
             
            }
          }
          wx.requestPayment(payret)
        })
       }

     }
     if (type=='C') {
      console.log("修改地址")

      var info=this.Base.getMyData().info;
      if (info.updateaddress_value=='Y') {
        this.Base.toast("您已修改过一次地址~");
        return;
      }
 
      wx.navigateTo({
        url: '/pages/updateaddress/updateaddress?id='+info.address_id+'&order_id='+info.id,
      })
      
    }
    if (type=='D') {
      console.log("查看物流")
    }
    if (type=='F') {
      console.log("申请售后")


    }
    if (type=='G') {
      console.log("评价");
      wx.navigateTo({
        url: '/pages/evaluate/evaluate?order_id='+this.Base.options.id,
      })
    }
  }

  toupdateaddress(e){
  
  }

  open(e){
    var file=e.currentTarget.dataset.file;
    if(file==""){
      this.Base.toast("请耐心等待商家开具发票");
      return;
    }
    wx.showLoading({
      title: '下载中',
    });
    var url=ApiConfig.GetUploadPath()+'order/'+file;
  //  console.log(url,"走没走",this.Base.getMyData().info.file);
  //  return;
    wx.downloadFile({
      // 示例 url，并非真实存在
      url: url,
      showMenu:true,
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功',res)
            
          },
          fail: function (res) {
            console.log('失败',res)
          },complete:function (res) {
            wx.hideLoading({
             
            })
          },
        })
      },
      fail: function (res) {
        console.log('失败',res)
      }
    })
  }

 

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;

body.bindpaymentmethod = content.bindpaymentmethod;
body.bindbutton = content.bindbutton;
body.toupdateaddress = content.toupdateaddress; 

body.open = content.open;
Page(body)