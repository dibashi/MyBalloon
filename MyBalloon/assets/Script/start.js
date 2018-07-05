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
        cc.sys.localStorage.setItem('currentCheckpoint', 0);
        cc.director.loadScene('gameScene');    
    },

    //进入关卡选择界面
    goSelectCheckpoint:function() {
        cc.director.loadScene('selectCheckpoint');    
    },

    // use this for initialization
    onLoad: function () {
       
    },

    // called every frame
    update: function (dt) {

    },
});
