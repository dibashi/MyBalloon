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

        panel1: {
            default: null,
            type: cc.Node,

        },

        panel2: {
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

        guanKa:0,//0代表无尽模式

      //  heightOfGenerateBody:0, //生成下一波关卡的高度
    },



    // use this for initialization
    onLoad: function () {
       
      //  this.heightOfGenerateBody =   cc.find("Canvas").getContentSize().height;
        //一个关卡的长度
        this.h = this.currentCheckpointNode.getContentSize().height;
        //下限 超过这个值 背景挪上去
        this.bgMinY = this.currentCheckpointNode.getPosition().y - this.h;

        this.cps = new Array();
        this.cps[0] = 1;
        this.cps[1] = 2;
        this.cps[2] = 11;
        this.cps[3] = 15;
        this.cps[4] = 19;

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
        
        this.guanKa = cc.sys.localStorage.getItem('currentCheckpoint');
        if(this.guanKa != 0) {
            let pathOfPrefab = "Prefab/checkpoint" + currentCheckpoint;
            cc.loader.loadRes(pathOfPrefab, function (err, prefab) {
                let newNode = cc.instantiate(prefab);
                self.node.getChildByName("gameLayer").addChild(newNode);
            });
        } else if(this.guanKa == 0) { //无尽模式
            //随机选择一关 便于调试 现在只有四关
           
           // let cps_index = Math.floor(Math.random()*4);
            let cps_index = 1;
            this.generateCheckpointByIndex(cps_index,this.panel1);
            let next_cps_index = 2;
           // let next_cps_index = Math.floor(Math.random()*4);
            this.generateCheckpointByIndex(next_cps_index,this.panel2);

            
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

        //递归：给子节点下的所有子节点以刚体速度
        this.giveRigidBodyVelocity(newNode,-this.bgSpeed*60);
    },

    giveRigidBodyVelocity:function(node,speed) {
        let children = node.children;
        for(let i = 0; i<children.length;i++) {
            this.giveRigidBodyVelocity(children[i],speed);
        }
        if(node.getComponent(cc.RigidBody)!=null) {
            node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,speed);
        }
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
            this.panel1.setPosition(this.currentCheckpointNode.getPosition());
            if(this.guanKa == 0) {
                //似乎不用移除这个容器下的所有节点，因为那是刚体，刚体不会改变速度 让他们自己往下跑，超过某个位置 删除
                this.generateCheckpointByIndex(3,this.panel1);
            }
            
        }else {
            bg1Y -= this.bgSpeed*dt*60;
            this.currentCheckpointNode.setPosition(this.currentCheckpointNode.getPosition().x,bg1Y);
            this.panel1.setPosition(this.currentCheckpointNode.getPosition());
        }
       


        if(bg2Y<=this.bgMinY) {
            this.nextCheckpointNode.setPosition(this.nextCheckpointNode.getPosition().x,bg1Y+this.h);
            this.panel2.setPosition(this.nextCheckpointNode.getPosition());
            if(this.guanKa == 0) {
                //似乎不用移除这个容器下的所有节点，因为那是刚体，刚体不会改变速度 让他们自己往下跑，超过某个位置 删除
                
                this.generateCheckpointByIndex(2,this.panel2);
            }
        }else {
            bg2Y -= this.bgSpeed*dt*60;
            this.nextCheckpointNode.setPosition(this.nextCheckpointNode.getPosition().x,bg2Y);
            this.panel2.setPosition(this.nextCheckpointNode.getPosition());
        }

        
    },


});
