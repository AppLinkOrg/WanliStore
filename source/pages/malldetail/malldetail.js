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
import {
  addshopCart
} from "../../apis/addshopCart"
import {
  CouponApi
} from "../../apis/coupon.api";
import {
  shopcartlist
} from '../../apis/shopCartList';
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    var that = this;
    super.onLoad(options);
    this.Base.setMyData({
      show: false,
      position: 'bottom',
      duration: 300,
      round: true,
      // 商品数量
      quantity: 1,
      // 商品规格
      norms: -1,
      isShow: false,
      prices: 0

    })



  }
  onMyShow() {
    var that = this;
    var mallapi = new MallApi();
    var coupon = new CouponApi();
    mallapi.goodsinfo({
      id: this.Base.options.id
    }, (info) => {

      this.Base.setMyData({
        info
      });

    });
    coupon.mycoupon({

    }, res => {
      var keshiyonglist = res.filter(item => {
        return item.usesstatus == 'A'
      })
      that.Base.setMyData({
        couponList: keshiyonglist
      })
    })


    var shopcart = new shopcartlist();

    shopcart.shopcartlist({}, res => {
      console.log(res, '我是第一');
      let shoCartList = res.filter((item) => {
        return !!item.shangpin[0];
      });
      that.Base.setMyData({
        // infoList:newArr,
        shoCartList
      })
    })
  }
  // 跳转订单
  tobuy(e) {
    // var data = this.Base.getMyData();
    // var inventory = data.info.inventory;
    // if(inventory<=0){
    //   this.Base.toast("没有库存啦~");
    //   return
    // }
    // wx.navigateTo({
    //   url: '/pages/ordersubmit/ordersubmit?goodsid='+this.Base.getMyData().info.id,
    // })

    console.log(e);
    let id = e.currentTarget.dataset.index;

    this.Base.setMyData({
      isShop: id,
      goods_idss: e.currentTarget.dataset.id,
      show: true,
    })

  }
  tobuybtn(e) {
    var that = this
    //  数量
    let goods_number = this.Base.getMyData().quantity;
    // 规格=？新商品
    let norms = this.Base.getMyData().norms;
    let goods_idss = this.Base.getMyData().goods_idss;
    let id = this.Base.getMyData().goods_id;
    if (norms == '-1') {
      wx.showToast({
        title: '请选择商品规格',
        icon: 'none',
        duration: 2000
      })
    } else {

      wx.navigateTo({
        url: '/pages/ordersubmit/ordersubmit?goodsid',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function (data) {
            console.log(data)
          },
          someEvent: function (data) {
            console.log(data)
          }

        },
        success: function (res) {
          // 通过 eventChannel 向被打开页面传送数据
          res.eventChannel.emit('shop_id', { id: goods_idss, goods_number: goods_number, guige_id: norms })
        }
      })
    }

  }

  // 跳转优惠卷
  tomycoupon() {
    wx.navigateTo({
      url: '/pages/mycoupon/mycoupon',
    })
  }

  // 跳转购物车
  toshopcar(e) {
    wx.navigateTo({
      url: '/pages/shopcar/shopcar?goodsid',
    })
  }
  // 遮罩层弹出
  joinshop(e) {
    let id = e.currentTarget.dataset.index
    this.Base.setMyData({
      isShop: id,
      show: true,
    })

  }
  // 退出遮罩层
  exit_btn(e) {
    this.Base.setMyData({
      show: false,

    })
  }
  // 增加数量按钮
  addquantity(e) {
    let quantity = this.Base.getMyData().quantity;
    console.log(quantity);
    quantity++;
    this.Base.setMyData({
      quantity
    })
  }

  // 减少数量按钮
  reducequantity(e) {
    let quantity = this.Base.getMyData().quantity;
    console.log(quantity);
    quantity--;
    this.Base.setMyData({
      quantity
    })
  }

  //输入框编辑数量
  editInput(e) {
    console.log(e);
    let quantity = e.detail.value;
    this.Base.setMyData({
      quantity
    })
  }
  // 获取商品规格
  getnorms(e) {
    console.log(e);
    let norms = e.target.dataset.id;
    // let shopprice = e.currentTarget.dataset.price;
    // let shopname = e.currentTarget.dataset.name;
    let price = e.target.dataset.price

    this.Base.setMyData({
      norms,
      price,
      prices: price
      // shopname
    })


  }
  // 提交到购物车
  shopCartBtn(e) {
    var that = this
    //  数量
    let quantity = this.Base.getMyData().quantity;
    // let qian = this.Base.getMyData().

    // 规格=？新商品
    let goods_id = this.Base.getMyData().info.id;
    let norms = this.Base.getMyData().norms;
    console.log(norms, '22');
    let price = this.Base.getMyData().price;
    if (norms == '-1') {
      wx.showToast({
        title: '请选择商品规格',
        icon: 'none',
        duration: 2000
      })
    } else {
      console.log(quantity, norms);
      var addshopCar = new addshopCart();
      addshopCar.addshopCart({
        goods_id,
        mall_number: quantity,
        norms,
        price
      }, res => {
        console.log(res);
        if (res.code == 0) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })
          that.Base.setMyData({
            show: false,
          })
          this.onMyShow();
        }
      })
    }
  }
}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.toshopcar = content.toshopcar;
body.tobuy = content.tobuy;
body.joinshop = content.joinshop;
body.exit_btn = content.exit_btn;
body.addquantity = content.addquantity;
body.reducequantity = content.reducequantity;
body.editInput = content.editInput;
body.shopCartBtn = content.shopCartBtn;
body.getnorms = content.getnorms;
body.tobuybtn = content.tobuybtn;
body.tomycoupon = content.tomycoupon;
Page(body)