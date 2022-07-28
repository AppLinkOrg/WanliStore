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
import {
  deleteshopcart
} from '../../apis/deleteshopcart'
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    this.Base.setMyData({
      // 商品数量
      quantity: 1,
      //总价
      totalPrice: 0,
      selectAllStatus: false, // 全选状态 默认全选
      // 删除页面
      isDelete: false,
      // 删除列表


    })
    super.onLoad(options);
    var that = this;
    var shopcart = new shopcartlist();
    var mallapi = new MallApi();
    shopcart.shopcartlist({}, res => {
      console.log(res, '我是第一');
      let newArr = [];
      // for (let i = 0; i < res.length; i++) {
      //   mallapi.goodsinfo({
      //     id: res[i].goods_id
      //   }, (info) => {
      //     // //  newArr.push(info)
      //     res[i].list = info;
      //   });
      // }
      that.Base.setMyData({
        // infoList:newArr,
        shoCartList: res
      })
    })

  }
  onMyShow() {
    var that = this;

    let shoCartList = this.Base.getMyData().shoCartList; // 获取购物车列表

    let aa = shoCartList.some(item => item.checked == false);
    if (aa == false) {
      this.Base.setMyData({
        selectAllStatus: true
      })
    } else {
      this.Base.setMyData({
        selectAllStatus: false
      })
    }

    this.getTotalPrice();      //重新获取总价

  }
  // 点击多选框
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.Base.setMyData({
      isDaleList: e.detail.value
    })

    // console.log(deleList,'hahahahah');
  }

  // 增加数量按钮
  addquantity(e) {
    const index = e.currentTarget.dataset.index;
    console.log(index);
    let shoCartList = this.Base.getMyData().shoCartList; // 获取购物车列表
    let mall_number = shoCartList[index].mall_number;
    console.log(typeof (mall_number));
    mall_number++;
    shoCartList[index].mall_number = mall_number;

    this.setData({
      shoCartList: shoCartList
    });
    this.getTotalPrice();
  }

  // 减少数量按钮
  reducequantity(e) {
    const index = e.currentTarget.dataset.index;
    let shoCartList = this.Base.getMyData().shoCartList; // 获取购物车列表
    let mall_number = shoCartList[index].mall_number;
    mall_number--;
    shoCartList[index].mall_number = mall_number;
    this.setData({
      shoCartList: shoCartList
    });
    this.getTotalPrice();
  }

  //输入框编辑数量
  editInput(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    let shoCartList = this.Base.getMyData().shoCartList; // 获取购物车列表
    let value = e.detail.value;
    shoCartList[index].mall_number = value;
    this.setData({
      shoCartList: shoCartList
    })
    this.getTotalPrice();
  }

  // 计算总价
  getTotalPrice() {
    let shoCartList = this.Base.getMyData().shoCartList; // 获取购物车列表
    let total = 0;
    for (let i = 0; i < shoCartList.length; i++) { // 循环列表得到每个数据
      if (shoCartList[i].checked) { // 判断选中才会计算价格
        total += shoCartList[i].mall_number * shoCartList[i].guige[0].price; // 所有价格加起来
      }
    }
    this.Base.setMyData({
      shoCartList: shoCartList,
      totalPrice: total.toFixed(2)
    });
  }

  // 当前商品选中事件
  selectList(e) {
    var that = this
    console.log(e);
    const index = e.currentTarget.dataset.index; //获取 data 传进来的index
    console.log(index);
    let shoCartList = this.Base.getMyData().shoCartList; // 获取购物车列表
    const checked = shoCartList[index].checked; //获取当前商品的选中状态
    shoCartList[index].checked = !checked; // 改变状态
    this.Base.setMyData({
      shoCartList: shoCartList
    });
    let aa = shoCartList.some(item => item.checked == false);
    if (aa == false) {
      this.Base.setMyData({
        selectAllStatus: true
      })
    } else {
      this.Base.setMyData({
        selectAllStatus: false
      })
    }

    this.getTotalPrice();      //重新获取总价
  }

  // 购物车全选事件
  selectAll(e) {
    let selectAllStatus = this.Base.getMyData().selectAllStatus; // 是否全选状态

    selectAllStatus = !selectAllStatus;
    console.log(selectAllStatus, '修改后');
    let shoCartList = this.Base.getMyData().shoCartList; // 获取购物车列表
    let isDaleList = this.Base.getMyData().isDaleList;
    for (let i = 0; i < shoCartList.length; i++) {
      // 把所有状态修改
      shoCartList[i].checked = selectAllStatus;

    }           // 改变所有商品状态
    if (selectAllStatus) {
      // 全选框为真   获取所有id
      for (let j = 0; j < shoCartList.length; j++) {
        let hh = shoCartList[j].id;
        isDaleList.push(hh);
      }
    }
    if (selectAllStatus == false) {
      // 全选框为真   获取所有id
      isDaleList.length = 0;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      shoCartList: shoCartList
    });
    this.getTotalPrice();  //重新获取总价
  }

  // 跳转订单
  tobuy(e) {
    var data = this.Base.getMyData();
    // var inventory = data.shoCartList.shangpin[0].inventory;
    // console.log(inventory);
    // if (inventory <= 0) {
    //   this.Base.toast("没有库存啦~");
    //   return
    // }
    let shoCartList = this.Base.getMyData().shoCartList;
    let shopList = [];
    shopList=shoCartList.filter(ele => ele.checked == true);
    console.log(shopList);
    let isDaleList = this.Base.getMyData().isDaleList;
    wx.setStorage({
      key:"shopList",
      data:shopList
    })
     wx.navigateTo({
      url: '/pages/ordersubmit/ordersubmit?goodsid'
    })
  }
  // 转换页面
  toDelete() {
    let isDelete = this.Base.getMyData().isDelete; // 是否全选状态
    this.Base.setMyData({
      isDelete: !isDelete
    })
  }
  // 删除事件
  deleshopcart() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '您确定将该商品移除购物车？',
      success(res) {
        if (res.confirm) {

          let idlist = that.Base.getMyData().isDaleList;
          var deleshopCart = new deleteshopcart();
          deleshopCart.deleteshopcart({
            idlist
          }, res => {
            if (res.code == 0) {
              wx.showToast({
                title: '移出成功',
                icon: 'success',
                duration: 2000
              })
              that.onLoad();
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
body.getTotalPrice = content.getTotalPrice;
body.selectList = content.selectList;
body.selectAll = content.selectAll;
body.tobuy = content.tobuy;
body.toDelete = content.toDelete;
body.deleshopcart = content.deleshopcart;
Page(body)