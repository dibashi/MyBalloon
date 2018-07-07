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

        fixedPositon:null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.fixedPositon = this.node.position;
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {

        cc.log("气球被击中 begin");

        //这里的处理逻辑还是比较多的
        //第1 要判断是谁击中了气球，必须是enemy才处理。
        //如何处理？1 游戏结束，跳转到弹出框，用于表示是否复活？这怎么复活？ 关卡模式可以复活吗？
        //估计只有无限模式才复活
        //再判断结束前，要先播放爆炸动画，动画回调中结束，如果这时候又有敌人触摸到气球 如何判断？
        //需要一个标记位，用来记录
        cc.log(otherCollider);
       if (otherCollider.node.group === "enemy") {
           // this.dead();
           //先用这个，将来用上面那个
           cc.find("Canvas").getComponent("gameScene").gameOver();
        }
    },

    dead: function () {
        this.boomAni();
    },

    boomAni: function () {
        cc.audioEngine.playEffect(this.boomAudio, false);
        this.node.group = "default";
        this.unscheduleAllCallbacks();
        this.scheduleOnce(this.baozhaOver, 0.7);

        let ani = this.node.getComponent(cc.Animation);
        ani.play();

    },

    baozhaOver: function () {
        cc.log("player baozhaover!~");
        this.unscheduleAllCallbacks();
        cc.find("Canvas").getComponent("gameScene").gameOver();
         this.node.destroy();
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
        cc.log("气球被击中 ennd");

        
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
        //   cc.log("onPreSolve");
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
         cc.log("balloon onPostSolve");
        cc.log(this.fixedPositon);
        this.node.position = this.fixedPositon;
    },

    // update (dt) {},
});
