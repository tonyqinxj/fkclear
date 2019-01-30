// TypeScript file

class GameUI extends eui.UILayer {
    private rootGroup: eui.Group;


    protected createChildren(): void {
        super.createChildren();

        this.runGameUI().catch(e => {
            console.log(e);
        })
    }

    // UILayer开启
    private async runGameUI() {
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

 
    }



}