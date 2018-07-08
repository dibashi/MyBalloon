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

        impulseVector: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.impulseVector = cc.v2(0.0, 0.0);
    },

    setImpulseVector(x, y) {
        this.impulseVector = cc.v2(x * 32, y * 32);
    },


    onBeginContact: function (contact, selfCollider, otherCollider) {
       // otherCollider.body.applyLinearImpulse(this.impulseVector, otherCollider.body.getWorldCenter(), true);

        // let children = cc.find("Canvas").getComponent("gameScene").currentCheckpointNode.children;
        // for(let i = 0; i<children.length;i++) {
        //     cc.log("guard   " +children[i].getPosition());
        // }
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {

    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
        //   cc.log("onPreSolve");
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
        // cc.log("onPostSolve");
    },

    start() {

    },
    // update (dt) {},
});
