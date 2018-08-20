// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        buttonAudio: {
            default: null,
            url: cc.AudioClip
        },

        AdReviveBtn: {
            default: null,
            type: cc.Button
        },

        recommendedBtn: {
            default: null,
            type: cc.Button
        },

        cancelBtn: {
            default: null,
            type: cc.Node
        },

        recommendedLabel: {
            default: null,
            type: cc.Label,
        },

        remainCountLabel: {
            default: null,
            type: cc.Label,
        },

        onWho: null,//在哪个页面上面，当当前页面消失时使得那个页面可点击

        //新需求node 审核没通过
        hideNode: {
            default: null,
            type: cc.Node,
        },

        shareImageSprite: {
            default: null,
            type: cc.Sprite,
        },

        ggImageSprite: {
            default: null,
            type: cc.Sprite,
        },

        inviteAlert: {
            default: null,
            type: cc.Prefab,
        },

        nextFriend: {
            default: null,
            type: cc.Sprite,
        },

        currentScoreLabel: {
            default: null,
            type: cc.Label,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.startFadeIn();
        this.cancelBtn.active = false;
        this.scheduleOnce(this.enableCancelBtn, 2);
        this.scheduleOnce(this.cancel, 10);

        this.defen = parseInt(cc.sys.localStorage.getItem("currentScore"));
        this.currentScoreLabel.string = "当前得分: " + this.defen;

        this.recommendedLabel.string = cc.sys.localStorage.getItem('recommendedCurrency');

        //更新今日可用复活数，首先判断现在是否为新的一天，若是直接赋予5，否则还是使用之前存储的。
        let cTime = this.currentYMD();
        let pTime = cc.sys.localStorage.getItem("lastLoadDate");
        if (cTime != pTime) {
            cc.sys.localStorage.setItem("todayAvailableCount", 5);
            cc.sys.localStorage.setItem("lastLoadDate", cTime);//若不是同一天，则更新为当前时间
        }

        //this.remainCountLabel.string = cc.sys.localStorage.getItem("todayAvailableCount");



        // //判断广告按钮是否可以点击
        // if (cc.sys.localStorage.getItem("adRevive") != "1") {
        //     this.AdReviveBtn.interactable = false;
        //     this.AdReviveBtn.node.opacity = 50;
        // }
        //cc.sys.localStorage.setItem("reviveState", "0"); //0代表未复活过，0就是 邀请好友复活，1还是邀请好友复活，2，则是广告复活

        let reviveState = cc.sys.localStorage.getItem("reviveState");

        //根据状态修改图片  下方点击按钮还要根据状态产生不同效果
        if (reviveState == 0 || reviveState == 1) {
            console.log("显示 分享好友的图片");
            this.AdReviveBtn.node.getComponent(cc.Sprite).spriteFrame = this.shareImageSprite.spriteFrame;
        } else if (reviveState == 2) {
            console.log("显示 观看广告的图片");
            this.AdReviveBtn.node.getComponent(cc.Sprite).spriteFrame = this.ggImageSprite.spriteFrame;
        } else {
            this.AdReviveBtn.interactable = false;
            this.AdReviveBtn.node.opacity = 50;
        }


        //若本局已用过，或者 今天已经不可用，或者没有复活币 注：改为本局不限次数
        // let tac = parseInt(cc.sys.localStorage.getItem("todayAvailableCount"));
        // let rc = parseInt(cc.sys.localStorage.getItem("recommendedCurrency"));
        // if (cc.sys.localStorage.getItem("recommendedRevive") != "1" || tac <= 0 || rc <= 0) {
        //     this.recommendedBtn.interactable = false;
        //     this.recommendedBtn.node.opacity = 50;
        // }

        // if (tac <= 0 || rc <= 0) {
        //     this.recommendedBtn.interactable = false;
        //     this.recommendedBtn.node.opacity = 50;
        // }


        if (cc.myballoon_isShare == 0) {
            this.hideNode.active = false;
        } else {
            this.hideNode.active = true;
        }


        this.seeNextBeyondFriend();

        this.tex = new cc.Texture2D();
    },

    seeNextBeyondFriend: function () {
        if (cc.myDebugMode) {
            let self = this;
            window.wx.postMessage({
                messageType: 9,
                currentScore: self.defen,
            });
            self.scheduleOnce(this._updateSubDomainCanvas, 1.5);
        }
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.nextFriend.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },

    //当前年月日
    currentYMD: function () {
        let dd = new Date();
        let y = dd.getFullYear();
        let m = dd.getMonth();
        let d = dd.getDate();

        return (y + "" + m + "" + d);
    },


    enableCancelBtn: function () {
        this.cancelBtn.active = true;
    },

    startFadeIn: function () {
        cc.eventManager.pauseTarget(this.node, true);

        this.node.setScale(2);
        this.node.opacity = 0;

        let cbFadeIn = cc.callFunc(this.onFadeInFinish, this);
        let actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(0.3, 255), cc.scaleTo(0.3, 1)), cbFadeIn);
        this.node.runAction(actionFadeIn);
    },

    onFadeInFinish: function () {

        cc.eventManager.resumeTarget(this.node, true);
    },

    //可以点击代表其值为1
    onRecommendedClick: function () {
        //cc.sys.localStorage.setItem("recommendedRevive", "0");

        // let tac = parseInt(cc.sys.localStorage.getItem("todayAvailableCount")) - 1;
        let rc = parseInt(cc.sys.localStorage.getItem("recommendedCurrency"));
        if (rc > 0) {
            let rc = rc - 1;
            cc.sys.localStorage.setItem("recommendedCurrency", rc);

            cc.eventManager.pauseTarget(this.node, true);
            this.onWho.getComponent("gameScene").goNewBalloon();

            let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
            let actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(0.3, 0), cc.scaleTo(0.3, 2.0)), cbFadeOut);
            this.node.runAction(actionFadeOut);
        } else {
            cc.eventManager.pauseTarget(this.node, true);
            let ss = cc.instantiate(this.inviteAlert);
            ss.setLocalZOrder(1000);
            ss.getComponent("inviteAlert").onWho = this.node;
            this.node.addChild(ss);
        }

    },




    //可以点击代表其值为1
    onGuangGaoClick: function () {

        let reviveState = cc.sys.localStorage.getItem("reviveState");

        //根据状态修改图片  下方点击按钮还要根据状态产生不同效果
        if (reviveState == 0 || reviveState == 1) {
            this.shareRevive();
        } else if (reviveState == 2) {
            cc.videoAd.show();
        }
    },

    givePrize: function () {
        console.log("给用户奖励！~~");

        cc.eventManager.pauseTarget(this.node, true);

        this.onWho.getComponent("gameScene").goNewBalloon();

        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(0.3, 0), cc.scaleTo(0.3, 2.0)), cbFadeOut);
        this.node.runAction(actionFadeOut);
    },


    shareRevive: function () {
        let self = this;
        let query_string = cc.sys.localStorage.getItem("openid");
        //console.log("准备发送请求的 query " + query_string);
        var str_imageUrl = null;
        var str_index=   Math.floor(Math.random()*2);
        var str_title = null;
        if(str_index == 0) {
            str_imageUrl = "https://bpw.blyule.com/res/raw-assets/Texture/shareImage0.5f075.jpg";
            str_title = "走开，别碰我！萌哭了";
        } else {
            str_imageUrl = "https://bpw.blyule.com/res/raw-assets/Texture/shareImage1.678a4.jpg";
            str_title = "萌翻全场，好想都抱回家!";
        } 
        
      

        wx.shareAppMessage({
            title: str_title,
            imageUrl: str_imageUrl, query: "otherID=" + query_string,
            success: (obj) => {
                console.log("分享回调成功")
                console.log(obj);

                cc.eventManager.pauseTarget(self.node, true);
                self.onWho.getComponent("gameScene").goNewBalloon();

                let cbFadeOut = cc.callFunc(self.onFadeOutFinish, self);
                let actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(0.3, 0), cc.scaleTo(0.3, 2.0)), cbFadeOut);
                self.node.runAction(actionFadeOut);
            },
            fail: (obj) => {
                console.log("分享回调失败")
                console.log(obj);
            },
            complete: (obj) => {
                console.log("分享回调默认")
                console.log(obj);
            }
        });
    },

    onCancelClick: function () {

        cc.director.loadScene("end");
    },

    onFadeOutFinish: function () {
        cc.eventManager.resumeTarget(this.onWho, true);
        this.node.destroy();
    },

    cancel: function () {

        cc.director.loadScene('end');
    },
});



