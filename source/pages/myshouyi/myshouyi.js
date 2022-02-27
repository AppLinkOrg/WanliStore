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
  import{
    FenxiaoApi
  }from "../../apis/fenxiao.api.js"
import{
  MemberApi
}from "../../apis/member.api"

  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
        wx.setNavigationBarTitle({
          title: '我的收益',
        })
      super.onLoad(options);
      this.Base.setMyData({
        nowindex: 1,
        overlay: true,
        specificationsinfo: null,
        number: 1,
        totalamount: 0,
        arrivalsoon:0,
        ketixian: 0,
      })
    }
    onMyShow() {
      var that = this;
      var mallapi = new MallApi();
      var data = this.Base.getMyData();
      var fenxiaoapi = new FenxiaoApi();
      fenxiaoapi.fenxiaojilu({},(e)=>{
        this.Base.setMyData({
          fenxiaojilu:e
        })
        that.getsum();
      })
      var memberapi = new MemberApi();

      memberapi.info({},(e)=>{        
        this.Base.setMyData({
          info:e
        })
      })
     
    }
    navigateback(e){
      wx.redirectTo({
        url:'/pages/shouyitixian/shouyitixian'
      })
    }

    getsum(){
      var data = this.Base.getMyData();
      var that = this
      console.log("进来吗");
      console.log(data);
      var totalamount = 0;
      var arrivalsoon = 0;
      var ketixian = 0;

      var array = data.fenxiaojilu;
      console.log("为啊什么");
      console.log(array);
      for(let item of array){
        if(item.orderstatus=='A'){
          arrivalsoon = (Number(arrivalsoon) + Number(item.amount)).toFixed(2);
          }
          if(item.orderstatus=='B'){
            ketixian = (Number(ketixian) + Number(item.amount)).toFixed(2);
            }
          
        }
        that.Base.setMyData({
          arrivalsoon,
          ketixian,
        })
      } 
 
  
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.navigateback = content.navigateback;
  body.getsum=content.getsum;
  
  Page(body)