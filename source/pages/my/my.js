import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  
  }
  onMyShow() {
    var that = this;
  }
  notdata() {
    this.Base.toast('暂未开放');
  }
  todetail(e){
    
  }
}


var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.notdata = content.notdata;
body.todetail = content.todetail;

Page(body)