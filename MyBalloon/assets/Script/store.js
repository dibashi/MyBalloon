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

        inviteLabel: {
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
        //定义数据，有的是用钻石购买，有的使用邀请币购买
        this.skinBuyDatas =  [
            { buyType: 'diamond', price: 60},//如果将来改数值 只需与界面的lable同步
            { buyType: 'diamond', price: 60},

            { buyType: 'diamond', price: 60},
            { buyType: 'diamond', price: 60},

            { buyType: 'diamond', price: 60},
            { buyType: 'diamond', price: 60},

            { buyType: 'diamond', price: 60},
            { buyType: 'diamond', price: 60},

            { buyType: 'diamond', price: 60},
            { buyType: 'inviteCurrency', price: 2},//如果将来改数值 只需与界面的lable同步

            { buyType: 'inviteCurrency', price: 3},
            { buyType: 'inviteCurrency', price: 5},
        ];
        this.refreshBtnState();
    },

    refreshBtnState: function () {
        
        let currentQQID = cc.sys.localStorage.getItem('currentSkinID');

        let panelCount = this.panels.children.length;
        for (let i = 0; i < panelCount; i++) {
            let suffix = "0";
            if (i < 9) {//0~8
                suffix = "0" + (i + 1);
            } else {
                suffix = "" + (i + 1);
            }
           
            let panel = this.panels.getChildByName("panel" + suffix);
            let isHasQQSkin = cc.sys.localStorage.getItem('qq' + suffix) == 1 ? true : false;

            this._refreshSingleBtn(panel, suffix, currentQQID, isHasQQSkin,i);
        }

        //刷新钻石显示
        this.diamondLabel.getComponent(cc.Label).string = cc.sys.localStorage.getItem('diamondCount');
        //刷新邀请币显示
        this.inviteLabel.getComponent(cc.Label).string = cc.sys.localStorage.getItem('recommendedCurrency');
    },


    _refreshSingleBtn: function (panel, suffix, currentQQID, isHasQQSkin,index) {
        if (isHasQQSkin) { //已拥有
            
            panel.getChildByName("priceNode").active = false;
            //panel.getChildByName("useLabel").active = true;
            if (currentQQID == suffix) { //已使用
               
                panel.getChildByName("purchaseBtn").getComponent(cc.Sprite).spriteFrame = this.selectedSprite.spriteFrame;
                panel.getChildByName("purchaseBtn").getComponent(cc.Button).interactable = false;
            } else {
               
                panel.getChildByName("purchaseBtn").getComponent(cc.Sprite).spriteFrame = this.selectSprite.spriteFrame;
                panel.getChildByName("purchaseBtn").getComponent(cc.Button).interactable = true;
            }
        } else {//未拥有 要先检测 他的钻石或者邀请币是否够，不够的话，按钮设置为不可点击
            panel.getChildByName("priceNode").active = true;
            
            panel.getChildByName("purchaseBtn").getComponent(cc.Sprite).spriteFrame = this.goumaiSprite.spriteFrame;
            //先判断用什么购买，然后判断那个值是否够
            if(this.skinBuyDatas[index].buyType == 'diamond') {
                let diamondCount = parseInt(cc.sys.localStorage.getItem('diamondCount'));
                if(diamondCount>= this.skinBuyDatas[index].price) {
                    panel.getChildByName("purchaseBtn").getComponent(cc.Button).interactable = true;
                    panel.getChildByName("purchaseBtn").opacity = 255;
                } else {
                    panel.getChildByName("purchaseBtn").getComponent(cc.Button).interactable = false;
                    panel.getChildByName("purchaseBtn").opacity = 100;
                }
            } else if(this.skinBuyDatas[index].buyType == 'inviteCurrency') {
                let rc = parseInt(cc.sys.localStorage.getItem('recommendedCurrency'));
                if(rc>= this.skinBuyDatas[index].price) {
                    panel.getChildByName("purchaseBtn").getComponent(cc.Button).interactable = true;
                    panel.getChildByName("purchaseBtn").opacity = 255;
                } else {
                    panel.getChildByName("purchaseBtn").getComponent(cc.Button).interactable = false;
                    panel.getChildByName("purchaseBtn").opacity = 100;
                }
            }
            
        }
    },


    // called every frame
    update: function (dt) {

    },
    //eventData: 01,02,03,04....10标记哪些皮肤按钮被点击
    purchaseClick: function (event, eventData) {

        let isHasQQSkin = cc.sys.localStorage.getItem('qq' + eventData);
        if (isHasQQSkin == 1) { //拥有该气球
            //判断当前是否使用的是该气球的皮肤
            
            let currentQQID = cc.sys.localStorage.getItem('currentSkinID');
            if (eventData == currentQQID) {//如果是，则什么也不用做，1不能购买，2不能选择出战

            } else {//当前不是该气球的ID，则可选择出战
                cc.sys.localStorage.setItem('currentSkinID', eventData);//将当前气球索引置为这个
                this.refreshBtnState();//刷新所有按钮状态，比如当前气球刷新了，之前的气球就可再选择出战
            }
        } else { //没有该气球，点击可购买，目前先按照钻石购买，之后加入别的逻辑
            //这里有个假定，就是已经刷新了，说明钻石数量是“够”买这个皮肤的，不然按钮是无法点击的
            let diamondCount = parseInt(cc.sys.localStorage.getItem('diamondCount'));
            let price = 0;
            switch (eventData) {
                case "01":
                    price = 60;//这一行无任何意义，应为01气球上去已经送给玩家了，这里随便写下
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
                case "05":
                    price = 60;
                    break;
                case "06":
                    price = 60;
                    break;
                case "07":
                    price = 60;
                    break;
            }
            //钻石数值修改
            cc.sys.localStorage.setItem('diamondCount', diamondCount - price);

            let inviteCurrency = parseInt(cc.sys.localStorage.getItem('recommendedCurrency'));
            switch (eventData) {
                case "08":
                    price = 2;
                    break;
                case "09":
                    price = 3;
                    break;
                case "10":
                    price = 5;
                    break;
            }

            cc.sys.localStorage.setItem('recommendedCurrency', inviteCurrency - price);

            //是否拥有某气球的数值修改
            cc.sys.localStorage.setItem('qq' + eventData, 1);
            //根据修改后的数值刷新界面显示
            this.refreshBtnState();
        }
    },
});
