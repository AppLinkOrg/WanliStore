// pages/goodstype/goodstype.js 
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
    wx.showLoading({
      title: '正在加载',
    })
    this.Base.setMyData({
      type: 'A',
      price_seq: 0,
      filtrate_id:0,
      seq_name:'seq'
    })
    wx.setNavigationBarTitle({
      title: this.Base.options.title_name
    })

    var mallapi = new MallApi();
 
    mallapi.classificationitem({
      classification_id:this.Base.options.id
    }, (typelist) => { 
      typelist.unshift({
        id: 0,
        name: '全部'
      }) 
      this.Base.setMyData({
        typelist
      })
    });

    this.goodsfiltrate();


  }
  onMyShow() {
    var that = this;
 

   


  }

  choosetype(e) {
    var type = e.currentTarget.id;
    var price_seq = this.Base.getMyData().price_seq;
    var seq_name=this.Base.getMyData().seq_name;
    if (type == 'C' && (price_seq == 0||price_seq == 1 ||price_seq == 3)) {
      price_seq = 2,seq_name='price'
    } else if (type == 'C' && price_seq == 2) {
      price_seq = 3,seq_name='price desc'
    } 
    else if (type == 'B'){
      price_seq = 1,seq_name='sales'
    } else if (type == 'A'){
      price_seq = 0,seq_name='seq'
    }

    this.Base.setMyData({
      type: type,
      price_seq,
      seq_name:seq_name
    })

    this.goodsfiltrate();
  }

  bindfiltrate(e) {
    this.Base.setMyData({
      filtrate_id: e.currentTarget.id
    })
    this.goodsfiltrate();
  }

  goodsfiltrate(){
    var mallapi = new MallApi();
    var filtrate_id=this.Base.getMyData().filtrate_id;
    var seq_name=this.Base.getMyData().seq_name;
    mallapi.filtrate({
      filtrate_id:filtrate_id,
      seq_name:seq_name,
      classification_id:this.Base.options.id
    },(list)=>{
      console.log(list,'列表');
      wx.hideLoading({ 
      })
      this.Base.setMyData({
        goodslist:list
      })
    })
  }


}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.choosetype = content.choosetype;
body.bindfiltrate = content.bindfiltrate;

body.goodsfiltrate = content.goodsfiltrate;

Page(body)