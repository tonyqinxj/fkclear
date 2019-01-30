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
var StartUI = (function (_super) {
    __extends(StartUI, _super);
    function StartUI() {
        var _this = _super.call(this) || this;
        console.log('constructor...');
        return _this;
    }
    StartUI.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        console.log('createChildren...');
        this.runStartUI().catch(function (e) {
            console.log(e);
        });
    };
    // UILayer开启
    StartUI.prototype.runStartUI = function () {
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
    StartUI.prototype.loadResource = function () {
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
                        return [4 /*yield*/, RES.loadGroup("start", 0, loadingView)];
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
    StartUI.prototype.createScene = function () {
        this.createRootGroup();
        this.createStartUI();
    };
    StartUI.prototype.createRootGroup = function () {
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
        var bg = ResourceUtils.createBitmapByName("bg_png");
        this.rootGroup.addChild(bg);
        bg.x = 0;
        bg.y = 0;
        bg.width = this.rootGroup.width;
        bg.height = this.rootGroup.height;
    };
    StartUI.prototype.createStartUI = function () {
        // 添加小程序的提示
        var tip_xcx = ResourceUtils.createBitmapByName("tip_xcx_png");
        this.rootGroup.addChild(tip_xcx);
        this.tipXcx = tip_xcx;
        tip_xcx.x = 221.8;
        tip_xcx.y = 82;
        tip_xcx.width = 309.8;
        tip_xcx.height = 65.4;
        // 创建title
        var start_title = ResourceUtils.createBitmapByName("start_title_png");
        this.rootGroup.addChild(start_title);
        this.startTitle = start_title;
        start_title.x = 1;
        start_title.y = 279;
        start_title.width = 750;
        start_title.height = 726;
        // 创建开始按钮
        var btStart = new eui.Button();
        this.rootGroup.addChild(btStart);
        this.buttonStart = btStart;
        btStart.x = 192;
        btStart.y = 1205;
        btStart.width = 370;
        btStart.height = 161;
        var exmlText = "<?xml version=\"1.0\" encoding=\"utf-8\" ?> \n                        <e:Skin class=\"skins.ButtonSkin\" states=\"up,down,disabled\" xmlns:e=\"http://ns.egret.com/eui\"> \n                            <e:Image width=\"100%\" height=\"100%\" alpha.disabled=\"0.5\" alpha.down=\"0.5\"\n                                    source=\"/resource/assets/bt_start.png\"/> \n                        </e:Skin>";
        btStart.skinName = exmlText;
        // let bt_start = ResourceUtils.createBitmapByName("bt_start_png");
        // btStart.addChild(bt_start);
        btStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnStartTouchHandler, this);
    };
    StartUI.prototype.removeStartUI = function () {
        if (this.tipXcx)
            this.rootGroup.removeChild(this.tipXcx);
        if (this.startTitle)
            this.rootGroup.removeChild(this.startTitle);
        if (this.buttonStart)
            this.rootGroup.removeChild(this.buttonStart);
    };
    StartUI.prototype.addStartUI = function () {
        if (this.tipXcx)
            this.rootGroup.addChild(this.tipXcx);
        if (this.startTitle)
            this.rootGroup.addChild(this.startTitle);
        if (this.buttonStart)
            this.rootGroup.addChild(this.buttonStart);
    };
    StartUI.prototype.btnStartTouchHandler = function (event) {
        console.log("button touched");
    };
    return StartUI;
}(eui.UILayer));
__reflect(StartUI.prototype, "StartUI");
//# sourceMappingURL=StartUI.js.map