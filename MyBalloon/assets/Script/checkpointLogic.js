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
        checkpointSpeed:2,//用来决定下落的速度

        thresholdOfCommotion:0,//规定了整个关卡落到什么位置开始处理一些事件，比如降落到100，某个挡板开始动，某些球开始落
    },

    //此脚本是一个关卡的公共逻辑，在onLoad中要做的就是对整个关卡数据进行位置初始化
    //如何才能具有统一的位置初始化？1，内部的对象摆好内部的位置（在prefab中）
    //2，整体的位置在onload中进行整体的平移摆放即可
    onLoad() {
        let wx = cc.director.getVisibleSize().width;
        let hy = cc.director.getVisibleSize().height;
        this.node.setPosition(0, hy);


    },


    start() {

    },

    //dt就是这帧与上一帧的时间差，这个函数在绘制之前调用的，改变此节点的属性，然后绘制。
    //有一个问题需要考虑，每个人的手机不一样，这个dt就是不一样的，如何统一？先不管了
    //这里做的主要逻辑是让整个node下落，以后和背景图的速度一致！
    update(dt) {
       //this.node.y-= checkpointSpeed;//这种写法。。如果有一帧用户手机较卡，耗时较长，物体的移动速度就会明显变慢

       if(this.node.y<=this.thresholdOfCommotion) {
           //1，敌人们开始表演

           //2,下次循环还会进来，怎么办？ 而且也不一定光在这里表演，可能再下落点继续表演？
           //如果写出一个通用的敌人表演方法？
       }

       this.node.y -= this.checkpointSpeed*dt*60;//dt*60约等于1，如果某一帧耗时很多，超过预期，则让其移动的多一点
    },
});
