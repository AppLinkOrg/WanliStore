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
        round:true
      })
      wx.getSystemInfo({ 
      
        success: function (res) { 
          console.log(res,'在这');
          let fen = 0.5;
          let height = res.windowHeight *fen;
          console.log(height);
          that.Base.setMyData({
                clientHeight: height 
            }); 
        } 
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

    toshopcar(e){
      wx.navigateTo({
        url: '/pages/shopcar/shopcar?goodsid',
      })
    }
    
    joinshop(e){
      this.Base.setMyData({
        show: true,
      
      })
    }

    exit_btn(e) {
      this.Base.setMyData({
        show: false,
      
      })
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
  Page(body)