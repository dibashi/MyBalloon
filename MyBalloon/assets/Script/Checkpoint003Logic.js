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

     

       
       

        bodys1: {
            default: null,
            type: cc.Node,
        },

        bodys2: {
            default: null,
            type: cc.Node,
        },

        bodys3: {
            default: null,
            type: cc.Node,
        },

        bodys4: {
            default: null,
            type: cc.Node,
        },

       
       // rigidBodyCountArray:null,//判断此集合里是否有刚体，没有就删除本节点
    },

   
    onLoad() {
        this.thresholdOfGravity = 1350,//规定了整个关卡给予刚体重力的位置阀值
        this.addGravityProperties(this.node);
        
        this.schedule(this.removeThis,5);
    },

    start() {
        for(let i = 0; i<this.bodys1.children.length; i++) {
            this.bodys1.children[i].getComponent("rigidBodyJS").thresholdOfGravity = this.thresholdOfGravity - 10;
        }

        for(let i = 0; i<this.bodys2.children.length; i++) {
            this.bodys2.children[i].getComponent("rigidBodyJS").thresholdOfGravity = this.thresholdOfGravity + 0;
        }

        for(let i = 0; i<this.bodys3.children.length; i++) {
            this.bodys3.children[i].getComponent("rigidBodyJS").thresholdOfGravity = this.thresholdOfGravity + 10;
        }

        for(let i = 0; i<this.bodys4.children.length; i++) {
            this.bodys4.children[i].getComponent("rigidBodyJS").thresholdOfGravity = this.thresholdOfGravity + 20;
        }
    },

     //初始化刚体节点的重力属性 如 碰撞后 给予重力，过阀值后给予重力。
     addGravityProperties: function (node) {
        let children = node.children;
       
        for (let i = 0; i < children.length; i++) {
            this.addGravityProperties(children[i]);
        }
        if (node.getComponent(cc.RigidBody) != null) {
            if(node.getComponent("rigidBodyJS")!= null) {
                node.getComponent("rigidBodyJS").gravityFlagOfThreshold = true;
                node.getComponent("rigidBodyJS").gravityFlagOfHit = true;
            } else if(node.getComponent("diamond")!= null) { //是钻石
                node.getComponent("diamond").gravityFlagOfThreshold = true;
                node.getComponent("diamond").gravityFlagOfHit = true;
            }
           
        }
    },

    removeThis:function() {
        //cc.log("关卡3 检测是否有刚体！");
        if(this.hasRigidBody(this.node) == false) {
           // cc.log("没有刚体了！");
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
});
