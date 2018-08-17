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




       

        //往小球身上飞的五角星们
        rigidBodys02: {
            default: null,
            type: cc.Node,
        },

        balloonPos: null, //气球的位置，用于给五角星们一个速度方向
     
        hasGivenVArray2: null,//标记内部节点是否给过速度 注：标记的是rigidBodys02中的刚体
    },


    onLoad() {

    },


    start() {
        this.thresholdOfGravity1 = 960;
        this.thresholdOfGravity2 = 1600;//定义 下降多少距离 开始表演
        this.addGravityProperties(this.node);

       

        this.hasGivenVArray2 = new Array();
        for (let j = 0; j < this.rigidBodys02.children.length; j++) {
            this.hasGivenVArray2[j] = false;
        }

        let balloon = cc.find("Canvas/gameLayer/balloon");
        if (balloon != null) { //balloon有可能在前面已经被碰到被删除了
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
            if (node.getComponent("rigidBodyJS") != null) {
                node.getComponent("rigidBodyJS").gravityFlagOfThreshold = false;
                node.getComponent("rigidBodyJS").gravityFlagOfHit = true;
            } else if (node.getComponent("diamond") != null) { //是钻石
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

    update(dt) {
        //往气球身上飞的五角星们
        let children2 = this.rigidBodys02.children;
        let childCount2 = children2.length;
        for (let i = 0; i < childCount2; i++) {
            if (children2[i] != null && this.hasGivenVArray2[i] == false) {
                let rr = children2[i].getComponent(cc.RigidBody);
                let aa = rr.getWorldPosition();
                if (aa.y < this.thresholdOfGravity2) {
                    let vec = cc.v2(0, 0);
                    let ratio = 0.6;
                    switch (children2[i].name) {
                        case "pentagram1":
                            vec = cc.v2((this.balloonPos.x - aa.x) * ratio * 0.25, (this.balloonPos.y - aa.y) * ratio);
                            break;
                        case "pentagram2":
                            vec = cc.v2((this.balloonPos.x - aa.x) * ratio * 0.5, (this.balloonPos.y - aa.y) * ratio);
                            break;
                        case "pentagram3":
                            vec = cc.v2((this.balloonPos.x - aa.x) * ratio * 0.75, (this.balloonPos.y - aa.y) * ratio);
                            break;
                        case "pentagram4":
                            vec = cc.v2((this.balloonPos.x - aa.x) * ratio * 1.0, (this.balloonPos.y - aa.y) * ratio);
                            break;

                        case "pentagram5":
                        //console.log("执行到5")
                            vec = cc.v2((this.balloonPos.x - aa.x) * ratio * 1.1, (this.balloonPos.y - aa.y) * ratio* 1.1);
                            break;
                        case "pentagram6":
                        //console.log("执行到6")
                            vec = cc.v2((this.balloonPos.x - aa.x) * ratio * 1.2, (this.balloonPos.y - aa.y) * ratio* 1.2);
                            break;
                        case "pentagram7":
                            //console.log("执行到7")
                            vec = cc.v2((this.balloonPos.x - aa.x) * ratio * 1.3, (this.balloonPos.y - aa.y) * ratio* 1.3);
                            break;
                    }
                    rr.linearVelocity = vec;
                    this.hasGivenVArray2[i] = true;//之后不再给予速度
                }
            }
        }
     



    },
});
