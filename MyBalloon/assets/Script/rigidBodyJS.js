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

        rigidBodyOfNode:null,//此node的刚体组件
        thresholdOfGravity:0,//初始化给予重力阀值
        flag:false,//每个刚体 都有一个内部的flag，用于其关卡内的操作

        gravityHasBeenGiven:false,//用于标记重力是否给过 
        gravityFlagOfThreshold:false, //碰到之后给予重力
        gravityFlagOfHit:false,//过了阀值给予重力
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.rigidBodyOfNode = this.node.getComponent(cc.RigidBody);
    },



    onBeginContact: function (contact, selfCollider, otherCollider) {

      //  cc.log("circle onBeginContact");
        // cc.log(contact);
        // cc.log(selfCollider);
        // cc.log(otherCollider.body);
        // otherCollider.body.linearVelocity = cc.v2(100,100);

    },

    // // 只在两个碰撞体结束接触时被调用一次
    // onEndContact: function (contact, selfCollider, otherCollider) {
    //     // cc.log("onEndContact");
    // },

    // // 每次将要处理碰撞体接触逻辑时被调用
    // onPreSolve: function (contact, selfCollider, otherCollider) {
    //     //   cc.log("onPreSolve");
    // },

    // // 每次处理完碰撞体接触逻辑时被调用
    // onPostSolve: function (contact, selfCollider, otherCollider) {
    //     // cc.log("onPostSolve");
    // },


    update(dt) {
        //下面说的都是废话 这个问题 我解决不；了！
    //!!这里的高度判定很复杂，约定 预制内 所有刚体的放入2580~300内！！！！！！！！！！！！！300往下不要方东西 不然会被碰到，最好是400以下不要方东西
        // if(this.rigidBodyOfNode.getWorldPosition().x<-100 || this.rigidBodyOfNode.getWorldPosition().x>1180|| this.rigidBodyOfNode.getWorldPosition().y<-200 ) {
         
        //   //||this.rigidBodyOfNode.getWorldPosition().y>2220
        //     this.node.removeFromParent();
           
        // }

        //cc.log(this.node.parent.convertToWorldSpaceAR(this.node.position));

        let thisNodePosY = this.node.parent.convertToWorldSpaceAR(this.node.position).y;
        cc.log("aaa" + thisNodePosY);
       

        if(this.gravityHasBeenGiven == false) { //没给过重力
            if(this.gravityFlagOfThreshold == true) { //根据阀值给重力
                if(thisNodePosY<this.thresholdOfGravity) { //到达阀值
                    this.node.getComponent(cc.RigidBody).gravityScale = 1;
                    this.gravityHasBeenGiven = true;
                }
            }
        }

        if(thisNodePosY<-250) {
            
            this.node.removeFromParent();
            
            //应该再向其父结点发送已删除，让其查询其是否还有刚体子节点，若没有，则删除自己，不然那个脚本还在运行
        }

        


        // if (this.operationalSetOfGravity.length != 0) {
        //     //1，敌人们开始表演

        //     //2,下次循环还会进来，怎么办？ 而且也不一定光在这里表演，可能再下落点继续表演？
        //     //如何写出一个通用的敌人表演方法？思路：要定义一个下落点数组，每个索引值有相应的表演函数来处理

        //     for (let i = 0; i < this.operationalSetOfGravity.length; i++) {//万一 那边因为超出边界 被删除了呢？ 要判断
               

        //         if (this.operationalSetOfGravity[i] != null && this.operationalSetOfGravity[i].getComponent("rigidBodyJS").flag == false) {
              
        //             if (this.operationalSetOfGravity[i].parent != null) {
                     
        //                 let rr = this.operationalSetOfGravity[i].getComponent(cc.RigidBody);
        //                 let aa = rr.getWorldPosition();
        //                 if (aa.y < this.hy - this.howManyMetersDown) {
        //                     rr.gravityScale = 1;
                            
        //                     this.operationalSetOfGravity[i].getComponent("rigidBodyJS").flag = true;//之后不再给予重力
        //                 }
        //             }
        //         }

                

        //     }
        // }
      
    },
});
