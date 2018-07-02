cc.Class({
    extends: cc.Component,

    properties: {
       
     
    },

   

    // use this for initialization
    onLoad: function () {
        var  self = this;
       //初始化要根据checkpoint来读取相应的关卡数据
       
       //1读取 数据 还是加载场景？ wtf
       cc.log("game scenen!");
       //读取prefab 然后放入到 gameLayer中，让 卫士，气球，敌人，奖励品，墙之间去交互
       //这个prefab中 会有敌人和奖品（金币）还会有一些障碍物（黑色的墙）
       let currentCheckpoint = cc.sys.localStorage.getItem('currentCheckpoint');

        let pathOfPrefab = "Prefab/checkpoint"+currentCheckpoint;
        cc.log(pathOfPrefab);
       
        cc.loader.loadRes(pathOfPrefab, function (err, prefab) {
            cc.log(prefab);
            cc.log(self.node.getChildByName("gameLayer"));
            let newNode = cc.instantiate(prefab);
            self.node.getChildByName("gameLayer").addChild(newNode);
        });
    },

    // called every frame
    update: function (dt) {

    },


});
