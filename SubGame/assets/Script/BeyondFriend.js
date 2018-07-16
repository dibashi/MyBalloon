cc.Class({
    extends: cc.Component,

    properties: {
        gameRankingList: cc.Node,
        headImageNode: cc.Node,
        waitingForBeyondFriends: null,
    },

    start() {
        console.log("运行到 好友超越！！");
        this.removeChild();
        this.waitingForBeyondFriends = null;
        window.wx.onMessage(data => {
            cc.log("接收主域发来消息：", data)
            if (data.messageType == 6) {//用于游戏内的超越功能的数据源获取
                this.fetchFriendDataToBeyond(data.MAIN_MENU_NUM);
            } else if (data.messageType == 7) { //用于查询给的分数是否超过当前数据源中的分数，超过谁就显示谁，然后删除掉
                this.isBeyond(data.currentScore);
            }
        });
    },
 
    removeChild() {
        this.gameRankingList.active = false;
    },

    isBeyond: function (currentScore) {
        if (this.waitingForBeyondFriends == null || this.waitingForBeyondFriends.length == 0) {
            return;
        }

        console.log("看下待超越的数据组");
        console.log(this.waitingForBeyondFriends);

        let beyondIndex = -1;
        for (let i = this.waitingForBeyondFriends.length - 1; i >= 0; i--) {//这个数据源是已经排好序的，但是是倒序从大到小
            if (currentScore > this.waitingForBeyondFriends[i]) {
                beyondIndex = i;
                break;
            }
        }

        let beyondData = this.waitingForBeyondFriends.splice(beyondIndex, 1);
        this.initSprite(beyondData);
    },

    initSprite: function (beyondData) {
        let avatarUrl = beyondData.avatarUrl;
        // console.log("看下 头像 URL");
        // console.log(avatarUrl);
        this.createImage(avatarUrl);
        let anim =  this.headImageNode.getComponent(cc.Animation);
        anim.play();
    },

    createImage(avatarUrl) {
        try {
            let image = wx.createImage();
            image.onload = () => {
                try {
                    let texture = new cc.Texture2D();
                    texture.initWithElement(image);
                    texture.handleLoadedTexture();
                    this.headImageNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                } catch (e) {
                    cc.log(e);
                    this.headImageNode.active = false;
                }
            };
            image.src = avatarUrl;
        } catch (e) {
            cc.log(e);
            this.headImageNode.active = false;
        }
    },

    fetchFriendDataToBeyond(MAIN_MENU_NUM) {
        this.node.active = true;
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    console.log('超越部分：success', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getFriendCloudStorage({
                        keyList: [MAIN_MENU_NUM],
                        success: res => {
                            console.log("超越部分：wx.getFriendCloudStorage success", res);
                            let data = res.data;
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return b.KVDataList[0].value - a.KVDataList[0].value;
                            });
                            let waitingForDelete = 0;
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].avatarUrl == userData.avatarUrl) {//这是自己，要从待超集合中删除
                                    waitingForDelete = i;
                                }
                            }

                            data.splice(waitingForDelete, 1);
                            this.waitingForBeyondFriends = data;
                            console.log("这里 这里！");
                            for(let j =0; j<this.waitingForBeyondFriends.length;j++) {
                                console.log(this.waitingForBeyondFriends[j]);
                            }
                           
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                            this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                        },
                    });
                },
                fail: (res) => {
                    this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                }
            });
        }
    },
});
