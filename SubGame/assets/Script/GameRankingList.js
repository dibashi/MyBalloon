cc.Class({
    extends: cc.Component,

    properties: {
        rankingScrollView: cc.ScrollView,
        scrollViewContent: cc.Node,
        prefabRankItem: cc.Prefab,
        prefabGameOverRank: cc.Prefab,
        gameOverRankLayout: cc.Node,
        loadingLabel: cc.Node,//加载文字

        beyondFriendNode: cc.Node,



        headImageNode: cc.Node,
        waitingForBeyondFriends: null,

        nameLabel: cc.Label,
        scoreLabel: cc.Label,
    },



    isBeyond: function (currentScore) {
        if (this.waitingForBeyondFriends == null || this.waitingForBeyondFriends.length == 0) {
            return;
        }
        //  console.log(this.waitingForBeyondFriends.length);
        //  console.log("看下待超越的数据组");
        // for (let j = 0; j < this.waitingForBeyondFriends.length; j++) {
        //     console.log(this.waitingForBeyondFriends[j]);
        // }


        let beyondIndex = -1;
        for (let i = this.waitingForBeyondFriends.length - 1; i >= 0; i--) {//这个数据源是已经排好序的，但是是倒序从大到小
            let otherScore = this.waitingForBeyondFriends[i].KVDataList.length != 0 ? this.waitingForBeyondFriends[i].KVDataList[0].value : 0;
            if (currentScore > otherScore) {
                beyondIndex = i;
                break;
            }
        }
        if (beyondIndex != -1) {
            this.beyondFriendNode.active = true;
            //splice 返回的是一个数组。一定要加索引来访问
            let beyondData = this.waitingForBeyondFriends.splice(beyondIndex, 1);
            // console.log("看下超越的玩家数据");
            // console.log(beyondData[0]);

            this.initSprite(beyondData[0]);
        }

    },

    nextBeyond: function (currentScore) {
        if (this.waitingForBeyondFriends == null || this.waitingForBeyondFriends.length == 0) {
            this.beyondFriendNode.active = false;
            return;
        }
        //  console.log(this.waitingForBeyondFriends.length);
        //  console.log("看下待超越的数据组");
        // for (let j = 0; j < this.waitingForBeyondFriends.length; j++) {
        //     console.log(this.waitingForBeyondFriends[j]);
        // }


        let nextBeyondIndex = -1;
        for (let i = this.waitingForBeyondFriends.length - 1; i >= 0; i--) {//这个数据源是已经排好序的，但是是倒序从大到小
            let otherScore = this.waitingForBeyondFriends[i].KVDataList.length != 0 ? this.waitingForBeyondFriends[i].KVDataList[0].value : 0;
            if (currentScore < otherScore) {
                nextBeyondIndex = i;
                break;
            }
        }

        console.log("看下传到子域的当前得分！--》 " + currentScore);
        if (nextBeyondIndex != -1) {
            this.beyondFriendNode.active = true;
            //splice 返回的是一个数组。一定要加索引来访问
            //let beyondData = this.waitingForBeyondFriends.splice(beyondIndex, 1);
            // console.log("看下超越的玩家数据");
            // console.log(beyondData[0]);

            this.initSprite(this.waitingForBeyondFriends[nextBeyondIndex]);
            this.nameLabel.string = this.waitingForBeyondFriends[nextBeyondIndex].nickname;
            this.scoreLabel.string = this.waitingForBeyondFriends[nextBeyondIndex].KVDataList[0].value;
        } else {
            console.log("执行到这里，隐藏了下个好友！");
            this.beyondFriendNode.active = false;
        }

    },

    initSprite: function (beyondData) {
        let avatarUrl = beyondData.avatarUrl;
        //  console.log("看下 头像 URL");
        //  console.log(avatarUrl);
        //  console.log(this.headImageNode);
        //  console.log(this.headImageNode.getComponent(cc.Animation));
        this.createImage(avatarUrl);
        // let anim = this.headImageNode.getComponent(cc.Animation);
        //anim.play();
        // this.headImageNode.runAction(cc.moveTo(5.0,cc.v2(200,200)));
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
                    // cc.log(e);
                    this.headImageNode.active = false;
                }
            };
            image.src = avatarUrl;
        } catch (e) {
            // cc.log(e);
            this.headImageNode.active = false;
        }
    },

    fetchFriendDataToBeyond(MAIN_MENU_NUM) {
        this.node.active = true;
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    //console.log('超越部分：success', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getFriendCloudStorage({
                        keyList: [MAIN_MENU_NUM],
                        success: res => {
                            //console.log("超越部分：wx.getFriendCloudStorage success", res);
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
                            //console.log("这里 这里！");
                            for (let j = 0; j < this.waitingForBeyondFriends.length; j++) {
                                console.log(this.waitingForBeyondFriends[j]);
                            }

                        },
                        fail: res => {
                            //console.log("wx.getFriendCloudStorage fail", res);
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













    start() {
        //console.log("运行到 排行list！！！！");

        this.removeChild();

        window.wx.onMessage(data => {
            //  cc.log("接收主域发来消息：", data)
            if (data.messageType == 0) {//移除排行榜
                this.removeChild();
            } else if (data.messageType == 1) {//获取好友排行榜
                this.fetchFriendData(data.MAIN_MENU_NUM);
            } else if (data.messageType == 3) {//提交得分
                this.submitScore(data.MAIN_MENU_NUM, data.score);
            } else if (data.messageType == 4) {//获取好友排行榜横向排列展示模式
                this.gameOverRank(data.MAIN_MENU_NUM);
            } else if (data.messageType == 5) {//获取群排行榜
                this.fetchGroupFriendData(data.MAIN_MENU_NUM, data.shareTicket);
            } else if (data.messageType == 6) {//用于游戏内的超越功能的数据源获取
                this.removeChild();
                this.loadingLabel.active = false;
                this.fetchFriendDataToBeyond(data.MAIN_MENU_NUM);
            } else if (data.messageType == 7) { //用于查询给的分数是否超过当前数据源中的分数，超过谁就显示谁，然后删除掉
                this.isBeyond(data.currentScore);
            } else if (data.messageType == 8) { //显示下个即将超越的好友
                this.beyondFriendNode.active = true;
                this.nextBeyond(data.currentScore);
            }
        });

    },
    submitScore(MAIN_MENU_NUM, score) { //提交得分
        if (CC_WECHATGAME) {
            window.wx.getUserCloudStorage({
                // 以key/value形式存储
                keyList: [MAIN_MENU_NUM],
                success: function (getres) {
                    //console.log('getUserCloudStorage', 'success', getres)
                    if (getres.KVDataList.length != 0) {
                        if (getres.KVDataList[0].value > score) {//这里比较了是否超过了服务器的数据，若没超过则不上传
                            return;
                        }
                    }
                    // 对用户托管数据进行写数据操作
                    window.wx.setUserCloudStorage({
                        KVDataList: [{ key: MAIN_MENU_NUM, value: "" + score }],
                        success: function (res) {
                            //console.log('setUserCloudStorage', 'success', res)
                        },
                        fail: function (res) {
                            // console.log('setUserCloudStorage', 'fail')
                        },
                        complete: function (res) {
                            //  console.log('setUserCloudStorage', 'ok')
                        }
                    });
                },
                fail: function (res) {
                    // console.log('getUserCloudStorage', 'fail')
                },
                complete: function (res) {
                    // console.log('getUserCloudStorage', 'ok')
                }
            });
        } else {
            //  cc.log("提交得分:" + MAIN_MENU_NUM + " : " + score)
        }
    },
    removeChild() {
        this.node.removeChildByTag(1000);
        this.rankingScrollView.node.active = false;
        this.scrollViewContent.removeAllChildren();
        this.gameOverRankLayout.active = false;
        this.gameOverRankLayout.removeAllChildren();
        this.loadingLabel.getComponent(cc.Label).string = "玩命加载中...";
        this.loadingLabel.active = false;

        this.beyondFriendNode.active = false;
    },
    fetchFriendData(MAIN_MENU_NUM) {
        this.removeChild();
        this.rankingScrollView.node.active = true;
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    this.loadingLabel.active = false;
                    // console.log('success', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getFriendCloudStorage({
                        keyList: [MAIN_MENU_NUM],
                        success: res => {
                            //  console.log("wx.getFriendCloudStorage success", res);
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
                            for (let i = 0; i < data.length; i++) {
                                if (i <= 8) {//先最多显示9条吧。以后再说
                                    var playerInfo = data[i];
                                    var item = cc.instantiate(this.prefabRankItem);
                                    item.getComponent('RankItem').init(i, playerInfo);
                                    this.scrollViewContent.addChild(item);//其实这里已经加过玩家自己的item了
                                }
                                if (data[i].avatarUrl == userData.avatarUrl) {//在下方继续再加一遍。。
                                    let userItem = cc.instantiate(this.prefabRankItem);
                                    userItem.getComponent('RankItem').init(i, playerInfo);
                                    userItem.y = -215;
                                    this.node.addChild(userItem, 1, 1000);
                                }
                            }
                        },
                        fail: res => {
                            //  console.log("wx.getFriendCloudStorage fail", res);
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



    fetchGroupFriendData(MAIN_MENU_NUM, shareTicket) {
        this.removeChild();
        this.rankingScrollView.node.active = true;
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    //  console.log('success', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getGroupCloudStorage({
                        shareTicket: shareTicket,
                        keyList: [MAIN_MENU_NUM],
                        success: res => {
                            //  console.log("wx.getGroupCloudStorage success", res);
                            this.loadingLabel.active = false;
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
                            for (let i = 0; i < data.length; i++) {
                                var playerInfo = data[i];
                                var item = cc.instantiate(this.prefabRankItem);
                                item.getComponent('RankItem').init(i, playerInfo);
                                this.scrollViewContent.addChild(item);
                                if (data[i].avatarUrl == userData.avatarUrl) {
                                    let userItem = cc.instantiate(this.prefabRankItem);
                                    userItem.getComponent('RankItem').init(i, playerInfo);
                                    userItem.y = -354;
                                    this.node.addChild(userItem, 1, 1000);
                                }
                            }
                        },
                        fail: res => {
                            // console.log("wx.getFriendCloudStorage fail", res);
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

    gameOverRank(MAIN_MENU_NUM) {
        this.removeChild();
        this.gameOverRankLayout.active = true;
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    //    cc.log('success', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getFriendCloudStorage({
                        keyList: [MAIN_MENU_NUM],
                        success: res => {
                            //       cc.log("wx.getFriendCloudStorage success", res);
                            this.loadingLabel.active = false;
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
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].avatarUrl == userData.avatarUrl) {
                                    if ((i - 1) >= 0) {
                                        if ((i + 1) >= data.length && (i - 2) >= 0) {
                                            let userItem = cc.instantiate(this.prefabGameOverRank);
                                            userItem.getComponent('GameOverRank').init(i - 2, data[i - 2]);
                                            this.gameOverRankLayout.addChild(userItem);
                                        }
                                        let userItem = cc.instantiate(this.prefabGameOverRank);
                                        userItem.getComponent('GameOverRank').init(i - 1, data[i - 1]);
                                        this.gameOverRankLayout.addChild(userItem);
                                    } else {
                                        if ((i + 2) >= data.length) {
                                            let node = new cc.Node();
                                            node.width = 200;
                                            this.gameOverRankLayout.addChild(node);
                                        }
                                    }
                                    let userItem = cc.instantiate(this.prefabGameOverRank);
                                    userItem.getComponent('GameOverRank').init(i, data[i], true);
                                    this.gameOverRankLayout.addChild(userItem);
                                    if ((i + 1) < data.length) {
                                        let userItem = cc.instantiate(this.prefabGameOverRank);
                                        userItem.getComponent('GameOverRank').init(i + 1, data[i + 1]);
                                        this.gameOverRankLayout.addChild(userItem);
                                        if ((i - 1) < 0 && (i + 2) < data.length) {
                                            let userItem = cc.instantiate(this.prefabGameOverRank);
                                            userItem.getComponent('GameOverRank').init(i + 2, data[i + 2]);
                                            this.gameOverRankLayout.addChild(userItem);
                                        }
                                    }
                                }
                            }
                        },
                        fail: res => {
                            // console.log("wx.getFriendCloudStorage fail", res);
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
