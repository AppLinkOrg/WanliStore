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
  shopcartlist
} from '../../apis/shopCartList';

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    this.Base.setMyData({
      // 商品数量
      quantity: 1,


    })
    super.onLoad(options);
    var that = this;
    var shopcart = new shopcartlist();
    var mallapi = new MallApi();
    shopcart.shopcartlist({}, res => {
      console.log(res, '我是第一');
      let newArr = [];
      for (let i = 0; i < res.length; i++) {
        mallapi.goodsinfo({
          id: res[i].goods_id
        }, (info) => {
          // //  newArr.push(info)
          res[i].list = info;
        });
      }
      that.Base.setMyData({
        // infoList:newArr,
        shoCartList: res
      })
    })

  }
  onMyShow() {
    var that = this;



  }
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  }

  // 增加数量按钮
  addquantity(e) {
    let quantity = this.Base.getMyData().quantity;
    console.log(quantity);
    quantity++;
    this.Base.setMyData({
      quantity
    })
  }

  // 减少数量按钮
  reducequantity(e) {
    let quantity = this.Base.getMyData().quantity;
    console.log(quantity);
    quantity--;
    this.Base.setMyData({
      quantity
    })
  }

  //输入框编辑数量
  editInput(e) {
    console.log(e);
    let quantity = e.detail.value;
    this.Base.setMyData({
      quantity
    })
  }

}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.checkboxChange = content.checkboxChange;
body.addquantity = content.addquantity;
body.reducequantity = content.reducequantity;
body.editInput = content.editInput;


Page(body)