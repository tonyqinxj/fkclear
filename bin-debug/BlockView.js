/**
 *  一个组合的格子，代表了各种形状，一开始放到操作区间，点击之后，需要从操作区间取出来，放入游戏区间
 *  是以点阵的形式来存在的
 *
*/
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
var BlockView = (function (_super) {
    __extends(BlockView, _super);
    function BlockView(blockinfo) {
        var _this = _super.call(this) || this;
        _this.blockInfo = null;
        _this.gz_width = happyClear.Grid_conf.gz_width;
        _this.gz_padding = happyClear.Grid_conf.gz_padding;
        _this.block_scale = 0.3;
        _this.state = happyClear.Block_state.INIT;
        _this.init(blockinfo);
        return _this;
    }
    BlockView.prototype.getBlockInfo = function () {
        return this.blockInfo;
    };
    BlockView.prototype.setState = function (state) {
        this.state = state;
        if (state == happyClear.Block_state.INIT) {
            this.resetScale(this.block_scale);
        }
        else if (state == happyClear.Block_state.MOVING) {
            this.resetScale(0.9);
        }
        else if (state == happyClear.Block_state.END) {
            this.removeChildren();
        }
    };
    BlockView.prototype.resetScale = function (scale) {
        this.scaleX = scale;
        this.scaleY = scale;
    };
    BlockView.prototype.init = function (blockinfo) {
        // 缩放
        this.blockInfo = blockinfo;
        var color = happyClear.Color_conf[blockinfo.colorId];
        var blockdata = happyClear.Block_conf[blockinfo.blockId];
        var rows = blockdata.length;
        var cols = blockdata[0].length;
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                if (blockdata[r][c]) {
                    var x = c * (this.gz_padding + this.gz_width);
                    var y = r * (this.gz_padding + this.gz_width);
                    var fk = ResourceUtils.createBitmapByName('game_json.' + color);
                    fk.x = x;
                    fk.y = y;
                    fk.width = this.gz_width;
                    fk.height = this.gz_width;
                    this.addChild(fk);
                }
            }
        }
        // 计算blockview的size
        this.x = blockinfo.x;
        this.y = blockinfo.y;
        this.width = rows * this.gz_width + this.gz_padding * (rows - 1);
        this.height = cols * this.gz_width + this.gz_padding * (cols - 1);
        this.setState(happyClear.Block_state.INIT);
    };
    return BlockView;
}(egret.Sprite));
__reflect(BlockView.prototype, "BlockView");
//# sourceMappingURL=BlockView.js.map