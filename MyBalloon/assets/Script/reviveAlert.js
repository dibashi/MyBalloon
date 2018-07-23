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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.startFadeIn();
        this.cancelBtn.active = false;
        this.scheduleOnce(this.enableCancelBtn, 2);
        this.scheduleOnce(this.cancel, 10);

        this.recommendedLabel.string = cc.sys.localStorage.getItem('recommendedCurrency');

        //更新今日可用复活数，首先判断现在是否为新的一天，若是直接赋予5，否则还是使用之前存储的。
        let cTime = this.currentYMD();
        let pTime = cc.sys.localStorage.getItem("lastLoadDate");
        if (cTime != pTime) {
            cc.sys.localStorage.setItem("todayAvailableCount", 5);
            cc.sys.localStorage.setItem("lastLoadDate", cTime);//若不是同一天，则更新为当前时间
        }

        this.remainCountLabel = cc.sys.localStorage.getItem("todayAvailableCount");



        //判断广告按钮是否可以点击
        if (cc.sys.localStorage.getItem("adRevive") != "1") {
            this.AdReviveBtn.interactable = false;
        }

        //若本局已用过，或者 今天已经不可用，或者没有复活币
        let tac = parseInt(cc.sys.localStorage.getItem("todayAvailableCount"));
        let rc = parseInt(cc.sys.localStorage.getItem("recommendedCurrency"));
        if (cc.sys.localStorage.getItem("recommendedRevive") != "1" || tac <= 0 || rc <= 0) {
            this.recommendedBtn.interactable = false;
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
        cc.sys.localStorage.setItem("recommendedRevive", "0");

        let tac = parseInt(cc.sys.localStorage.getItem("todayAvailableCount")) - 1;
        let rc = parseInt(cc.sys.localStorage.getItem("recommendedCurrency")) - 1;

        cc.sys.localStorage.setItem("todayAvailableCount", tac);
        cc.sys.localStorage.setItem("recommendedCurrency", rc);

        cc.eventManager.pauseTarget(this.node, true);
        this.onWho.getComponent("gameScene").goNewBalloon();

        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(0.3, 0), cc.scaleTo(0.3, 2.0)), cbFadeOut);
        this.node.runAction(actionFadeOut);
    },
    //可以点击代表其值为1
    onGuangGaoClick: function () {

        cc.sys.localStorage.setItem("adRevive", "0");

        cc.eventManager.pauseTarget(this.node, true);
        this.onWho.getComponent("gameScene").goNewBalloon();

        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(0.3, 0), cc.scaleTo(0.3, 2.0)), cbFadeOut);
        this.node.runAction(actionFadeOut);
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



