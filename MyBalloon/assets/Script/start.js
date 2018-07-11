cc.Class({
    extends: cc.Component,

    properties: {
        

        settingNode:{
            default:null,
            type: cc.Node,
        },

        settingOnImg:{
            default:null,
            type: cc.Node,
        },

        settingOffImg:{
            default:null,
            type: cc.Node,
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

    goStore:function() {
        cc.director.loadScene('store');    
    },

    settingClick:function() {
        let gsb = cc.sys.localStorage.getItem("gameSoundBG");
        if(gsb == 1) {
            gsb = 0;
        } else {
            gsb = 1;
        }
        cc.sys.localStorage.setItem("gameSoundBG",gsb);
        this.refreshSetting();
    },

    // use this for initialization
    onLoad: function () {

        cc.audioEngine.stopMusic();

        let isloaded = cc.sys.localStorage.getItem("isLoaded");
        if (isloaded == 0 || isloaded == null) {
            cc.sys.localStorage.setItem('isLoaded', 1);
            cc.sys.localStorage.setItem("bestScore",0);
            cc.sys.localStorage.setItem('gameSoundBG',1);
        }else {
            cc.sys.localStorage.setItem('isLoaded', parseInt(isloaded) + 1);
        }

        this.refreshSetting();
    },

    refreshSetting:function() {
        let gsb = cc.sys.localStorage.getItem("gameSoundBG");

        cc.log(gsb + "  !!");
        if(gsb == 1) {
            this.settingNode.getComponent(cc.Sprite).spriteFrame = this.settingOnImg.getComponent(cc.Sprite).spriteFrame;
        } else {
            this.settingNode.getComponent(cc.Sprite).spriteFrame = this.settingOffImg.getComponent(cc.Sprite).spriteFrame;
        }
    },

    // called every frame
    update: function (dt) {

    },
});
