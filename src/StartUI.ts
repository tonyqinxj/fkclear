// TypeScript file

class StartUI extends eui.UILayer {
    private rootGroup: eui.Group;
    private buttonStart: eui.Button;
    private tipXcx: egret.Bitmap;
    private startTitle: egret.Bitmap;

    public constructor(){
        super();
        console.log('constructor...');
    }

    protected createChildren(): void {
        super.createChildren();
        console.log('createChildren...');

        this.runStartUI().catch(e => {
            console.log(e);
        })
    }

    // UILayer开启
    private async runStartUI() {
        await this.loadResource()
        this.createScene();
    }

    // 预先加载资源，for StartUI
    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("start", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private createScene() {
        this.createRootGroup();
        this.createStartUI();
    }

    private createRootGroup() {
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
        let bg = ResourceUtils.createBitmapByName("bg_png");
        this.rootGroup.addChild(bg);
        bg.x = 0;
        bg.y = 0;
        bg.width = this.rootGroup.width;
        bg.height = this.rootGroup.height;
    }

    private createStartUI() {

        // 添加小程序的提示
        let tip_xcx = ResourceUtils.createBitmapByName("tip_xcx_png");
        this.rootGroup.addChild(tip_xcx);
        this.tipXcx = tip_xcx;

        tip_xcx.x = 221.8;
        tip_xcx.y = 82;
        tip_xcx.width = 309.8;
        tip_xcx.height = 65.4;


        // 创建title
        let start_title = ResourceUtils.createBitmapByName("start_title_png");
        this.rootGroup.addChild(start_title);
        this.startTitle = start_title;

        start_title.x = 1;
        start_title.y = 279;
        start_title.width = 750;
        start_title.height = 726;



        // 创建开始按钮
        let btStart = new eui.Button();
        this.rootGroup.addChild(btStart);
        this.buttonStart = btStart;

        btStart.x = 192;
        btStart.y = 1205;
        btStart.width = 370;
        btStart.height = 161;

        var exmlText = `<?xml version="1.0" encoding="utf-8" ?> 
                        <e:Skin class="skins.ButtonSkin" states="up,down,disabled" xmlns:e="http://ns.egret.com/eui"> 
                            <e:Image width="100%" height="100%" alpha.disabled="0.5" alpha.down="0.5"
                                    source="/resource/assets/bt_start.png"/> 
                        </e:Skin>`;

        btStart.skinName = exmlText;

        // let bt_start = ResourceUtils.createBitmapByName("bt_start_png");
        // btStart.addChild(bt_start);


        btStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnStartTouchHandler, this);

    }

    private removeStartUI(){
        if(this.tipXcx) this.rootGroup.removeChild(this.tipXcx);
        if(this.startTitle) this.rootGroup.removeChild(this.startTitle);
        if(this.buttonStart) this.rootGroup.removeChild(this.buttonStart);
    }

    private addStartUI(){
        if(this.tipXcx) this.rootGroup.addChild(this.tipXcx);
        if(this.startTitle) this.rootGroup.addChild(this.startTitle);
        if(this.buttonStart) this.rootGroup.addChild(this.buttonStart);
    }

    private btnStartTouchHandler(event: egret.TouchEvent): void {
        console.log("button touched");
    }

}