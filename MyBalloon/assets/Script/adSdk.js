const adversion ="1.0.1";
// 固定参数值
const adtype = 1;
var ver = '1.0.0';
const consturl = "https://mpa.blyule.com/adcenter/wxmngame";
const consturl2 = "https://mpa.blyule.com/adcenter/tpwxmngame";


var adInfo = '';//获取到的广告信息
var adUserInfo = '';//获取到的用户信息保存

/**
 * 获取系统类型数据参数值   字符串
 */
var sysinfo = ""; //设备信息相关的拼接字符串
const getSysInfoStr = (calback) => {
  wx.getSystemInfo({
    success: function (res) {
      const wxversion = res.version;
      const sdkv = res.SDKVersion;
      const platform = res.platform;
      const system = res.system;
      const srw = res.screenWidth;
      const srh = res.screenHeight;
      const model = res.model;
      var sysinfo = "&wxversion=" + wxversion
        + "&sdkv=" + sdkv
        + "&platform=" + platform
        + "&system=" + system
        + "&srw=" + srw
        + "&srh=" + srh
        + "&model=" + model;
      calback(sysinfo); //获取成功后的回调函数
    }
  })
}

/**
 * 发送请求
 */
const requestLogUrl = url => {
  console.log("请求url")
  console.log(url)
  wx.request({
    url: url, //仅为示例，并非真实的接口地址
    data: {},
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
    }
  })
}


/**
 *  通用参数 整合参数值到url中    ver,adtype,adUserInfo,系统信息 (用于日志)
 */
const UrlString = (adUserInfo, callback) => {
  var placeid = adUserInfo.placeid;
  var appid = adUserInfo.appid;
  var appwxuserid = adUserInfo.appwxuserid;
  var appwxusername = adUserInfo.appwxusername;
  var paraStr = "&placeid=" + placeid + "&appid="
    + appid + "&appwxuserid=" + appwxuserid + "&appwxusername=" + appwxusername;
  const time = new Date().getTime();
  var url = "&ver=" + ver;
  url += "&adtype=" + adtype;
  url += paraStr;
  url += "&time=" + time;
  console.log(sysinfo)
  if (!sysinfo || sysinfo == '') { //是否以及获取到设备信息
    getSysInfoStr(function (sysinfopara) {
      sysinfo = sysinfopara;
      url += sysinfopara;
      callback(url);
      return url;
    })
  } else {  //获取到，直接调用回调函数返回
    url += sysinfo;
    callback(url);
    return url;
  }

}
// 

/**
 *  发送日志 2,4,10   evt + adinfo.appendInfo + UrlString
 */
const sendLog = (evt, adUserInfo, adinfo) => {
  UrlString(adUserInfo, function (urlpara) {
    var url = consturl;
    url += "?evt=" + evt;
    console.log("sendLog", url)
    if (adinfo && adinfo.appendInfo) {
      url += adinfo.appendInfo;
    }
    url += urlpara;
    requestLogUrl(url);
  });

}

/**
 * 获取广告信息
 *传入参数adUserInfo{} 以及回调函数 evt 1
 */
const creatAdInfo = (adUserInfopara, callback) => {
  // 创建广告时保存用户传递的信息
  adUserInfo = adUserInfopara;
  // 发送请求日志 
  UrlString(adUserInfo, function (urlpara) {
    var url = consturl;
    url += "?evt=" + 1;
    url += urlpara;
    console.log(url)
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // sdk成功展现
        adInfo = res.data.datas[0];
        if (!adInfo){
          return;
        }
        callback(adInfo)
      }, fail: function () {
        // sdk请求广告 失败
        sendLog(2, adUserInfo);
      }
    })
  })
}

/**
 * 展示日志 4
 *传入参数adinfo{}
 */
const adshowlog = (adInfo) => {
  console.log('zhanshi')
  console.log(adUserInfo)
  var placeid = adUserInfo.placeid;
  var appid = adUserInfo.appid;
  var appwxuserid = adUserInfo.appwxuserid;
  var appwxusername = adUserInfo.appwxusername;
  // 成功展示图片时发送日志
  console.log(adInfo)
  if (adInfo && adInfo.appendInfo) {
    sendLog(4, adUserInfo, adInfo);
  } else {
    sendLog(4, adUserInfo);
  }
}

