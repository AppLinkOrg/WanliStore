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
  import {
    spelist
  } from "../../apis/spelist.js";
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
      console.log(options,'232323');
      this.Base.setMyData({
         pingfen:0,
         totalpf:5,
         imglist:[],
         contents:'',
         flag:true
      })
    }
    onMyShow() {
      var that = this;
      var orderapi = new OrderApi();
      var speList = new spelist();
      // 订单详情
      // orderapi.orderinfo({id:this.Base.options.id},(info)=>{
      //   this.Base.setMyData({
      //       info
      //   })
      // })
      // 商品详情
   
    // 查询u规格表
      speList.spelist({
        id: this.Base.options.id,
        goods_id: this.Base.options.goods_id
      }, (info) => {
        this.Base.setMyData({
          info
        });
  
      });
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
        // 将图片上传到服务器对应的文件夹里面
        this.Base.uploadImage('pingjia',(ret)=>{
          console.log(ret,'55555555');
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
        var goods_id = data.info[0].goods_id;
        var flag = data.flag;
        var guigeid = data.info[0].guige[0].id;
        if(pingfen<=0){
            this.Base.toast('请给商品评分');
            return
        }
        if(contents==''){
            this.Base.toast('请给商品填写评价');
            return
        }
        if(flag==true){
          flag=false
        }
        var orderapi = new OrderApi();
        orderapi.addpingjia({
            order_id:this.Base.options.order_id,
            content:contents,
            pingfen:pingfen,
            goods_id:goods_id,
            guigeid:guigeid,
            imglist:JSON.stringify(imglist)
        },(ret)=>{
            if(ret.code=='0'){
              this.Base.toast('评论成功~')
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
  body.formSubmit = content.formSubmit;
  body.bindpf = content.bindpf;
  body.uploadimg = content.uploadimg;
  body.shanchu = content.shanchu;
  body.contentsFn = content.contentsFn;
  body.tosave = content.tosave;
  Page(body)