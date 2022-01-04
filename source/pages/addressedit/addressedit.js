// pages/addressedit/addressedit.js 
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
    // options.id=5;
    super.onLoad(options);
    wx.showLoading({
      title: '正在加载',
    })
    var mallapi = new MallApi();
    mallapi.addressinfo({
      id: this.Base.options.id
    }, (info) => {
      console.log(info, '有东西吗')
      if (info == null) {
        this.Base.setMyData({
          name: '',
          mobile: '',
          address_name: '',
          isdefault: 'N',
          region: [],
          regionname: ''
        })
      } else {
        this.Base.setMyData({
          name: info.name,
          mobile: info.mobile,
          address_name: info.address_name,
          isdefault: info.isdefault_value,
          region: [],
          regionname: info.region
        })
      }
    });

  }
  onMyShow() {
    var that = this;
    wx.hideLoading({})

  }

  // bindRegionChange(e){
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     region: e.detail.value
  //   })
  // }
  bindRegionChange(e) {
    this.Base.setMyData({
      regionname: e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    })
  }
  bindinput(e) {
    console.log(e);
    var type = e.currentTarget.dataset.type;
    if (type == 'A') {
      this.Base.setMyData({
        name: e.detail.value
      })
    }
    if (type == 'B') {
      this.Base.setMyData({
        mobile: e.detail.value
      })
    }
    if (type == 'C') {
      this.Base.setMyData({
        address_name: e.detail.value
      })
    }
  }

  bindclear(e) {
    var id = e.currentTarget.id;
    if (id == 'A') {
      this.Base.setMyData({
        name: ""
      })
    }
    if (id == 'B') {
      this.Base.setMyData({
        mobile: ""
      })
    }
    if (id == 'C') {
      this.Base.setMyData({
        address_name: ""
      })
    }
  }

  confrim(e) {
    wx.showLoading({
      title: '正在保存',
    })
    var mallapi = new MallApi();
    var data = this.Base.getMyData();
    console.log(this.Base.options.id,'多少？')
    if (this.Base.options.id != undefined  && this.Base.options.id != null) {
    

      console.log("走这里没")
      mallapi.updatemyaddress({
        address_id:this.Base.options.id,
        name: data.name,
        mobile: data.mobile,
        isdefault: data.isdefault,
        address_name: data.address_name,
        region: data.regionname
      }, (ret) => {
        console.log(ret);
        if (ret == 0) {

          wx.hideLoading({
            success: (res) => {
              wx.navigateBack({})
            },
          })

        }
      })
    }else{
      mallapi.creataddress({
        name: data.name,
        mobile: data.mobile,
        isdefault: data.isdefault,
        address_name: data.address_name,
        region: data.regionname
      }, (ret) => {
        console.log(ret);
        if (ret.code == 0) {

          wx.hideLoading({
            success: (res) => {
              wx.navigateBack({})
            },
          })

        }
      })
    }

  }


  setdefault(e) {
    this.Base.setMyData({
      isdefault: this.Base.getMyData().isdefault == 'Y' ? 'N' : 'Y'
    })
  }

  binddelete(e) {
    console.log(e);
    var that = this;
    var mallapi = new MallApi();
    wx.showModal({
      content: '确认删除地址？',
      success: (res) => {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          mallapi.deleteaddress({
            id: that.Base.options.id
          }, (ret) => {
            if (ret.code == 0) {
              wx.navigateBack({})
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
body.confrim = content.confrim;
body.bindRegionChange = content.bindRegionChange;
body.bindinput = content.bindinput;
body.bindclear = content.bindclear;
body.setdefault = content.setdefault;
body.binddelete = content.binddelete;


Page(body)