/** 
 * 跳转到其它小程序
 *传入参数adinfo{}
 */
const adjump = (adInfo) => {
  console.log("跳转")
  console.log(adUserInfo)
  console.log(adInfo)

  var targetWXMGAppid = adInfo.targetWXMGAppid;
  var targetWXMGPath = adInfo.targetWXMGPath;
  var skipWXMPAppid = adInfo.skipWXMPAppid;
  var skipWXMPPath = adInfo.skipWXMPPath;
  console.log(skipWXMPAppid, skipWXMPPath)
  // 没有的中间跳转小程序设置默认的小程序
  if (!skipWXMPAppid || !skipWXMPPath) {
    // return;
    skipWXMPAppid = "wx7f442f6a3f87b842";
    skipWXMPPath = "/pages/index/index";
  }
  if (adInfo && adInfo.appendInfo) {
    sendLog(10, adUserInfo, adInfo);
  } else {
    // sdk普通点击 日志
    sendLog(10, adUserInfo);
  }
  // 成功取到url之后进行跳转。
  getPathUrlString(adUserInfo, adInfo, function (url) {
    var logurl = base64encode(url);
    console.log("跳转前去的logurl")
    // path中缺少evt,time以及openid     添加跳转的目标游戏，添加一个adSdkTag识别（可以进行判断是否接入SDK）
    if (skipWXMPPath.indexOf('?') > -1) {
      skipWXMPPath += "&adSdkTag=" + "adSdkTag" + "&targetWXMGAppid=" + targetWXMGAppid + "&targetWXMGPath=" + targetWXMGPath + "&logurl=" + logur;
    } else {
      skipWXMPPath += "?adSdkTag=" + "adSdkTag" + "&targetWXMGAppid=" + targetWXMGAppid + "&targetWXMGPath=" + targetWXMGPath + "&logurl=" + logurl;
    }
    // if (targetWXMGPath.indexOf('?') > -1) {
    //   targetWXMGPath += "&adSdkTag=" + "adSdkTag" + "&logurl=" + logur;
    // } else {
    //   targetWXMGPath += "?adSdkTag=" + "adSdkTag" + "&logurl=" + logurl ;
    // }
    console.log("-----------")
    console.log(skipWXMPPath)
    wx.navigateToMiniProgram({
      appId: skipWXMPAppid,
      path: skipWXMPPath,
      extraData: {
        open: 'happy'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功  
        // sdk广告点击
        console.log('跳转其它小程序成功');
      }, fail: function (err) {
        console.log('跳转失败');
        console.log(err);
      }
    })
  });



}

//  获取跳转到的小程序里面携带的logurl   adUserInfo，adinfo 系统信息
const getPathUrlString = (adUserInfo, adinfo, callback) => {
  // 中传递 参数
  var placeid = adUserInfo.placeid;
  var appid = adUserInfo.appid;
  var appwxuserid = adUserInfo.appwxuserid;
  var appwxusername = adUserInfo.appwxusername;
  var paraStr = "&placeid=" + placeid + "&appid="
    + appid + "&appwxuserid=" + appwxuserid + "&appwxusername=" + appwxusername;
  var url = '';
  url = "ver=" + ver;
  url += paraStr;
  if (adinfo && adinfo.appendInfo) {
    url += adinfo.appendInfo;
  }
  url += "&adtype=" + adtype;
  if (!sysinfo || sysinfo == '') {
    getSysInfoStr(function (sysinfopara) {
      // 初始赋值
      sysinfo = sysinfopara;
      url += sysinfopara;
      callback(url);
      return url;
    })
  } else {
    url += sysinfo;
    if (callback) {
      callback(url);
    }
    return url;
  }
}

/**
 * 到达日志  logurl,adwxuserid,sourcewxappid
 *
 */
