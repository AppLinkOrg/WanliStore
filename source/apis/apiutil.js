import {
  ApiConfig
} from 'apiconfig.js';

export class ApiUtil {

  static renamelist = [];
  static HtmlDecode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");


    s = s.replace(new RegExp("</p>", "gm"), "</p><br />");
    s = s.replace(new RegExp("\"/alucard263096/wanlistore/upload/", "gm"), "\"" + "https://cmsdev.app-link.org/Users/alucard263096/wanlistore/upload/");


    return s;
  }

  static fixRename(ret) {
    var renamelist = ApiUtil.renamelist;
    console.log("rename a");
    if (ret instanceof Array) {
      for (var i = 0; i < ret.length; i++) {
        if (ret[i].member_id != undefined && renamelist[ret[i].member_id] != undefined && renamelist[ret[i].member_id] != "") {
          ret[i].member_nickName = renamelist[ret[i].member_id];
        }
        if (ret[i].nickName != undefined && renamelist[ret[i].id] != undefined && renamelist[ret[i].id] != "") {
          ret[i].nickName = renamelist[ret[i].id];
        }
      }
    } else {
      console.log("rename b");
      if (ret.member_id != undefined && renamelist[ret.member_id] != undefined && renamelist[ret.member_id] != "") {
        ret.member_nickName = renamelist[ret.member_id].nickName;
      }
      if (ret.nickName != undefined && renamelist[ret.id] != undefined && renamelist[ret.id] != "") {
        console.log("rename c");
        ret.nickName = renamelist[ret.id];
      }
    }
    return ret;
  }

  static Toast(toastCtrl, msg) {
    let toast = toastCtrl.create({
      message: msg
    });
    toast.present();
  }

  static FormatDateTime(val) {
    return val.getFullYear() + "-" + (val.getMonth() + 1) + "-" + val.getDate()+
      " " + val.getHours() + ":" + val.getMinutes() + ":" + val.getSeconds();
  }

  static formatTime (val) {
    var formatNumber = ApiUtil.formatNumber;
    var year = val.getFullYear ()
    var month = val.getMonth () + 1
    var day = val.getDate ()
    var hour = val.getHours ()
    var minute = val.getMinutes ()
    var second = val.getSeconds ()
    
    return [year , month , day ].map (formatNumber ).join ( '-' ) + ' ' + [hour , minute , second ].map (formatNumber ).join ( ':' )
    }
    
    static formatNumber = n => {
      n = n .toString ()
      return n [ 1 ] ? n : '0' + n
      }

  static FormatDate(val) {
    return val.getFullYear() + "-" + (val.getMonth() + 1) + "-" + val.getDate();
  }

  static IsMobileNo(str) {

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    return myreg.test(str);
  }
  static FormatPercent(val) {
    val = val * 100.0;
    return val.toFixed(2) + '%';
  }
  static FormatPrice(val) {
    val = val * 1.0;
    return val.toFixed(2);
  }
  static FormatNumber(val, digits) {
    val = val * 1.0;
    return val.toFixed(digits);
  }
  static Storage = null;

  static TimeAgo(agoTime) {

    // ????????????????????????????????????????????????????????????????????????????????????????????????
    var time = (new Date()).getTime() / 1000 - agoTime;

    var num = 0;
    if (time >= 31104000) { // N??????
      num = parseInt(time / 31104000);
      return num + '??????';
    }
    if (time >= 2592000) { // N??????
      num = parseInt(time / 2592000);
      return num + '??????';
    }
    if (time >= 86400) { // N??????
      num = parseInt(time / 86400);
      return num + '??????';
    }
    if (time >= 3600) { // N?????????
      num = parseInt(time / 3600);
      return num + '?????????';
    }
    if (time > 60) { // N?????????
      num = parseInt(time / 60);
      return num + '?????????';
    }
    return '1?????????';
  }


  static fixImages(info) {
    var images = [];
    if (info.photo1 != "") {
      images.push(info.photo1);
    }
    if (info.photo2 != "") {
      images.push(info.photo2);
    }
    if (info.photo3 != "") {
      images.push(info.photo3);
    }
    if (info.photo4 != "") {
      images.push(info.photo4);
    }
    if (info.photo5 != "") {
      images.push(info.photo5);
    }
    if (info.photo6 != "") {
      images.push(info.photo6);
    }
    if (info.photo7 != "") {
      images.push(info.photo7);
    }
    if (info.photo8 != "") {
      images.push(info.photo8);
    }
    if (info.photo9 != "") {
      images.push(info.photo9);
    }
    if (info.photo10 != "") {
      images.push(info.photo10);
    }
    if (info.photo11 != "") {
      images.push(info.photo11);
    }
    if (info.photo12 != "") {
      images.push(info.photo12);
    }
    if (info.photo13 != "") {
      images.push(info.photo13);
    }
    if (info.photo14 != "") {
      images.push(info.photo14);
    }
    return images;
  }

  //???????????????
  static getweekday(date) {
    var weekArray = new Array("?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????");
    var week = weekArray[new Date(date).getDay()];
    return week;
  }

  //??????????????????
  static ages(str) {
    var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null) return false;
    var d = new Date(r[1], r[3] - 1, r[4]);
    if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
      var Y = new Date().getFullYear();
      return (Y - r[1]);
    }
    return ("??????????????????????????????");
  }

  //????????????????????????
  static get_date_time(date) {
    var date = new Date(date)
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return ApiUtil.formatTen(month) + "???" + ApiUtil.formatTen(day) + "???";
  }

  static Timeshow(agoTime) {

    // ????????????????????????????????????????????????????????????????????????????????????????????????
    var times = (new Date(agoTime)).getTime() / 1000;

    var date = agoTime.split(" ")[0];
    var daytime = agoTime.split(" ")[1];
    var num = 0;
    var nowdate = (new Date()).getFullYear()+'/'+((new Date()).getMonth()+1)+'/'+(new Date()).getDate()+' 00:00:00';
    var ling = (new Date(nowdate)).getTime() / 1000;
    var time =  times - ling;
    console.log(time)
    if(time>0){
      daytime = daytime.substring(0,5);
      return daytime;
    }
    if(time<0 && time>-31104000){
      date = date.substring(5,date.length);
      return date;
    }
    if (time <= -31104000) { // N??????
      return date;
    }
    // if (time >= 2592000) { // N??????
    //   date = date.substring(5,date.length);
    //   return date;
    // }
    // if (time >= 86400) { // N??????
    //   date = date.substring(5,date.length);
    //   return date;
    // }
    // if (time >= 3600) { // N?????????
    //   daytime = daytime.substring(0,5);
    //   return daytime;
    // }
    // if (time > 60) { // N?????????
    //   daytime = daytime.substring(0,5);
    //   return daytime;
    // }
    return date;
  }


  static daysDistance(nowdate){
      if(nowdate==undefined||nowdate==""){
         return "";
      }
      var date1 = new Date();
      // 2021-11-20
      // var date2 =new Date(nowdate); 
      var date3= nowdate.slice(5)
      var year=date1.getFullYear(); 
      var date4=new Date(year+'-'+date3); 
      var cha=date4.getTime() - date1.getTime();
      if(cha<0){
         year=year+1;
         date4=new Date(year+'-'+date3); 
      }

       console.log(year,'????????????');
      var days = Math.ceil((date4.getTime() - date1.getTime()) / (24 * 60 * 60 * 1000));
      
      return days;
  }

  static numFormat(num) {
    if (num >= 10000) {
        num = Math.round(num / 1000) / 10 + 'w'
    } else if (num >= 1000) {
        num = Math.round(num / 100) / 10 + 'k'
    }
	return num
}
static GetDistance(lat1, lng1, lat2, lng2) {
  console.log(lat1, lng1, lat2, lng2);
  var radLat1 = ApiUtil.Rad(lat1);
  var radLat2 = ApiUtil.Rad(lat2);
  var a = radLat1 - radLat2;
  var b = ApiUtil.Rad(lng1) - ApiUtil.Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // ?????????????????????;
  s = Math.round(s * 10000) / 10000; //???????????????
  s = Math.round(s * 1000) / 1; //??????????????????,??????
  //s=s.toFixed(4);
  return s;
}
static Rad(d) {
  return d * Math.PI / 180.0; //???????????????????????????????????????????????????
}
static GetMileTxt(mile) {
  console.log(mile);
  if (mile > 10000) {
    return + (mile / 1000.0).toFixed(0) + "km";
  }
  if (mile > 1000 && mile<10000) {
    return + (mile / 1000.0).toFixed(1) + "km";
  } else if (mile < 100) {
    return "100??????";
  } else {
    return "" + (mile).toString() + "m";
  }
}


}