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
    MemberApi
  } from "../../apis/member.api.js";
  
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
      //options.id=5;
      super.onLoad(options);
      wx.setNavigationBarTitle({
        title: "地址管理"
      })
      this.Base.setMyData({
        tihuoren_id:this.Base.options.id==undefined?0:this.Base.options.id,
        choseid: this.Base.options.id==undefined?0:this.Base.options.id,
        chosetype: this.Base.options.chosetype
      })
    }
    onMyShow() {
      var that = this;
      var memberapi = new MemberApi();
      memberapi.addresslist({},(list)=>{
          this.Base.setMyData({
              list
          })
      })
    }
    chosedz(e){
        var id = e.currentTarget.id;
        this.Base.setMyData({
            choseid:id
        })
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.setData({
             address_id:id
           })
           wx.navigateBack({//返回
             delta: 1
           })
    }
    chosethr(e){
      var id = e.currentTarget.id;
      this.Base.setMyData({
        tihuoren_id:id
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      prevPage.setData({
          tihuoren_id:id
         })
         wx.navigateBack({//返回
           delta: 1
         })
  }
    deleteaddress(e){
      var id = e.currentTarget.id;
      var memberapi = new MemberApi();
      var that = this;
      wx.showModal({
        title:'提示',
        content:'地址有改变，是否要改变地址',
        success:(res)=>{
          if(res.confirm){
            memberapi.deleteaddress({id:id},(ret)=>{
              if(ret.code=='0'){
                that.Base.toast('删除成功');
                that.onMyShow();
              }else {
                that.Base.toast(ret.result);
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
  body.chosedz = content.chosedz;
  body.deleteaddress = content.deleteaddress;
  body.chosethr=content.chosethr;
  Page(body)