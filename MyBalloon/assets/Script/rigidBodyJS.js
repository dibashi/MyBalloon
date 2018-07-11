// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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

        rigidBodyOfNode: null,//此node的刚体组件
        flag: false,//每个刚体 都有一个内部的flag，用于其关卡内的操作

        gravityHasBeenGiven: false,//用于标记重力是否给过 
        gravityFlagOfThreshold: false, //碰到之后给予重力
        gravityFlagOfHit: false,//过了阀值给予重力
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.thresholdOfGravity = 1350;
    },

    start() {
        this.rigidBodyOfNode = this.node.getComponent(cc.RigidBody);
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
       
        if (this.gravityHasBeenGiven == false && otherCollider.node.group != "wall") { //没给过重力
            if (this.gravityFlagOfHit == true) { //根据阀值给重力

               // cc.log("碰撞： 给到重力！");
                this.node.getComponent(cc.RigidBody).gravityScale = 1;
                this.gravityHasBeenGiven = true;
            }
        }

    },

    update(dt) {
        let thisPosition = this.node.parent.convertToWorldSpaceAR(this.node.position);
        let thisNodePosX = thisPosition.x;
        let thisNodePosY = thisPosition.y;

       // cc.log("阀值： "  + this.thresholdOfGravity + "   y值： " + thisNodePosY);
        if (this.gravityHasBeenGiven == false) { //没给过重力
            //cc.log("没有给重力！");
            if (this.gravityFlagOfThreshold == true) { //根据阀值给重力
                if (thisNodePosY < this.thresholdOfGravity) { //到达阀值
                    this.node.getComponent(cc.RigidBody).gravityScale = 1;
                    this.gravityHasBeenGiven = true;
                    //cc.log("阀值：给上重力");
                }
            }
        }
        //!不要删上面，不然新加的关卡也会被删除，各个关卡宽边 不要超出屏幕420像素!!
        if (thisNodePosY < -1000 ||thisNodePosX >1500 ||thisNodePosX<-420 ) {
            this.node.removeFromParent();
            //应该再向其父结点发送已删除，让其查询其是否还有刚体子节点，若没有，则删除自己，不然那个脚本还在运行
        }
    },
});
