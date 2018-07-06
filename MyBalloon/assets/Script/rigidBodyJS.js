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
        //下面说的都是废话 这个问题 我解决不；了！
    //!!这里的高度判定很复杂，约定 预制内 所有刚体的放入2580~300内！！！！！！！！！！！！！300往下不要方东西 不然会被碰到，最好是400以下不要方东西
        if(this.rigidBodyOfNode.getWorldPosition().x<-100 || this.rigidBodyOfNode.getWorldPosition().x>2020|| this.rigidBodyOfNode.getWorldPosition().y<-200 ) {
         
          //||this.rigidBodyOfNode.getWorldPosition().y>2220
            this.node.removeFromParent();
           
        }
      
    },
});
