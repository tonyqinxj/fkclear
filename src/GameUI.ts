// TypeScript file

const gameGroupConfig = {
	x: 71,
	y: 356,
	w: 76 * 8,
};

const opGroupConfig = {
	x: 23,
	y: 1052,
	w: 705,
	h: 181,
}

class GameUI extends eui.UILayer {
	private rootGroup: eui.Group;
	private gameGroup: eui.Group;
	private opGroup: eui.Group;

	private gameData: happyClear.GameData;	// 游戏数据

	private curblockview: BlockView;	// 当前正在操作的组合格子
	private oldx: number;	// 当前正在操作的组合格子的原x
	private oldy: number;	// 当前正在操作的组合格子的原y

	private shadow: Array<any>; // 移动过程中的阴影 [gz]
	private shadow_pos: any; // {r,c}

	protected createChildren(): void {
		super.createChildren();

		this.gameData = new happyClear.GameData();
		this.shadow = [];
		this.shadow_pos = null;

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
			await RES.loadGroup("game", 0, loadingView);
			this.stage.removeChild(loadingView);
		}
		catch (e) {
			console.error(e);
		}
	}

	private createScene() {
		this.createRootGroup();
		this.createStartUI();
		this.gameData.initGrid();
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
		let bg = ResourceUtils.createBitmapByName("game_bg_png");
		this.rootGroup.addChild(bg);
		bg.x = 0;
		bg.y = 0;
		bg.width = this.rootGroup.width;
		bg.height = this.rootGroup.height;
	}

	private createStartUI() {
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
		let bt_bomb = new eui.Button();

		this.opGroup.addChild(bt_bomb);

		bt_bomb.top = 19;
		bt_bomb.left = 19;
		bt_bomb.width = 87;
		bt_bomb.height = 144;

		var exmlText = `<?xml version="1.0" encoding="utf-8" ?> 
                        <e:Skin class="skins.ButtonSkin" states="up,down,disabled" xmlns:e="http://ns.egret.com/eui"> 
                            <e:Image width="100%" height="100%" alpha.disabled="0.5" alpha.down="0.5"
                                    source="/resource/assets/game_bomb.png"/> 
                        </e:Skin>`;

		bt_bomb.skinName = exmlText;

		bt_bomb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bombTapHandler, this);


		// 创建change按钮
		let bt_change = new eui.Button();

		this.opGroup.addChild(bt_change);

		bt_change.top = 19;
		bt_change.right = 19;
		bt_change.width = 87;
		bt_change.height = 144;

		var exmlText = `<?xml version="1.0" encoding="utf-8" ?> 
                        <e:Skin class="skins.ButtonSkin" states="up,down,disabled" xmlns:e="http://ns.egret.com/eui"> 
                            <e:Image width="100%" height="100%" alpha.disabled="0.5" alpha.down="0.5"
                                    source="/resource/assets/game_change.png"/> 
                        </e:Skin>`;

		bt_change.skinName = exmlText;

		bt_change.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeTapHandler, this);


		// 创建3个block容器
		
	}

	private bombTapHandler() {
		console.log('bombTapHandler');
	}

	private changeTapHandler() {
		console.log('changeTapHandler');
	}
}