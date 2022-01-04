// pages/addresslist/addresslist.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import {
  MallApi
} from "../../apis/mall.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    wx.showLoading({
      title: '正在加载',
    })
  }
  onMyShow() {
    var that = this;
    var mallapi = new MallApi();
    mallapi.addresslist({},(list)=>{
      this.Base.setMyData({
        list
      })
      wx.hideLoading({ 
      })
    })
  }
  chooseaddress(e){
    console.log(this.Base.options.type,'多少');
    // return;
    if (this.Base.options.type=='A') {
      let pages = getCurrentPages();   
      let prevPage = pages[pages.length - 2];  
      prevPage.setData({
          address_id: e.currentTarget.id,
      }) 
      wx.navigateBack({});
 
    }else{
      wx.navigateTo({
        url: '/pages/addressedit/addressedit?id='+e.currentTarget.id,
      })
    }
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.chooseaddress = content.chooseaddress;

Page(body)