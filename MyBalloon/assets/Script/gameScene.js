cc.Class({
    extends: cc.Component,

    properties: {

        testDragonBones: {
            default: null,
            type: cc.Node,

        },

        currentCheckpointNode: {
            default: null,
            type: cc.Node,

        },

        nextCheckpointNode: {
            default: null,
            type: cc.Node,

        },

        yun1: {
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


        cps:null,//关卡索引数组
        h:0,//关卡长度
        bgMinY:0,//下限 超过这个值 背景挪上去
        bgSpeed:2,//背景的移动速度
    },



    // use this for initialization
    onLoad: function () {

        //一个关卡的长度
        this.h = this.currentCheckpointNode.getContentSize().height;
        //下限 超过这个值 背景挪上去
        this.bgMinY = this.currentCheckpointNode.getPosition().y - this.h;

        this.cps = new Array();
        this.cps[0] = 2;
        this.cps[1] = 11;
        this.cps[2] = 15;
        this.cps[3] = 19;

        cc.director.getPhysicsManager().enabled = true; //开启物理系统，否则在编辑器里做的一切都没有任何效果

        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        cc.PhysicsManager.DrawBits.e_pairBit |
        cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        cc.PhysicsManager.DrawBits.e_jointBit |
        cc.PhysicsManager.DrawBits.e_shapeBit; //开启物理调试信息
        cc.director.getPhysicsManager().debugDrawFlags = 0; //-设置为0则关闭调试
        cc.director.getPhysicsManager().gravity = cc.v2(0, -320);//-320像素/秒的平方，这个是默认值，为了以后调试先放在这

        var self = this;
        //初始化要根据checkpoint来读取相应的关卡数据

        //1读取 数据 还是加载场景？ wtf
        //读取prefab 然后放入到 gameLayer中，让 卫士，气球，敌人，奖励品，墙之间去交互
        //这个prefab中 会有敌人和奖品（金币）还会有一些障碍物（黑色的墙）
        
        let currentGuanKa = cc.sys.localStorage.getItem('currentCheckpoint');
        if(currentGuanKa != 0) {
            let pathOfPrefab = "Prefab/checkpoint" + currentCheckpoint;
            cc.loader.loadRes(pathOfPrefab, function (err, prefab) {
                let newNode = cc.instantiate(prefab);
                self.node.getChildByName("gameLayer").addChild(newNode);
            });
        } else if(currentGuanKa == 0) { //无尽模式
            //随机选择一关 便于调试 现在只有四关
           
           // let cps_index = Math.floor(Math.random()*4);
           let cps_index = 3;
            this.generateCheckpointByIndex(cps_index,this.currentCheckpointNode);
          //  let next_cps_index = 3;
          //  let next_cps_index = Math.floor(Math.random()*4);
           // this.generateCheckpointByIndex(next_cps_index,this.nextCheckpointNode);

            
            //this.generateBG(cps_index,next_cps_index);
        }
       
       
        
        // let armatureDisplay = this.testDragonBones.getComponent(dragonBones.ArmatureDisplay);
        // armatureDisplay.playAnimation("time");
    },

    //根据索引生成关卡 这里是异步生成 node是用于接收的生成关卡节点
    generateCheckpointByIndex:function(index,checkpointNode) {
        let self = this;
       
        let pathOfPrefab = "Prefab/checkpoint" + this.cps[index];
        cc.loader.loadRes(pathOfPrefab, function (err, prefab) {
           self.checkPointLoadSuccess(prefab,checkpointNode);
        });
    },

    checkPointLoadSuccess:function(prefab,checkpointNode) {
        let newNode = cc.instantiate(prefab);
       newNode.setPosition(cc.v2(newNode.getContentSize().width*0.5,newNode.getContentSize().height*0.5));
        checkpointNode.addChild(newNode);
        cc.log(newNode.getContentSize());
        
        
       
    },

    //传入两关，来完美的生成背景图并且滚动，
    //若curIndex = -1,则在其后添加nextIndex背景
    //若nextIndex = -1,则在当前背景后面添加结束背景。
    generateBG:function(curIndex,nextIndex) {

    },

    gameOver:function() {
        cc.log("gameover~!!");
        cc.director.loadScene('selectCheckpoint');  
    },

    // called every frame
    update: function (dt) {

        let bg1Y = this.currentCheckpointNode.getPosition().y;
        let bg2Y = this.nextCheckpointNode.getPosition().y;

        if(bg1Y<=this.bgMinY) {
            this.currentCheckpointNode.setPosition(this.currentCheckpointNode.getPosition().x,bg2Y+this.h-this.bgSpeed*dt*60);
        }else {
            bg1Y -= this.bgSpeed*dt*60;
            this.currentCheckpointNode.setPosition(this.currentCheckpointNode.getPosition().x,bg1Y);
        }

        if(bg2Y<=this.bgMinY) {
            this.nextCheckpointNode.setPosition(this.nextCheckpointNode.getPosition().x,bg1Y+this.h);
        }else {
            bg2Y -= this.bgSpeed*dt*60;
            this.nextCheckpointNode.setPosition(this.nextCheckpointNode.getPosition().x,bg2Y);
        }
    },


});
