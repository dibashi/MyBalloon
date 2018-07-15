cc.Class({
    extends: cc.Component,

    properties: {
        // label: {
        //     default: null,
        //     type: cc.Label
        // },
      
    },

    

    goStart:function() {
        cc.director.loadScene('start');    
    },

    // use this for initialization
    onLoad: function () {
    
    },

    // called every frame
    update: function (dt) {

    },
    //eventData: 01,02,03,04....10标记哪些皮肤按钮被点击
    purchaseClick:function(event,eventData) {
        cc.sys.localStorage.setItem('qq02', 0);

        let isHasQQSkin =  cc.sys.localStorage.getItem('qq'+eventData);
        if(isHasQQSkin == 1) { //拥有该气球
            //判断当前是否使用的是该气球的皮肤
            let currentQQID = cc.sys.localStorage.getItem('currentSkinID');
            if(eventData == currentQQID) {//如果是，则什么也不用做，1不能购买，2不能选择出战

            } else {//当前不是该气球的ID，则可选择出战
                
            }
        } else { //没有该气球

        }
    },
});
