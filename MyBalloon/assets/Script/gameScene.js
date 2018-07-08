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


        cps: null,//关卡索引数组
        h: 0,//关卡长度
        bgMinY: 0,//下限 超过这个值 背景挪上去
        bgSpeed: 2,//背景的移动速度

        guanKa: 0,//0代表无尽模式

        //  heightOfGenerateBody:0, //生成下一波关卡的高度


    },



    // use this for initialization
    onLoad: function () {



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
            this.addCheckPointToScene(this.guanKa);
        } else if (this.guanKa == -1) { //无尽模式
            //随机选择一关 便于调试 现在只有四关


            //let cps_index = 1;
            this.generateCheckpointByIndex(0, this.panel1);
            //  let next_cps_index = 2;

            this.generateCheckpointByIndex(2, this.panel2);


            //this.generateBG(cps_index,next_cps_index);
        }

        
        this.gameLayer.getComponent("gameLayer").bgSpeed = this.bgSpeed;
        // let armatureDisplay = this.testDragonBones.getComponent(dragonBones.ArmatureDisplay);
        // armatureDisplay.playAnimation("time");
    },

    getGuanKa: function () {
        return Math.floor(Math.random() * 4);
    },



    //异步加载资源 直接传入关卡ID  根据ID 加入关卡
    addCheckPointToScene: function (ID) {
        let self = this;
        let pathOfPrefab = "Prefab/checkpoint" + ID;
        cc.loader.loadRes(pathOfPrefab, function (err, prefab) {
            self.checkPointLoadSuccess(prefab);
        });
    },

    //根据索引生成关卡 这里是异步生成 node是用于接收的生成关卡节点
    generateCheckpointByIndex: function (index, checkpointNode) {
        let self = this;

        let pathOfPrefab = "Prefab/checkpoint" + this.cps[index];
        cc.loader.loadRes(pathOfPrefab, function (err, prefab) {
            self.checkPointLoadSuccess(prefab, checkpointNode);
        });
    },

    //关卡数据读取成功的回调函数，在这里将关卡加入scene
    checkPointLoadSuccess: function (prefab) {
        //生成关卡的NODE 将其加入gameLayer
        let currentNode = cc.instantiate(prefab);
        currentNode.setPosition(0, 960);
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
        if (node.getComponent(cc.RigidBody) != null && node.group != "yun" ){
            node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, speed);
        }
    },

    //传入两关，来完美的生成背景图并且滚动，
    //若curIndex = -1,则在其后添加nextIndex背景
    //若nextIndex = -1,则在当前背景后面添加结束背景。
    generateBG: function (curIndex, nextIndex) {

    },

    gameOver: function () {
        cc.log("gameover~!!");
        cc.director.loadScene('selectCheckpoint');
    },

    // called every frame
    update: function (dt) {

        // let bg1Y = this.currentCheckpointNode.getPosition().y;
        // let bg2Y = this.nextCheckpointNode.getPosition().y;

        // if (bg1Y <= this.bgMinY) {
        //     this.currentCheckpointNode.setPosition(this.currentCheckpointNode.getPosition().x, bg2Y + this.h - this.bgSpeed * dt * 60);
        //     this.panel1.setPosition(this.currentCheckpointNode.getPosition());
        //     if (this.guanKa == 0) {
        //         //似乎不用移除这个容器下的所有节点，因为那是刚体，刚体不会改变速度 让他们自己往下跑，超过某个位置 删除
        //         this.panel1.removeAllChildren();
        //         this.generateCheckpointByIndex(this.getGuanKa(), this.panel1);


        //     } else {

        //     }

        // } else {
        //     bg1Y -= this.bgSpeed * dt * 60;
        //     this.currentCheckpointNode.setPosition(this.currentCheckpointNode.getPosition().x, bg1Y);
        //     this.panel1.setPosition(this.currentCheckpointNode.getPosition());
        // }



        // if (bg2Y <= this.bgMinY) {
        //     this.nextCheckpointNode.setPosition(this.nextCheckpointNode.getPosition().x, bg1Y + this.h);
        //     this.panel2.setPosition(this.nextCheckpointNode.getPosition());
        //     if (this.guanKa == 0) {
        //         //似乎不用移除这个容器下的所有节点，因为那是刚体，刚体不会改变速度 让他们自己往下跑，超过某个位置 删除
        //         this.panel2.removeAllChildren();
        //         this.generateCheckpointByIndex(this.getGuanKa(), this.panel2);
        //     }
        // } else {
        //     bg2Y -= this.bgSpeed * dt * 60;
        //     this.nextCheckpointNode.setPosition(this.nextCheckpointNode.getPosition().x, bg2Y);
        //     this.panel2.setPosition(this.nextCheckpointNode.getPosition());
        // }




    },


});
