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

        recommendedLabel: {
            default: null,
            type: cc.Node,
        },

        scoreLabel: {
            default: null,
            type: cc.Node,
        },

        diamondLabel: {
            default: null,
            type: cc.Node,
        },

        qqNode: {
            default: null,
            type: cc.Node,
        },

        rouletteNode: {
            default: null,
            type: cc.Node,
        },

        countDownLabel: {
            default: null,
            type: cc.Label,
        },

        roulettePre: {
            default: null,
            type: cc.Prefab,
        }
    },

    //无尽模式
    goGame: function () {
        cc.sys.localStorage.setItem('currentCheckpoint', -1);//-1无尽模式
        cc.director.loadScene('gameScene');
    },

    goShare: function () {
        let query_string = cc.sys.localStorage.getItem("openid");
        //console.log("准备发送请求的 query " + query_string);

        wx.shareAppMessage({
            title: "我邀请了8个好友一起PK，就差你了，赶紧来！",
            imageUrl: "https://bpw.blyule.com/res/raw-assets/Texture/shareImage.d561d.jpg", query: "otherID=" + query_string
        });
    },

    goRoulette: function () {
        console.log("轮盘赌启动！！");

        cc.eventManager.pauseTarget(this.node, true);
        let ss = cc.instantiate(this.roulettePre);
        ss.setLocalZOrder(1000);
        ss.getComponent("rouletteAlert").onWho = this.node;
        this.node.addChild(ss);
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

    // settingClick: function () {
    //     let gsb = cc.sys.localStorage.getItem("gameSoundBG");
    //     if (gsb == 1) {
    //         gsb = 0;
    //     } else {
    //         gsb = 1;
    //     }
    //     cc.sys.localStorage.setItem("gameSoundBG", gsb);
    //     this.refreshSetting();
    // },

    musicStoreClick: function () {
        cc.director.loadScene('music');
    },



    // use this for initialization
    onLoad: function () {

        this.myDebugMode = false;

        cc.audioEngine.stopMusic();
        this.userData = null;

        let isloaded = cc.sys.localStorage.getItem("isLoaded");
        if (isloaded == 0 || isloaded == null) {
            cc.sys.localStorage.setItem('isLoaded', 1);
            cc.sys.localStorage.setItem("bestScore", 0);
            if (this.myDebugMode) {
                window.wx.postMessage({
                    messageType: 3,
                    MAIN_MENU_NUM: "user_best_score",
                    score: 0,
                });
            }

            cc.sys.localStorage.setItem("openid", "0");

            cc.sys.localStorage.setItem('gameSoundBG', 1);
            cc.sys.localStorage.setItem('diamondCount', 0);
            cc.sys.localStorage.setItem('recommendedCurrency', 0);

            //拥有的皮肤数据存储，以及当前的皮肤数据存储
            cc.sys.localStorage.setItem('qq01', 1);//默认拥有

            cc.sys.localStorage.setItem('qq02', 0);
            cc.sys.localStorage.setItem('qq03', 0);
            cc.sys.localStorage.setItem('qq04', 0);
            cc.sys.localStorage.setItem('qq05', 0);
            cc.sys.localStorage.setItem('qq06', 0);
            cc.sys.localStorage.setItem('qq07', 0);
            cc.sys.localStorage.setItem('qq08', 0);
            cc.sys.localStorage.setItem('qq09', 0);
            cc.sys.localStorage.setItem('qq10', 0);
            cc.sys.localStorage.setItem('currentSkinID', "01"); //当前使用的皮肤ID


            //拥有的音乐数据存储，以及当前使用的音乐
            cc.sys.localStorage.setItem('music01', 1);//默认拥有

            cc.sys.localStorage.setItem('music02', 0);
            cc.sys.localStorage.setItem('music03', 0);
            cc.sys.localStorage.setItem('music04', 0);
            cc.sys.localStorage.setItem('currentMusicID', "01"); //当前使用的音乐ID

            //初始化用户的登陆日期
            cc.sys.localStorage.setItem("lastLoadDate", this.currentYMD());
            cc.sys.localStorage.setItem("todayAvailableCount", 5);

            //记录玩家当前玩到的关卡  从第一关开始 1代表第一关
            cc.sys.localStorage.setItem("dangQianGuanKa", 1);
        } else {
            cc.sys.localStorage.setItem('isLoaded', parseInt(isloaded) + 1);
        }
        this.getUerOpenID();
        // this.refreshSetting();
        this.loadQQAndTail();//根据当前气球索引加载气球皮肤以及尾巴颜色
        this.recommendedLabel.getComponent(cc.Label).string = cc.sys.localStorage.getItem('recommendedCurrency');
        this.scoreLabel.getComponent(cc.Label).string = cc.sys.localStorage.getItem("bestScore");
        this.diamondLabel.getComponent(cc.Label).string = cc.sys.localStorage.getItem("diamondCount");


        this.rouletteInitLogic();
        this.schedule(this.refreshrecommended, 4);
    },

    //！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
    //！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
    //这个函数 要在玩家轮盘赌结束后调用一次，那一次会刷新玩家的时间
    rouletteInitLogic: function () {
        //1读取上次登陆距离1970的毫秒数 d1
        //2现在时间的距离1970的毫秒数   d2
        //3 两者的差值 dx = (d2-d1)/1000>(4*60*60) 玩家可以再次领取
        //4 差值弱小于，则剩余（4*60*60）-（d2-d1)/1000秒数 赋予一个变量
        //5 定时器一秒调用一次，一次让这个变量减一，然后把变量的值转化为时分秒 赋予label上

        //根据时间差来设置btn是否可点击
        let d3 = parseInt(cc.sys.localStorage.getItem('ggTime'));//轮盘赌广告结束时的时间（领取过后才赋值！）
        console.log(cc.sys.localStorage.getItem('ggTime'));
        console.log(d3);
        if (d3 == null || typeof d3 == undefined || isNaN(d3)) {
            d3 = Date.now();//1970 年 1 月 1日午夜与当前日期和时间之间的毫秒数。
            cc.sys.localStorage.setItem("ggTime", d3);
        }
        let d4 = parseInt(Date.now());

        this.dxGG = parseInt((d4 - d3) * 0.001);
        // cc.log("aaaa  " +this.dxLQ);
        if (this.dxGG > (1 * 60)) {//超过半个小时
            this.rouletteNode.getComponent(cc.Button).interactable = true;
            this.rouletteNode.color = cc.hexToColor("#FFFFFF");
            this.countDownLabel.node.active = false;
        } else {
            this.dxGG = 1 * 60 - this.dxGG;
            this.rouletteNode.getComponent(cc.Button).interactable = false;
            this.rouletteNode.color = cc.hexToColor("#2B3466");
            this.countDownLabel.node.active = true;
            this.setTimeToLabel(this.dxGG, this.countDownLabel);
            //   this.schedule(this.countdownFUN,this,1,this.dxLQ);

            this.schedule(this.countdownFUNGG, 1);
        }
    },

    setTimeToLabel: function (dx, label) {
        //dx-->29分54秒
        let m = parseInt(dx / 60);
        let s = parseInt(dx - (60 * m));

        label.string = m + "分" + s + "秒";
    },

    countdownFUNGG: function () {

        this.dxGG = this.dxGG - 1;

        this.setTimeToLabel(this.dxGG, this.countDownLabel);
        if (this.dxGG <= 0) {
            this.rouletteNode.getComponent(cc.Button).interactable = true;
            this.rouletteNode.color = cc.hexToColor("#FFFFFF");
            this.countDownLabel.node.active = false;
            this.unschedule(this.countdownFUNGG);
        }
    },

    loadQQAndTail: function () {
        let qqCurrentID = cc.sys.localStorage.getItem("currentSkinID");//获得当前气球索引，然后加载他的图片，设置相应的尾巴颜色
        let addres = "qqTex/QQ";
        //预留， 这里根据索引修改尾巴颜色！！！！！
        switch (qqCurrentID) {
            case "01":
                this.qqNode.getChildByName("tail").color = cc.hexToColor("#FFFFFF");
                break;
            case "02":
                this.qqNode.getChildByName("tail").color = cc.hexToColor("#B9B9B9");
                break;
            case "03":
                this.qqNode.getChildByName("tail").color = cc.hexToColor("#FFEC0C");
                break;
            case "04":
                this.qqNode.getChildByName("tail").color = cc.hexToColor("#92FF88");
                break;
            case "05":
                this.qqNode.getChildByName("tail").color = cc.hexToColor("#FF9C9C");
                break;
            case "06":
                this.qqNode.getChildByName("tail").color = cc.hexToColor("#77D3FF");
                break;
            case "07":
                this.qqNode.getChildByName("tail").color = cc.hexToColor("#F577FF");
                break;
            case "08":
                this.qqNode.getChildByName("tail").color = cc.hexToColor("#FF7575");
                break;
            case "09":
                this.qqNode.getChildByName("tail").color = cc.hexToColor("#FF8C6E");
                break;
            case "10":
                this.qqNode.getChildByName("tail").color = cc.hexToColor("#FAFDAB");
                break;
        }

        //cc.log("addres --->" + addres);
        let self = this;
        cc.loader.loadRes(addres, cc.SpriteAtlas, function (err, atlas) {
            self.qqNode.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('qq' + qqCurrentID);
        });
    },

    //当前年月日
    currentYMD: function () {
        let dd = new Date();
        let y = dd.getFullYear();
        let m = dd.getMonth();
        let d = dd.getDate();

        return (y + "" + m + "" + d);
    },



    //从服务器获得用户的推荐奖励，并刷新在界面上
    refreshrecommended: function () {
        let self = this;
        let openid = cc.sys.localStorage.getItem("openid");
        if (openid == "0") {
            return;
        }

        if (this.myDebugMode) {
            wx.request({
                url: 'https://bpw.blyule.com/public/index.php/index/index/getprise?userid=' + openid,
                data: {
                    userid: openid,
                },
                success: (obj, statusCode, header) => {
                    console.log("成功获得服务器那边的用户奖励数据！！！！ 服务器返回的数据！！--> ");
                    console.log(obj);
                    if (obj.data.code > 0) {
                        let rc = parseInt(cc.sys.localStorage.getItem('recommendedCurrency')) + obj.data.code;
                        cc.sys.localStorage.setItem('recommendedCurrency', rc);
                        self.recommendedLabel.getComponent(cc.Label).string = rc;
                    }
                },
            });
        }
    },


    getUerOpenID: function () {
        if (!this.myDebugMode) {
            return;
        }

        // console.log("getUserOpenID!");
        let self = this;
        self.openid = cc.sys.localStorage.getItem("openid");
        if (self.openid == "0") {//保证用户是第一次进游戏
            // console.log("发送wx.login请求!");
            wx.login({
                success: (res) => {
                    let codeInfo = res.code;
                    //console.log('start场景，codeInfo：--->', codeInfo);
                    if (res.code) {
                        //发起网络请求
                        wx.request({
                            url: 'https://bpw.blyule.com/public/index.php/index/index/getopenid?code=' + res.code,
                            data: {
                                code: res.code,
                            },
                            success: (obj, statusCode, header) => {
                                // console.log("请求openid,服务器返回的数据！！--> " + obj);
                                // console.log(obj.data.openid);

                                self.openid = obj.data.openid;
                                cc.sys.localStorage.setItem("openid", obj.data.openid);//之所以要存，是在分享的时候放入query中
                                //微信官方文档那里写的调用函数是getLaunchInfoSync，但是根本搜不到这个API，应该是下面这个。
                                var launchOption = wx.getLaunchOptionsSync();
                                //  console.log(launchOption);
                                //  self.otherOpenIDLabel.string = JSON.stringify(launchOption.query) + "query.otherID-->" + launchOption.query.otherID;

                                if (launchOption.query.otherID == null || launchOption.query.otherID == undefined) {
                                    launchOption.query.otherID = 0;
                                }
                                // console.log("看下 自己的openid 和 推荐方的openid");
                                // console.log(self.openid);
                                // console.log(launchOption.query.otherID);
                                wx.request({
                                    url: 'https://bpw.blyule.com/public/index.php/index/index/add?userid=' + self.openid + "&" + "cuid=" + launchOption.query.otherID,
                                    data: {
                                        userid: self.openid,
                                        cuid: launchOption.query.otherID,
                                    },
                                    success: (data, statusCode, header) => {
                                        //  console.log("添加用户成功！ 服务器返回的数据！！--> ");
                                        //  console.log(data);

                                        //  console.log("看下自己的openid数据！！--> ");
                                        //  console.log(self.openid);
                                    },
                                });


                            },
                        });
                    }
                }
            });
        }//end if



    },

    start() {
        //这个有问题 因为没有openid 所以。。
        // wx.showShareMenu();
        // wx.onShareAppMessage(function () {
        //     // 用户点击了“转发”按钮
        //     return {
        //         title: '我邀请了8个好友一起PK，就差你了，赶紧来！',
        //         imageUrl: "https://bpw.blyule.com/res/raw-assets/Texture/shareImage.d561d.jpg",

        //     }
        // });
    },

    // refreshSetting: function () {
    //     let gsb = cc.sys.localStorage.getItem("gameSoundBG");

    //     // cc.log(gsb + "  !!");
    //     if (gsb == 1) {
    //         this.settingNode.getComponent(cc.Sprite).spriteFrame = this.settingOnImg.getComponent(cc.Sprite).spriteFrame;
    //     } else {
    //         this.settingNode.getComponent(cc.Sprite).spriteFrame = this.settingOffImg.getComponent(cc.Sprite).spriteFrame;
    //     }
    // },

    // called every frame
    update: function (dt) {

    },
});
