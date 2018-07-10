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
});
