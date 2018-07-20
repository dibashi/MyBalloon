// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html


//这个脚本只处理 最最普通的关卡， 具体的就是：当节点内（除了墙体）的某个刚体过了一个阀值，就给予重力加速度，其他的不管
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },


        thresholdOfCommotion: 0,//规定了整个关卡给予刚体重力的位置阀值

        wall1: {
            default: null,
            type: cc.Node,
        },

        wall2: {
            default: null,
            type: cc.Node,
        },



      

        // rigidBodyCountArray:null,//判断此集合里是否有刚体，没有就删除本节点
    },


    onLoad() {
        this.addGravityProperties(this.node);
        this.thresholdOfGravity = 1600;
          



        //5秒一轮询，看其内部是否还有刚体，若没有则删除该结点
        this.schedule(this.removeThis, 5);
    },

    removeThis: function () {
        //cc.log("普通关卡 检测是否有刚体！");
        if (this.hasRigidBody(this.node) == false) {
            // cc.log("没有刚体了！");
            this.node.destroy();
        }
    },

    hasRigidBody: function (node) {
        let cr = node.children;
        let hasFlag = false; //是否有刚体 false 没有刚体 true 有刚体
        for (let i = 0; i < cr.length; i++) {
            if (this.hasRigidBody(cr[i]) == true) {
                hasFlag = true;
                break;
            }
        }
        if (hasFlag == false && node.getComponent(cc.RigidBody) == null) {
            return false;
        }
        return true;
    },

    //初始化刚体节点的重力属性 如 碰撞后 给予重力，过阀值后给予重力。
    addGravityProperties: function (node) {
        let children = node.children;
       
        for (let i = 0; i < children.length; i++) {
            this.addGravityProperties(children[i]);
        }
        if (node.getComponent(cc.RigidBody) != null) {
            if(node.getComponent("rigidBodyJS")!= null) {
                node.getComponent("rigidBodyJS").gravityFlagOfThreshold = false;
                node.getComponent("rigidBodyJS").gravityFlagOfHit = true;
            } else if(node.getComponent("diamond")!= null) { //是钻石
                node.getComponent("diamond").gravityFlagOfThreshold = true;
                node.getComponent("diamond").gravityFlagOfHit = true;
            }
           
        }
    },

    update(dt) {
        // cc.log("yy--> " + this.wall1.getComponent(cc.RigidBody).getWorldPosition().y);
        // cc.log(this.wall2.x - this.wall1.x);
        // cc.log(this.wall1.width * 0.5 + this.wall2.width * 0.5 + 100 + 50);
        if(this.wall1.getComponent(cc.RigidBody).getWorldPosition().y<this.thresholdOfGravity) {
            if ((this.wall2.x - this.wall1.x) > (this.wall1.width * 0.5 + this.wall2.width * 0.5 + 100 + 50)) {
              
                // this.wall1.getComponent("rigidBodyJS").linearVelocity = cc.v2(100000,0);
                // this.wall2.getComponent("rigidBodyJS").linearVelocity = cc.v2(-1000000,0);
                this.wall1.x = this.wall1.x+1;
                this.wall2.x = this.wall2.x -1;
            } else {
                // this.wall1.getComponent("rigidBodyJS").linearVelocity = cc.v2(0,0);
                // this.wall2.getComponent("rigidBodyJS").linearVelocity = cc.v2(0,0);
            }
        }
       
    },


});
