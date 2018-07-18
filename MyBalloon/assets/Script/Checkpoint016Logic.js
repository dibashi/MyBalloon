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
     

        thresholdOfCommotion: 0,//规定了整个关卡给予刚体重力的位置阀值
       
      

        positionRigidBody:{
            default: null,
            type: cc.Node,
        },
       
        hasEmit:false,//是否已经开启发射模式
        
        generateCount:12,//发射多少个五角星
    },

   
    onLoad() {
        this.addGravityProperties(this.node);
        this.thresholdOfGravity = 1850;
        
       
        this.emitIndex = 0;
        
        //5秒一轮询，看其内部是否还有刚体，若没有则删除该结点
        this.schedule(this.removeThis,5);
    },

    removeThis:function() {
        //cc.log("普通关卡 检测是否有刚体！");
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

    update(dt) {
        if(this.hasEmit == false && this.positionRigidBody.getComponent(cc.RigidBody).getWorldPosition().y<this.thresholdOfGravity) {
            this.hasEmit = true;
            
            for(let i = 0; i<this.generateCount;i++) {
                this.node.runAction(cc.sequence(cc.delayTime(0.15*(i)), cc.callFunc(this.emit,this)));
            }
        }
    },

    emit:function() {
        let hudu = (2*Math.PI*this.emitIndex/this.generateCount) * 4; //弧度*2 扩大
        let cloneNode = cc.instantiate(this.positionRigidBody);
        cloneNode.parent = this.positionRigidBody.parent;
       
        cloneNode.setPosition(cloneNode.x + 150*Math.cos(hudu),cloneNode.y + 150*Math.sin(hudu));
        //cloneNode.setPosition(cloneNode.x +50 ,cloneNode.y+50 );
        
        cloneNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(300*Math.cos(hudu),300*Math.sin(hudu));
        this.emitIndex++;
    },
        
});
