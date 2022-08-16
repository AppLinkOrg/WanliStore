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
import { ApiUtil } from "../../apis/apiutil";
  
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
      //options.id=5;
      super.onLoad(options);
      wx.setNavigationBarTitle({
        title: "门店自提"
      })
      this.Base.setMyData({
        choseid: this.Base.options.id==undefined?0:this.Base.options.id,
        chosetype: this.Base.options.chosetype,
        mlat:0,
        mylng:0,
      })
    }
    onMyShow() {
      var that = this;
      this.getlist();
    }
    getlist(){
      var data = this.Base.getMyData();
      var mylat = data.mylat;
      var mylng = data.mylng;
      var mallapi = new MallApi();
      mallapi.storelist({goodsid:this.Base.options.goodsid,mylat,mylng},(list)=>{
        for(let item of list){
          var distance = ApiUtil.GetDistance(mylat,mylng,item.lat,item.lng);
          item.miletext = ApiUtil.GetMileTxt(distance);
        }
          this.Base.setMyData({
              list
          })
      })
      mallapi.suoshustore({mylat,mylng},(list)=>{
        for(let item of list){
          var distance = ApiUtil.GetDistance(mylat,mylng,item.lat,item.lng);
          item.miletext = ApiUtil.GetMileTxt(distance);
        }
          this.Base.setMyData({
              sssss:list
          })
      })
      mallapi.usestore({goodsid:this.Base.options.goodsid,mylat,mylng},(usestore)=>{
        for(let item of usestore){
          var distance = ApiUtil.GetDistance(mylat,mylng,item.lat,item.lng);
          item.miletext = ApiUtil.GetMileTxt(distance);
        }
        this.Base.setMyData({
            usestore
        })
    })
    }
    chosedz(e){
        var id = e.currentTarget.id;
        this.Base.setMyData({
            choseid:id
        })
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.setData({
             store_id:id
           })
           wx.navigateBack({//返回
             delta: 1
           })
    }

    phonecall(e){
      var phone = e.currentTarget.dataset.phone;
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    }

  }
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad; 
  body.onMyShow = content.onMyShow;
  body.chosedz = content.chosedz;
  body.getlist = content.getlist;
  body.phonecall = content.phonecall;
  Page(body)