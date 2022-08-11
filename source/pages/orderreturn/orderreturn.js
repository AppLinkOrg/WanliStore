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
  FenxiaoApi
} from "../../apis/fenxiao.api.js"
import {
  OrderApi
} from "../../apis/order.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    wx.setNavigationBarTitle({
      title: "申请售后"
    })

    this.Base.setMyData({
      return_price: 0,
      isprice: false,
      return_phone: 0,
      show: false,
      position: 'bottom',
      duration: 300,
      return_type: [
        {
          name: "自行寄回",
          type: "A"
        },
        {
          name: "店面返还",
          type: "B"
        }
      ],
      order_type: 'A',
      contents: '',
      imglist: [],
      return_name:'',
      order_id: this.Base.options.id,
      orderno: this.Base.options.orderno,
      
      xiugai: this.Base.options.xiugai
    })
    console.log(this.Base.options.id, this.Base.options.orderno, this.Base.options.xiugai, '我在这呢,总订单id');
  }
  onMyShow() {
    var that = this;

  }
  // 获取名称
  goodsname(e) {
    this.Base.setMyData({
      return_name: e.detail.value
    })
  }
  // 修改金额
  setprice(e) {
    console.log('触发了');
    var that = this;
    let isprice = this.Base.getMyData().isprice;
    console.log(isprice);
    isprice = !isprice
    this.Base.setMyData({
      isprice
    })
  }

  // 获取修改
  getprice(e) {
    let price = e.detail.value;
    this.Base.setMyData({
      return_price: price
    })
  }
  // 获取手机号
  getphone(e) {
    let phone = e.detail.value;
    this.Base.setMyData({
      return_phone: phone
    })
  }

  // 弹窗
  tanc(e) {
    this.Base.setMyData({
      show: true
    })
  }
  setreturn_type(e) {
    console.log(e);
    let order_type = e.currentTarget.dataset.type;
    this.Base.setMyData({
      order_type,
      show: false
    })

  }
  contentsFn(e) {
    this.Base.setMyData({
      contents: e.detail.value
    })
  }

  uploadimg(e) {
    var id = e.currentTarget.id;
    var imglist = this.Base.getMyData().imglist;
    // 将图片上传到服务器对应的文件夹里面
    this.Base.uploadImage('returnOrder', (ret) => {
      console.log(ret);
      if (id >= 0) {
        imglist[id].img = ret;
      } else {
        imglist.push({
          img: ret
        })
      }
      this.Base.setMyData({
        imglist
      })
    })
  }
  shanchu(e) {
    var id = e.currentTarget.id;
    var imglist = this.Base.getMyData().imglist;
    imglist.splice(id, 1);
    this.Base.setMyData({
      imglist
    })
  }

  setordertrun() {
    console.log('22');
    var orderapi = new OrderApi();
    let data = this.Base.getMyData()
    let orderno_id = data.order_id;
    let orderno = data.orderno;
    let member_phone = data.return_phone;
    let return_type = data.order_type;
    let goods_id = data.return_name;
    let price = data.return_price;
    let beizhu = data.contents;
    let imglist = data.imglist;
    let primary_id = data.xiugai;
    var pattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/


    if (!!goods_id) {
    } else {
      this.Base.toast('请输入商品名称');
      return
    }

    if (price <= 0) {
      this.Base.toast('请输入申请金额');
      return
    }

    if (pattern.test(member_phone)) {
    } else {
      this.Base.toast('请输入正确的手机号码');
      return
    }
    if (primary_id == 1) {
      orderapi.amendedpetition({
        orderno_id,
        member_phone,
        returntype: return_type,
        goods_id,
        price,
        beizhu,
        orderno,
        imglist: JSON.stringify(imglist)
      }, res => {
        console.log(res);
        if (res.code == '0') {
          this.Base.toast('提交成功')
          wx.navigateBack({
            delta: 1,
          })
        } else {
          this.Base.toast(res.result);
        }

      })
    } else {

      orderapi.addreturunorder({
        orderno_id,
        member_phone,
        returntype: return_type,
        goods_id,
        price,
        beizhu,
        orderno,
        imglist: JSON.stringify(imglist)
      }, res => {
        console.log(res);
        if (res.code == '0') {
          this.Base.toast('提交成功')
          wx.navigateBack({
            delta: 1,
          })
        } else {
          this.Base.toast(res.result);
        }

      })
    }


  }
}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.goodsname = content.goodsname;
body.setprice = content.setprice;
body.getprice = content.getprice;
body.getphone = content.getphone;
body.tanc = content.tanc
body.setreturn_type = content.setreturn_type
body.contentsFn = content.contentsFn
body.uploadimg = content.uploadimg
body.shanchu = content.shanchu
body.setordertrun = content.setordertrun
Page(body)
