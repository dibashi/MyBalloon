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

        // bigCircle1Body: null,
        // bigCircle2Body: null,
        // bigCircle1RunFlag: false,
        // bigCircle2RunFlag: false,
    },

   
    onLoad() {
        this.operationalSetOfGravity = new Array();
        let cd = this.stripes.children;

        for(let i = 0; cd.length;i++) {
            this.operationalSetOfGravity.push({"node" : cd[i],"flag" : false});
        }
        cc.log(this.operationalSetOfGravity);
    },


    start() {

       
        // cc.log(this.operationalSetOfGravity);

        // this.bigCircle1RunFlag = false;
        // this.bigCircle2RunFlag = false;

        // this.wx = cc.director.getVisibleSize().width;
        // this.hy = cc.director.getVisibleSize().height;

        // this.bigCircle1Body = this.bigCircle1.getComponent(cc.RigidBody);
        // this.bigCircle2Body = this.bigCircle2.getComponent(cc.RigidBody);
    },

    //dt就是这帧与上一帧的时间差，这个函数在绘制之前调用的，改变此节点的属性，然后绘制。
    //有一个问题需要考虑，每个人的手机不一样，这个dt就是不一样的，如何统一？先不管了
    //这里做的主要逻辑是让整个node下落，以后和背景图的速度一致！
    update(dt) {

        // if(this.bigCircle1!=null && this.bigCircle1.parent != null) {
        //     let big1Hy = this.bigCircle1.parent.convertToWorldSpaceAR(this.bigCircle1.getPosition()).y;

        //     if (this.bigCircle1RunFlag == false && big1Hy < this.hy - 150) {
        //         this.bigCircle1RunFlag = true;
        //         this.bigCircle1Body.applyLinearImpulse(cc.v2(10000, -20000),this.bigCircle1Body.getWorldCenter(),true);
        //     }
        // }
       
       
        
        // if(this.bigCircle1!=null && this.bigCircle1.parent != null) {
        //     let big2Hy = this.bigCircle2.parent.convertToWorldSpaceAR(this.bigCircle2.getPosition()).y;


        //     if (this.bigCircle2RunFlag == false && big2Hy < this.hy - 150) {
        //         this.bigCircle2RunFlag = true;
        //         this.bigCircle2Body.applyLinearImpulse(cc.v2(10000, -20000),this.bigCircle1Body.getWorldCenter(),true);
        //     }
        // }
       
      

    },
});
