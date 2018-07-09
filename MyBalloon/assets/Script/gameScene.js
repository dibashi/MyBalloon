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


        cps: null,//关卡索引数组
        h: 3840,//关卡长度
        bgMinY: -2880,//下限 超过这个值 背景挪上去
        bgSpeed: 8,//背景的移动速度

        guanKa: 0,//0代表无尽模式

        //  heightOfGenerateBody:0, //生成下一波关卡的高度

        colorIndex:null,

        bg1ColorIndex:0,
        bg2ColorIndex:0,//初始化两个背景的 颜色索引

        isLoadNextCheckPoint:false,//是否已经加载下一关的标记
    },



    // use this for initialization
    onLoad: function () {

        this.h = 3840;
        this.bgMinY = -2880;
        this.bgSpeed = 4;
       // this.ctx.strokeColor = cc.hexToColor('#495069');
       this.colorIndex = [
           {bgColor:'#5ac2de',yun3Color:'#84cade',yun2Color:'#add7e6'},
           {bgColor:'#0092ce',yun3Color:'#42aad6',yun2Color:'#8cc2de'},

           {bgColor:'#10aa10',yun3Color:'#52ba52',yun2Color:'#94ce92'},
           {bgColor:'#7bc242',yun3Color:'#9cca73',yun2Color:'#bdd7a4'},

           {bgColor:'#00cea4',yun3Color:'#42d7bd',yun2Color:'#8cdfce'},
           {bgColor:'#94a2ff',yun3Color:'#adb3f7',yun2Color:'#c5c9ef'},

           {bgColor:'#520c4a',yun3Color:'#7b4d7b',yun2Color:'#ad8ead'},
           {bgColor:'#3a457b',yun3Color:'#7886cb',yun2Color:'#b5c2fe'},
        

           {bgColor:'#002431',yun3Color:'#53869f',yun2Color:'#89c3d7'},
           {bgColor:'#424542',yun3Color:'#959595',yun2Color:'#c6c6c6'},

           {bgColor:'#f7d731',yun3Color:'#efdb6b',yun2Color:'#efdf9c'},
           {bgColor:'#d6ce00',yun3Color:'#d6d742',yun2Color:'#dedb8c'},

           {bgColor:'#ef9e31',yun3Color:'#efb26b',yun2Color:'#efca9c'},
           {bgColor:'#f77531',yun3Color:'#ef966b',yun2Color:'#efba9c'},

           {bgColor:'#ce4100',yun3Color:'#d67142',yun2Color:'#dea28c'},
           {bgColor:'#ef4131',yun3Color:'#ef716b',yun2Color:'#efa29c'},

           {bgColor:'#ef3584',yun3Color:'#ef69a4',yun2Color:'#ef9ebd'},
        
        ];

        this.cps = [1,2,11,15,19];

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
            this.generateCheckpointByID(this.guanKa,this.bg1.position);
        } else if (this.guanKa == -1) { //无尽模式
            this.generateCheckpointByIndex(3, this.bg1.position);
        }
       // this.gameLayer.getComponent("gameLayer").bgSpeed = this.bgSpeed;


        // let armatureDisplay = this.testDragonBones.getComponent(dragonBones.ArmatureDisplay);
        // armatureDisplay.playAnimation("time");
    },

    //背景和云2 云3 的颜色 初始化
    initBGColor:function(){
       this.bg1ColorIndex = Math.floor(Math.random()*this.colorIndex.length);

       if(this.bg1ColorIndex+1>=this.colorIndex.length) {
           this.bg2ColorIndex = 0;
       } else {
           this.bg2ColorIndex = this.bg1ColorIndex+1;
       }

       this.bg1.color = cc.hexToColor(this.colorIndex[this.bg1ColorIndex].bgColor);
       this.bg2.color = cc.hexToColor(this.colorIndex[this.bg2ColorIndex].bgColor);

       this.yun3.color = cc.hexToColor(this.colorIndex[this.bg1ColorIndex].yun3Color);
       this.yun2.color = cc.hexToColor(this.colorIndex[this.bg1ColorIndex].yun2Color);
    },

    getGuanKa: function () {
        return Math.floor(Math.random() * 4);
    },



    //异步加载资源 直接传入关卡ID  根据ID 加入关卡
    generateCheckpointByID: function (ID,position) {
        let self = this;
        let pathOfPrefab = "Prefab/checkpoint" + ID;
        cc.loader.loadRes(pathOfPrefab, function (err, prefab) {
            self.checkPointLoadSuccess(prefab,position);
        });
    },

    //根据索引生成关卡 这里是异步生成 node是用于接收的生成关卡节点
    generateCheckpointByIndex: function (index, position) {
        let self = this;

        let pathOfPrefab = "Prefab/checkpoint" + this.cps[index];
        cc.loader.loadRes(pathOfPrefab, function (err, prefab) {
            self.checkPointLoadSuccess(prefab, position);
        });
    },

    //关卡数据读取成功的回调函数，在这里将关卡加入scene
    checkPointLoadSuccess: function (prefab,position) {
        //生成关卡的NODE 将其加入gameLayer
        let currentNode = cc.instantiate(prefab);
        currentNode.setPosition(position);
        this.gameLayer.addChild(currentNode);

        this.gameLayer.getComponent("gameLayer").currentNode = currentNode;
       
        //递归：给子节点下的所有子节点以刚体速度
        this.giveRigidBodyVelocity(currentNode, -this.bgSpeed * 60);
    },

    //给关卡中的所有刚体 一个速度 让其和背景一起下落
    giveRigidBodyVelocity: function (node, speed) {
        let children = node.children;
        for (let i = 0; i < children.length; i++) {
            this.giveRigidBodyVelocity(children[i], speed);
        }
        if (node.getComponent(cc.RigidBody) != null){
            node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, speed);
        }
    },


    gameOver: function () {
        cc.log("gameover~!!");
        cc.director.loadScene('selectCheckpoint');
    },

    // called every frame
    update: function (dt) {

        if (this.bg1.y <= this.bgMinY) {
            this.bg1.y = this.bg2.y + this.h - this.bgSpeed * dt * 60;

            this.bg1ColorIndex = Math.floor(Math.random()*this.colorIndex.length);
            this.bg1.color = cc.hexToColor(this.colorIndex[this.bg1ColorIndex].bgColor);
        } else {
            this.bg1.y -= this.bgSpeed * dt * 60;
        }

        if (this.bg2.y <= this.bgMinY) {
            this.bg2.y = this.bg1.y+this.h;

            this.bg2ColorIndex = Math.floor(Math.random()*this.colorIndex.length);
            this.bg2.color = cc.hexToColor(this.colorIndex[this.bg2ColorIndex].bgColor);
        } else {
            this.bg2.y -= this.bgSpeed * dt * 60;
        }

        if(this.yuns.y <=(-960 - 300)) { //屏幕高度的一半 再减去yun的高度的一半
            this.yuns.y = (this.bg1.y+this.bg2.y) *0.5;//放在两个背景的中间
            this.isLoadNextCheckPoint = false;//未加载下一关
            //云2 云3的颜色 则根据下方的bg来设置
            if(this.bg1.y<this.bg2.y) {
                this.yun3.color = cc.hexToColor(this.colorIndex[this.bg1ColorIndex].yun3Color);
                this.yun2.color = cc.hexToColor(this.colorIndex[this.bg1ColorIndex].yun2Color);
            } else {
                this.yun3.color = cc.hexToColor(this.colorIndex[this.bg2ColorIndex].yun3Color);
                this.yun2.color = cc.hexToColor(this.colorIndex[this.bg2ColorIndex].yun2Color);
            }

            if(this.guanKa!=-1) {
                cc.director.loadScene("selectCheckpoint");
            }
           
        } else {
            this.yuns.y -= this.bgSpeed*dt*60;
             //如果未加载下一关，且云已经出现且是无尽模式
            if(this.isLoadNextCheckPoint == false && this.yuns.y < 960 && this.guanKa == -1) {
                //判断加载哪个背景上，谁在上面就加到那个
                if(this.bg1.y>this.bg2.y) {
                    this.generateCheckpointByIndex(2, this.bg1.position);
                } else {
                    this.generateCheckpointByIndex(2, this.bg2.position);
                }
                this.isLoadNextCheckPoint = true;
            }
        }



    },


});
