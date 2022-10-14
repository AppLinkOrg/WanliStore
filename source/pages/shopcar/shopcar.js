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
      isDaleList: []


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
      let shoCartList = res.filter((item) => {
        return !!item.shangpin[0];
      });
      that.Base.setMyData({
        // infoList:newArr,
        shoCartList
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

    this.getTotalPrice(); //重新获取总价

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
    var that = this
    const index = e.currentTarget.dataset.index;
    // 购物车Id
    const specifications_id = e.currentTarget.dataset.spe_id;
    const zhuangtaiid = e.currentTarget.dataset.zhuangtai;
    const kucun = e.currentTarget.dataset.kucun;
    const num = e.currentTarget.dataset.num;

    let shoCartList = this.Base.getMyData().shoCartList; // 获取购物车列表
    let mall_number = shoCartList[index].mall_number;

    let id = shoCartList[index].id;

    let isDaleList = this.Base.getMyData().isDaleList;
    console.log('原来的值', isDaleList);
    console.log('原来的值', e,id);
    mall_number++;
    
    if(kucun<num*mall_number&&isDaleList.length>0){
      for(let i=0;i<isDaleList.length;i++){
        if(isDaleList[i]==id){
          isDaleList.splice(i, 1);
          console.log(isDaleList)
         
          const checked = shoCartList[index].checked; //获取当前商品的选中状态
          shoCartList[index].checked = false; // 改变状态
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
      
          this.getTotalPrice(); //重新获取总价
        }
      }
    }
    this.Base.setMyData({
      isDaleList: isDaleList
    })

    
    shoCartList[index].mall_number = mall_number;

    var shopcart = new shopcartlist();
    shopcart.addshopcartnum({
      specifications_id,
      mall_number,
      zhuangtaiid
    }, res => {
      console.log(res);
    })
    this.setData({
      shoCartList: shoCartList
    });
    this.getTotalPrice();
  }

  // 减少数量按钮
  reducequantity(e) {
    const index = e.currentTarget.dataset.index;
    const specifications_id = e.currentTarget.dataset.spe_id;
    const zhuangtaiid = e.currentTarget.dataset.zhuangtai;


    let shoCartList = this.Base.getMyData().shoCartList; // 获取购物车列表
    let mall_number = shoCartList[index].mall_number;
    mall_number--;
    shoCartList[index].mall_number = mall_number;
    var shopcart = new shopcartlist();
    shopcart.addshopcartnum({
      specifications_id,
      mall_number,
      zhuangtaiid
    }, res => {
      console.log(res);
    })
    this.setData({
      shoCartList: shoCartList
    });
    this.getTotalPrice();
  }

  //输入框编辑数量
  editInput(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    const specifications_id = e.currentTarget.dataset.spe_id;
    const zhuangtaiid = e.currentTarget.dataset.zhuangtai;
   
    let shoCartList = this.Base.getMyData().shoCartList; // 获取购物车列表
    let value = e.detail.value;
    if(value==0||value==""){
      value=1;
    }
    shoCartList[index].mall_number = value;

    var shopcart = new shopcartlist();
    shopcart.addshopcartnum({
      specifications_id,
      mall_number: value,
      zhuangtaiid
    }, res => {
      console.log(res);
    })
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
        total += shoCartList[i].mall_number * shoCartList[i].price; // 所有价格加起来
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

    this.getTotalPrice(); //重新获取总价
  }

  // 购物车全选事件
  selectAll(e) {
    let selectAllStatus = this.Base.getMyData().selectAllStatus; // 是否全选状态

    selectAllStatus = !selectAllStatus;
    console.log(selectAllStatus, '修改后');
    let shoCartList = this.Base.getMyData().shoCartList; // 获取购物车列表
    //  shoCartList = shoCartList.filter((item) => {
    //   return !!item.shangpin[0];
    // });
    let isDaleList = this.Base.getMyData().isDaleList;

    for (let i = 0; i < shoCartList.length; i++) {
      // 把所有状态修改
      shoCartList[i].checked = selectAllStatus;

    } // 改变所有商品状态
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
    this.getTotalPrice(); //重新获取总价
  }

  // 跳转订单
  tobuy(e) {
    let totalPrice = this.Base.getMyData().totalPrice;
    if(totalPrice<=0){
      this.Base.toast('请选择商品');
      return
    }


    var data = this.Base.getMyData();

    let shoCartList = this.Base.getMyData().shoCartList;

    let shopList = shoCartList.filter(ele => ele.checked == true);
    console.log('被选中的', shopList);
    for(var i=0;i<shopList.length;i++){
      let kucun=shopList[i].shangpin[0].inventory;
      let buynum=shopList[i].mall_number*shopList[i].guige[0].num;
      if(kucun<buynum){
        this.Base.toast(shopList[i].shangpin[0].name+'库存不够，请重新选择商品！');
        return
      }else if(shopList.length>1){
        for(var i=0;i<shopList.length-1;i++){
          for(var j=i+1;j<shopList.length;j++){
            console.log(i,j)
            if(shopList[i].goods_id==shopList[j].goods_id){
              let kucun=shopList[i].shangpin[0].inventory;
              let buynum=shopList[i].mall_number*shopList[i].guige[0].num+ shopList[j].mall_number*shopList[j].guige[0].num;
              if(kucun<buynum){
                this.Base.toast(shopList[i].shangpin[0].name+'库存不够，请重新选择商品！');
                return
              }
            }
          }
        }
      } 

    }

    
    
     

    // let shop_id= [];
    // let shop_dd = {};
    // for (let i = 0; i < shoCartList.length; i++) {
    //   let aa = shopList[i].specifications_id;
    //   let bb = shopList[i].mall_number;
    //   shop_dd.specifications_id = aa;
    //   shop_dd.mall_number = bb;
    //   shop_id.push(shop_dd);
    // }
    // console.log(shop_id,'hhhh');
    // // 更新购物车表里数据
    var upshopCat = new shopcartlist();
    upshopCat.shopcartup({
      shop_id: JSON.stringify(shopList),
      primary_id: 1
    }, res => {

    })
    console.log(shopList);
    let isDaleList = this.Base.getMyData().isDaleList;
    wx.setStorage({
      key: "shopList",
      data: shopList
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
  //清空失效购物车
  delete(e){
    let that = this
    console.log(e,"清掉该商品")
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '该商品库存不够，您确定将该商品移除购物车？',
      success(res) {
        if (res.confirm) {
          var deleshopCart = new deleteshopcart();
          deleshopCart.deleteshopcart({
            idlist:id
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
body.delete = content.delete;

Page(body)