var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var GameView = (function (_super) {
    __extends(GameView, _super);
    function GameView() {
        var _this = _super.call(this) || this;
        _this.grid_start_x = 0;
        _this.grid_start_y = 136;
        _this.gameData = new happyClear.GameData();
        return _this;
    }
    GameView.prototype.createView = function (w, h) {
        this.stageW = w;
        this.stageH = h;
        // 创建headerview
        // 创建gridview
        this.createGrid();
        // 创建blockview 
        this.createBlocks();
        // 创建adview // 广告
    };
    GameView.prototype.createGrid = function () {
        // 创建容器
        this.grid = new egret.Sprite();
        this.grid.x = this.grid_start_x;
        this.grid.y = this.grid_start_y;
        this.grid.width = this.stageW;
        this.grid.height = happyClear.Grid_conf.grid_line_width * 2 + happyClear.Grid_conf.gz_padding * 9 + happyClear.Grid_conf.gz_width * 8;
        this.addChild(this.grid);
        console.log('grid:', this.grid.width, this.grid.height);
        // 添加背景
        var bg = ResourceUtils.createBitmapByName("game_json.24");
        this.grid.addChild(bg);
        bg.width = this.grid.width;
        bg.height = this.grid.height;
        // 初始化数据
        this.gameData.initGrid();
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var gz = ResourceUtils.createBitmapByName("game_json.23");
                this.grid.addChild(gz);
                gz.x = this.gameData.gameGrid[i][j].x;
                gz.y = this.gameData.gameGrid[i][j].y;
                gz.width = happyClear.Grid_conf.gz_width;
                gz.height = happyClear.Grid_conf.gz_width;
            }
        }
    };
    GameView.prototype.createBlocks = function () {
        var _this = this;
        // 创建容器
        this.blockSprite = new egret.Sprite();
        this.addChild(this.blockSprite);
        this.blockSprite.x = 0;
        this.blockSprite.y = this.grid.y + this.grid.height + 30;
        this.blockSprite.width = this.stageW;
        this.blockSprite.height = 200;
        // 给容器添加背景图
        var bg_block = ResourceUtils.createBitmapByName("game_json.24");
        this.blockSprite.addChild(bg_block);
        bg_block.width = this.blockSprite.width;
        bg_block.height = this.blockSprite.height;
        // 随机3个组合格子
        this.gameData.initBlock();
        this.gameData.blocks.forEach(function (blockinfo) {
            var blockview = new BlockView(blockinfo);
            _this.blockSprite.addChild(blockview);
            blockview.touchEnabled = true;
            blockview.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onBlockTouchBegin1, _this);
        });
    };
    GameView.prototype.onBlockTouchBegin1 = function (e) {
        console.log('onBlockTouchBegin1:', e.stageX, e.stageY);
        this.curblockview = e.target;
        this.curblockview.setState(happyClear.Block_state.MOVING);
        this.oldx = this.curblockview.x;
        this.oldy = this.curblockview.y;
        this.blockSprite.removeChild(this.curblockview);
        this.addChild(this.curblockview);
        this.curblockview.x = e.stageX - this.x;
        this.curblockview.y = e.stageY - this.y - 300;
        this.touchEnabled = true;
        this.curblockview.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlockTouchBegin1, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlockTouchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onBlockTouchMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onBlockTouchEnd, this);
    };
    GameView.prototype.onBlockTouchBegin = function (e) {
        this.curblockview.x = e.stageX - this.x;
        this.curblockview.y = e.stageY - this.y - 300;
        console.log('onBlockTouchBegin:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);
    };
    GameView.prototype.onBlockTouchMove = function (e) {
        this.curblockview.x = e.stageX - this.x;
        this.curblockview.y = e.stageY - this.y - 300;
        // 计算canput
        // this.gameData.blockCanPut(this.curblockview.getBlockInfo().id);
        // 根据canput，决定是否预先填充
        //console.log('onBlockTouchMove:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);
    };
    GameView.prototype.onBlockTouchEnd = function (e) {
        console.log('onBlockTouchEnd:', e.stageX, e.stageY);
        // 点的转换
        var pos = this.gameData.getPos(this.curblockview.x - this.grid_start_x, this.curblockview.y - this.grid_start_y);
        var canPutDown = false;
        var x = 0;
        var y = 0;
        if (pos.find) {
            x = pos.x;
            y = pos.y;
            canPutDown = this.gameData.blockCanPutPoint(x, y, this.curblockview.getBlockInfo().id);
        }
        console.log('onBlockTouchEnd 1:', pos, x, y, canPutDown);
        if (canPutDown) {
            // 放下block，并删除blockview
            this.blockAddToGrid(x, y, this.curblockview.getBlockInfo());
            this.gameData.blockAddToGrid(x, y, this.curblockview.getBlockInfo().id);
            this.curblockview.setState(happyClear.Block_state.END);
            this.removeChild(this.curblockview);
        }
        else {
            // block还原
            this.blockSprite.addChild(this.curblockview);
            this.curblockview.setState(happyClear.Block_state.INIT);
            this.curblockview.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlockTouchBegin1, this);
        }
        this.curblockview.x = this.oldx;
        this.curblockview.y = this.oldy;
        this.touchEnabled = false;
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlockTouchBegin, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onBlockTouchMove, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onBlockTouchEnd, this);
    };
    GameView.prototype.matchCurBlockPos = function () {
        return this.gameData.getPos(this.curblockview.x, this.curblockview.y);
    };
    GameView.prototype.blockAddToGrid = function (x, y, blockInfo) {
        // blockInfo { blockId, colorId}
        var blockId = blockInfo.blockId;
        var colorId = blockInfo.colorId;
        var block = happyClear.Block_conf[blockId];
        var color = happyClear.Color_conf[colorId];
        var rows = block.length;
        var cols = block[0].length;
        console.log('addtogrid:', x, y, rows, cols);
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                if (block[i][j]) {
                    var gz = ResourceUtils.createBitmapByName("game_json." + color);
                    var gz_info = this.gameData.getGridInfoByPos(i + x, j + y);
                    this.grid.addChild(gz);
                    gz.x = gz_info.x;
                    gz.y = gz_info.y;
                    gz.width = happyClear.Grid_conf.gz_width;
                    gz.height = happyClear.Grid_conf.gz_width;
                }
            }
        }
    };
    return GameView;
}(egret.Sprite));
__reflect(GameView.prototype, "GameView");
//# sourceMappingURL=GameView.js.map