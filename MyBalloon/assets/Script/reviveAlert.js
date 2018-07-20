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

        reviveBtn: {
            default: null,
            type: cc.Node
        },

        reNewBtn: {
            default: null,
            type: cc.Node
        },
        onWho: null,//在哪个页面上面，当当前页面消失时使得那个页面可点击
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.startFadeIn();
        this.reNewBtn.active = false;
        this.scheduleOnce(this.enableReNewBtn, 2);
        this.scheduleOnce(this.cancel, 10);
    },

    enableReNewBtn: function () {
        this.reNewBtn.active = true;
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

    onGuangGaoClick: function () {
        
        // cc.sys.localStorage.setItem("GuangGaoFuhuoFlag",0);
        // cc.audioEngine.playEffect(this.buttonAudio, false);
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



