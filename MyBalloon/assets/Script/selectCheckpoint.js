cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        
    },

    goCheckpoint:function(event,eventData) {
        //根据这个eventData来加载相应的关卡，约定好在cocosCreator中为每个按钮设置了不同的
        //eventData，将这个值传给 game，如何传呢？ game那边如何根据eventdata==-1则无尽模式
        //其他数值则直接读取相应的关卡数据并显示？
       // cc.log(eventData);  //从1开始 1 2 3 4  //0表示无尽模式

        //与其麻烦的使用全局变量不如用这个API 
        cc.sys.localStorage.setItem('currentCheckpoint', eventData);
        cc.director.loadScene('gameScene');    
    },

    // use this for initialization
    onLoad: function () {
       
    },

    // called every frame
    update: function (dt) {

    },

    goMainLayer:function() {
       
        cc.director.loadScene('start');  
    },
});
