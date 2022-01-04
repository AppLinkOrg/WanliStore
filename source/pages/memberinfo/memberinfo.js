// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { MemberApi } from "../../apis/member.api.js";
import { WechatApi } from "../../apis/wechat.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    wx.setNavigationBarTitle({
      title: '个人资料',
    })
    this.Base.setMyData({
        sexlist:[
          {name:'男',value:'1'},
          {name:'女',value:'2'},
        ],
        info:null,
        showocc:false,
    })
   
  }
  onMyShow() {
    var that = this;
    console.error(this.Base.getMyData().info,'info' ,this.Base.getMyData().info==null);
    if(this.Base.getMyData().info==null){
      var memberinfo = this.Base.getMyData().memberinfo;
      if(memberinfo.name == ''){
        memberinfo.name = memberinfo.nickName;
      }
      this.Base.setMyData({
        info:memberinfo
      })
    }
    var memberapi = new MemberApi();
    memberapi.occupation({},(occupation)=>{
      var arr = [];
      for(let item of occupation){
        if(item.check==1){
          arr.push(item.name)
        }
      }
      this.Base.setMyData({
        occupation
      })
    })
  }
  uploadimg(){
    var info = this.Base.getMyData().info;
    var that = this;
    this.Base.uploadImage("member",(ret)=>{
      info.touxiang=ret;
      that.Base.setMyData({
        info
      })
    })
  }
  changesex(e){
    var info = this.Base.getMyData().info;
    var sexlist = this.Base.getMyData().sexlist;
    var idx = e.detail.value;
    info.gender=sexlist[idx].value;
    info.gender_name=sexlist[idx].name;
    this.Base.setMyData({
      info
    })
  }
  changebirth(e){
   
    var info = this.Base.getMyData().info;
    var idx = e.detail.value;
    info.birthday=idx;
    this.Base.setMyData({
      info
    })
  }
  changeoccupation(e){
    var info = this.Base.getMyData().info;
    var occupation = this.Base.getMyData().occupation;
    var idx = e.detail.value;
    info.occupation_id=occupation[idx].id;
    info.occupation_id_name=occupation[idx].name;
    this.Base.setMyData({
      info
    })
  }
  changejiaxiang(e){
    console.log(e)
    var info = this.Base.getMyData().info;
    var idx = e.detail.value;
    info.jiaxiang=idx.join(" ");
    this.Base.setMyData({
      info
    })
  }
  nameFn(e){
    var info = this.Base.getMyData().info;
    info.name = e.detail.value;
    this.Base.setMyData({
      info
    })
  }
  xingFn(e){
    var info = this.Base.getMyData().info;
    // console.log(info,'看看111')
    info.xing = e.detail.value;
    // console.log(info,'看看222')
    // return;
    this.Base.setMyData({
      info
    })
  }
  mobileFn(e){
    var info = this.Base.getMyData().info;
    info.mobile = e.detail.value;
    // console.log(info,'电话')
    this.Base.setMyData({
      info
    })
  }
  mingFn(e){
    var info = this.Base.getMyData().info;
    info.ming = e.detail.value;
    this.Base.setMyData({
      info
    })
  }
  jianjieFn(e){
    var info = this.Base.getMyData().info;
    info.jianjie = e.detail.value;
    this.Base.setMyData({
      info
    })
  }
  formSubmit(e){
    console.log(e)
    var info = this.Base.getMyData().info;
    var data = e.detail.value;
    info.name = data.name;
    info.jianjie = data.jianjie;
    info.mobile = data.mobile;
    var arr = [];
    if(info.xihao.length>0){
      for(let item of info.xihao){
        arr.push(item.id);
      }
    }
    info.xihaoid = arr.join(',');
    var memberapi = new MemberApi();
    memberapi.updateinfo(info,(ret)=>{
      wx.navigateBack({
        delta: 0,
      })
    })
  }
  getphoneno(e){
    var that = this;
    var api = new WechatApi();
    var data = this.Base.getMyData();
    e.detail.session_key = AppBase.UserInfo.session_key;
    e.detail.openid = AppBase.UserInfo.openid;
    console.log(e.detail);
    var info = data.info;
    api.decrypteddata(e.detail, (ret) => {
      console.log(ret);
      if(ret.return!=''){
        info.mobile = ret.return.phoneNumber;

        var memberapi=new MemberApi();
    memberapi.updatemobile({
      mobile:ret.return.phoneNumber
    },(ret)=>{
      console.log(ret);
    })

        this.Base.setMyData({
          info
        })
      }
      
    });
  }
  bindshowocc(){
    var showocc = this.Base.getMyData().showocc;
    showocc = showocc?false:true;
    this.Base.setMyData({
      showocc
    })
    // if(showocc==false){
    //   this.onMyShow();
    // }
    var info = this.Base.getMyData().info;
    var occupation = this.Base.getMyData().occupation;
    for(let item of occupation){
      item.check=0;
      for(let json of info.xihao){
        if(item.id == json.id){
          item.check=1;
        }
      }
    }
    this.Base.setMyData({
      occupation
    })
  }
  choseocc(e){
    var idx = e.currentTarget.id;
    var occupation = this.Base.getMyData().occupation;
    occupation[idx].check=occupation[idx].check?false:true;
    this.Base.setMyData({
      occupation
    })
  }
  saveocc(){
    var occupation = this.Base.getMyData().occupation;
    var info = this.Base.getMyData().info;
    var arr = [];
    for(let item of occupation){
      if(item.check){
        arr.push(item);
      }
    }
    info.xihao = arr;
    this.Base.setMyData({
      info,
      showocc:false,
    })
  }
  shanchuocc(e){
    var idx = e.currentTarget.id;
    var info = this.Base.getMyData().info;
    var occupation = this.Base.getMyData().occupation;
    var id = info.xihao[idx].id;
    for(let item of occupation){
      if(item.id == id){
        item.check=0;
      }
    }
    info.xihao.splice(idx,1);
   
    this.Base.setMyData({
      info,
      occupation
    })
  }
}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow; 
body.uploadimg = content.uploadimg; 
body.changesex = content.changesex; 
body.changebirth = content.changebirth; 
body.changejiaxiang = content.changejiaxiang; 
body.changeoccupation = content.changeoccupation; 
body.formSubmit = content.formSubmit; 
body.nameFn = content.nameFn; 
body.xingFn = content.xingFn; 
body.mingFn = content.mingFn; 
body.jianjieFn = content.jianjieFn; 
body.getphoneno = content.getphoneno; 
body.choseocc = content.choseocc; 
body.bindshowocc = content.bindshowocc; 
body.saveocc = content.saveocc; 
body.shanchuocc = content.shanchuocc; 
body.mobileFn = content.mobileFn; 
Page(body)

