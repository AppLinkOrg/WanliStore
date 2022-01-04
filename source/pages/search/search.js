// pages/search/search.js
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
    // wx.setNavigationBarTitle({
    //   title: "商品详情"
    // })
    this.Base.setMyData({
      choose: 'A',keyword:''
    })
    this.bindlist();
  }
  onMyShow() {
    var that = this;
  
  }

  bindlist(){
    var mallapi = new MallApi();
    var courseapi = new CourseApi();
    var communityapi = new CommunityApi();
    var keyword=this.Base.getMyData().keyword;
    mallapi.goodslist({keyword:keyword}, (goodslist) => {
      this.Base.setMyData({ goodslist });
    }); 
    courseapi.list({keyword:keyword}, (courselist) => {
      this.Base.setMyData({ courselist });
    }); 
    communityapi.activitylist({
      keyword:keyword
    },(activitylist)=>{
      this.Base.setMyData({
        activitylist
      })
    })
  }

  bindchoose(e) {
    // wx.showLoading({
    //   title: '正在加载',
    // })
    this.Base.setMyData({
      choose: e.currentTarget.id,
    })
  }

  searchinput(e){
    this.Base.setMyData({
      keyword:e.detail.value
    })
  }
  bindsearch(e){
    this.bindlist(this.Base.getMyData().keyword);
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bindchoose = content.bindchoose;
body.searchinput = content.searchinput;
body.bindsearch = content.bindsearch;
body.bindlist = content.bindlist;

Page(body)