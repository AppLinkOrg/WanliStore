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
        duration:300,
        round:true,
        // 商品数量
        quantity:1,
        // 商品规格
        norms:-1,
        isShow:false
    
      })
    }
    onMyShow() {
      var that = this;
      var mallapi = new MallApi();
    
      mallapi.goodsinfo({
        id: this.Base.options.id
      }, (info) => {
       
        this.Base.setMyData({
          info
        });
  
      });
  
    }
    // 跳转订单
    tobuy(e){
      var data = this.Base.getMyData();
      var inventory = data.info.inventory;
      if(inventory<=0){
        this.Base.toast("没有库存啦~");
        return
      }
      wx.navigateTo({
        url: '/pages/ordersubmit/ordersubmit?goodsid='+this.Base.getMyData().info.id,
      })
    }
    // 跳转购物车
    toshopcar(e){
      wx.navigateTo({
        url: '/pages/shopcar/shopcar?goodsid',
      })
    }
    // 遮罩层弹出
    joinshop(e){
      this.Base.setMyData({
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
    addquantity (e) {
      let quantity = this.Base.getMyData().quantity;
      console.log(quantity);
      quantity++;
      this.Base.setMyData({
        quantity
      })
    }

    // 减少数量按钮
    reducequantity (e) {
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
    getnorms(e){
      console.log(e);
      let norms = e.target.dataset.id;
      // let shopprice = e.currentTarget.dataset.price;
      // let shopname = e.currentTarget.dataset.name;

      
      this.Base.setMyData({
        norms,
        
        // shopname
      })
      
  
    }
    // 提交到购物车
    shopCartBtn(e){
      var that  =this
    //  数量
      let quantity = this.Base.getMyData().quantity;
      // let qian = this.Base.getMyData().
     
      // 规格=？新商品
      let goods_id = this.Base.getMyData().info.id;
      let norms = this.Base.getMyData().norms;
      
      if (norms == '-1') {
        wx.showToast({
          title: '请选择商品规格',
          icon: 'none',
          duration: 2000
        })
      }else{
        console.log(quantity,norms);
        var addshopCar  =new addshopCart();
        addshopCar.addshopCart({
          goods_id,
          mall_number:quantity,
          norms
        },res => {
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
  body.tobuy= content.tobuy;
  body.joinshop= content.joinshop;
  body.exit_btn =content.exit_btn;
  body.addquantity = content.addquantity;
  body.reducequantity = content.reducequantity;
  body.editInput = content.editInput;
  body.shopCartBtn = content.shopCartBtn;
  body.getnorms = content.getnorms;
  Page(body)