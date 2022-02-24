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
      flag: 'A',
      inputValue: '',
      inputpawValue: ''
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


    bindKeyInput(e){
      var inputValue= e.detail.value
      this.Base.setMyData({
        inputValue
      })
      console.log()
    }
    bindPawInput(e){
      var inputpawValue= e.detail.value
      this.Base.setMyData({
        inputpawValue
      })
    }
    

    giftCardExhange(e){
      // wx.reLaunch({
      //   url: '/pages/exchagessuccess/exchagessuccess',
      // })
      // console.log("???");
      // return;
      var giftcardsapi = new GiftcardsApi();
      var inputValue = this.Base.getMyData().inputValue
      var inputpawValue = this.Base.getMyData().inputpawValue
      console.log("有数据吗")
      console.log(inputpawValue)
      giftcardsapi.exchangecard({
        name: inputValue,
        kami: inputpawValue,
      },(ret)=>{
        if(ret.code=='0'){
                wx.reLaunch({
                  url: '/pages/exchagessuccess/exchagessuccess',
                })
              }
      })

    }
  
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.switchtype = content.switchtype;
  body.bindKeyInput = content.bindKeyInput;
  body.bindPawInput = content.bindPawInput;
  body.giftCardExhange = content.giftCardExhange;

  Page(body)