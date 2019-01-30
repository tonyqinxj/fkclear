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
        _this.shadow = [];
        _this.shadow_pos = null;
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
        this.resetBlock();
    };
    // 随机组合格子
    GameView.prototype.resetBlock = function () {
        var _this = this;
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
        this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onBlockTouchCancel, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onBlockTouchReleaeOutside, this);
    };
    GameView.prototype.onBlockTouchBegin = function (e) {
        this.curblockview.x = e.stageX - this.x;
        this.curblockview.y = e.stageY - this.y - 300;
        console.log('onBlockTouchBegin:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);
    };
    GameView.prototype.onBlockTouchCancel = function (e) {
        console.log('onBlockTouchCancel:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);
    };
    GameView.prototype.onBlockTouchReleaeOutside = function (e) {
        console.log('onBlockTouchReleaeOutside:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);
        this.onBlockTouchEnd(e);
    };
    GameView.prototype.shadowClear = function () {
        var _this = this;
        if (this.shadow_pos != null) {
            this.shadow.forEach(function (s) {
                _this.grid.removeChild(s);
            });
            this.shadow = [];
        }
    };
    GameView.prototype.onBlockTouchMove = function (e) {
        this.curblockview.x = e.stageX - this.x;
        this.curblockview.y = e.stageY - this.y - 300;
        var pos = this.gameData.getPos(this.curblockview.x - this.grid_start_x + happyClear.Grid_conf.gz_width / 2, this.curblockview.y - this.grid_start_y + happyClear.Grid_conf.gz_width / 2);
        var canPutDown = false;
        var r = 0;
        var c = 0;
        var blockInfo = this.curblockview.getBlockInfo();
        if (pos.find) {
            r = pos.r;
            c = pos.c;
            canPutDown = this.gameData.blockCanPutPoint(r, c, blockInfo.id);
        }
        if (canPutDown) {
            // 绘制阴影
            if (this.shadow_pos == null || this.shadow_pos.r != r || this.shadow_pos.c != c) {
                this.shadowClear();
                this.shadow_pos = pos;
                var blockId = blockInfo.blockId;
                var colorId = blockInfo.colorId;
                var block = happyClear.Block_conf[blockId];
                var color = happyClear.Color_conf[colorId];
                var rows = block.length;
                var cols = block[0].length;
                for (var i = 0; i < rows; i++) {
                    for (var j = 0; j < cols; j++) {
                        if (block[i][j]) {
                            var gz = ResourceUtils.createBitmapByName("game_json." + color);
                            var gz_info = this.gameData.getGridInfoByPos(i + r, j + c);
                            this.grid.addChild(gz);
                            gz.x = gz_info.x;
                            gz.y = gz_info.y;
                            gz.alpha = 0.5;
                            gz.width = happyClear.Grid_conf.gz_width;
                            gz.height = happyClear.Grid_conf.gz_width;
                            this.shadow.push(gz);
                        }
                    }
                }
            }
        }
        else {
            this.shadowClear();
        }
    };
    GameView.prototype.onBlockTouchEnd = function (e) {
        console.log('onBlockTouchEnd:', e.stageX, e.stageY);
        // 点的转换
        var pos = this.gameData.getPos(this.curblockview.x - this.grid_start_x + happyClear.Grid_conf.gz_width / 2, this.curblockview.y - this.grid_start_y + happyClear.Grid_conf.gz_width / 2);
        var canPutDown = false;
        var r = 0;
        var c = 0;
        if (pos.find) {
            r = pos.r;
            c = pos.c;
            canPutDown = this.gameData.blockCanPutPoint(r, c, this.curblockview.getBlockInfo().id);
        }
        console.log('onBlockTouchEnd 1:', pos, r, c, canPutDown);
        this.shadowClear();
        if (canPutDown) {
            // 放下block，并删除blockview
            this.gameData.blockAddToGrid(r, c, this.curblockview.getBlockInfo().id);
            this.blockAddToGrid(r, c, this.curblockview.getBlockInfo());
            this.curblockview.setState(happyClear.Block_state.END);
            this.removeChild(this.curblockview);
            this.curblockview = null;
            this.checkClear();
        }
        else {
            // block还原
            this.blockSprite.addChild(this.curblockview);
            this.curblockview.setState(happyClear.Block_state.INIT);
            this.curblockview.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlockTouchBegin1, this);
            this.curblockview.x = this.oldx;
            this.curblockview.y = this.oldy;
        }
        this.touchEnabled = false;
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlockTouchBegin, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onBlockTouchMove, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onBlockTouchEnd, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onBlockTouchCancel, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onBlockTouchReleaeOutside, this);
    };
    GameView.prototype.checkClear = function () {
        // 清楚数据中的gz
        var clearData = this.gameData.doClear();
        // 从试图中清除掉gz
        if (clearData.gzs.length > 0) {
            for (var i = 0; i < clearData.gzs.length; i++) {
                this.grid.removeChild(clearData.gzs[i]);
            }
        }
        // 如果没有可用的组合，则再次生产
        if (this.gameData.haveBlockToUse() == false) {
            this.resetBlock();
        }
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
                    this.gameData.attachGz(i + x, j + y, gz);
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