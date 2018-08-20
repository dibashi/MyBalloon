cc.Class({
    extends: cc.Component,

    properties: {
        diamondLabel: cc.Label,

        checkPoints: {
            default: null,
            type: cc.Node,
        },

    },

    goCheckpoint: function (event, eventData) {
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
        //console.log("执行到 onload  selectCheckPoint!~~");
        //this.refreshCheckPoint();
        this.diamondLabel.string = cc.sys.localStorage.getItem("diamondCount");
    },

    refreshCheckPoint: function () {

        //从1计数 第一关是1
        let dangQianGuanKa = parseInt(cc.sys.localStorage.getItem("dangQianGuanKa"));
        //console.log("pre dangQianGuanKa " +dangQianGuanKa);
        if(dangQianGuanKa == null || typeof(dangQianGuanKa) == undefined || isNaN(dangQianGuanKa)) {
            dangQianGuanKa = 1;
        }
        //console.log("dangQianGuanKa  " +dangQianGuanKa);
        let cps = this.checkPoints.children;
        for (let i = 0; i < cps.length; i++) {

            if (i < (dangQianGuanKa - 1)) {
                cps[i].opacity = 255;
                cps[i].getComponent(cc.Button).interactable = true;
                cps[i].getChildByName("tubiao_wancheng").active = true;
            } else if (i == (dangQianGuanKa - 1)) {
                cps[i].opacity = 255;
                cps[i].getComponent(cc.Button).interactable = true;
                cps[i].getChildByName("tubiao_wancheng").active = false;
            } else if (i > (dangQianGuanKa - 1)) {
                cps[i].opacity = 70;
                cps[i].getComponent(cc.Button).interactable = false;
                cps[i].getChildByName("tubiao_wancheng").active = false;
            }
        }
    },

    // called every frame
    update: function (dt) {

    },

    goMainLayer: function () {

        cc.director.loadScene('start');
    },
});
