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
        operationalSetOfGravity: null,

        howManyMetersDown:300,

       // rigidBodyCountArray:null,//判断此集合里是否有刚体，没有就删除本节点
    },

    //此脚本是一个关卡的公共逻辑，在onLoad中要做的就是对整个关卡数据进行位置初始化
    //如何才能具有统一的位置初始化？1，内部的对象摆好内部的位置（在prefab中）
    //2，整体的位置在onload中进行整体的平移摆放即可
    //这个脚本 除wall之外 都在某个阀值给予了重力加速度
    onLoad() {
        
        this.thresholdOfCommotion = 1920 - this.howManyMetersDown;//初始化阀值
        this.operationalSetOfGravity = new Array();//后续的操作集合

        //获得内部刚体的集合（除了墙体） 接下来对这个集合进行操作
        //判断集合内哪些刚体超过了阀值，直接给予重力加速度，并从集合中删除

        //以递归的方式 给集合中 所有刚体  除 墙体外  加入 操作集合 后续进行重力加速度赋予
        this.addRigidBodyToOperationalSet(this.node);

            
    },


    // start: function () {
    //     this.schedule(this.clean, 3);
    // },

    // clean:function() {

    //     this.rigidBodyCountArray = new Array();
    //     this.hasRigidBody(this.node);
    //     if(this.rigidBodyCountArray.length == 0) {
    //         cc.log("清楚普通关卡！");
    //         this.node.removeFromParent();
    //         this.node.destroy();
    //     }
    // },

    // hasRigidBody:function(node) {

    //     let children = node.children;
       
    //     for (let i = 0; i < children.length; i++) {
           
    //         this.hasRigidBody(children[i]);
    //     }
    //     if (node.getComponent(cc.RigidBody) != null) {
           
    //         this.rigidBodyCountArray.push(node);
    //     }
    // },

    addRigidBodyToOperationalSet: function (node) {
        let children = node.children;
       
        for (let i = 0; i < children.length; i++) {
           
            this.addRigidBodyToOperationalSet(children[i]);
        }
        if (node.getComponent(cc.RigidBody) != null && node.group != "wall") {
            // cc.log("加入操作集合的node ");
            // cc.log(node);
            this.operationalSetOfGravity.push(node);
        }
    },

    //dt就是这帧与上一帧的时间差，这个函数在绘制之前调用的，改变此节点的属性，然后绘制。
    //有一个问题需要考虑，每个人的手机不一样，这个dt就是不一样的，如何统一？先不管了
    //这里做的主要逻辑是让整个node下落，以后和背景图的速度一致！
    update(dt) {

        if (this.operationalSetOfGravity.length != 0) {
            //1，敌人们开始表演

            //2,下次循环还会进来，怎么办？ 而且也不一定光在这里表演，可能再下落点继续表演？
            //如何写出一个通用的敌人表演方法？思路：要定义一个下落点数组，每个索引值有相应的表演函数来处理

            for (let i = 0; i < this.operationalSetOfGravity.length; i++) {//万一 那边因为超出边界 被删除了呢？ 要判断
               

                if (this.operationalSetOfGravity[i] != null && this.operationalSetOfGravity[i].getComponent("rigidBodyJS").flag == false) {
              
                    if (this.operationalSetOfGravity[i].parent != null) {
                     
                        let rr = this.operationalSetOfGravity[i].getComponent(cc.RigidBody);
                        let aa = rr.getWorldPosition();
                        if (aa.y < this.hy - this.howManyMetersDown) {
                            rr.gravityScale = 1;
                            
                            this.operationalSetOfGravity[i].getComponent("rigidBodyJS").flag = true;//之后不再给予重力
                        }
                    }
                }

                

            }
        }


    },
});
