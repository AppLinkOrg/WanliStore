// pages/confirmorder/confirmorder.js 
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
  WechatApi
} from "../../apis/wechat.api.js";
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
    wx.setNavigationBarTitle({
      title: "确认订单"
    })
    wx.showLoading({
      title: '加载中',
    })
    this.Base.setMyData({
      list: JSON.parse(this.Base.options.cartslist),
      amount: this.Base.options.amount,
      paymentmethodlist: [{
        name: '微信支付',
        status: 'A'
      }, {
        name: '公对公付款',
        status: 'B'
      }],
      paymentmethod: 'A',
      paymentmethod_name: '微信支付',
      salesperson: '',
      address_id: '',
      discounts: 0,
      original_price: 0,
      coupon_index: null,
      coupon_discount: null,
      zonjifen: 0,
      keyon: 0,
      overlay: false,
      tjinfo: [],
      info: [],
      addressinfo: null
    })
  }
  onMyShow() {
    var that = this;
    var mallapi = new MallApi();
    var memberapi = new MemberApi();
    var keyon = 0;
    if(this.Base.getMyData().memberinfo.u_salesperson!=""){
      var salesperson_id=this.Base.getMyData().memberinfo.u_salesperson.id;
    }else{
     var salesperson_id=0;
    }
    memberapi.salespersoninfo({
      id: salesperson_id
    }, (info) => {
      this.Base.setMyData({
        info: info,salesperson:info.bianhao
      })
    })

    if (this.Base.getMyData().address_id != '') {
      mallapi.addressinfo({
        id: this.Base.getMyData().address_id
      }, (info) => {
        this.Base.setMyData({
          addressinfo: info
        })
        wx.hideLoading({})
      })
    } else {
      mallapi.addresslist({
        isdefault: 'Y'
      }, (list) => {
        console.log(list, '是不是没有')
        if (list.length > 0) {
          this.Base.setMyData({
            addressinfo: list[0],
            address_id: list[0].id
          })
        }
        wx.hideLoading({})
      })
    }

    

    this.bindprice();


    memberapi.mycoupons({
      coupon_type: 'A',
      use_status: 'A',
      orderby: 'r_main.use_status,r_main.harvest_time desc'
    }, (mycoupons) => {

      for (var i = 0; i < mycoupons.length; i++) {
        if (Number(this.Base.getMyData().amount) >= Number(mycoupons[i].quota)) {
          mycoupons[i].use = true
          keyon++
        } else {
          mycoupons[i].use = false
        }
      }
      this.Base.setMyData({
        mycoupons,
        keyon
      })
    })


  }

  bindguige(e) {
    this.Base.setMyData({
      overlay: true
    })
  }

  bindclose(e) {
    this.Base.setMyData({
      overlay: false
    })
  }




  bindpaymentmethod(e) {
    var paymentmethodlist = this.Base.getMyData().paymentmethodlist;
    console.log(e);
    this.Base.setMyData({
      paymentmethod: paymentmethodlist[e.detail.value].status,
      paymentmethod_name: paymentmethodlist[e.detail.value].name,
    })
  }
  salesperson(e) {
    var salesperson = e.detail.value;

    this.Base.setMyData({
      salesperson
    })

  }
  bindselect(e) {
    var mallapi = new MallApi();
    var salesperson = this.Base.getMyData().salesperson;
    if (salesperson != '') {
      mallapi.selectsalesperson({
        salesperson: salesperson
      }, (info) => {
        this.Base.setMyData({
          info
        })
      })
    }

  }
  bindtuijian(e) {
    var tj_mobile = e.detail.value;

    this.Base.setMyData({
      tj_mobile
    })

  }
  chatuijianren(e) {
    var mallapi = new MallApi();
    var tj_mobile = this.Base.getMyData().tj_mobile;
    if (tj_mobile != '') {
      mallapi.chatuijianren({
        mobile: tj_mobile
      }, (info) => {
        this.Base.setMyData({
          tjinfo: info
        })
      })
    }

  }
  remarks_input(e) {
    this.Base.setMyData({
      remarks: e.detail.value
    })
  }

  choose_coupons(e) {
    var coupon_index = e.currentTarget.dataset.index;
    var coupon_id = e.currentTarget.id;
    var quota = e.currentTarget.dataset.quota;
    if (this.Base.getMyData().original_price < parseInt(quota)) {
      this.Base.toast("未满足使用条件")
      return;
    }
    this.Base.setMyData({
      coupon_index: coupon_index,
      coupon_id: coupon_id
    })
  }

  bindconfrim(e) {
    var data = this.Base.getMyData();
    var mycoupons = data.mycoupons;
    var coupon_index = data.coupon_index;
    if (coupon_index == null) {
      this.Base.setMyData({
        overlay: false
      })
      return;
    }
    // this.bindprice();

    
    var amount = data.amount;
     console.log("这个金额是多少",amount)
     console.log("扣完是多少",amount);
    amount = (amount - parseInt(mycoupons[coupon_index].coupon_discount)).toFixed(2);//金额减去使用优惠券的需支付金额
    console.log(amount);
    this.Base.setMyData({
      amount,
      overlay: false,
      coupon_discount: mycoupons[coupon_index].coupon_discount
    })
  }
  bindprice() {

    var use_ratio = Number(this.Base.getMyData().instinfo.use_ratio);
    var amount = Number(this.Base.options.amount).toFixed(2); //传入总金额
    console.log(amount,'传入的总金额不会是空的吧?');
    // return;
    var original_price = amount; //商品原价
    var member_jifen= Number(this.Base.getMyData().memberinfo.jifen); //账户积分

    var discounts = Number((use_ratio / 100) * amount); //根据后台设置兑换比例计算持有积分可抵扣额度

    var list = this.Base.getMyData().list;

    var zonjifen = 0;

    if(member_jifen>=original_price){ //账户积分足够抵扣需支付金额时
       var shengyu= member_jifen-original_price;
       var amount= 0;
       var discounts =original_price;
       console.log("抵扣完账户剩余积分",shengyu);
    }else{
      var amount = original_price-member_jifen;
      var discounts =member_jifen;
      var shengyu= 0;
      console.log("抵扣后剩余需支付金额：",amount,"账户剩余积分：",shengyu);
      
    }

    // return;

    for (var i = 0; i < list.length; i++) { //计算该订单可赠送的总积分
      zonjifen += Math.ceil(Number(list[i].goods_giving_ratio) / 100 * Number(list[i].unitprice)) * Number(list[i].count);
    }
   
    
   // console.log(Math.ceil(zonjifen), '总积分是多少', Math.round(zonjifen));
 
    // return;

    
    // if (parseInt(this.Base.getMyData().memberinfo.jifen) >= discounts) {
    //   // amount = amount.toFixed(2);
    //   amount = (amount - discounts).toFixed(2);
    // } 

    this.Base.setMyData({
      discounts, //本次抵扣的积分
      amount,//积分抵扣完最终需支付金额
      shengyu, //本次抵扣剩余的积分
      original_price, //未使用任何积分跟优惠时的原价
      zonjifen: Math.ceil(zonjifen)//订单完成可赠送的积分
    })

  }

  bindpay(e) {
    var that = this;
    // wx.showLoading({
    //   title: '正在提交',
    // })
    if (this.Base.getMyData().addressinfo == null) {
      this.Base.toast("请选择地址");
      return;
    }

    var mallapi = new MallApi();
    var memberapi = new MemberApi();
    var data = this.Base.getMyData();

    var remarks = data.remarks;
    var list = data.list;

    console.log(list, '列表');
    // return;
    var payment_amount = data.amount;
    var freight = 0;
    var payment_method = data.paymentmethod;
    
    if(data.info.length==0){
    var salesperson_id=this.Base.getMyData().memberinfo.u_salesperson.id
    }else{
      var salesperson_id = data.info.id;
    }
    console.log(salesperson_id,'多少');
    // return;
    
    var tj_member_id = data.tjinfo.id;
    var address_id = data.address_id;
    var coupon_id = data.coupon_id;
    var integration = data.discounts;
    var coupon = data.coupon_discount;
    var rental = data.original_price;
    var integration_all = data.zonjifen;
    console.log(integration, coupon, '积分跟优惠券',integration_all);
    // return;
    // if(parseInt(this.Base.getMyData().jifen)<parseInt(integration)){
    //    this.Base.toast("积分余额不足")
    // }

    //this.Base.toast(salesperson_id==null?"1":salesperson_id);
    if (salesperson_id==null) {
      this.Base.toast("请输入销售员编号");
      return;
    }

    var datajson = [];

    console.log(address_id, );
    //  return;

    mallapi.creatorder({
      payment_amount: payment_amount,
      address_id: address_id,
      freight: freight,
      coupon_id: coupon_id,
      rental: rental,
      payment_method: payment_method,
      salesperson_id: salesperson_id,
      tj_member_id: tj_member_id,
      integration_all: integration_all,
      integration: integration,
      coupon: coupon,
      remarks: remarks
    }, (ret) => {
      if (ret.code == 0) {

        //提交订单后清理购物车中已下单的商品
        this.binddelete();

        for (var i = 0; i < list.length; i++) {
          datajson.push({
            order_id: ret.return,
            goods_id: list[i].goods_id,
            number: list[i].count,
            amount: parseFloat(list[i].unitprice) * parseInt(list[i].count),
            status: 'A',
            unitprice: list[i].unitprice,
            specifications_name: list[i].specifications_name,
            specifications: list[i].specifications,
            coverimg: list[i].coverimg,
            giving_integration: Math.ceil(parseInt(list[i].goods_giving_ratio) / 100 * parseFloat(list[i].unitprice)) * parseInt(list[i].count),
            aftersale: 'N'
          })
        }
        datajson = JSON.stringify(datajson);

        console.log("提交订单成功")
        mallapi.submitorderitem({
          datajson: datajson
        }, (back) => {
          if (back.code == 0) {

            memberapi.addmemberjifen({
              jifen: -that.Base.getMyData().discounts,
              name: '商城支付抵扣',
              order_id: ret.return
            }, (ret2) => {
              if (ret2.code == 0) {
                console.log("用积分")

                mallapi.usecoupon({
                  id: coupon_id,
                  use_status: 'D'
                }, (ret3) => {
                  console.log("调支付")
                  wx.hideLoading({})
                  if (payment_method == 'A') {
                    that.pay(ret.return);
                  } else {
                    wx.hideLoading({})
                    wx.reLaunch({
                      url: '/pages/orderinfo/orderinfo?type=0&id=' + ret.return,
                    })
                  }

                })

              } else {
                that.Base.toast("支付失败");
                wx.hideLoading({})
                wx.reLaunch({
                  url: '/pages/orderinfo/orderinfo?type=0&id=' + ret.return,
                })
              }
            })

            console.log("传子订单")

          }
        })

      }

    })


  }

  pay(id) {
    var that = this;
    var wechatapi = new WechatApi();
    var mallapi = new MallApi();
    // var id=this.Base.options.id;

    wechatapi.prepay({
      id: id
    }, (payret) => {
      console.log(payret, '支付回调');

      payret.complete = function (e) {
        if (e.errMsg == "requestPayment:ok") {
          that.Base.toast("支付成功")
          // that.onMyShow();
          mallapi.usecoupon({
            id: that.Base.getMyData().coupon_id,
            use_status: 'B'
          }, (ret) => {
            if (ret.code == 0) {
              wx.reLaunch({
                url: '/pages/orderinfo/orderinfo?type=0&id=' + id,
              })
            }

          })

        } else {
          that.Base.toast("支付失败");
          wx.reLaunch({
            url: '/pages/orderinfo/orderinfo?type=0&id=' + id,
          })
        }
      }
      wx.requestPayment(payret)
    })

  }

  binddelete(e) {
    var list = this.Base.getMyData().list;
    var idlist = "";
    var mallapi = new MallApi();
    for (var i = 0; i < list.length; i++) { 
        idlist += '"' + list[i].specifications + '"' + ',' 
    }
    idlist = idlist.slice(0, -1);
  
    mallapi.deletecarts({
      idlist: idlist
    }, (ret) => {
      
    })

  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.salesperson = content.salesperson;
body.bindselect = content.bindselect;
body.bindtuijian = content.bindtuijian;
body.chatuijianren = content.chatuijianren;

body.choose_coupons = content.choose_coupons;
body.bindconfrim = content.bindconfrim;
body.bindprice = content.bindprice;

body.bindpay = content.bindpay;
body.remarks_input = content.remarks_input;
body.bindpaymentmethod = content.bindpaymentmethod;
body.pay = content.pay;
body.bindguige = content.bindguige;
body.bindclose = content.bindclose;
body.binddelete = content.binddelete;

Page(body)