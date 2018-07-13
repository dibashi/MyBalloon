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

    goShare: function () {
        wx.shareAppMessage({
            title: "我邀请了8个好友一起PK，就差你了，赶紧来！",
            imageUrl: "http://www.youngwingtec.com/VRContent/bowuguan/res/raw-assets/Texture/shareLogo.5717b.jpg", query: "begin_share"
        });
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
        wx.login({
            success: (res) => {
                let codeInfo = res.code;
                console.log('start场景，codeInfo：--->', codeInfo);
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: 'https://bpw.blyule.com/public/index.php/index/index/getopenid?code=' + res.code,
                        data: {
                            code: res.code
                        },
                        success: (data, statusCode, header) => {
                            console.log("服务器返回的数据！！--> " + data);
                            console.log(data);
                            console.log(data.openid);
                            cc.sys.localStorage.setItem("openid", data.openid);
                        },
                    });
                }
            }
        });






        let isloaded = cc.sys.localStorage.getItem("isLoaded");
        if (isloaded == 0 || isloaded == null) {
            cc.sys.localStorage.setItem('isLoaded', 1);
            cc.sys.localStorage.setItem("bestScore", 0);

            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "user_best_score",
                score: 0,
            });
            cc.sys.localStorage.setItem("openid", 0);
            this.getUerOpenID();

            cc.sys.localStorage.setItem('gameSoundBG', 1);
            cc.sys.localStorage.setItem('diamondCount', 0);
        } else {
            cc.sys.localStorage.setItem('isLoaded', parseInt(isloaded) + 1);
        }

        this.refreshSetting();
    },

    getUerOpenID: function () {

        wx.login({
            //     success: (res) => {
            //         let codeInfo = res.code;
            //         console.log('start场景，codeInfo：--->', codeInfo);
            //         if (res.code) {
            //             //发起网络请求
            //             wx.request({
            //               url: 'https://bpw.blyule.com/public/index.php/index/index/getopenid?code=' + res.code,
            //               data: {
            //                 code: res.code
            //               },
            //               success:(data,statusCode,header) =>{
            //                 console.log("服务器返回的数据！！--> " +data);
            //                 console.log(data);
            //                 console.log(data.openid);
            //                 cc.sys.localStorage.setItem("openid",data.openid);
            //               },
            //             });
            //           } 
            //     }
            // });


            // success: (res) => {
            //     let codeInfo = res.code;
            //     console.log('start场景，codeInfo：--->', codeInfo);
            //     if (res.code) {
            //         //发起网络请求
            //         wx.request({
            //           url: 'https://bpw.blyule.com/public/index.php/index/index/getopenid',
            //           data: {
            //             code: res.code
            //           },
            //           success:(data,statusCode,header) =>{
            //             console.log("服务器返回的数据！！--> " +data);
            //             console.log(data);
            //             console.log(data.openid);
            //             cc.sys.localStorage.setItem("openid",data.openid);
            //           },
            //         });
            //       } 
            // }
        });




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
