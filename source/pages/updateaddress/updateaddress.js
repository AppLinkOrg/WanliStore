// pages/updateaddress/updateaddress.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
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
    

  }
  onMyShow() {
    var that = this; 
    var mallapi = new MallApi();

    mallapi.addressinfo({id:this.Base.options.id},(info)=>{
      
      mallapi.addresslist({},(list)=>{
        this.Base.setMyData({
          list,info
        })
        wx.hideLoading({ 
        })
      })
 
    })
  }
  bindchoose(e){
    this.Base.setMyData({
      address_id:e.currentTarget.id
    })
  }

  confirm(e){
    var mallapi=new MallApi();
    var that=this;

    wx.showModal({ 
      content: "确认提交修改",
      success: (res) => {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          mallapi.updateaddress({
            address_id:that.Base.getMyData().address_id,
            id:that.Base.options.order_id
          },(ret)=>{
               if (ret.code==0) {
                  wx.navigateBack({
                    
                  })
               }
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
body.confirm = content.confirm;
body.bindchoose = content.bindchoose;
Page(body)