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
          info: {
              name:'',
              mobile:'',
              address:'',
              moren:'N'
          }
      })
    }
    onMyShow() {
      var that = this;
      var memberapi = new MemberApi();
      if(this.Base.options.id>0){
        memberapi.addressinfo({id:this.Base.options.id},(info)=>{
            this.Base.setMyData({
              info
            })
        })
      }
     
    }
    formSubmit(e){
        var data = e.detail.value;
        if(this.Base.options.id>0){
            data.primary_id=this.Base.options.id;
        }
        console.log(data)
        data.moren = data.moren?'Y':'N';
        var memberapi = new MemberApi();
        memberapi.addaddress(data,(ret)=>{
            if(ret.code=='0'){
                this.Base.toast('保存成功');
                wx.navigateBack({
                  delta: 0,
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
  Page(body)