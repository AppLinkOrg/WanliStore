// pages/mall/mall.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { MallApi } from "../../apis/mall.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    
  }
  onMyShow() {
    wx.showLoading({
      title: '正在加载',
    })
    var that = this;
    var mallapi = new MallApi();  
    mallapi.goodslist({}, (goodslist) => { 
      this.Base.setMyData({ goodslist });
    });  
    wx.hideLoading({ 
    })

  }
 

}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow; 
// body.clickAdv=content.clickAdv;
Page(body)