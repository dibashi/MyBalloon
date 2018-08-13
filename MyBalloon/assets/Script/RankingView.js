cc.Class({
    extends: cc.Component,
    name: "RankingView",
    properties: {
        // groupFriendButton: cc.Node,
        // friendButton: cc.Node,
        gameOverButton: cc.Node,
        rankingScrollView: cc.Sprite,//显示排行榜
        loadLabel: cc.Node,//显示加载中的label

        isQun: 0,//0标记是好友排行榜，1标记是群排行榜

        friendTitleImg: cc.Sprite,
        groupTitleImg: cc.Sprite,
        friendBtnImg: cc.Sprite,
        groupBtnImg: cc.Sprite,
        title: cc.Sprite, //title的sprite
        dataFetch: cc.Sprite, //下方按钮请求数据的 sprite
        dataFetchBtn: cc.Button,
    },
    onLoad() {
        this.timer = 0;
        this.isQun = 0;

        this.dataFetchBtn.interactable = false;
    },

    goStart: function () {
        cc.director.loadScene('start');
    },

    friendAndGroupDatasShift: function () {
        if (this.isQun == 0) {
            this.isQun = 1; //如果是好友排行，则切换到群排行
            this.title.spriteFrame = this.groupTitleImg.spriteFrame;
            this.dataFetch.spriteFrame = this.friendBtnImg.spriteFrame;
        } else {
            this.isQun = 0;//如果是群排行，则切换到好友排行
            this.title.spriteFrame = this.friendTitleImg.spriteFrame;
            this.dataFetch.spriteFrame = this.groupBtnImg.spriteFrame;
        }
    },

    dataFetchClick: function (event) {
        if (this.isQun == 0) { //如果当前好友排行榜，则获得群排行榜数据
            this.groupFriendButtonFunc(event);
        } else {
            this.friendButtonFunc(event);
        }
    },

    uiRefresh: function () {
        this.scheduleOnce(this._updateSubDomainCanvas, 3.0);
        this.scheduleOnce(this.closeTips, 3.0);
        this.scheduleOnce(this.friendAndGroupDatasShift, 3.0);
        this.scheduleOnce(this.openTips, 1.0);
    },

    start() {
        if (CC_WECHATGAME) {
            //window.wx.showShareMenu({ withShareTicket: true });//设置分享按钮，方便获取群id展示群排行榜
            //https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/share.html?search-key=shareAppMessage
            wx.updateShareMenu({
                withShareTicket: true
            });

            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 1080;
            window.sharedCanvas.height = 1920;
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "bpwBFen"
            });


            this.scheduleOnce(this._updateSubDomainCanvas, 3.0);
            this.scheduleOnce(this.closeTips, 3.0);
        }
    },

    openTips: function () {
        this.loadLabel.active = true;
    },

    closeTips: function () {
        this.dataFetchBtn.interactable = true;
        this.loadLabel.active = false;
    },

    friendButtonFunc(event) {
        if (CC_WECHATGAME) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "bpwBFen"
            });
            this.dataFetchBtn.interactable = false;
            this.uiRefresh();
        } else {

        }
    },

    groupFriendButtonFunc: function (event) {
        let self = this;
        if (CC_WECHATGAME) {
            window.wx.shareAppMessage({
                title: "我邀请了8个好友一起PK，就差你了，赶紧来！",
                imageUrl: "https://bpw.blyule.com/res/raw-assets/Texture/shareImage0.a52e5.jpg",
                success: (res) => {
                    //console.log("shareTickets  res ---> ");
                    //console.log(res);
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        window.wx.postMessage({
                            messageType: 5,
                            MAIN_MENU_NUM: "bpwBFen",
                            shareTicket: res.shareTickets[0]
                        });
                        self.dataFetchBtn.interactable = false;
                        self.uiRefresh();
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
            this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
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
