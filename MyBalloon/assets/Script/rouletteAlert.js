// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {


        AdBtn: {
            default: null,
            type: cc.Button
        },

        wheelSp: {
            default: null,
            type: cc.Node
        },







        onWho: null,//在哪个页面上面，当当前页面消失时使得那个页面可点击
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.startFadeIn();


        this.initRoulette();

        this.initDataTable();
    },

    initRoulette: function () {
        //用时间度量由于是浮点数会存在误差，改为用次数
        this.accelerateTime = 3 * 60;
        this.slowDownTime = this.accelerateTime;
        this.accCount = 0;
        this.decCount = this.accCount;
        this.accAngle = 5 * 360;
        this.decAngle = this.accAngle;
        this.wheelState = 0; //0静止 1加速旋转，2减速旋转
        this.curSpeed = 0;
        this.gearNum = 6; //6个齿轮
        this.gearAngle = 360 / this.gearNum;   //每个齿轮的角度
        this.wheelSp.rotation = 0; //用户每次进来都应该是这个角度
        this.finalAngle = 0;                   //最终结果指定的角度
    },

    initDataTable: function () {
        this.prizeDatas = [
            //概率这个值目前没有用到
            { probability: 0.5, prizeName: 'diamond', prizeCount: 5 },//约定随机数值p<=0.5
            { probability: 0.05, prizeName: 'skin', prizeCount: '08' },//0.5<p<=0.55

            { probability: 0.1, prizeName: 'diamond', prizeCount: 100 },//0.55<p<=0.65
            { probability: 0.1, prizeName: 'recommend', prizeCount: 1 },//0.65<p<=0.75

            { probability: 0.2, prizeName: 'diamond', prizeCount: 50 },//0.75<p<=0.95
            { probability: 0.05, prizeName: 'skin', prizeCount: '09' },//0.95<p
        ]
    },


    startFadeIn: function () {
        cc.eventManager.pauseTarget(this.node, true);

        this.node.setScale(2);
        this.node.opacity = 0;

        let cbFadeIn = cc.callFunc(this.onFadeInFinish, this);
        let actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(0.3, 255), cc.scaleTo(0.3, 1)), cbFadeIn);
        this.node.runAction(actionFadeIn);
    },

    onFadeInFinish: function () {

        cc.eventManager.resumeTarget(this.node, true);
    },


    //可以点击代表其值为1
    onGuangGaoClick: function () {

        //观看广告 被点击 
        //没有接入广告，现在直接旋转
        if (this.wheelState !== 0) {
            return;
        }

        this.AdBtn.interactable = false;

        this.wheelState = 1; //开始旋转 update 会自动判断   

        let p = Math.random();
        if (p <= 0.5) {
            this.targetID = 0;
        } else if (0.5 < p <= 0.55) {
            this.targetID = 1;
        } else if (0.55 < p <= 0.65) {
            this.targetID = 2;
        } else if (0.65 < p <= 0.75) {
            this.targetID = 3;
        } else if (0.75 < p <= 0.95) {
            this.targetID = 4;
        } else { //else if (p > 0.95)
            this.targetID = 5;
        }
        this.finalAngle = (360 - this.targetID * 60) + this.accAngle + this.decAngle;

        //0+ a+2a+,.....+this.accelerateTime*a = this.accelerateTime*a*this.accelerateTime *0.5  = this.finalAngle/2==>
        this.accV = this.finalAngle / (this.accelerateTime * this.accelerateTime);
    },



    onFadeOutFinish: function () {
        cc.eventManager.resumeTarget(this.onWho, true);
        this.node.destroy();
    },

    onCancelClick: function () {
        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(0.3, 0), cc.scaleTo(0.3, 2.0)), cbFadeOut);
        this.node.runAction(actionFadeOut);
    },

    start: function () {
        // cc.log('....start');
    },


    update: function (dt) {

        if (this.wheelState === 0) {
            return;
        }

        else if (this.wheelState == 1) {

            if (this.accCount < this.accelerateTime) { //如果小于给定持续时间，就更新一次
                this.accCount++;

                this.curSpeed += this.accV;
                this.wheelSp.rotation = this.wheelSp.rotation + this.curSpeed;
            } else { //达到了更新时间

              
                this.wheelState = 2;//进入减速状态
            }
        }
        else if (this.wheelState == 2) {
            //根据加速计算当前速度，以及当前位置
            if (this.decCount < this.slowDownTime) {
                this.decCount++;
                // this.curSpeed -= this.dV * dt/this.slowDownTime; //此数肯定为负 所以直接相加
                //this.curSpeed -= this.dV / (60 * this.slowDownTime);
                this.curSpeed -= this.accV;
              
                this.wheelSp.rotation = this.wheelSp.rotation + this.curSpeed;
               
            } else {
               
                //console.log("whell s 置为0了");
                this.wheelState = 0;
                this.wheelSp.rotation = this.finalAngle;

                //转盘停止，发放奖励。
                //todo!!!!
            }
        }
    },

});



