cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
      
    },

     //无尽模式
    goGame:function() {
        cc.sys.localStorage.setItem('currentCheckpoint', -1);//-1无尽模式
        cc.director.loadScene('gameScene');    
    },

    //进入关卡选择界面
    goSelectCheckpoint:function() {
        cc.director.loadScene('selectCheckpoint');    
    },

    // use this for initialization
    onLoad: function () {
        let isloaded = cc.sys.localStorage.getItem("isLoaded");
        if (isloaded == 0 || isloaded == null) {
            cc.sys.localStorage.setItem('isLoaded', 1);
            cc.sys.localStorage.setItem("bestScore",0);
        }else {
            cc.sys.localStorage.setItem('isLoaded', parseInt(isloaded) + 1);
        }
    },

    // called every frame
    update: function (dt) {

    },
});
