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

        rigidBodyOfNode:null,//此node的刚体组件

        flag:false,//每个刚体 都有一个内部的flag，用于其关卡内的操作
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.rigidBodyOfNode = this.node.getComponent(cc.RigidBody);
    },



    onBeginContact: function (contact, selfCollider, otherCollider) {

      //  cc.log("circle onBeginContact");
        // cc.log(contact);
        // cc.log(selfCollider);
        // cc.log(otherCollider.body);
        // otherCollider.body.linearVelocity = cc.v2(100,100);

    },

    // // 只在两个碰撞体结束接触时被调用一次
    // onEndContact: function (contact, selfCollider, otherCollider) {
    //     // cc.log("onEndContact");
    // },

    // // 每次将要处理碰撞体接触逻辑时被调用
    // onPreSolve: function (contact, selfCollider, otherCollider) {
    //     //   cc.log("onPreSolve");
    // },

    // // 每次处理完碰撞体接触逻辑时被调用
    // onPostSolve: function (contact, selfCollider, otherCollider) {
    //     // cc.log("onPostSolve");
    // },


    update(dt) {
       // cc.log(this.node.name+"   " +this.rigidBodyOfNode.getWorldPosition());

        if(this.rigidBodyOfNode.getWorldPosition().x<-300 || this.rigidBodyOfNode.getWorldPosition().x>2220 || this.rigidBodyOfNode.getWorldPosition().y<-200) {
          //  ||this.rigidBodyOfNode.getWorldPosition().y>2880
            // cc.log("删除刚体！！");
            // cc.log(this.node);
           
            // this.node.removeComponent(cc.RigidBody);
            // this.node.destroy();
            this.node.removeFromParent();
            // this.node = null;
        }
        // if (this.node.getPosition().y < -1000) {
        //     this.node.setPosition(0, 500);
        //     this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        // }
    },
});