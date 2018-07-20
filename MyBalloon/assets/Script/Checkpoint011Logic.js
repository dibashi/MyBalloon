// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html


//这个脚本只处理第11关，因为其内部与第11关的一些物体紧耦合
cc.Class({
    extends: cc.Component,

    properties: {

     

        thresholdOfCommotion: 1600,//规定了整个关卡给予刚体重力的位置阀值
      

        bigCircle1: {
            default: null,
            type: cc.Node,
        },

        bigCircle2: {
            default: null,
            type: cc.Node,
        },

        bigCircle1Body: null,
        bigCircle2Body: null,
        bigCircle1RunFlag: false,
        bigCircle2RunFlag: false,

       // rigidBodyCountArray:null,//判断此集合里是否有刚体，没有就删除本节点
    },

   
    onLoad() {
        this.addGravityProperties(this.node);
        this.thresholdOfGravity = 1800
        this.bigCircle1RunFlag = false;
        this.bigCircle2RunFlag = false;
        this.bigCircle1Body = this.bigCircle1.getComponent(cc.RigidBody);
        this.bigCircle2Body = this.bigCircle2.getComponent(cc.RigidBody);
        
        this.schedule(this.removeThis,5);
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

    removeThis:function() {
      
        if(this.hasRigidBody(this.node) == false) {
           
            this.node.destroy();
        }
    },

    hasRigidBody:function(node){
        let cr = node.children;
        let hasFlag = false; //是否有刚体 false 没有刚体 true 有刚体
        for(let i = 0; i<cr.length;i++) {
            if(this.hasRigidBody(cr[i]) == true){
                hasFlag = true;
                break;
            }
        }
        if(hasFlag == false && node.getComponent(cc.RigidBody) == null) {
            return false;
        }
        return true;
    },

    update(dt) {    

        if(this.bigCircle1!=null && this.bigCircle1.parent != null) {
            //let big1Hy = this.bigCircle1.parent.convertToWorldSpaceAR(this.bigCircle1.getPosition()).y;
            let big1Hy = this.bigCircle1Body.getWorldPosition().y;
            if (this.bigCircle1RunFlag == false && big1Hy < this.thresholdOfGravity) {
                this.bigCircle1RunFlag = true;
                //this.bigCircle1Body.applyLinearImpulse(cc.v2(-10000, -20000),this.bigCircle1Body.getWorldCenter(),true);
                this.bigCircle1Body.linearVelocity = cc.v2(100,-300);
                this.bigCircle1Body.gravityScale = 1;
            }
        }
       
       
        if(this.bigCircle2!=null && this.bigCircle2.parent != null) {
            //let big2Hy = this.bigCircle2.parent.convertToWorldSpaceAR(this.bigCircle2.getPosition()).y;
            let big2Hy = this.bigCircle2Body.getWorldPosition().y;

            if (this.bigCircle2RunFlag == false && big2Hy < this.thresholdOfGravity) {
                this.bigCircle2RunFlag = true;
                //this.bigCircle2Body.applyLinearImpulse(cc.v2(10000, -20000),this.bigCircle2Body.getWorldCenter(),true);
                this.bigCircle2Body.linearVelocity = cc.v2(-100,-300);
                this.bigCircle2Body.gravityScale = 1;
            }
        }

    },
});
