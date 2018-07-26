cc.Class({
    extends: cc.Component,

    properties: {

        // testDragonBones: {
        //     default: null,
        //     type: cc.Node,

        // },

        // currentCheckpointNode: {
        //     default: null,
        //     type: cc.Node,

        // },

        // nextCheckpointNode: {
        //     default: null,
        //     type: cc.Node,

        // },

        // panel1: {
        //     default: null,
        //     type: cc.Node,

        // },

        // panel2: {
        //     default: null,
        //     type: cc.Node,

        // },



        // yun1: {
        //     default: null,
        //     type: cc.Node,

        // },

        // yun2: {
        //     default: null,
        //     type: cc.Node,

        // },

        // yun3: {
        //     default: null,
        //     type: cc.Node,

        // },

        gameLayer: {
            default: null,
            type: cc.Node,

        },

        bg1: {
            default: null,
            type: cc.Node,

        },

        bg2: {
            default: null,
            type: cc.Node,

        },

        yun2: {
            default: null,
            type: cc.Node,

        },

        yun3: {
            default: null,
            type: cc.Node,

        },

        yuns: {
            default: null,
            type: cc.Node,

        },

        teXiaoWin: {
            default: null,
            type: cc.Prefab,
        },

        balloon: {
            default: null,
            type: cc.Node,
        },

        scoreNode: {
            default: null,
            type: cc.Node,
        },


        scoreLabel: {
            default: null,
            type: cc.Node,
        },

        diamondNode: {
            default: null,
            type: cc.Node,
        },


        diamondLabel: {
            default: null,
            type: cc.Node,
        },

        reviveAlert: {
            default: null,
            type: cc.Prefab,
        },

        winAlert: {
            default: null,
            type: cc.Prefab,
        },

        gameAudio01: {
            default: null,
            url: cc.AudioClip
        },

        gameAudio02: {
            default: null,
            url: cc.AudioClip
        },

        gameAudio03: {
            default: null,
            url: cc.AudioClip
        },

        gameAudio04: {
            default: null,
            url: cc.AudioClip
        },


        nextFriend: {
            default: null,
            type: cc.Sprite,
        },

        splashScreen: {
            default: null,
            type: cc.Node,
        },

        guard: {
            default: null,
            type: cc.Node,
        },


        cps: null,//关卡索引数组
        h: 3840,//关卡长度
        bgMinY: -2880,//下限 超过这个值 背景挪上去
        bgSpeed: 0,//背景的移动速度

        guanKa: 0,//0代表无尽模式

        //  heightOfGenerateBody:0, //生成下一波关卡的高度

        colorIndex: null,

        bg1ColorIndex: 0,
        bg2ColorIndex: 0,//初始化两个背景的 颜色索引

        isLoadNextCheckPoint: false,//是否已经加载下一关的标记
        //胜利彩带，这个只在关卡模式下有用
        winRibbon: null,
        guanKaWin:false,
    },



    // use this for initialization
    onLoad: function () {
        //这个功能已经废除了，但这里先不删，防止以后又加上， 注：标记用户是否关闭背景音乐
        let gameSoundBG = cc.sys.localStorage.getItem('gameSoundBG');
        if (gameSoundBG == 1) {
            let currentMusicID = cc.sys.localStorage.getItem("currentMusicID");
            switch (currentMusicID) {
                case "01":
                    cc.audioEngine.playMusic(this.gameAudio01, true);
                    break;
                case "02":
                    cc.audioEngine.playMusic(this.gameAudio02, true);
                    break;
                case "03":
                    cc.audioEngine.playMusic(this.gameAudio03, true);
                    break;
                case "04":
                    cc.audioEngine.playMusic(this.gameAudio04, true);
                    break;
            }
        }

        this.h = 3840;
        this.bgMinY = -2880;
        this.bgSpeed = 360;//为了性能改为1秒的速度 以前是6 现在是360
        this.bgScale = 1;

        this.scoreNode.active = false; //先不显示得分 在无尽模式中显示
        this.diamondNode.active = false;//同上

        this.colorIndex = [
            { bgColor: '#5ac2de', yun3Color: '#84cade', yun2Color: '#add7e6' },
            { bgColor: '#3190b9', yun3Color: '#42aad6', yun2Color: '#8cc2de' },

            { bgColor: '#38a738', yun3Color: '#52ba52', yun2Color: '#94ce92' },
            { bgColor: '#7bc242', yun3Color: '#9cca73', yun2Color: '#bdd7a4' },

            { bgColor: '#00cea4', yun3Color: '#42d7bd', yun2Color: '#8cdfce' },
            { bgColor: '#94a2ff', yun3Color: '#adb3f7', yun2Color: '#c5c9ef' },

            { bgColor: '#520c4a', yun3Color: '#7b4d7b', yun2Color: '#ad8ead' },
            { bgColor: '#3a457b', yun3Color: '#7886cb', yun2Color: '#b5c2fe' },


            { bgColor: '#002431', yun3Color: '#53869f', yun2Color: '#89c3d7' },
            { bgColor: '#424542', yun3Color: '#959595', yun2Color: '#c6c6c6' },

            { bgColor: '#d4bf4c', yun3Color: '#efdb6b', yun2Color: '#efdf9c' },
            { bgColor: '#c1c223', yun3Color: '#d6d742', yun2Color: '#dedb8c' },

            { bgColor: '#ef9e31', yun3Color: '#efb26b', yun2Color: '#efca9c' },
            { bgColor: '#f77531', yun3Color: '#ef966b', yun2Color: '#efba9c' },

            { bgColor: '#ce4100', yun3Color: '#d67142', yun2Color: '#dea28c' },
            { bgColor: '#cc423b', yun3Color: '#ef716b', yun2Color: '#efa29c' },

            { bgColor: '#d6518b', yun3Color: '#ef69a4', yun2Color: '#ef9ebd' },

        ];

        this.cps = ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012", "013", "014", "015", "016", "017", "018", "019", "020"];

        this.initBGColor();

        cc.director.getPhysicsManager().enabled = true; //开启物理系统，否则在编辑器里做的一切都没有任何效果

        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
            cc.PhysicsManager.DrawBits.e_pairBit |
            cc.PhysicsManager.DrawBits.e_centerOfMassBit |
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit; //开启物理调试信息
        cc.director.getPhysicsManager().debugDrawFlags = 0; //-设置为0则关闭调试
        cc.director.getPhysicsManager().gravity = cc.v2(0, -320);//-320像素/秒的平方，这个是默认值，为了以后调试先放在这

        var self = this;

        //1,2,3..代表关卡，-1代表无尽模式，0代表结束关卡
        this.guanKa = cc.sys.localStorage.getItem('currentCheckpoint');
        if (this.guanKa != -1) {
            this.generateCheckpointByID(this.guanKa, this.bg1.position);
        } else if (this.guanKa == -1) { //无尽模式
            //向子域发送请求，获得所有的好友数据
            this.sendMessageToSubdomainGetFriendDatas();

            this.scoreNode.active = true;
            this.diamondNode.active = true;
            //先判断是否是复活进来的 如果是，则分数继承，如果不是则分数置为0;
            let goNewBalloonFlag = cc.sys.localStorage.getItem("goNewBalloon-flag");

            if (goNewBalloonFlag != "1") {
                this.defen = 0;
                //本局广告复活可用一次，复活币复活可用一次
                cc.sys.localStorage.setItem("adRevive", "1");
                cc.sys.localStorage.setItem("recommendedRevive", "1");
            } else {

                this.defen = parseInt(cc.sys.localStorage.getItem("goNewBalloon-defen"));
                cc.sys.localStorage.setItem("goNewBalloon-flag", "0");
            }
            //获得的钻石 复活后 还是从现在拥有的 显示；
            this.diamondCount = parseInt(cc.sys.localStorage.getItem('diamondCount'));
            this.scoreLabel.getComponent(cc.Label).string = this.defen;
            this.diamondLabel.getComponent(cc.Label).string = this.diamondCount;

            this.generateCheckpointByIndex(this.getGuanKa(), this.bg1.position);
            this.schedule(this.addScore, 1);//1秒给1分

            //5秒钟，刷新一次下个即将超越的好友头像 注：时间设置的越长性能越好，越短则越精确。
            //废弃，这种方式会使得游戏5秒一卡，在云出现的时候加载试试 放在了 update的判断中
            //this.schedule(this.seeNextBeyondFriend, 5);

            this.tex = new cc.Texture2D();
        }
    },

    sendMessageToSubdomainGetFriendDatas: function () {
        window.sharedCanvas.width = 1080;
        window.sharedCanvas.height = 1920;
        window.wx.postMessage({
            messageType: 6,
            MAIN_MENU_NUM: "user_best_score"
        });
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.nextFriend.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },

    seeNextBeyondFriend: function () {
        let self = this;
        window.wx.postMessage({
            messageType: 8,
            currentScore: self.defen,
        });
        self.scheduleOnce(this._updateSubDomainCanvas, 1);
    },

    addScore: function () {
        this.defen++;
        this.scoreLabel.getComponent(cc.Label).string = this.defen;
    },

    //背景和云2 云3 的颜色 初始化
    initBGColor: function () {
        this.bg1ColorIndex = Math.floor(Math.random() * this.colorIndex.length);

        if (this.bg1ColorIndex + 1 >= this.colorIndex.length) {
            this.bg2ColorIndex = 0;
        } else {
            this.bg2ColorIndex = this.bg1ColorIndex + 1;
        }

        this.bg1.color = cc.hexToColor(this.colorIndex[this.bg1ColorIndex].bgColor);
        this.bg2.color = cc.hexToColor(this.colorIndex[this.bg2ColorIndex].bgColor);

        this.yun3.color = cc.hexToColor(this.colorIndex[this.bg1ColorIndex].yun3Color);
        this.yun2.color = cc.hexToColor(this.colorIndex[this.bg1ColorIndex].yun2Color);
    },

    getGuanKa: function () {
        return Math.floor(Math.random() * this.cps.length);
    },

    //异步加载资源 直接传入关卡ID  根据ID 加入关卡
    generateCheckpointByID: function (ID, position) {
        let self = this;
        let pathOfPrefab = "Prefab/checkpoint" + ID;
        cc.loader.loadRes(pathOfPrefab, function (err, prefab) {
            self.checkPointLoadSuccess(prefab, position);
        });
    },

    //根据索引生成关卡 这里是异步生成 node是用于接收的生成关卡节点
    generateCheckpointByIndex: function (index, position) {
        let self = this;
        let pathOfPrefab = "Prefab/endless-checkpoint" + this.cps[index];

        cc.loader.loadRes(pathOfPrefab, function (err, prefab) {
            self.checkPointLoadSuccess(prefab, position);
        });
    },

    //关卡数据读取成功的回调函数，在这里将关卡加入scene
    checkPointLoadSuccess: function (prefab, position) {
        //生成关卡的NODE 将其加入gameLayer
        let currentNode = cc.instantiate(prefab);
        currentNode.setPosition(position);
        this.gameLayer.addChild(currentNode);

        this.gameLayer.getComponent("gameLayer").currentNode = currentNode;

        //递归：给子节点下的所有子节点以刚体速度
        this.giveRigidBodyVelocity(currentNode, -this.bgSpeed * 1.2);

        //单独把 关卡模式的 胜利横幅拉出来
        if (this.guanKa != -1) {
            this.winRibbon = currentNode.getChildByName("zhongdian");
        }
    },

    //给关卡中的所有刚体 一个速度 让其和背景一起下落
    giveRigidBodyVelocity: function (node, speed) {
        let children = node.children;
        for (let i = 0; i < children.length; i++) {
            this.giveRigidBodyVelocity(children[i], speed);
        }
        if (node.getComponent(cc.RigidBody) != null) {
            node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, speed);
        }
    },

    slowMotion: function (scaleV) {
        cc.eventManager.pauseTarget(this.node, true);
        cc.director.getScheduler().setTimeScale(scaleV);
        let splashScreenAni = this.splashScreen.getComponent(cc.Animation);
        splashScreenAni.play();
        let guardAni = this.guard.getComponent(cc.Animation);
        guardAni.play();
        this.setAllRigidBodyVScale(this.node, scaleV);
        this.bgScale = scaleV;
    },
    //对所有的刚体速度进行放缩，实现慢镜头功能
    setAllRigidBodyVScale: function (node, scaleV) {
        let children = node.children;
        for (let i = 0; i < children.length; i++) {
            this.setAllRigidBodyVScale(children[i], scaleV);
        }
        let nodeRigid = node.getComponent(cc.RigidBody)
        if (nodeRigid != null) {
            nodeRigid.linearVelocity = cc.v2(nodeRigid.linearVelocity.x * scaleV, nodeRigid.linearVelocity.y * scaleV);
            nodeRigid.gravityScale = scaleV;
        }
    },

    addDiamond: function (value) {
        this.diamondCount += value;
        this.diamondLabel.getComponent(cc.Label).string = this.diamondCount;
    },

    gameOver: function () {
        cc.director.getScheduler().setTimeScale(1.0);

        if (this.guanKa == -1) {
            this.unschedule(this.addScore, this);
            let bestScore = parseInt(cc.sys.localStorage.getItem("bestScore"));
            if (this.defen > bestScore) {
                cc.sys.localStorage.setItem("bestScore", this.defen);
            }
            //这个是结束界面要用的本局得分
            cc.sys.localStorage.setItem("currentScore", this.defen);
            let self = this;
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "user_best_score",
                score: self.defen,
            });

            cc.sys.localStorage.setItem("diamondCount", this.diamondCount);

            //本局的所有复活已经用完，就直接跳转结束页面
            if (cc.sys.localStorage.getItem("adRevive") != "1" && cc.sys.localStorage.getItem("recommendedRevive") != "1") {
                cc.director.loadScene("end");
            } else { //还有复活可用，则跳转的复活界面
                //“弹出”结束界面
                cc.eventManager.pauseTarget(this.node, true);
                let ss = cc.instantiate(this.reviveAlert);
                ss.setLocalZOrder(1000);
                ss.getComponent("reviveAlert").onWho = this.node;
                this.node.addChild(ss);
            }


        } else {
            cc.director.loadScene('selectCheckpoint');
        }
    },

    goNewBalloon: function () {

        cc.sys.localStorage.setItem("goNewBalloon-defen", this.defen);
        cc.sys.localStorage.setItem("goNewBalloon-flag", "1");
        cc.director.loadScene("gameScene");
    },

    // called every frame
    update: function (dt) {
        if (this.bg1.y <= this.bgMinY) {
            this.bg1.y = this.bg2.y + this.h - this.bgSpeed * dt * this.bgScale;

            this.bg1ColorIndex = Math.floor(Math.random() * this.colorIndex.length);
            this.bg1.color = cc.hexToColor(this.colorIndex[this.bg1ColorIndex].bgColor);
        } else {
            this.bg1.y -= this.bgSpeed * dt * this.bgScale;
        }

        if (this.bg2.y <= this.bgMinY) {
            this.bg2.y = this.bg1.y + this.h;

            this.bg2ColorIndex = Math.floor(Math.random() * this.colorIndex.length);
            this.bg2.color = cc.hexToColor(this.colorIndex[this.bg2ColorIndex].bgColor);
        } else {
            this.bg2.y -= this.bgSpeed * dt * this.bgScale;
        }

        if (this.yuns.y <= (-960 - 300)) { //屏幕高度的一半 再减去yun的高度的一半
            this.yuns.y = (this.bg1.y + this.bg2.y) * 0.5;//放在两个背景的中间
            this.isLoadNextCheckPoint = false;//未加载下一关
            //云2 云3的颜色 则根据下方的bg来设置
            if (this.bg1.y < this.bg2.y) {
                this.yun3.color = cc.hexToColor(this.colorIndex[this.bg1ColorIndex].yun3Color);
                this.yun2.color = cc.hexToColor(this.colorIndex[this.bg1ColorIndex].yun2Color);
            } else {
                this.yun3.color = cc.hexToColor(this.colorIndex[this.bg2ColorIndex].yun3Color);
                this.yun2.color = cc.hexToColor(this.colorIndex[this.bg2ColorIndex].yun2Color);
            }
            //需求更改 下方的代码废弃 作用是 关卡结束
            // if (this.guanKa != -1) {
            //     //胜利，先播放胜利动画，然后去关卡选择界面
            //     this.balloon.opacity = 0;
            //     let aniWin = cc.instantiate(this.teXiaoWin);
            //     this.armatureDisplayWinpro = aniWin.getComponent(dragonBones.ArmatureDisplay);
            //     this.armatureDisplayWinpro.playAnimation("winpro");
            //     this.node.addChild(aniWin);
            //     aniWin.setPosition(0, 0);
            //     this.scheduleOnce(this.winProOver, 3.0);
            // }

        } else {
            this.yuns.y -= this.bgSpeed * dt * this.bgScale;
            //如果未加载下一关，且云已经出现且是无尽模式
            if (this.isLoadNextCheckPoint == false && this.yuns.y < 0 && this.guanKa == -1) {
                //判断加载哪个背景上，谁在上面就加到那个
                if (this.bg1.y > this.bg2.y) {
                    this.generateCheckpointByIndex(this.getGuanKa(), this.bg1.position);
                } else {
                    this.generateCheckpointByIndex(this.getGuanKa(), this.bg2.position);
                }
                this.isLoadNextCheckPoint = true;
                //云出现，3秒后刷新超越好友
                this.scheduleOnce(this.seeNextBeyondFriend, 1);
            }
        }
        //胜利彩带的移动与结束判断
        if (this.guanKa != -1 && this.winRibbon != null) {
            if (this.winRibbon.position.y < this.balloon.position.y - 100 && this.guanKaWin == false) {
                console.log("胜利！！");
                this.guanKaWin = true;
                this.checkpointWin();
            } else {
                this.winRibbon.position.y -= this.bgSpeed * dt * this.bgScale;
            }
            
        }
    },


    checkpointWin: function () {
        let curCP = cc.sys.localStorage.getItem("currentCheckpoint");
        //首先要把curCP前面的0去掉 然后+1，就代表着当前要玩的关卡
        let sCurCP = curCP.split('');
        for (let i = 0; i < sCurCP.length; i++) {
            if (sCurCP[i] != '0') {
                break;
            }
        }
        let r = curCP.substring(i, curCP.length);
        let pr = parseInt(r);
        let cr = parseInt(cc.sys.localStorage.getItem("dangQianGuanKa"));
        if (pr < cr) {//如果玩的关卡小于玩家当前的关卡，则什么也不做
            this.scheduleOnce(this.winProOver, 3.0);
        } else {
            let result = pr + 1;
            cc.sys.localStorage.setItem("dangQianGuanKa", result);

            cc.eventManager.pauseTarget(this.node, true);
            let ss = cc.instantiate(this.winAlert);
            ss.setLocalZOrder(1000);
            ss.getComponent("winAlert").onWho = this.node;
            this.node.addChild(ss);

            //给用户钻石，目前不管什么关卡，都是三颗钻石
            let dc = parseInt(cc.sys.localStorage.getItem("diamondCount")) + 3;
            cc.sys.localStorage.setItem("diamondCount", dc);
        }

        //胜利，先播放胜利动画，然后去关卡选择界面
        this.balloon.opacity = 0;
        let aniWin = cc.instantiate(this.teXiaoWin);
        this.armatureDisplayWinpro = aniWin.getComponent(dragonBones.ArmatureDisplay);
        this.armatureDisplayWinpro.playAnimation("winpro");
        this.node.addChild(aniWin);
        aniWin.setPosition(0, 0);

        
    },

    winProOver: function () {
        cc.director.loadScene("selectCheckpoint");
    },

});
