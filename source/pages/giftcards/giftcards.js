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
    GiftcardsApi
  } from "../../apis/giftcards.api.js";
  
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
      wx.setNavigationBarTitle({
        title: "礼品卡"
      })
      super.onLoad(options);
      this.Base.setMyData({
        typelist:[
          {name:'我的礼品卡',value:'A'},
          {name:'兑换礼品卡',value:'B'}
      ],
      flag: 'A'
      
      })
    }
    onMyShow() {

      var giftcardsapi = new GiftcardsApi();
      giftcardsapi.mygiftcardlist({},(e) => {
        this.Base.setMyData({
          cardlist:e
        })
      })
      giftcardsapi.mygiftcardinfo({id:this.Base.options.id},(e) => {
        this.Base.setMyData({
          cardinfo:e
        })
      })
    }



    switchtype(e){
      console.log("这这这")
      console.log(e)
      var id = e.currentTarget.id
      this.Base.setMyData({
          flag: id
      })
    }
  
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.switchtype = content.switchtype;

  Page(body)