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
  
  class Content extends AppBase {
    constructor() {
      super();
    }
    onLoad(options) {
      this.Base.Page = this;
      wx.setNavigationBarTitle({
        title: '意见反馈',
      })
      super.onLoad(options);
      this.Base.setMyData({
        contents:'',
        imglist:[],
      })
    }
    onMyShow() {
      var that = this;
  
    }
    contentsFn(e){
        this.Base.setMyData({
            contents:e.detail.value
        })
    }
    shanchu(e){
        var id = e.currentTarget.id;
        var imglist = this.Base.getMyData().imglist;
        imglist.splice(id,1);
        this.Base.setMyData({
            imglist
        })
    }
    uploadimg(e){
        var id = e.currentTarget.id;
        var imglist = this.Base.getMyData().imglist;
        this.Base.uploadImage('feedback',(ret)=>{
            if(id>=0){
                imglist[id].img=ret;
            }else {
                imglist.push({
                    img:ret
                })
            }
            this.Base.setMyData({
                imglist
            })
        })
    }
    tosave(){
        var data = this.Base.getMyData();
        var imglist = data.imglist;
        var contents = data.contents;
        if(contents==''){
            this.Base.toast('请填写反馈内容');
            return
        }
        var instapi = new InstApi();
        instapi.feedback({
            summary:contents,
            imglist:JSON.stringify(imglist)
        },(ret)=>{
            if(ret.code=='0'){
              this.Base.toast('提交成功~')
              wx.navigateBack({
                          delta: 1,
                        })
                // wx.showModal({
                //   title:'提示',
                //   content:'评价发布成功',
                //   showCancel:false,
                //   success:(res)=>{
                //     if(res.confirm){
                //         wx.navigateBack({
                //           delta: 0,
                //         })
                //     }
                //   }
                // })
            }else {
                this.Base.toast(ret.result);
            }
        },300)
    }
  
  }
  
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad;
  body.onMyShow = content.onMyShow;
  body.contentsFn = content.contentsFn;
  body.shanchu = content.shanchu;
  body.uploadimg = content.uploadimg;
  body.tosave = content.tosave;
  
  
  Page(body)