cc.Class({
    extends: cc.Component,

    properties: {
       
        guard:{
            default: null,
            type: cc.Node,
        },
        
        singleTouchID:-1,//一个锁，如果被一个指头触摸，则不处理其他指头的触摸事件

        //卫士的宽度一半 高度一半  为了性能 放在成员变量中
        guardHalfWidth:0.0,
        guardHalfHeight:0.0,
    },

   

    // use this for initialization
    onLoad: function () {
       //初始化要根据checkpoint来读取相应的关卡数据
       
       //1读取 数据 还是加载场景？ wtf

       //缓存一些数据，为了性能
       this.guardHalfWidth = this.guard.getContentSize().width/2;
       this.guardHalfHeight = this.guard.getContentSize().height/2;
       //开启触摸
       this.node.on('touchstart', this.dragStart, this);
       this.node.on('touchmove', this.dragMove, this);
       this.node.on('touchend', this.drageEnd, this);
    },

    dragStart: function (event) {
        cc.log("touch begin  "+ this.singleTouchID);
        if (this.singleTouchID == -1) {
            this.singleTouchID = event.getID();
        } else {
            //已经被触摸设置了，那就不处理
            return;
        }
        this.touchBeginPoint = event.getLocation();
    },

    dragMove: function (event) {

        cc.log("touch move  "+ this.singleTouchID);

        if (event.getID() != this.singleTouchID) {
            return;
        }

        this.touchMovePoint = event.getLocation();
        let dx = this.touchMovePoint.x - this.touchBeginPoint.x;
        let dy = this.touchMovePoint.y - this.touchBeginPoint.y;

        let location = this.guard.getPosition();

        location.x += dx;
        location.y += dy;

        //飞机不移出屏幕 
        let minX = this.guardHalfWidth-this.node.width / 2;
        let maxX = -minX;
        let minY = this.guardHalfHeight-this.node.height / 2;
        let maxY = -minY;
        if (location.x < minX) {
            location.x = minX;
        }
        if (location.x > maxX) {
            location.x = maxX;
        }
        if (location.y < minY) {
            location.y = minY;
        }
        if (location.y > maxY) {
            location.y = maxY;
        }

        this.guard.setPosition(location);

        this.touchBeginPoint = this.touchMovePoint;
    },

    drageEnd: function (event) {
        cc.log("touch end 执行了！");
        if (event.getID() == this.singleTouchID) {
            this.singleTouchID = -1;//-1标记可以再触摸
        }
    },

    // called every frame
    update: function (dt) {

    },


});
