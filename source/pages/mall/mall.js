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

  pagechange(e) {
        console.log(e);
    // 通过touch判断，改变tab的下标值
    if ("touch" === e.detail.source) {
      // let currentPageIndex = this.data.currentIndex;
      console.log(e.detail.current,'我看 看看');
      let typeid = e.detail.current+1
  
      // 拿到当前索引并动态改变
      this.setData({
        typeid
      })

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
  }
}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.getlist = content.getlist;
body.bindtype = content.bindtype;
body.changPage = content.bindPage;
body.pagechange = content.pagechange;
body.onShareAppMessage = content.onShareAppMessage;
Page(body)