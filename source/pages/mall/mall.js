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
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
      typeid: 0
    })
  }
  onMyShow() {
    wx.showLoading({
      title: '正在加载',
    })
    var that = this;
    var mallapi = new MallApi();
    mallapi.goodstypelist({}, (typelist) => {
      var typeid = typelist[0].id;
      this.Base.setMyData({
        typeid,
        typelist
      })
      this.getlist();
    })

    wx.hideLoading({})

  }
  getlist() {
    var typeid = this.Base.getMyData().typeid;
    var mallapi = new MallApi();
    mallapi.goodslist({
      typeid: typeid,
      orderby: "r_main.seq"
    }, (goodslist) => {
      this.Base.setMyData({
        goodslist
      });
    });
  }
  bindtype(e) {
    console.log(e, "-----------bindtype-----------");
    var id = e.currentTarget.id;
    this.Base.setMyData({
      typeid: id
    })
    this.getlist();
  }
  bindPage(e) {
    console.log(e, '--------bindPage---------');
  }
}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.getlist = content.getlist;
body.bindtype = content.bindtype;
body.changPage = content.bindPage;
Page(body)