const adarrivelog = (pathPara, adwxuserid, sourcewxappid) => {
  // 从接入SDK的跳转过来
  const time = new Date().getTime();
  if (!pathPara.sourcewxappid) {
    pathPara.sourcewxappid = sourcewxappid;
  }
  var usrePara = "evt=100" + "&adwxuserid=" + adwxuserid + '&time=' + time;
  if (pathPara && pathPara.adSdkTag && pathPara.adSdkTag == "adSdkTag" && adwxuserid) {
    var url = consturl;
    console.log(pathPara.logurl)
    console.log(base64_decode(pathPara.logurl))
    url += "?" + usrePara + "&sourcewxappid=" + pathPara.sourcewxappid + "&" + base64_decode(pathPara.logurl);;
    console.log(url)
    requestLogUrl(url);
    return url;
  } else if (pathPara && pathPara.adSdkTag == "putLink") {
    //从没有接SDK仅有链接的跳转过来,获取路径里面携带的参数，拼接发送日志。
    // appid  adcampaignid
    var url = consturl2;
    url += "?" + usrePara + "&sourcewxappid=" + sourcewxappid;
    if (pathPara.appid) {
      url += "&appid=" + pathPara.appid;
    }
    if (pathPara.adcampaignid) {
      url += "&adcampaignid=" + pathPara.adcampaignid;
    }
    // 设备信息参数
    getSysInfoStr(function (SysInfoStr) {
      if (SysInfoStr) {
        url += SysInfoStr;
        requestLogUrl(url);
        return url;
      }
    })
  }
}

/**
 * 获取用户信息成功，日志logurl,adwxuserid,adwxusername,sourcewxappid
 *
 */
const adgivelog = (pathPara, adwxuserid, adwxusername, sourcewxappid) => {
  // 从接入SDK的跳转过来
  const time = new Date().getTime();
  var usrePara = "evt=101" + "&adwxuserid=" + adwxuserid + "&adwxusername=" + adwxusername + '&time=' + time;
  if (pathPara && pathPara.adSdkTag && pathPara.adSdkTag == "adSdkTag" && adwxuserid) {
    var url = consturl;
    console.log(pathPara.logurl)
    console.log(base64_decode(pathPara.logurl))
    url += "?" + usrePara + "&sourcewxappid=" + pathPara.sourcewxappid + "&" + base64_decode(pathPara.logurl);;
    console.log(url)
    requestLogUrl(url);
    return url;
  } else if (pathPara && pathPara.adSdkTag == "putLink") {
    //从没有接SDK仅有链接的跳转过来,获取路径里面携带的参数，拼接发送日志。
    // appid  adcampaignid
    var url = consturl2;
    const time = new Date().getTime();
    url += "?" + usrePara + "&sourcewxappid=" + sourcewxappid;
    if (pathPara.appid) {
      url += "&appid=" + pathPara.appid;
    }
    if (pathPara.adcampaignid) {
      url += "&adcampaignid=" + pathPara.adcampaignid;
    }
    // 设备信息参数
    getSysInfoStr(function (SysInfoStr) {
      if (SysInfoStr) {
        url += SysInfoStr;
        requestLogUrl(url);
        return url;
      }
    })
  }
}




module.exports = {
  creatAdInfo: creatAdInfo,
  adshowlog: adshowlog,
  adjump: adjump,
  adarrivelog: adarrivelog,
  adgivelog: adgivelog
}
/**
*creatAdInfo
*/


