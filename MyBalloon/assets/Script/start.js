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
        
        cc.director.loadScene('game');    
    },

    //进入关卡选择界面
    goCheckpoint:function() {
        cc.director.loadScene('checkpoint');    
    },

    // use this for initialization
    onLoad: function () {
       
    },

    // called every frame
    update: function (dt) {

    },
});
