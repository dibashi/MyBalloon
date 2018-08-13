cc.Class({
    extends: cc.Component,

    properties: {
        diamondLabel: cc.Label,
        scoreLabel: cc.Label,
        loadLabel: cc.Node,//要隐藏，用node
        rankingView: cc.Sprite,//显示排行榜

        inviteAlert: {
            default: null,
            type: cc.Prefab,
        },

        hideNode: {
            default: null,
            type: cc.Node,
        }
    },
    onLoad() {
        this.timer = 0;

        this.scoreLabel.string = cc.sys.localStorage.getItem("currentScore");
        this.diamondLabel.string = cc.sys.localStorage.getItem("diamondCount");

        if (cc.myballoon_isShare == 0) {
            this.hideNode.active = false;
        } else {
            this.hideNode.active = true;
        }
    },

    goStart: function () {
        cc.director.loadScene('start');
    },

    onReNewClick: function () {

        cc.director.loadScene("gameScene");
    },

    goShare: function () {
        cc.eventManager.pauseTarget(this.node, true);
        let ss = cc.instantiate(this.inviteAlert);
        ss.setLocalZOrder(1000);
        ss.getComponent("inviteAlert").onWho = this.node;
        this.node.addChild(ss);
    },

    start() {

        //window.wx.showShareMenu({ withShareTicket: true });//设置分享按钮，方便获取群id展示群排行榜
        if (cc.myDebugMode) {
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 1080;
            window.sharedCanvas.height = 1920;
            window.wx.postMessage({
                messageType: 4,
                MAIN_MENU_NUM: "bpwBFen"
            });


            this.scheduleOnce(this._updateSubDomainCanvas, 3.0);
            this.scheduleOnce(this.closeTips, 3.0);
        }

    },

    closeTips: function () {
        this.loadLabel.active = false;
    },



    groupFriendButtonFunc: function (event) {
        if (CC_WECHATGAME) {
            window.wx.shareAppMessage({
                success: (res) => {
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        window.wx.postMessage({
                            messageType: 5,
                            MAIN_MENU_NUM: "bpwBFen",
                            shareTicket: res.shareTickets[0]
                        });
                    }
                }
            });
        } else {

        }
    },

    gameOverButtonFunc: function (event) {
        if (CC_WECHATGAME) {
            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: "bpwBFen"
            });
        } else {

        }
    },


    // submitScoreButtonFunc(){
    //     let score = 123;
    //     if (CC_WECHATGAME) {
    //         window.wx.postMessage({
    //             messageType: 3,
    //             MAIN_MENU_NUM: "bpwBFen",
    //             score: score,
    //         });
    //     } else {
    //         cc.log("提交得分: x1 : " + score)
    //     }
    // },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },
    update(dt) {
        //this._updateSubDomainCanvas();
        // this.timer += dt;
        // if (this.timer > 2) {
        //     this._updateSubDomainCanvas();
        //     this.timer = 0;
        // }

    },
});