/**
  1.adarrivelog （页面展示时进行判断从其它小程序跳转过来并且有options.adSdkTag。调用下面函数）
    传入参数pathPara(路径里面的参数options), adwxuserid（微信用户id),sourcewxappid（来源小程序appid）
    demo<
      adSdk.adarrivelog(pathPara, adwxuserid, sourcewxappid);
    >
  2.adgivelog （页面展示时进行判断从其它小程序跳转过来并且有options.adSdkTag；授权激活用户）
    传入参数pathPara(路径里面的参数options), adwxuserid, 微信用户昵称,sourcewxappid（来源小程序appid）
    demo<
      adSdk.adgivelog(pathPara, adwxuserid, adwxusername, sourcewxappid);
    >
  3.creatAdInfo调用 创建广告
    传入参数adUserInfo，callback
    adUserInfo对象
      placeid=xxxx#传，广告位id
      appid=xxxx#传，应用id
      appwxuserid=xxxx#传，微信用户id
      appwxusername=xxxx#传，微信用户昵称
      callback(adInfo)调用回调函数，传递adinfo
      {
        "adType": "1",#广告类型固定为1
        "payType": "1",
        "appendInfo": "",#此信息为展示点击上报拼接参数，直接将此信息拼接到展示，点击上报后即可
        "skipWXMPAppid": "",#中转小程序的app id
        "skipWXMPPath": "",#中转小程序的路径
        "targetWXMGAppid": "",#目标小游戏的app id
        "targetWXMGPath": "",#目标小游戏的路径
        "title": "",#小游戏的标题
        "description": "",#小游戏的描述
        "imageUrl": "",#广告图片
        "impmonUrlList": ["https://www.hao123.com/zhanshi","https://www.hao123.com/zhanshi"],#第三方展示url，当前无用
        "clkmonUrlList": ["https://www.hao123.com/dianji","https://www.hao123.com/zhanshi"]#第三方点击url，当前无用
      }
    demo<
      let adUserInfo = {
        placeid: 1,
        appid: 1,
        appwxuserid: 3,
        appwxusername: 'aaa'
      }
      adSdk.creatAdInfo(adUserInfo, function (adInfo) {
        // 代码部分
      })
    >
  4.adshowlog （成功展示后调用）
    传入参数adinfo
    demo<
      adSdk.adshowlog(adInfo);
    >
  5.adjump （点击广告跳转）
    传入参数adinfo
    demo<
      adSdk.adjump(adInfo);
    >
  
  
  1.页面展示时调用（发送到达日志）(可以先进行判断是否从其它小程序跳转过来，再进行判断是否有options.adSdkTag)；
    参数options，用户id，来源小程序id
    adSdk.adarrivelog(pathPara, adwxuserid, sourcewxappid);

  2.获得激活用户（激活用户）(从其它小程序跳转过来并且有options.adSdkTag)；
    参数options，用户id，用户名称，来源小程序id
    adSdk.adgivelog(pathPara, adwxuserid, adwxusername, sourcewxappid);


  3.首先用户调用展示广告
      adSdk.creatAdInfo(adUserInfo, function (adInfo) {
        // 代码部分此部分返回广告信息（如上），已供展示
	
	      //一般在此展示后可调用adSdk.adshowlog(adUserInfo, adInfo);
      })
	
  4.用户成功展示广告后调用
    adSdk.adshowlog(adInfo);


  5.用户点击广告时进行小程序跳转（点击）
    adSdk.adjump(adInfo);

  
 */



// 转码base64
const base64_decode = input => { // 解码，配合decodeURIComponent使用
  var base64EncodeChars =

    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  while (i < input.length) {
    enc1 = base64EncodeChars.indexOf(input.charAt(i++));
    enc2 = base64EncodeChars.indexOf(input.charAt(i++));
    enc3 = base64EncodeChars.indexOf(input.charAt(i++));
    enc4 = base64EncodeChars.indexOf(input.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output = output + String.fromCharCode(chr1);
    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }
  }
  return utf8_decode(output);
}
const utf8_decode = utftext => { // utf-8解码
  var string = '';
  let i = 0;
  let c = 0;
  let c1 = 0;
  let c2 = 0;
  while (i < utftext.length) {
    c = utftext.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if ((c > 191) && (c < 224)) {
      c1 = utftext.charCodeAt(i + 1);
      string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
      i += 2;
    } else {
      c1 = utftext.charCodeAt(i + 1);
      c2 = utftext.charCodeAt(i + 2);
      string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 &

        63));
      i += 3;
    }
  }
  return string;
}
const base64encode = (str) => {
  var base64EncodeChars =

    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
  var out, i, len;
  var c1, c2, c3;
  len = str.length;
  i = 0;
  out = "";
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt((c1 & 0x3) << 4);
      out += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += base64EncodeChars.charAt((c2 & 0xF) << 2);
      out += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    out += base64EncodeChars.charAt(c3 & 0x3F);
  }
  return out;
}