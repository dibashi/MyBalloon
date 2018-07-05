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
        checkpointSpeed: 2,//用来决定下落的速度

        thresholdOfCommotion: 0,//规定了整个关卡给予刚体重力的位置阀值
        operationalSetOfGravity: null,
    },

    //此脚本是一个关卡的公共逻辑，在onLoad中要做的就是对整个关卡数据进行位置初始化
    //如何才能具有统一的位置初始化？1，内部的对象摆好内部的位置（在prefab中）
    //2，整体的位置在onload中进行整体的平移摆放即可
    onLoad() {
       
    },


    start() {
       // let wx = cc.director.getVisibleSize().width;
        // let hy = cc.director.getVisibleSize().height;
       let hy =1920;
      
      
        this.thresholdOfCommotion = -1000;//初始化阀值

        this.operationalSetOfGravity = new Array();//后续的操作集合

        //获得内部刚体的集合（除了墙体） 接下来对这个集合进行操作
        //判断集合内哪些刚体超过了阀值，直接给予重力加速度，并从集合中删除
        let children = this.node.children;
        let cc = this.node.childrenCount;
        for (let i = 0; i < cc; i++) {
            if (children[i].group != 'wall') {//过滤墙体，将其他的刚体加入操作集合中
                this.operationalSetOfGravity.push(children[i]);
            }
        }
    },

    //dt就是这帧与上一帧的时间差，这个函数在绘制之前调用的，改变此节点的属性，然后绘制。
    //有一个问题需要考虑，每个人的手机不一样，这个dt就是不一样的，如何统一？先不管了
    //这里做的主要逻辑是让整个node下落，以后和背景图的速度一致！
    update(dt) {
        //this.node.y-= checkpointSpeed;//这种写法。。如果有一帧用户手机较卡，耗时较长，物体的移动速度就会明显变慢

        
        if (this.operationalSetOfGravity.length != 0) {
            //1，敌人们开始表演

            //2,下次循环还会进来，怎么办？ 而且也不一定光在这里表演，可能再下落点继续表演？
            //如何写出一个通用的敌人表演方法？思路：要定义一个下落点数组，每个索引值有相应的表演函数来处理

            for (let i = 0; i < this.operationalSetOfGravity.length; i++) {
                if (this.operationalSetOfGravity[i].y < this.thresholdOfCommotion) {//过滤墙体，将其他的刚体加入操作集合中
                    this.operationalSetOfGravity[i].getComponent(cc.RigidBody).gravityScale = 1;
                    this.operationalSetOfGravity.splice(i, 1);
                }
            }
        }

        //化为泡影，刚体根本就不管父节点是否移动。。
        //this.node.y -= this.checkpointSpeed * dt * 60;//dt*60约等于1，如果某一帧耗时很多，超过预期，则让其移动的多一点
       // cc.log(this.node.y);
       // cc.log(this.node);
    },
});
