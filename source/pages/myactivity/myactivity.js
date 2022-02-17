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
import { ActivitysApi } from "../../apis/activitys.api";
  
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
      wx.setNavigationBarTitle({
        title: "我的活动"
      })
      super.onLoad(options);
      this.Base.setMyData({
        typelist:[
            {name:'已报名',value:'A'},
            {name:'已取消',value:'B'},
            {name:'已结束',value:'C'}
        ],
        statusbaoming:this.Base.options.type==undefined?'A':this.Base.options.type
    })
    }
    onMyShow() {
      var that = this;
      var activitysApi = new ActivitysApi()
      var statusbaoming = this.Base.getMyData().statusbaoming;
      activitysApi.baominglist({statusbaoming:statusbaoming},(list)=>{
        this.Base.setMyData({
          baominglist:list
        })
      })

      activitysApi.activitylist({},(list)=>{
        this.Base.setMyData({
          activitylist:list
        })
      })

      
    }
    switchtype(e){
      var statusbaoming = e.currentTarget.id;
      this.Base.setMyData({
        statusbaoming
      })
      this.onMyShow();
  }
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.switchtype = content.switchtype;

  Page(body)