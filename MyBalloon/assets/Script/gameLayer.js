cc.Class({
    extends: cc.Component,

    properties: {

        guard: {
            default: null,
            type: cc.Node,
        },

        guardRigidBody: null,//guard 的刚体组件

        balloon: {
            default: null,
            type: cc.Node,
        },

        singleTouchID: -1,//一个锁，如果被一个指头触摸，则不处理其他指头的触摸事件

        //卫士的宽度一半 高度一半  为了性能 放在成员变量中
        guardHalfWidth: 0.0,
        guardHalfHeight: 0.0,

        currentNode: null,//当前关卡的node
        bgSpeed: 2,
    },



    // use this for initialization
    onLoad: function () {
        //初始化要根据checkpoint来读取相应的关卡数据

        //1读取 数据 还是加载场景？ wtf

        //缓存一些数据，为了性能
        this.guardHalfWidth = this.guard.getContentSize().width / 2;
        this.guardHalfHeight = this.guard.getContentSize().height / 2;
        //开启触摸
        this.node.on('touchstart', this.dragStart, this);
        this.node.on('touchmove', this.dragMove, this);
        this.node.on('touchend', this.drageEnd, this);

        this.guard.setLocalZOrder(100);
        this.balloon.setLocalZOrder(100);

        this.guardRigidBody = this.guard.getComponent(cc.RigidBody);
        this.touchBeginPoint = cc.v2(0.0, 0.0);
        this.touchMovePoint = cc.v2(0.0, 0.0);

        
        // this.currentFingerPosition = null;
        // this.lastFingerPosition = null;

       
        this.originGuardPosition = this.node.convertToWorldSpaceAR(this.guard.position);
        this.originFingerPosition = cc.v2(this.originGuardPosition.x,this.originGuardPosition.y);
        this.offsetPosition = cc.v2(this.originGuardPosition.x - this.originFingerPosition.x, this.originGuardPosition.y - this.originFingerPosition.y);
        this.currentFingerPosition = this.originFingerPosition;
    },

    dragStart: function (event) {

        // this.touchBeginPoint = event.getLocation();

        //this.currentFingerPosition = event.getLocation();
        // cc.log("这个是原版坐标");
        // cc.log(event.getLocation());
        // cc.log("这个是世界坐标");
        // cc.log(this.node.parent.convertToWorldSpaceAR(event.getLocation()));
        //this.currentFingerPosition =  this.node.parent.convertToWorldSpaceAR(event.getLocation());
        // this.currentFingerPosition = event.getLocation();
        // this.lastFingerPosition = this.currentFingerPosition;

        this.originFingerPosition = event.getLocation();
        this.originGuardPosition = this.node.convertToWorldSpaceAR(this.guard.position);
        this.offsetPosition = cc.v2(this.originGuardPosition.x - this.originFingerPosition.x, this.originGuardPosition.y - this.originFingerPosition.y);
        this.currentFingerPosition = this.originFingerPosition;
    },

    dragMove: function (event) {
        //    this.lastFingerPosition = this.currentFingerPosition;
        this.currentFingerPosition = event.getLocation();


        //  this.currentFingerPosition = this.node.parent.convertToWorldSpaceAR(event.getLocation());
        //  cc.log(this.currentFingerPosition);
        // this.touchMovePoint = event.getLocation();
        // let dx = this.touchMovePoint.x - this.touchBeginPoint.x;
        // let dy = this.touchMovePoint.y - this.touchBeginPoint.y;

        // let location = this.guard.getPosition();

        // location.x += dx;
        // location.y += dy;

        // //卫士不移出屏幕 
        // let minX = this.guardHalfWidth - this.node.width / 2;
        // let maxX = -minX;
        // let minY = this.guardHalfHeight - this.node.height / 2;
        // let maxY = -minY;
        // if (location.x < minX) {
        //     location.x = minX;
        // }
        // if (location.x > maxX) {
        //     location.x = maxX;
        // }
        // if (location.y < minY) {
        //     location.y = minY;
        // }
        // if (location.y > maxY) {
        //     location.y = maxY;
        // }

        //  this.guard.setPosition(location);
        //  this.guardRigidBody.linearVelocity = cc.v2(dx*15,dy*15);//距离除以时间 时间为1/60
        //  this.touchBeginPoint = this.touchMovePoint;
    },

    drageEnd: function (event) {
        //this.guardRigidBody.linearVelocity = cc.v2(0, 0);
    },

    // called every frame
    update: function (dt) {


        // if (this.currentFingerPosition != null && this.lastFingerPosition != null) {
        //     let dx = this.currentFingerPosition.x - this.lastFingerPosition.x;
        //     let dy = this.currentFingerPosition.y - this.lastFingerPosition.y;
        //     this.guardRigidBody.linearVelocity = cc.v2(dx / dt, dy / dt);
        //     this.guardRigidBody.linearVelocity = cc.v2(dx / dt, dy / dt);
        //     this.lastFingerPosition = this.currentFingerPosition;
        // }

        if (this.currentFingerPosition != null) {
            let guardWorldPos = this.node.convertToWorldSpaceAR(this.guard.position);
            let dx = this.currentFingerPosition.x + this.offsetPosition.x - guardWorldPos.x;
            let dy = this.currentFingerPosition.y + this.offsetPosition.y - guardWorldPos.y;
           
            this.guardRigidBody.linearVelocity = cc.v2(dx * 80, dy * 80);
        }


        // if(this.touchBeginPoint!=null && this.touchMovePoint != null) {
        //     let dx = this.touchMovePoint.x - this.touchBeginPoint.x;
        //     let dy = this.touchMovePoint.y - this.touchBeginPoint.y;
        //     this.guardRigidBody.linearVelocity = cc.v2(dx/dt,dy/dt);
        //     this.touchBeginPoint = this.touchMovePoint;
        // }
        // if (this.currentNode!=null ) {
        //     cc.log(this.currentNode.y);    
        // }

        // if (this.currentNode!=null  && this.currentNode.y >= -2880) {
        //     this.currentNode.y -= this.bgSpeed *dt*60;    //speed为负数 所以相加
        // }


    },


});
