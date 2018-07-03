cc.Class({
    extends: cc.Component,

    properties: {


    },



    // use this for initialization
    onLoad: function () {
        cc.director.getPhysicsManager().enabled = true; //开启物理系统，否则在编辑器里做的一切都没有任何效果

        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit; //开启物理调试信息
        //cc.director.getPhysicsManager().debugDrawFlags = 0; 设置为0则关闭调试
        cc.director.getPhysicsManager().gravity = cc.v2(0, -320);//-320像素/秒的平方，这个是默认值，为了以后调试先放在这

        var manager = cc.director.getCollisionManager(); //碰撞接口
        manager.enabled = true;
        manager.enabledDebugDraw = true; //显示碰撞边框

        var self = this;
        //初始化要根据checkpoint来读取相应的关卡数据

        //1读取 数据 还是加载场景？ wtf
        cc.log("game scenen!");
        
        //读取prefab 然后放入到 gameLayer中，让 卫士，气球，敌人，奖励品，墙之间去交互
        //这个prefab中 会有敌人和奖品（金币）还会有一些障碍物（黑色的墙）

        // let currentCheckpoint = cc.sys.localStorage.getItem('currentCheckpoint');
        // let pathOfPrefab = "Prefab/checkpoint" + currentCheckpoint;
        // cc.loader.loadRes(pathOfPrefab, function (err, prefab) {
        //     let newNode = cc.instantiate(prefab);
        //     self.node.getChildByName("gameLayer").addChild(newNode);
        // });
    },

    // called every frame
    update: function (dt) {

    },


});
