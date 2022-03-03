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
        title: "发布评价"
      })
      this.Base.setMyData({
         pingfen:0,
         totalpf:5,
         imglist:[],
         contents:''
      })
    }
    onMyShow() {
      var that = this;
      var orderapi = new OrderApi();
      orderapi.orderinfo({id:this.Base.options.id},(info)=>{
        this.Base.setMyData({
            info
        })
      })
     
    }
    bindpf(e){
        var id = e.currentTarget.id;
        var type = e.currentTarget.dataset.type;
        var pingfen = this.Base.getMyData().pingfen;
        if(type=='A'){
            pingfen=Number(pingfen)+Number(id)+1;
            this.Base.setMyData({
                pingfen:pingfen
            })
        }
        if(type=='B'){
            pingfen=Number(id)+1;
            this.Base.setMyData({
                pingfen:pingfen
            })
        }
    }
    uploadimg(e){
        var id = e.currentTarget.id;
        var imglist = this.Base.getMyData().imglist;
        this.Base.uploadImage('pingjia',(ret)=>{
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
    shanchu(e){
        var id = e.currentTarget.id;
        var imglist = this.Base.getMyData().imglist;
        imglist.splice(id,1);
        this.Base.setMyData({
            imglist
        })
    }
    contentsFn(e){
        this.Base.setMyData({
            contents:e.detail.value
        })
    }
    tosave(){
        var data = this.Base.getMyData();
        var imglist = data.imglist;
        var pingfen = data.pingfen;
        var contents = data.contents;
        var goods_id = data.info.goods_id;
        if(pingfen<=0){
            this.Base.toast('请给商品评分');
            return
        }
        if(contents==''){
            this.Base.toast('请给商品填写评价');
            return
        }
        var orderapi = new OrderApi();
        orderapi.addpingjia({
            order_id:this.Base.options.id,
            content:contents,
            pingfen:pingfen,
            goods_id:goods_id,
            imglist:JSON.stringify(imglist)
        },(ret)=>{
            if(ret.code=='0'){
                wx.showModal({
                  title:'提示',
                  content:'评价发布成功',
                  showCancel:false,
                  success:(res)=>{
                    if(res.confirm){
                        wx.navigateBack({
                          delta: 0,
                        })
                    }
                  }
                })
            }else {
                this.Base.toast(ret.result);
            }
        })
    }
  }
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad; 
  body.onMyShow = content.onMyShow;
  body.formSubmit = content.formSubmit;
  body.bindpf = content.bindpf;
  body.uploadimg = content.uploadimg;
  body.shanchu = content.shanchu;
  body.contentsFn = content.contentsFn;
  body.tosave = content.tosave;
  Page(body)