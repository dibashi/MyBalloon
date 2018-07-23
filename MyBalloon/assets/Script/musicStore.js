cc.Class({
    extends: cc.Component,

    properties: {
        // label: {
        //     default: null,
        //     type: cc.Label
        // },
        panels: {
            default: null,
            type: cc.Node,
        },

        diamondLabel: {
            default: null,
            type: cc.Node,
        },

        goumaiSprite: {
            default: null,
            type: cc.Sprite,
        },

        selectSprite: {
            default: null,
            type: cc.Sprite,
        },

        selectedSprite: {
            default: null,
            type: cc.Sprite,
        },
    },



    goStart: function () {
        cc.director.loadScene('start');
    },

    // use this for initialization
    onLoad: function () {
        this.refreshBtnState();
    },

    refreshBtnState: function () {

        let currentMusicID = cc.sys.localStorage.getItem('currentMusicID');

        let panelCount = this.panels.children.length;
        for (let i = 0; i < panelCount; i++) {
            let suffix = "0";
            if (i < 9) {//0~8
                suffix = "0" + (i + 1);
            } else {
                suffix = "" + (i + 1);
            }

            let panel = this.panels.getChildByName("panel" + suffix);
            let isHasMusic = cc.sys.localStorage.getItem('music' + suffix) == 1 ? true : false;

            this._refreshSingleBtn(panel, suffix, currentMusicID, isHasMusic);
        }

        //刷新钻石显示
        this.diamondLabel.getComponent(cc.Label).string = cc.sys.localStorage.getItem('diamondCount');
    },


    _refreshSingleBtn: function (panel, suffix, currentMusicID, isHasMusic) {
        if (isHasMusic) { //已拥有

            panel.getChildByName("priceNode").active = false;
            //panel.getChildByName("useLabel").active = true;
            if (currentMusicID == suffix) { //已使用

                panel.getChildByName("purchaseBtn").getComponent(cc.Sprite).spriteFrame = this.selectedSprite.spriteFrame;
                panel.getChildByName("purchaseBtn").getComponent(cc.Button).interactable = false;
            } else {

                panel.getChildByName("purchaseBtn").getComponent(cc.Sprite).spriteFrame = this.selectSprite.spriteFrame;
                panel.getChildByName("purchaseBtn").getComponent(cc.Button).interactable = true;
            }
        } else {

            panel.getChildByName("priceNode").active = true;
            //panel.getChildByName("useLabel").active = false;

            panel.getChildByName("purchaseBtn").getComponent(cc.Sprite).spriteFrame = this.goumaiSprite.spriteFrame;
            panel.getChildByName("purchaseBtn").getComponent(cc.Button).interactable = true;
        }
    },


    // called every frame
    update: function (dt) {

    },
    //eventData: 01,02,03,04....10标记哪些皮肤按钮被点击
    purchaseClick: function (event, eventData) {

        let isHasMusic = cc.sys.localStorage.getItem('music' + eventData);
        if (isHasMusic == 1) { //拥有该音乐
            //判断当前是否使用的是该音乐

            let currentMusicID = cc.sys.localStorage.getItem('currentMusicID');
            if (eventData == currentMusicID) {//如果是，则什么也不用做，1不能购买，2不能选择出战

            } else {//当前不是该音乐的ID，则可选择出战
                cc.sys.localStorage.setItem('currentMusicID', eventData);//将当前音乐索引置为这个
                this.refreshBtnState();//刷新所有按钮状态，比如当前音乐刷新了，之前的音乐就可再选择出战
            }
        } else { //没有该音乐，点击可购买，目前先按照钻石购买，之后加入别的逻辑
            //这里有个假定，就是已经刷新了，说明钻石数量是“够”买这个皮肤的，不然按钮是无法点击的
            let diamondCount = parseInt(cc.sys.localStorage.getItem('diamondCount'));
            let price = 0;
            switch (eventData) {
                case "01":
                    price = 60;//这一行无任何意义，应为01音乐上去已经送给玩家了，这里随便写下
                    break;
                case "02":
                    price = 60;
                    break;
                case "03":
                    price = 60;
                    break;
                case "04":
                    price = 60;
                    break;
            }
            //钻石数值修改
            cc.sys.localStorage.setItem('diamondCount', diamondCount - price);
            //是否拥有某气球的数值修改
            cc.sys.localStorage.setItem('music' + eventData, 1);
            //根据修改后的数值刷新界面显示
            this.refreshBtnState();
        }
    },
});
