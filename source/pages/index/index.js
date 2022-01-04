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

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;

    super.onLoad(options);
    this.Base.setMyData({
      nowindex: 1,
      overlay: true,
      specificationsinfo: null,
      number: 1
    })
  }
  onMyShow() {
    var that = this;
    var mallapi = new MallApi();

    mallapi.goodsinfo({
      id: this.Base.options.id
    }, (info) => {
      var typelist = info.specifications_type;
      for (var i = 0; i < typelist.length; i++) {
        var list = typelist[i].specificationslist;
        typelist[i].choose = 0;
        // for(var j=0;j<list.length;j++){
        //   list[j].choose=false;
        // }
      }

      this.Base.setMyData({
        info
      });

    });

  }

  // 轮播图当前序号
  bindchange(e) {
    console.log(e);
    this.Base.setMyData({
      nowindex: e.detail.current + 1
    })
  }

  // 打开弹窗
  bindguige(e) {
    this.Base.setMyData({
      overlay: true
    })
  }

  // 商品规格选择
  chooseguige(e) {
    var that = this;
    var num = 0;
    var guige_id = e.currentTarget.id;
    var index = e.currentTarget.dataset.index;
    var info = this.Base.getMyData().info;
    var chooseid_item = [];
    var specificationsinfo = this.Base.getMyData().specificationsinfo;


    if (info.specifications_type[index].choose != 0 && info.specifications_type[index].choose == guige_id) { //再次点击取消选择
      info.specifications_type[index].choose = 0;
      specificationsinfo = null;
    } else {
      info.specifications_type[index].choose = guige_id;
    }

    // 检查有无未选规格
    for (var i = 0; i < info.specifications_type.length; i++) {
      if (parseInt(info.specifications_type[i].choose) == 0) {
        num++
      } else {
        chooseid_item.push(info.specifications_type[i].choose)
      }
    }
    if (num == 0) { // 规格选择完全后返回商品图片及价格
      var mallapi = new MallApi();
      mallapi.selectprice({
        chooseid: chooseid_item
      }, (ret) => {
        this.Base.setMyData({
          specificationsinfo: ret.return
        })
      })
    } else { //未选择完全重置为默认商品
      this.Base.setMyData({
        specificationsinfo
      })
    }

    this.Base.setMyData({
      info: info,
    })
  }
  //  关闭弹窗
  bindclose(e) {
    this.Base.setMyData({
      overlay: false
    })
  }

  // 数量减
  bindsubtract(e) {
    var number = this.Base.getMyData().number;
    if (number > 1) {
      number--
    } else {
      this.Base.toast("数量低于范围~");
      return;
    }
    this.Base.setMyData({
      number
    })
  }

  // 数量加
  bindadd(e) {
    var number = this.Base.getMyData().number;
    number++
    this.Base.setMyData({
      number
    })
  }
  bindconfrim(e) {
    var info = this.Base.getMyData().info;
    var complete=true;
    for (var i = 0; i < info.specifications_type.length; i++) {

      if (info.specifications_type[i].choose == 0) {
        this.Base.toast("请选择" + info.specifications_type[i].name);
        complete=false;
        break;
      }
    }

    console.log(complete,'是否完成')
    if (complete) {
      this.Base.setMyData({
        
      })
    }

  }

}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bindchange = content.bindchange;

body.bindguige = content.bindguige; 
body.bindclose = content.bindclose;

body.chooseguige = content.chooseguige;


body.bindsubtract = content.bindsubtract;
body.bindadd = content.bindadd;


body.bindconfrim = content.bindconfrim;

Page(body)