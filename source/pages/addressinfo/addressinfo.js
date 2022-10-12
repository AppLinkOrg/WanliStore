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
    ismobile(mobile){
      var that = this;
      const regex = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      console.log(mobile)
      if (mobile == '')
      {
        console.log(wx.getStorageSync('msg'))
        that.Base.setMyData({
          err_msg: '手机号不能为空'
        })
        return false
      }
      console.log(wx.getStorageSync('msg'),mobile)
      if (mobile.length !== 0 && mobile.length !== 11) {
        that.Base.setMyData({
          mobileLength: true,
          err_msg: '手机长度有误'
        })
        return false
      } else if (mobile.length !== 0 && !regex.test(mobile)) {
        that.Base.setMyData({
          mobileFormat: true,
          err_msg: '手机号有误'
        })
        return false
      }
      return true
    }
   


    formSubmit(e){
        var data = e.detail.value;
        console.log(data,'xczxczxc');
        var ismobile = this.ismobile(data.mobile);
        console.log(ismobile);
        if(!data.name){
          // console.log('2323');
          this.Base.toast('请输入姓名');
          return
        }
        if (!data.address) {
          // console.log('2323');
          this.Base.toast('请填写地址');
          return
        }
        if(this.Base.options.id>0){
            data.primary_id=this.Base.options.id;
        }
        
        console.log(data)
        data.moren = data.moren?'Y':'N';
        
        if(!ismobile){
          var msg = this.Base.getMyData().err_msg;
          this.Base.toast(msg);
        }else{
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
    select(){
      
    }
  }
  var content = new Content();
  var body = content.generateBodyJson();
  body.onLoad = content.onLoad; 
  body.onMyShow = content.onMyShow;
  body.ismobile = content.ismobile;

  body.formSubmit = content.formSubmit;
  body.select = content.select;
  
  Page(body)