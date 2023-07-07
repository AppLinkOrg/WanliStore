 
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import {
  MallApi
} from "../../apis/mall.api.js";
import { MemberApi } from "../../apis/member.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    // wx.setNavigationBarTitle({ 
    //   title: "商品详情"
    // })
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.indexbanner({},(indexbanner)=>{
      this.Base.setMyData({
        indexbanner
      })
    })
    var mallapi = new MallApi();
    mallapi.goodslist({ishome:'Y',
    orderby:"r_main.shouyepaixu"},(list)=>{
      this.Base.setMyData({
        list
      })
    })


    this.Base.setMyData({
      u_member_id:this.Base.options.member_id
    })
    var memberapi = new MemberApi();
    memberapi.addmember({u_member_id:this.Base.getMyData().u_member_id},(e)=>{
      this.Base.setMyData({
        addmember:e
      })
    })
  }
  tobanner(e){
    var item = e.currentTarget.dataset.item;
    if(item.type=='A'){
      wx.navigateTo({
        url: '/pages/malldetail/malldetail?id='+item.goods_id,
      })
    }else if(item.type=='B'){
      wx.navigateTo({
        url: item.url,
      })
    }else{
    }
  }

  shipingkaiguan(e){
    var instinfo = this.Base.getMyData().instinfo
    if(instinfo.shiping=='是'){
      wx.navigateTo({
        url: '/pages/videolist/videolist',
      })
    }else{
      this.Base.toast("此功能未开放")
    }
  }


}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.tobanner = content.tobanner;
body.shipingkaiguan = content.shipingkaiguan;
body.onShareAppMessage = content.onShareAppMessage;
Page(body)