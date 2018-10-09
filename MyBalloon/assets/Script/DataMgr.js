import adSdk from 'adSdk';
const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class DataMgr extends cc.Component {

    //第三方sdk 用到的东西
    adUserInfo = {
        placeid: "1006",
        appid: "wx53cdc20078b402a5",
        appwxuserid: 3,
        appwxusername: 'aaa'
    };

    adInfo = null;




    initData() {
        //版本比较 是否重置数据
        cc.dataMgr.nickName = cc.sys.localStorage.getItem("nickName");
        if (!cc.dataMgr.nickName)
            cc.dataMgr.nickName = "***";

        console.log("--- DataMgr 获取启动参数 并对参数进行存储 ---");
        let obj = wx.getLaunchOptionsSync();
        console.log(obj);
        let query = obj.query;
        console.log("--- 重要信息 游戏 query --" + query);
        if (query)
            this.query = query;
        if (obj.referrerInfo && obj.referrerInfo.appId)
            this.scoreAppId = obj.referrerInfo.appId;
    }

    createAdInfo(createPos) {
        this.openid = cc.sys.localStorage.getItem("openid");
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



                let nodeStart = cc.find("Canvas");
                if (nodeStart && nodeStart.active) {
                    let startJs = nodeStart.getComponent("start");
                    if (startJs) {
                        startJs.refreshMore();
                    }
                }

            });
        }
    }

    adJump() {
        if (!this.adInfo) {
            console.log(this.adInfo);
            //return;

            this.adInfo = {};
        }
        adSdk.adjump(this.adUserInfo, this.adInfo);
    }

    adshowlog() {
        console.log("-- adshowlog --");

        if (!this.isShowLog) {
            this.isShowLog = true;
            console.log("-- adshowlog 展示成功 --");
            console.log(this.adInfo);
            if (!this.adInfo)
                this.adInfo = {};
            adSdk.adshowlog(this.adUserInfo, this.adInfo);
        }

    }

    adarrivelog() {
        console.log("-- adarrivelog -- " + this.scoreAppId);
        console.log(this.query);
        console.log("this.openid--> " + this.openid);
        if (this.query && this.query.adSdkTag)
            adSdk.adarrivelog(this.query, this.openid, this.scoreAppId);
    }

    adgivelog() {
        console.log("-- adgivelog -- " + this.scoreAppId);
        console.log(this.query);
        console.log("this.openid--> " + this.openid);
        if (this.query && this.query.adSdkTag)
            adSdk.adgivelog(this.query, this.openid, this.nickName, this.scoreAppId);
    }

    //------ 账号奖励等相关 ------



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
                    nodeN.zIndex = 10000;
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