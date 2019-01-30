// TypeScript file
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var gameGroupConfig = {
    x: 71,
    y: 356,
    w: 76 * 8,
};
var opGroupConfig = {
    x: 23,
    y: 1052,
    w: 705,
    h: 181,
};
var GameUI = (function (_super) {
    __extends(GameUI, _super);
    function GameUI() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameUI.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this.gameData = new happyClear.GameData();
        this.shadow = [];
        this.shadow_pos = null;
        this.runGameUI().catch(function (e) {
            console.log(e);
        });
    };
    // UILayer开启
    GameUI.prototype.runGameUI = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        this.createScene();
                        return [2 /*return*/];
                }
            });
        });
    };
    // 预先加载资源，for StartUI
    GameUI.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("game", 0, loadingView)];
                    case 2:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GameUI.prototype.createScene = function () {
        this.createRootGroup();
        this.createStartUI();
        this.gameData.initGrid();
    };
    GameUI.prototype.createRootGroup = function () {
        // 创建一个顶层的group
        this.rootGroup = new eui.Group();
        this.rootGroup.horizontalCenter = 0;
        this.rootGroup.verticalCenter = 0;
        this.rootGroup.width = this.stage.stageWidth;
        this.rootGroup.height = this.stage.stageHeight;
        this.rootGroup.layout = new eui.BasicLayout();
        this.addChild(this.rootGroup);
        console.log('wh:', this.rootGroup.width, this.rootGroup.height);
        // 给一个背景图片
        var bg = ResourceUtils.createBitmapByName("game_bg_png");
        this.rootGroup.addChild(bg);
        bg.x = 0;
        bg.y = 0;
        bg.width = this.rootGroup.width;
        bg.height = this.rootGroup.height;
    };
    GameUI.prototype.createStartUI = function () {
        // 创建game的group
        this.gameGroup = new eui.Group();
        this.rootGroup.addChild(this.gameGroup);
        this.gameGroup.left = gameGroupConfig.x;
        this.gameGroup.top = gameGroupConfig.y;
        this.gameGroup.width = gameGroupConfig.w;
        this.gameGroup.height = gameGroupConfig.w;
        this.gameGroup.layout = new eui.BasicLayout;
        // 创建op的group
        this.opGroup = new eui.Group();
        this.rootGroup.addChild(this.opGroup);
        this.opGroup.left = opGroupConfig.x;
        this.opGroup.top = opGroupConfig.y;
        this.opGroup.width = opGroupConfig.w;
        this.opGroup.height = opGroupConfig.h;
        this.opGroup.layout = new eui.BasicLayout;
        // 创建bomb按钮
        var bt_bomb = new eui.Button();
        this.opGroup.addChild(bt_bomb);
        bt_bomb.top = 19;
        bt_bomb.left = 19;
        bt_bomb.width = 87;
        bt_bomb.height = 144;
        var exmlText = "<?xml version=\"1.0\" encoding=\"utf-8\" ?> \n                        <e:Skin class=\"skins.ButtonSkin\" states=\"up,down,disabled\" xmlns:e=\"http://ns.egret.com/eui\"> \n                            <e:Image width=\"100%\" height=\"100%\" alpha.disabled=\"0.5\" alpha.down=\"0.5\"\n                                    source=\"/resource/assets/game_bomb.png\"/> \n                        </e:Skin>";
        bt_bomb.skinName = exmlText;
        bt_bomb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bombTapHandler, this);
        // 创建change按钮
        var bt_change = new eui.Button();
        this.opGroup.addChild(bt_change);
        bt_change.top = 19;
        bt_change.right = 19;
        bt_change.width = 87;
        bt_change.height = 144;
        var exmlText = "<?xml version=\"1.0\" encoding=\"utf-8\" ?> \n                        <e:Skin class=\"skins.ButtonSkin\" states=\"up,down,disabled\" xmlns:e=\"http://ns.egret.com/eui\"> \n                            <e:Image width=\"100%\" height=\"100%\" alpha.disabled=\"0.5\" alpha.down=\"0.5\"\n                                    source=\"/resource/assets/game_change.png\"/> \n                        </e:Skin>";
        bt_change.skinName = exmlText;
        bt_change.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeTapHandler, this);
    };
    GameUI.prototype.bombTapHandler = function () {
        console.log('bombTapHandler');
    };
    GameUI.prototype.changeTapHandler = function () {
        console.log('changeTapHandler');
    };
    return GameUI;
}(eui.UILayer));
__reflect(GameUI.prototype, "GameUI");
//# sourceMappingURL=GameUI.js.map