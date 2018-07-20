// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html


//这个脚本只处理第2关，因为其内部与第2关的一些物体紧耦合
cc.Class({
    extends: cc.Component,

    properties: {



        //  thresholdOfCommotion: 0,//规定了整个关卡给予刚体重力的位置阀值
        operationalSetOfGravity: null,

        stripes: {
            default: null,
            type: cc.Node,
        },



        // wx: 0,
        // hy: 0,





        hy: 0,
        balloonPos: null,

      

        hasGivenVArray: null,//标记内部节点是否给过速度

    },


    onLoad() {

    },


    start() {

        this.thresholdOfGravity = 1650,//定义 下降多少距离 开始表演
        this.addGravityProperties(this.node);
        

        this.hasGivenVArray = new Array();
        for (let i = 0; i < this.node.children.length; i++) {
            this.hasGivenVArray[i] = false;
        }

        let balloon = cc.find("Canvas/gameLayer/balloon");
        if(balloon != null) { //balloon有可能在前面已经被碰到被删除了
            this.balloonPos = balloon.getComponent(cc.RigidBody).getWorldPosition();
        }
      
        this.schedule(this.removeThis, 5);
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

    removeThis: function () {
        if (this.hasRigidBody(this.node) == false) {
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

    //dt就是这帧与上一帧的时间差，这个函数在绘制之前调用的，改变此节点的属性，然后绘制。
    //有一个问题需要考虑，每个人的手机不一样，这个dt就是不一样的，如何统一？先不管了
    //这里做的主要逻辑是让整个node下落，以后和背景图的速度一致！
    update(dt) {
        let children = this.node.children;
        let childCount = this.node.children.length;
        for (let i = 0; i < childCount; i++) {

            if (children[i] != null && this.hasGivenVArray[i] == false) {

                let rr = children[i].getComponent(cc.RigidBody);
                let aa = rr.getWorldPosition();
                if (aa.y < this.thresholdOfGravity) {
    
                    let vec = cc.v2((this.balloonPos.x - aa.x) * 0.6, (this.balloonPos.y - aa.y) * 0.6);
                    rr.linearVelocity = vec;
                    this.hasGivenVArray[i] = true;//之后不再给予速度
                }
            }
        }

    },
});
