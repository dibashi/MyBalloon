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

        
        operationalSetOfGravity: null,
       
      

        hy: 0,
        balloonPos: null,

        howManyMetersDown:300,//定义 下降多少距离 开始表演
        
    },


    onLoad() {

    },


    start() {

       

       
        
        this.operationalSetOfGravity = this.stripes.children;
        for(let i =0;i<this.operationalSetOfGravity.length;i++) {
            this.operationalSetOfGravity[i].getComponent("rigidBodyJS").flag = false;
        }
        this.hy = cc.director.getVisibleSize().height;

        let balloon = cc.find("Canvas/gameLayer/balloon");

        this.balloonPos = balloon.getComponent(cc.RigidBody).getWorldPosition();
        cc.log(this.balloonPos);
        
       
        this.schedule(this.clean, 3);
    },

    clean:function() {
        if(!this.hasRigidBody(this.node)) {
            cc.log("清楚关卡2");
            this.node.removeFromParent();
            this.node.destroy();
        }
    },

    hasRigidBody:function() {
        cc.log("this.stripes.children.length");
        cc.log(this.stripes.children.length);
        return this.stripes.children.length != 0;
    },

    //dt就是这帧与上一帧的时间差，这个函数在绘制之前调用的，改变此节点的属性，然后绘制。
    //有一个问题需要考虑，每个人的手机不一样，这个dt就是不一样的，如何统一？先不管了
    //这里做的主要逻辑是让整个node下落，以后和背景图的速度一致！
    update(dt) {

        for (let i = 0; i < this.operationalSetOfGravity.length; i++) {
            
            if (this.operationalSetOfGravity[i] != null && this.operationalSetOfGravity[i].getComponent("rigidBodyJS").flag == false) {
              
                if (this.operationalSetOfGravity[i].parent != null) {
                  //  cc.log(this.operationalSetOfGravity[i].getComponent("rigidBodyJS").flag);
                    let rr = this.operationalSetOfGravity[i].getComponent(cc.RigidBody);
                    let aa = rr.getWorldPosition();
                    if (aa.y < this.hy - this.howManyMetersDown) {
                         cc.log("给上速度了！");
                        
                        let vec = cc.v2((this.balloonPos.x - aa.x) * 0.3, (this.balloonPos.y - aa.y) * 0.3);
                        cc.log(vec);
                        this.operationalSetOfGravity[i].getComponent(cc.RigidBody).applyLinearImpulse(vec, rr.getWorldCenter(), true);
                        
                        this.operationalSetOfGravity[i].getComponent("rigidBodyJS").flag = true;//之后不再给予冲量
                    }
                }
            }
        }

    },
});
