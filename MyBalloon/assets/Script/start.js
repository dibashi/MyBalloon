cc.Class({
    extends: cc.Component,

    properties: {


        settingNode: {
            default: null,
            type: cc.Node,
        },

        settingOnImg: {
            default: null,
            type: cc.Node,
        },

        settingOffImg: {
            default: null,
            type: cc.Node,
        },

    },

    //无尽模式
    goGame: function () {
        cc.sys.localStorage.setItem('currentCheckpoint', -1);//-1无尽模式
        cc.director.loadScene('gameScene');
    },

    goShare: function () {
        let query_string = cc.sys.localStorage.getItem("openid");
        console("准备发送请求的 query " + query_string);

        wx.shareAppMessage({
            title: "我邀请了8个好友一起PK，就差你了，赶紧来！",
            imageUrl: "http://www.youngwingtec.com/VRContent/bowuguan/res/raw-assets/Texture/shareLogo.5717b.jpg", query:{otherID:query_string}
        });
    },

    goRankingView: function () {
        cc.director.loadScene('RankingView');
    },

    //进入关卡选择界面
    goSelectCheckpoint: function () {
        cc.director.loadScene('selectCheckpoint');
    },

    goStore: function () {
        cc.director.loadScene('store');
    },

    settingClick: function () {
        let gsb = cc.sys.localStorage.getItem("gameSoundBG");
        if (gsb == 1) {
            gsb = 0;
        } else {
            gsb = 1;
        }
        cc.sys.localStorage.setItem("gameSoundBG", gsb);
        this.refreshSetting();
    },



    // use this for initialization
    onLoad: function () {

        cc.audioEngine.stopMusic();
        let self = this;
        this.userData = null;
        // wx.getUserInfo({
        //     openIdList: ['selfOpenId'],
        //     success: (userRes) => {
        //         self.userData = userRes.data[0];
        //         console.log('玩家自己信息：--->', this.userData);
        //     }
        // });



        // wx.onshow(res => {
        //     if(res.scene === 1044){
        //         if(res.query.from){
        //             // show pk UI
        //         }else{
        //             // todo nothing
        //         }
        //     }
        // });


        let isloaded = cc.sys.localStorage.getItem("isLoaded");
        if (isloaded == 0 || isloaded == null) {
            cc.sys.localStorage.setItem('isLoaded', 1);
            cc.sys.localStorage.setItem("bestScore", 0);

            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "user_best_score",
                score: 0,
            });
            cc.sys.localStorage.setItem("openid", "0");

            cc.sys.localStorage.setItem('gameSoundBG', 1);
            cc.sys.localStorage.setItem('diamondCount', 0);

            cc.sys.localStorage.setItem('recommendedCurrency', 0);
        } else {
            cc.sys.localStorage.setItem('isLoaded', parseInt(isloaded) + 1);
        }
        //先判断用户是否在本地服务器注册 1.若注册，判断是否本地存储他的openid，若没有就存储。
        // wx.request({
        //     url: 'https://bpw.blyule.com/public/index.php/index/index/isexit?userid=',
        //     success: (data, statusCode, header) => {
        //         console.log("用户是否在服务器注册 返回的数据！！--> " + data);
        //         console.log(data);

        //         //下面是伪代码 data.code目前是不存在的，是我自己假想的！！！因为牛龙飞现在不在。
        //         if(data.code == 1) { //有此用户
        //             self.getUerOpenID(); //其内部会判断是否本地存储他的openid，若没有会从服务器请求。
        //         } else { //没有此用户，那么用户进入游戏分两种情况，1，是被分享进入的。2，自己找地方下载的。
        //             wx.onShow(res => {
        //                 console.log("这是微信onShow返回的数据--->  ");
        //                 console.log(res);
        //                 if(res.query != null && res.query != undefined) { //query存在，表示是被分享进入的
        //                     //这里要给予分享人奖励， 需要自己的openid 和对方的openid   
        //                     wx.request({
        //                         url: 'https://bpw.blyule.com/public/index.php/index/index/add?code=' + res.code,
        //                         data: {
        //                             code: res.code
        //                         },
        //                         success: (data, statusCode, header) => {
        //                             console.log("服务器返回的数据！！--> " + data);
        //                             console.log(data);
        //                             console.log(data.openid);
        //                             cc.sys.localStorage.setItem("openid", data.openid);
        //                         },
        //                     });
        //                 } else { //用户是自己进入的，没有人分享
        //                     self.getUerOpenID();
        //                 }
        //             });
        //         }

        //     },
        // });


        // var launchOption = wx.getLaunchOptionsSync();
        // console.log(launchOption);
        // if ((LaunchOption.scene == 1007 || LaunchOption.scene == 1008) && LaunchOption.query.type == "heart") {
        //     self.m_gameEngine.reward();
        //     cc.sys.localStorage.setItem("bReward", 1)
        // }



        this.getUerOpenID();
        this.refreshSetting();
    },

    queryUserRewards:function() {
        console.log("查询用户目前奖励！");
    },

    getUerOpenID: function () {
        console.log("getUserOpenID!");
        let self = this;
        self.openid = cc.sys.localStorage.getItem("openid");
        if (self.openid == "0") {//保证用户是第一次进游戏
            console.log("发送wx.login请求!");
            wx.login({
                success: (res) => {
                    let codeInfo = res.code;
                    console.log('start场景，codeInfo：--->', codeInfo);
                    if (res.code) {
                        //发起网络请求
                        wx.request({
                            url: 'https://bpw.blyule.com/public/index.php/index/index/getopenid?code=' + res.code,
                            data: {
                                code: res.code,
                            },
                            success: (obj, statusCode, header) => {
                                console.log("请求openid,服务器返回的数据！！--> " + obj);
                                console.log(obj.data.openid);

                                self.openid = obj.data.openid;
                                cc.sys.localStorage.setItem("openid", obj.data.openid);//之所以要存，是在分享的时候放入query中

                                var launchOption = wx.getLaunchOptionsSync();
                                console.log(launchOption);
                                if (launchOption.query.otherID == null || launchOption.query.otherID == undefined) {
                                    launchOption.query.otherID = 0;
                                }
                                console.log("看下 自己的openid 和 推荐方的openid");
                                console.log(self.openid);
                                console.log(launchOption.query.otherID);
                                wx.request({
                                    url: 'https://bpw.blyule.com/public/index.php/index/index/add?userid=' + self.openid + "&" + "cuid=" + launchOption.query.otherID,
                                    data: {
                                        userid: self.openid,
                                        cuid: launchOption.query.otherID,
                                    },
                                    success: (data, statusCode, header) => {
                                        console.log("添加用户成功！ 服务器返回的数据！！--> ");
                                        console.log(data);

                                        console.log("看下自己的openid数据！！--> ");
                                        console.log(self.openid);
                                    },
                                });


                            },
                        });
                    }
                }
            });
        }



    },

    start() {
        // let bs = cc.sys.localStorage.getItem('bestScore');
        // this.setBestScore(parseInt(bs));

        // wx.showShareMenu();
        // wx.onShareAppMessage(function () {
        //     // 用户点击了“转发”按钮
        //     return {
        //         title: '我邀请了8个好友一起PK，就差你了，赶紧来！',
        //         imageUrl: "http://www.youngwingtec.com/VRContent/bowuguan/res/raw-assets/Texture/shareLogo.5717b.jpg"

        //     }
        // });


    },

    refreshSetting: function () {
        let gsb = cc.sys.localStorage.getItem("gameSoundBG");

        cc.log(gsb + "  !!");
        if (gsb == 1) {
            this.settingNode.getComponent(cc.Sprite).spriteFrame = this.settingOnImg.getComponent(cc.Sprite).spriteFrame;
        } else {
            this.settingNode.getComponent(cc.Sprite).spriteFrame = this.settingOffImg.getComponent(cc.Sprite).spriteFrame;
        }
    },

    // called every frame
    update: function (dt) {

    },
});
