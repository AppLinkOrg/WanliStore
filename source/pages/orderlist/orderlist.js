import {
    AppBase
} from "../../appbase";
import {
    ApiConfig
} from "../../apis/apiconfig";
import {
    InstApi
} from "../../apis/inst.api.js";
import { OrderApi } from "../../apis/order.api";
import { WechatApi } from "../../apis/wechat.api";
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
        wx.setNavigationBarTitle({
            title: "我的订单"
        })
        this.Base.setMyData({
            typelist: [
                { name: '全部', value: '' },
                { name: '待付款', value: 'A' },
                { name: '待发货', value: 'B' },
                { name: '待收货', value: 'C' },
                { name: '已完成', value: 'F' },
                { name: '已取消', value: 'Q,R' },
            ],
            orderstatus: this.Base.options.type == undefined ? '' : this.Base.options.type,
            listnum:0,
        })
        console.log(this.Base.getMyData().orderstatus,'22323');
    }
    onMyShow() {
        var that = this;
        var orderapi = new OrderApi();
       
        var orderstatus = this.Base.getMyData().orderstatus;
         orderapi.orderlist({ orderstatus: orderstatus }, (list) => {
            // this.teamList(list);
           
            that.Base.setMyData({
                list
            })
         
        })

       
    }

    // teamList(list) {
    //     var that = this;
    //     var mallapi = new MallApi();
    //     console.log(list, '2222222222222');
    //     // var mallapi = new MallApi();
    //     // let list = that.Base.getMyData().list;
    //     for (let i = 0; i < list.length; i++) {
    //         console.log(list[i].team.length > 0, '有东西吗');
    //         // 判断每个team是否有值？
    //         if (list[i].team.length > 0) {
    //             // 返回的true 我只取3个 因为i只有三个
    //             console.log(list[i].team[i], '看看是什么');
    //             for (let j = 0; j < list[i].team.length; j++) {
    //                 //    我需要 每个team的id
    //                 let goods_id = list[i].team[j].goods_id;
    //                 mallapi.goodsinfo({
    //                     id: goods_id
    //                 }, (res) => {
    //                     list[i].team[j].haha = res
    //                 });
    //             }
    //         }
    //     }
    // }










    switchtype(e) {
        var orderstatus = e.currentTarget.id;

        this.Base.setMyData({
            orderstatus,
        })
        this.onMyShow();
    }
    cancelorder(e) {
        var that = this;
        var id = e.currentTarget.id;
        var orderapi = new OrderApi();
        wx.showModal({
            title: '订单提示',
            content: '是否要取消该订单',
            success: (ret) => {
                if (ret.confirm) {
                    orderapi.cancelorder({ id: id }, (ret) => {
                        that.Base.toast('订单取消成功');
                        that.Base.setMyData({
                            orderstatus: 'Q',
                        })
                        that.onMyShow();
                    })
                }
            }
        })
    }
    refundorder(e) {
        var that = this;
        var id = e.currentTarget.id;
        var wechatapi = new WechatApi();
        wx.showModal({
            title: '订单提示',
            content: '是否要申请退款？',
            success: (ret) => {
                console.log("这")
                console.log(ret)
                if (ret.confirm) {
                    wechatapi.refund({ id: id }, (ret) => {
                        if (ret.code >= 0) {
                            that.Base.toast('订单退款成功');
                            that.onMyShow();
                        } else {
                            that.Base.toast(ret.result);
                        }
                    })
                }
            }
        })
    }
    shouhuo(e) {
        var that = this;
        var id = e.currentTarget.id;
        var orderapi = new OrderApi();
        wx.showModal({
            title: '订单提示',
            content: '已确认收到商品',
            success: (ret) => {
                if (ret.confirm) {
                    orderapi.shouhuo({ id: id }, (ret) => {
                        that.Base.setMyData({
                            orderstatus: 'F'
                        })
                        that.onMyShow();
                    })
                }
            }
        })
    }
    quhuo(e) {
        var that = this;
        var id = e.currentTarget.id;
        var orderapi = new OrderApi();
        wx.showModal({
            title: '订单提示',
            content: '已确认收到商品',
            success: (ret) => {
                if (ret.confirm) {
                    orderapi.shouhuo({ id: id }, (ret) => {
                        that.Base.setMyData({
                            orderstatus: 'F'
                        })
                        wx.navigateTo({
                            url: '/pages/orderlist/orderlist?type=' + this.Base.getMyData().orderstatus,
                        })
                    })
                }
            }
        })

    }
    shanchuorder(e) {
        var that = this;
        var id = e.currentTarget.id;
        var orderapi = new OrderApi();
        wx.showModal({
            title: '订单提示',
            content: '是否要删除该订单',
            success: (ret) => {
                if (ret.confirm) {
                    orderapi.deleteorder({ id: id }, (ret) => {
                        that.Base.toast('删除成功');
                        that.onMyShow();
                    })
                }
            }
        })
    }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.switchtype = content.switchtype;
body.cancelorder = content.cancelorder;
body.refundorder = content.refundorder;
body.shouhuo = content.shouhuo;
body.shanchuorder = content.shanchuorder;
body.quhuo = content.quhuo;
body.teamList = content.teamList;
Page(body)