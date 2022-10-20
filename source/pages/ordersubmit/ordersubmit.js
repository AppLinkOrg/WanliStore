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
  OrderApi
} from "../../apis/order.api.js";
import {
  WechatApi
} from "../../apis/wechat.api.js";
import {
  MemberApi
} from "../../apis/member.api.js";
import {
  GiftcardsApi
} from "../../apis/giftcards.api";
import {
  CouponApi
} from "../../apis/coupon.api";
import {
  spelist
} from "../../apis/spelist.js";
import { ApiUtil } from "../../apis/apiutil";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;

    super.onLoad(options);

    console.log(options.query)
    wx.setNavigationBarTitle({
      title: "创建订单"
    })
    this.Base.setMyData({
      sendtype: 'A',
      address_id: 0,
      tihuoren_id: 0,
      store_id: 0,
      beizhu: '',
      youhui: 0,
      couponprice: 0,
      lipin: 0,
      yunfei: 0,
      amount: 0,
      totalamount: 0,
      giftcardid: 0,
      liping: 0,
      couponid: 0,
      keyongcoupon: 0,
      flagcard: false,
      // flag 
      flag: true,
      info: [],
      str: [],
      isgogo: true,
      foss: false,
    })
  }

  onMyShow() {
    var that = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' });
    eventChannel.emit('someEvent', { data: 'test' });
    // 监听 acceptDataFromOpenerPage 事件，获取上一页面通过 eventChannel 传送到当前页面的数据
    eventChannel.on('shop_id', function (data) {

      that.setData({
        goods_number: data.goods_number,
        guige_id: data.guige_id,
        goods_id: data.id
      })

      // 通过规格接口查出需要的数据
      var speList = new spelist();
      speList.spelist({
        id: data.guige_id,
        goods_id: data.id
      }, res => {
        console.log(res, 'hahahahahahahah');
        res[0].mall_number = data.goods_number;
        res[0].specifications_id = data.guige_id;
        that.Base.setMyData({
          shopList: res
        })
      })
    })
    // 购物车数据 
    wx.getStorage({
      key: 'shopList',
      success(res) {
        that.Base.setMyData({
          shopList: res.data,
        })
      }
    })
    var mallapi = new MallApi();
    console.log("有神")
    console.log(this.Base.Page)

    // 获取商品内容
    // console.log(giftcardid)
    // console.log(this.Base.options, '是什么东西');
    mallapi.goodsinfo({
      id: this.Base.getMyData().goods_id
    }, (info) => {
      this.Base.setMyData({
        info: info
      });



      //2
      // 礼品卡
      var couponapi = new CouponApi();
      console.log("couponid有么")
      console.log(this.Base.getMyData().couponid)
      if (this.Base.getMyData().couponid > 0) {
        couponapi.couponinfo({
          id: this.Base.getMyData().couponid
        }, (e) => {
          this.Base.setMyData({
            couponinfo: e
          })
          this.getsum();
        })
      }
      // //  // 地址
      if (this.Base.getMyData().shopList.length < 2) {
        var mylat = this.Base.getMyData().mylat;
        var mylng = this.Base.getMyData().mylng;
        var goodsid = this.Base.getMyData().shopList[0].goods_id;
        console.log(goodsid);
        var mallapi = new MallApi();
        mallapi.usestore({ goodsid, mylat, mylng }, (usestore) => {
          console.log(usestore, '何方要写');
          for (let item of usestore) {
            var distance = ApiUtil.GetDistance(mylat, mylng, item.lat, item.lng);
            item.miletext = ApiUtil.GetMileTxt(distance);
          }
          this.Base.setMyData({
            usexxstore: usestore
          })
        })
      }
      // 优惠卷
      couponapi.mycoupon({}, (e) => {
        var data = this.Base.getMyData();
        console.log('data有什么')
        console.log(data)
        let keys = Object.keys(e)
        var arr = e.filter(item => {
          return item.usesstatus == 'A' && (item.manmoney * 1) <= (data.totalamount * 1)
        })
        console.log("arr是什么")
        console.log(arr.length);
        var keyongcoupon = arr.length
        this.Base.setMyData({
          keyongcoupon: keyongcoupon
        })
      })
      console.log("keyongcoupon赋值了吗")
      console.log(this.Base.getMyData().keyongcoupon)
      // 	我的礼品卡
      var giftcardsapi = new GiftcardsApi();
      console.log("giftcardid有么")
      console.log(this.Base.getMyData().giftcardid)
      if (this.Base.getMyData().giftcardid > 0) {
        giftcardsapi.mygiftcardinfo({
          id: this.Base.getMyData().giftcardid
        }, (giftcardinfo) => {
          // this.Base.getMyData().giftcardinfo.yue
          this.Base.setMyData({
            giftcardinfo
          })
          this.getsum();
        })
      }
      this.getsum();

    });


    var memberapi = new MemberApi();
    console.log(this.Base.getMyData().address_id, '达到');
    console.log(this.Base.getMyData().tihuoren_id, '达到');
    // 如果是商家配送的话
    if (this.Base.getMyData().address_id == 0 && this.Base.getMyData().sendtype == 'A') {

      var memberinfo = this.Base.getMyData().memberinfo;
      console.log("member是什么")
      console.log(memberinfo)
      this.Base.setMyData({
        address_id: memberinfo.address_id
      })
    }


    if (this.Base.getMyData().address_id > 0 && this.Base.getMyData().sendtype == 'A') {
      memberapi.addressinfo({
        id: this.Base.getMyData().address_id,
        status: 'A'
      }, (addressinfo) => {
        this.Base.setMyData({
          addressinfo
        })
      })
    }
    if (this.Base.getMyData().tihuoren_id > 0 && this.Base.getMyData().sendtype == 'B') {
      memberapi.addressinfo({
        id: this.Base.getMyData().tihuoren_id
      }, (addressthr) => {
        this.Base.setMyData({
          addressthr
        })
      })
    }
    if (this.Base.getMyData().store_id > 0 && this.Base.getMyData().sendtype == 'B') {
      mallapi.storeinfo({
        id: this.Base.getMyData().store_id
      }, (storeinfo) => {
        this.Base.setMyData({
          storeinfo
        })
      })
    }

  }
  swtichsend(e) {
    var sendtype = e.currentTarget.id
    this.Base.setMyData({
      sendtype: sendtype
    })
    this.getsum();
  }
  beizhuFn(e) {
    this.Base.setMyData({
      beizhu: e.detail.value
    })
  }

  // 计算总金额
  getsum() {
    var data = this.Base.getMyData();
    var sendtype = data.sendtype;
    let totalprice = 0;
    let yunfei =0;
    // 每个商品的总价格
    // 数量
    let goods_number = data.goods_number;

    console.log(goods_number, '数量');
    if (goods_number == undefined) {
      // 如果门店自提  门店==0 没有门店   0没有门店 1
      if (sendtype == 'B') {
        let storeinfoid = data.store_id;
        let shopList = data.shopList;
        if (storeinfoid == 0) {
          for (let i = 0; i < shopList.length; i++) {
            let aa = shopList[i].mall_number * shopList[i].price
            totalprice += aa
            yunfei = 0
          }
          totalprice = Math.round((totalprice)*100)/100;
          this.Base.setMyData({
            totalprice
          })
        } else {
          let storeinfoid = data.store_id;
          console.log('进来了', 'cxzczx');
          // 过滤空数组
          shopList = shopList.filter((item) => {
            return !!item.tihuo[0];
          });
          console.log(shopList, '我看看');
          // console.log(shopList.tihuo[storeinfoid-1].fid);
          // 1就是0 2就是1
          let arrdy = [];
          for (let index = 0; index < shopList.length; index++) {
            for (let x = 0; x < shopList[index].tihuo.length; x++) {
              let aa = shopList[index].tihuo[x].fid;
              if (aa == storeinfoid) {
                arrdy.push(shopList[index]);
              }
            }
          }

          // if (storeinfoid in array)
          // {
          //   this.Base.setMyData({

          //     foss:true
          //   })
          // }
          // 更新商品
          // var mallapi = new MallApi();
          // mallapi.updatamallis({
          //   arrdy:JSON.stringify(arrdy),
          // },res => {
          //   console.log(res,'更新');
          // })


          console.log(arrdy, 'cxzczx');
          shopList = arrdy;
          console.log(shopList, '出来楼');
          for (let i = 0; i < shopList.length; i++) {
            // shopList[i].
            let aa = shopList[i].mall_number * shopList[i].price
            totalprice += aa
          }
          totalprice = Math.round((totalprice)*100)/100;
          this.Base.setMyData({
            totalprice,
            mendianxx: arrdy,

          })
        }
        // shopList = shopList.filter((item) => {
        //   return item.tihuo[storeinfoid-1].fid == storeinfoid;
        // });
      }
      if (sendtype == 'A') {

        let shopList = data.shopList;
        for (let i = 0; i < shopList.length; i++) {
          let aa = shopList[i].mall_number * shopList[i].price
          let bb = shopList[i].mall_number * shopList[i].guige[0].yunfei
          totalprice += aa
          yunfei += bb
        }
        totalprice = Math.round((totalprice)*100)/100;
        this.Base.setMyData({
          totalprice
        })
      }


    } else {
      if (sendtype == 'A') {
        let guigeprice = data.shopList[0].price;
        console.log(guigeprice, '单价');
        // 这里运行了
        totalprice = goods_number * guigeprice;
        totalprice = Math.round((totalprice)*100)/100;
        yunfei = goods_number * data.shopList[0].guige[0].yunfei
        console.log(totalprice, '总价');
      }
      if (sendtype == 'B') {
        let storeinfoid = data.store_id;
        let shopList = data.shopList;
        if (storeinfoid == 0) {
          for (let i = 0; i < shopList.length; i++) {
            let aa = shopList[i].mall_number * shopList[i].price
            totalprice += aa
            yunfei = 0
          }
          totalprice = Math.round((totalprice)*100)/100;
          this.Base.setMyData({
            totalprice
          })
        } else {
          console.log('进来了', 'cxzczx');
          // 过滤空数组
          shopList = shopList.filter((item) => {
            return !!item.tihuo[0];
          });
          console.log(shopList, '我看看');
          // console.log(shopList.tihuo[storeinfoid-1].fid);
          // 1就是0 2就是1
          let arrdy = [];
          for (let index = 0; index < shopList.length; index++) {
            for (let x = 0; x < shopList[index].tihuo.length; x++) {
              let aa = shopList[index].tihuo[x].fid;
              if (aa == storeinfoid) {
                arrdy.push(shopList[index]);
              }
            }
          }
          arrdy.forEach(item => {
            item.addState = 'A';
          })
          shopList = arrdy;
          console.log(shopList, '出来楼');

          for (let i = 0; i < shopList.length; i++) {
            let aa = shopList[i].mall_number * shopList[i].price
            let bb = shopList[i].mall_number * shopList[i].guige[0].yunfei
            totalprice += aa
          }
          totalprice = Math.round((totalprice)*100)/100;
          this.Base.setMyData({
            totalprice,
            mendianxx: arrdy
          })
        }
        // shopList = shopList.filter((item) => {
        //   return item.tihuo[storeinfoid-1].fid == storeinfoid;
        // });
      }
    }


    totalprice = Math.round((totalprice)*100)/100;
    this.Base.setMyData({
      totalprice
    })

    console.log("有什么")
    console.log(data)
    console.log(this.Base.options)
    var info = data.shopList;
    // console.log(info[0].shangpin[0].yunfei, '我是运费');
    // yunfei = sendtype == 'A' ? Number(yunfei).toFixed(2) : Number(0).toFixed(2);
    var amount = 0;
    var totalamount = 0;
    var youhui = 0;
    var lipin = 0;
    var liping = 0;
    var couponprice = 0;
    // 商品总价，商品价格
    totalamount = Number(totalprice).toFixed(2);
    yunfei = Number(yunfei).toFixed(2);
    // 优惠券使用
    if (data.couponid > 0) {
      if (data.couponinfo.type == 'A') {
        couponprice = data.couponinfo.amount
      }
      if (data.couponinfo.type == 'B') {
        couponprice = (totalamount * (1 - data.couponinfo.zhekou / 100)).toFixed(2)
      }
    }
    // 礼品卡使用
    // 1、礼品卡使用金额
    if (data.giftcardid > 0) {
      var cardyue = data.giftcardinfo.yue;
      var cardid = data.giftcardinfo.id;
      if (data.couponid > 0) {
        console.log("第三个日乌尔禾IE")
        console.log(yunfei)
        if (data.sendtype == 'A') {
          var price = (Number(totalamount) + Number(yunfei) - Number(couponprice)).toFixed(2)
          if (cardyue * 1 > price * 1) {
            liping = price
          } else {
            liping = cardyue
          }
        } else {
          var price = (Number(totalamount) - Number(couponprice)).toFixed(2)
          if (cardyue * 1 > price * 1) {
            liping = price
          } else {
            liping = cardyue
          }
        }

      } else {
        console.log("这个怎么样？")
        console.log(cardyue)
        console.log(totalamount)
        if (data.sendtype == 'A') {
          if (cardyue * 1 > (Number(totalamount) + Number(yunfei)).toFixed(2)) {
            liping = (Number(totalamount) + Number(yunfei)).toFixed(2)
          } else {
            liping = cardyue
          }
        } else {
          if (cardyue * 1 > Number(totalamount).toFixed(2)) {
            liping = Number(totalamount).toFixed(2)
          } else {
            liping = cardyue
          }
        }

      }
      // 2、礼品卡余额
      if (data.giftcardid > 0) {
        if (data.couponid > 0) {
          if (data.sendtype == 'A') {
            lipin = (Number(cardyue) - Number(totalamount) - Number(yunfei) + Number(couponprice)).toFixed(2);

          } else {

            lipin = (Number(cardyue) - Number(totalamount) + Number(couponprice)).toFixed(2);
          }
        } else {
          if (data.sendtype == 'A') {
            lipin = (Number(cardyue) - Number(totalamount) - Number(yunfei)).toFixed(2);

          } else {

            lipin = (Number(cardyue) - Number(totalamount)).toFixed(2);
          }

        }
      }
      var data = this.Base.getMyData();
      // let shopList = data.shopList;
      // let str = data.str;
      // console.log(shopList, '2222');
      // console.log(str, '3333');
      // for (let i = 0; i < shopList.length; i++) {

      //   let strid = shopList[i].specifications_id;
      //   str.push(strid);
      // }
    }
    // 总优惠金额
    youhui = (Number(couponprice) + Number(liping)).toFixed(2);
    // 最终付款金额
    if (data.sendtype == 'A') {
      amount = (Number(totalamount) + Number(yunfei) - Number(youhui)).toFixed(2);
    } else {
      amount = (Number(totalamount) - Number(youhui)).toFixed(2);
    }


    this.Base.setMyData({
      liping,
      lipin,
      couponprice,
      totalamount,
      yunfei,
      youhui,
      amount,
      cardyue,
      cardid,
    })

  }
  // 创建订单
  bindpay() {
    var data = this.Base.getMyData();
    console.log("aaaa");
    // 判断有没有点击过
    // flag = true
    if (data.flag == false) {
      console.log("bbbb")
    } else {
      var flag = false
    }
    // flag = false
    // 判断有没有选地址
    if (data.sendtype == 'A' && data.address_id <= 0) {
      this.Base.toast('请选择地址');
      return
    }
    if (data.sendtype == 'A' && !data.addressinfo.address) {
      this.Base.toast('请选择地址');
      return
    }
    // 判断有没有选门店
    if (data.sendtype == 'B' && data.store_id <= 0) {
      this.Base.toast('请选择门店地址');
      return
    }
    // 判断有没有选提货人
    if (data.sendtype == 'B' && data.tihuoren_id <= 0) {
      this.Base.toast('请选择提货人');
      return
    }
    this.Base.setMyData({
      flag
    })
    // 判断用户是否授权
    if (data.memberinfo.nickName == '' || data.memberinfo.avatarUrl == '') {
      this.Base.toast('授权昵称，头像');
      return
    }
    // 判断用户是否授权
    if (data.memberinfo.mobile == '') {
      this.Base.toast('请授权手机号');
      return
    }




    // 礼品卡
    var giftcardsapi = new GiftcardsApi();
    if (data.giftcardid > 0) {
      // 查询礼品卡 
      giftcardsapi.mygiftcardinfo({
        id: data.giftcardid
      }, (e) => {
        var flagcard = this.Base.getMyData().flagcard
        console.log(flagcard + "按揭贷款对哦")
        if (e.isuse == 'C' || e.isuse == 'D') {
          this.Base.toast("该礼品卡不可使用~");
          return
        }

        let isgogo = data.isgogo;
        let shopList = data.shopList;
        let str = data.str;
        console.log(shopList, '2222');
        console.log(str, '3333');
        if (data.sendtype == 'A') {

          if (flag == false && isgogo == true) {
            for (let i = 0; i < shopList.length; i++) {
              let strid = shopList[i].specifications_id;
              str.push(strid);
            }
          }
        }

        if (data.sendtype == 'B') {
          let storeinfoid = data.store_id;
          if (storeinfoid == 0) {
            if (flag == false && isgogo == true) {
              shopList = shopList.filter((item) => {
                return !!item.tihuo[0];
              });
              console.log(shopList, '我看看');
              // shopList = shopList.filter((item) => {
              //   return item.tihuo[storeinfoid].fid == storeinfoid;
              // });
              for (let i = 0; i < shopList.length; i++) {
                let strid = shopList[i].specifications_id;
                str.push(strid);
              }
            }
          } else {

            if (flag == false && isgogo == true) {
              // 过滤空数组
              shopList = shopList.filter((item) => {
                return !!item.tihuo[0];
              });
              console.log('进来了', 'cxzczx');

              console.log(shopList, '我看看');
              // console.log(shopList.tihuo[storeinfoid-1].fid);
              // 1就是0 2就是1
              let arrdy = [];
              for (let index = 0; index < shopList.length; index++) {
                for (let x = 0; x < shopList[index].tihuo.length; x++) {
                  let aa = shopList[index].tihuo[x].fid;
                  if (aa == storeinfoid) {
                    arrdy.push(shopList[index]);
                  }
                }
              }
              shopList = arrdy;
              console.log(shopList, '出来楼');
              // shopList = shopList.filter((item) => {
              //   return item.tihuo[storeinfoid].fid == storeinfoid;
              // });
              for (let i = 0; i < shopList.length; i++) {
                let strid = shopList[i].specifications_id;
                str.push(strid);
              }
            }
          }

        }


        var orderapi = new OrderApi();
        var wechatapi = new WechatApi();
        // 创建订单  
        console.log(this.Base.getMyData().goods_id, 'hhhhhhhhh');
        orderapi.createorder({
          goods_id: this.Base.getMyData().shopList[0].goods_id,
          // 商品数量
          goods_number: data.shopList[0].mall_number,
          // 商品单价
          goods_price: data.shopList[0].price,
          // 商品规格
          goods_guige_id: data.shopList[0].guige[0].id,
          // //如果直接购买
          // goods_guige_yunfei: data.shopList[0].guige[0].yunfei,

          sendtype: data.sendtype,
          price: data.totalprice,
          youhui: data.youhui,
          couponprice: data.couponprice,
          lipin: data.liping,
          yunfei: data.yunfei,
          // 优惠后的总价格
          amount: data.amount,
          // 商品总价格
          totalamount: data.totalamount,
          store_id: data.store_id,
          address_id: data.address_id,
          beizhu: data.beizhu,
          mygiftcard_id: data.cardid,
          mycoupons_id: data.couponid,
          str: data.str

        }, (ret) => {
          console.log("手机号")
          if(ret.code==-1){
            wx.showToast({
              title: '商品已不在购物车，请在待付款完成支付',
              icon: 'none',
              duration: 2000
            })

            setTimeout(()=>{
              wx.reLaunch({
                url: '/pages/orderlist/orderlist?type=A',
              })
            }, 2000)
            
          }
          var data = this.Base.getMyData();
          var that = this;
          // 判断需要支付的金额是否大于0
          if (data.amount != 0) {
            if (ret.code == '0') {
              wechatapi.prepay({
                id: ret.return
              }, (payret) => {
                wx.showModal({
                  title: '测试',
                  content: JSON.stringify(payret),
                  })  ;
                payret.complete = function (e) {
                  console.log("payret进来了")
                  var data = that.Base.getMyData();
                  if (e.errMsg == "requestPayment:ok") {
                    wx.reLaunch({
                      url: '/pages/paysuccess/paysuccess?amount=' + data.amount,
                    })
                  } else {
                    console.log("没有付款")
                    var data = that.Base.getMyData();
                    var couponid = 0
                    var giftcardid = 0
                    let flag = true
                    let isgogo = data.isgogo
                    isgogo = false
                    //更改
                    var amount = (Number(data.totalprice) + Number(data.yunfei)-Number(data.youhui)).toFixed(2);
                    console.log(amount, '设么的点点滴滴');
                    var youhui = data.youhui
                    that.Base.setMyData({
                      giftcardid,
                      couponid,
                      flag,
                      amount,
                      youhui,
                      isgogo
                    })

                  }
                }
                wx.requestPayment(payret);
              })
            } else {
              this.Base.toast(ret.result);
            }
          } else {
            // 不走支付
            var orderapi = new OrderApi();
            var data = this.Base.getMyData();
            console.log("data有什么")
            console.log(data)
            console.log(data.id)
            console.log(this.Base.options.id)
            console.log(ret.return, '你什么东西');
            // 更新订单状态
            orderapi.updateorder({
              id: ret.return
            })

            wx.reLaunch({
              url: '/pages/paysuccess/paysuccess?amount=' + data.amount,
            })
          }

        })
        this.Base.setMyData({
          // flagcard
        })
      })
    } else {
      // 没有礼品卡
      var orderapi = new OrderApi();
      var wechatapi = new WechatApi();
      // 创建订单
      console.log(this.Base.getMyData().goods_id, 'hhhhhhhhh');
      // 这里还要给一份礼品卡   获取缓存里购物车
      var data = this.Base.getMyData();
      let shopList = data.shopList;
      let str = data.str;
      let isgogo = data.isgogo;
      console.log(shopList, '2222');
      console.log(str, '3333');
      // flag才能走进去  isgogo true 才能走进去
      if (data.sendtype == 'A') {

        if (flag == false && isgogo == true) {
          console.log('走一次');
          for (let i = 0; i < shopList.length; i++) {

            let strid = shopList[i].specifications_id;
            str.push(strid);
          }
        }
      }

      if (data.sendtype == 'B') {
        let storeinfoid = data.store_id;
        if (storeinfoid == 0) {
          if (flag == false && isgogo == true) {
            shopList = shopList.filter((item) => {
              return !!item.tihuo[0];
            });

            for (let i = 0; i < shopList.length; i++) {
              let strid = shopList[i].specifications_id;
              str.push(strid);
            }
          }
        } else {
          if (flag == false && isgogo == true) {
            shopList = shopList.filter((item) => {
              return !!item.tihuo[0];
            });

            // console.log(shopList.tihuo[storeinfoid-1].fid);
            // 1就是0 2就是1
            let arrdy = [];
            for (let index = 0; index < shopList.length; index++) {
              for (let x = 0; x < shopList[index].tihuo.length; x++) {
                let aa = shopList[index].tihuo[x].fid;
                if (aa == storeinfoid) {
                  arrdy.push(shopList[index]);
                }
              }
            }
            shopList = arrdy;
            console.log(shopList, '出来楼');
            // shopList = shopList.filter((item) => {
            //   return item.tihuo[storeinfoid].fid == storeinfoid;
            // });
            for (let i = 0; i < shopList.length; i++) {
              let strid = shopList[i].specifications_id;
              str.push(strid);
            }
          }


        }

      }


      let goods_id = this.Base.getMyData().shopList[0].goods_id;
      orderapi.createorder({
        // 商品id  可有可无
        goods_id: goods_id,
        // 商品数量
        goods_number: data.shopList[0].mall_number,
        // 商品单价
        goods_price: data.shopList[0].price,
        // 商品规格
        goods_guige_id: data.shopList[0].guige[0].id,
        //配送方式
        sendtype: data.sendtype,
        // 价格不对 没有商品数量 价格 ==  单价x数量
        price: data.totalprice,
        // 优惠卷
        youhui: data.youhui,
        // 优惠卷金额
        couponprice: data.couponprice,
        // 礼品卡
        lipin: data.liping,
        // 运费
        yunfei: data.yunfei,
        // 计算后的总价格
        amount: data.amount,
        // 商品总价格
        totalamount: data.totalprice,
        // 门店
        store_id: data.store_id,
        // 地址
        address_id: data.address_id,
        // 备注
        beizhu: data.beizhu,
        // 我的礼品卡
        mygiftcard_id: data.cardid,
        // 我的优惠券
        mycoupons_id: data.couponid,
        str: data.str
      }, (ret) => {
        console.log("手机号")
        if(ret.code==-1){
          wx.showToast({
            title: '商品已不在购物车，请在待付款完成支付',
            icon: 'none',
            duration: 2000
          })
          // data.flag == true
          setTimeout(()=>{
            wx.reLaunch({
              url: '/pages/orderlist/orderlist?type=A',
            })
          }, 2000)
        }
        var data = this.Base.getMyData();
        var that = this;
        // 判断需要支付的金额是否大于0
        if (data.amount != 0) {
          if (ret.code == '0') {
            // 调起支付
            console.log(data.amount, '有吗？？？');
            wechatapi.prepay({
              id: ret.return
            }, (payret) => {
              wx.showModal({
                title: '测试',
                content: JSON.stringify(payret),
                })  ;
              payret.complete = function (e) {
                console.log("payret进来了")
                let datas = that.Base.getMyData();
                if (e.errMsg == "requestPayment:ok") {
                  console.log(datas, '222');
                  wx.reLaunch({
                    url: '/pages/paysuccess/paysuccess?amount=' + datas.amount,
                  })
                } else {
                  console.log("没有付款")
                  var data = that.Base.getMyData();
                  var couponid = 0
                  var giftcardid = 0
                  let flag = true
                  let isgogo = data.isgogo
                  isgogo = false
                  //更改
                  var amount = (Number(data.totalprice) + Number(data.yunfei)-Number(data.youhui)).toFixed(2);
                  // var amount = (Number(data.totalprice) + Number(data.shopList[0].guige[0].yunfei)).toFixed(2)
                  console.log(data.totalprice, '总价', data.yunfei, data.youhui);
                  console.log(amount, '设么的点点滴滴');
                  var youhui = data.youhui
                  that.Base.setMyData({
                    giftcardid,
                    couponid,
                    flag,
                    amount,
                    youhui,
                    isgogo
                  })

                }
              }
              console.log("requestPayment")
              wx.requestPayment(payret);
            })
          } else {
            this.Base.toast(ret.result);
          }
        } else {
          // 不走支付
          var orderapi = new OrderApi();
          var data = this.Base.getMyData();
          console.log("data有什么")
          console.log(data)
          console.log(data.id)
          console.log(this.Base.options.id)
          // 更新订单状态
          orderapi.updateorder({
            id: ret.return
          })
          wx.reLaunch({
            url: '/pages/paysuccess/paysuccess?amount=' + data.amount,
          })
        }

      })
    }
  }

  onUnload() {
    wx.removeStorage({
      key: 'shopList',
    })
  }
  onHide() {
    wx.removeStorage({
      key: 'shopList',
    })
  }

}



var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.swtichsend = content.swtichsend;
body.bindpay = content.bindpay;
body.beizhuFn = content.beizhuFn;
body.getsum = content.getsum;

Page(body)