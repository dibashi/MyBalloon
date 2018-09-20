import adSdk from 'adSdk';
const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class DataMgr extends cc.Component {
   
    //第三方sdk 用到的东西
    adUserInfo = {
        placeid: "1003",
        appid: "1006",
        appwxuserid: 3,
        appwxusername: 'aaa'
    };

    adInfo = null;




    initData() {
        //版本比较 是否重置数据
        cc.dataMgr.nickName = cc.sys.localStorage.getItem("nickName");
        if (!cc.dataMgr.nickName)
            cc.dataMgr.nickName = "***";
    }

    createAdInfo(createPos) {
        this.openid = cc.sys.localStorage.getItem("openid")
        console.log("-- createAdInfo --" + createPos);
        if (true) {
            console.log("-- 第三方sdk C check --");
            this.adUserInfo.appwxuserid = this.openid;
            this.adUserInfo.appwxusername = this.nickName;
            console.log(cc.dataMgr.adUserInfo);
            adSdk.creatAdInfo(this.adUserInfo, function (adInfo) {
                console.log("--- 第三方 back ---");
                console.log(adInfo);
                cc.dataMgr.adInfo = adInfo;
            });
        }
    }

    adJump() {
        if (!this.adInfo) {
            console.log(this.adInfo);
            return;
        }
        adSdk.adjump(this.adUserInfo, this.adInfo);
    }

    adarrivelog(pathPara) {
        console.log("-- adarrivelog -- " + pathPara);
        adSdk.adarrivelog(pathPara, this.openid);
    }

    adgivelog(pathPara) {
        console.log("-- adgivelog -- " + pathPara);
        adSdk.adgivelog(pathPara, this.openid, this.nickName);
    }

    //------ 账号奖励等相关 ------

    getUerOpenID(reset) {
        if (CC_WECHATGAME) {
            let openid = cc.sys.localStorage.getItem("openid");
            if (!openid || openid - 1 == -1 || openid == "0" || reset) { //保证用户是第一次进游戏
                console.log("发送wx.login请求!");
                wx.login({
                    success: (res) => {
                        console.log("-- wx.login success --");
                        console.log(res);
                        if (res.code) {
                            //发起网络请求
                            wx.request({
                                url: 'https://bpw.blyule.com/game_2/public/index.php/index/index/getopenid?code=' + res.code,
                                data: {
                                    code: res.code,
                                },
                                success: (obj, statusCode, header) => {
                                    console.log("请求openid,服务器返回的数据！！--> ");
                                    console.log(obj);

                                    cc.dataMgr.openid = obj.data.openid;
                                    cc.dataMgr.adUserInfo.appwxuserid = cc.dataMgr.openid;
                                    cc.sys.localStorage.setItem("openid", obj.data.openid); //之所以要存，是在分享的时候放入query中

                                    //微信官方文档那里写的调用函数是getLaunchInfoSync，但是根本搜不到这个API，应该是下面这个。
                                    let launchOption = wx.getLaunchOptionsSync();
                                    console.log(launchOption);
                                    if (launchOption.query.otherID == null || launchOption.query.otherID == undefined) {
                                        launchOption.query.otherID = 0;
                                    }
                                    console.log("看下 自己的openid 和 推荐方的openid");
                                    console.log(cc.dataMgr.openid);
                                    console.log(launchOption.query.otherID);
                                    wx.request({
                                        url: 'https://bpw.blyule.com/game_2/public/index.php/index/index/add?userid=' + cc.dataMgr.openid + "&" + "cuid=" + launchOption.query.otherID,
                                        data: {
                                            userid: cc.dataMgr.openid,
                                            cuid: launchOption.query.otherID,
                                        },
                                        success: (data, statusCode, header) => {
                                            console.log("添加用户成功！ 服务器返回的数据！！--> ");
                                            console.log(data);
                                        },
                                    });
                                },
                            });
                        }
                    }
                });
            }
        }
    }
            // //判断登陆请求是否过期
         
    //>_< 微信大大该接口了 getUserInfo 不能直接用了
    createUserInfoButton() {
        console.log("-- 微信昵称 --" + cc.dataMgr.nickName + " -- " + this.nickName);
        if (cc.dataMgr.nickName == "aaa" || cc.dataMgr.nickName == "***" || !cc.dataMgr.nickName || cc.dataMgr.nickName == "0") {
            console.log("-- 开始 userInfoButton --");
            if (CC_WECHATGAME) {
                let nodeN = cc.find("Canvas/node_userInfo");
                if (nodeN) {
                    nodeN.active = true;
                    nodeN.zIndex =10000;
                }
                    
                console.log("-- 开始创建 --");
                let button = wx.createUserInfoButton({
                    type: 'text',
                    text: '获取昵称信息',
                    style: {
                        left: 120,
                        top: 360,//微信和 这像素不一样。。。
                        width: 120,
                        height: 40,
                        lineHeight: 40,
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        textAlign: 'center',
                        fontSize: 16,
                        borderRadius: 4
                    },
                    withCredentials: true
                });
                if (button) {
                    button.onTap((res) => {
                        console.log("-- 点击授权了 --");
                        console.log(res)

                        let nodeN = cc.find("Canvas/node_userInfo");
                        if (nodeN)
                            nodeN.active = false;
                        button.hide();

                        //微信群报错 故此修改
                        wx.getUserInfo({
                            success: function (res) {
                                console.log("-- 获取成功 userInfo --");
                                console.log(res)
                                if (res.userInfo) {
                                    cc.dataMgr.nickName = res.userInfo.nickName;
                                    cc.sys.localStorage.setItem("nickName", cc.dataMgr.nickName);
                                }
                                cc.dataMgr.createAdInfo("button");
                            },
                            fail: function (res) {
                                console.log("--- 获取用户信息失败 ---");
                                console.log(res);
                            }
                        });

                        // cc.dataMgr.nickName = res.userInfo.nickName;
                        // cc.sys.localStorage.setItem("nickName", cc.dataMgr.nickName);
                        // cc.dataMgr.createAdInfo("button");
                    });
                }
            }
        }
        else
            cc.dataMgr.createAdInfo("getUerOpenID");
    }

  
    
   
  
}