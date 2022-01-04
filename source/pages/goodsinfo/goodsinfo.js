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
import { WechatApi } from "../../apis/wechat.api.js";
import { MemberApi } from "../../apis/member.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;

    super.onLoad(options);
    // wx.setNavigationBarTitle({
    //   title: "商品详情"
    // })
wx.showLoading({
  title: '正在加载',
})
    this.Base.setMyData({
      nowindex: 1,
      overlay: false,
      specificationsinfo: null,
      number: 1,
      choose_specifications:"",
      specifications_name:'',
      chooseid_item:[]
    })

    var mallapi = new MallApi();
    mallapi.goodsinfo({
      id: this.Base.options.id
    }, (info) => {
      var typelist = info.specifications_type;
      for (var i = 0; i < typelist.length; i++) {
        var list = typelist[i].specificationslist;
        typelist[i].choose = 0;
        typelist[i].specifications = '';
        // for(var j=0;j<list.length;j++){
        //   list[j].choose=false;
        // }
      }

      mallapi.selectcoupon({
        // classification_id: info.classification_id
      }, (coupon) => {
        this.Base.setMyData({
          info,couponlist:coupon
        });
        wx.hideLoading({ 
        })
      })
      
         
     
    });

  }
  onMyShow() {
    var that = this; 
  }

  getphoneno(e){
    var that = this;
    var api = new WechatApi();
    var memberinfo = this.Base.getMyData().memberinfo;
    e.detail.session_key = AppBase.UserInfo.session_key;
    e.detail.openid = AppBase.UserInfo.openid;
    console.log(e.detail);

    api.decrypteddata(e.detail, (ret) => {
      console.log(ret);
      if(ret.return!=''){
        // var mobile=ret.return.phoneNumber;
        var memberapi=new MemberApi();
        memberinfo.mobile=ret.return.phoneNumber;
        
        memberapi.updatemobile({
          mobile:ret.return.phoneNumber
        },(ret)=>{
          console.log(ret);
        })

        this.Base.setMyData({
          memberinfo
        })
      }
      
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
    var name = e.currentTarget.dataset.name;

    var index = e.currentTarget.dataset.index;
    var info = this.Base.getMyData().info;
    var chooseid_item = [];
    var choose_specifications="";
    var specificationsinfo = this.Base.getMyData().specificationsinfo;


    if (info.specifications_type[index].choose != 0 && info.specifications_type[index].choose == guige_id) { //再次点击取消选择
      info.specifications_type[index].choose = 0;
      specificationsinfo = null;
    } else {
      info.specifications_type[index].choose = guige_id;
      info.specifications_type[index].specifications=name;
    }

    // 检查有无未选规格
    for (var i = 0; i < info.specifications_type.length; i++) {
      if (parseInt(info.specifications_type[i].choose) == 0) {
        num++
      } else {
        chooseid_item.push(info.specifications_type[i].choose);
        choose_specifications+=info.specifications_type[i].specifications+' ';
      }
    }
    // console.log(choose_specifications);
    if (num == 0) { // 规格选择完全后返回商品图片及价格
      var mallapi = new MallApi();
      mallapi.selectprice({
        chooseid: chooseid_item
      }, (ret) => {
        this.Base.setMyData({
          specificationsinfo: ret.return,choose_specifications:choose_specifications,chooseid_item:chooseid_item
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
  bindconfrim() {
    var info = this.Base.getMyData().info;
    var complete = true;
    //判断是否未选择规格，未选择则提示
    for (var i = 0; i < info.specifications_type.length; i++) { 
      if (info.specifications_type[i].choose == 0) {
        this.Base.toast("请选择" + info.specifications_type[i].name);
        complete = false;
        break;
      }
    }

    //选择完成保存选择参数关闭弹窗
    if (complete) {
      this.Base.setMyData({
      specifications_name:this.Base.getMyData().choose_specifications,overlay: false
      })
      return true
    }else{
      return false
    }

  }


  bindaddcarts(e){
    var that=this;
    if(this.Base.getMyData().info.ispresell_value=='Y'){

      wx.showModal({
        title: '提示',
        content: '此商品为预售商品，预计1个月发货，是否确认购买？',
        success: function (res) {
          if (res.confirm) {
            that.readaddcart();
          } else {
            console.log('取消')
          }
        }
      })
    }else{
      that.readaddcart();
    }


    // console.log(this.bindconfrim(),'返回没')
  }

  readaddcart(){

    // this.bindconfrim();
    var mallapi = new MallApi();
    console.log(this.Base.getMyData().number,'数量')
    // return;
    if (this.bindconfrim()) {
      mallapi.addcarts({ 
        goods_id: this.Base.options.id,
        number:this.Base.getMyData().number,
        specifications_name:this.Base.getMyData().choose_specifications,
        specifications:this.Base.getMyData().chooseid_item,
        unitprice:this.Base.getMyData().specificationsinfo.price,
        coverimg:this.Base.getMyData().specificationsinfo.img
      }, (ret) => {
        console.log(ret);
        if (ret.code==0) {
          this.Base.toast("添加成功~")
        }
      })

    }
  }

  bindbuy(e){
    var that=this;
    if(this.Base.getMyData().info.ispresell_value=='Y'){

      wx.showModal({
        title: '提示',
        content: '此商品为预售商品，预计1个月发货，是否确认购买？',
        success: function (res) {
          if (res.confirm) {
            that.realbuy();
          } else {
            console.log('取消')
          }
        }
      })
    }else{
      that.realbuy();
    }
  }


  realbuy(e){
    var cartslist=[];

   
    // var amount=parseInt(data.info.price)*parseInt(data.number);
    
    // console.log(amount.toFixed(2),data.specificationsinfo.price,parseFloat(data.specificationsinfo.price),parseInt(data.number));
    // return;
    if (this.bindconfrim()) {
      var data =this.Base.getMyData();
    var amount=(data.specificationsinfo.price*parseInt(data.number)).toFixed(2);
      cartslist.push({
        id:1,
        count:data.number,
        // goods_coverimage:data.info.coverimage,
        specifications_name:this.Base.getMyData().choose_specifications,
        specifications:this.Base.getMyData().chooseid_item,
        coverimg:this.Base.getMyData().specificationsinfo.img,
        goods_id:data.info.id,
        goods_name:data.info.name,
        unitprice:data.specificationsinfo.price, 
        goods_original_price:data.info.original_price,
        goods_giving_ratio:data.info.giving_ratio,
      });

      console.log(cartslist);
  
      cartslist=JSON.stringify(cartslist);
      
      // this.Base.setMyData({ 
      //   specificationsinfo: null,
      //   number: 1,
      //   specifications_name:''
      // })

      // return;
      wx.navigateTo({
        url: '/pages/confirmorder/confirmorder?cartslist='+cartslist+'&amount='+amount,
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
body.bindaddcarts = content.bindaddcarts;
body.bindbuy = content.bindbuy;
body.readaddcart = content.readaddcart;
body.realbuy = content.realbuy;
body.getphoneno = content.getphoneno;

Page(body)