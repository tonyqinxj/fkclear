class GameView extends egret.Sprite {

	private stageW: number; // 屏幕宽度
	private stageH: number;	// 屏幕长度

	private grid: egret.Sprite; // 网格容器 
	private blockSprite: egret.Sprite;	// 操作区域容器

	private gameData: happyClear.GameData;	// 游戏数据

	private gridData
	private curblockview: BlockView;	// 当前正在操作的组合格子
	private oldx: number;	// 当前正在操作的组合格子的原x
	private oldy: number;	// 当前正在操作的组合格子的原y


	private grid_start_x: number = 0;
	private grid_start_y: number = 136;
	public constructor() {
		super();

		this.gameData = new happyClear.GameData();
	}

	public createView(w: number, h: number): void {

		this.stageW = w;
		this.stageH = h;

		// 创建headerview

		// 创建gridview
		this.createGrid();

		// 创建blockview 
		this.createBlocks();

		// 创建adview // 广告
	}

	public createGrid(): void {
		// 创建容器
		this.grid = new egret.Sprite();
		this.grid.x = this.grid_start_x;
		this.grid.y = this.grid_start_y;
		this.grid.width = this.stageW;
		this.grid.height = happyClear.Grid_conf.grid_line_width * 2 + happyClear.Grid_conf.gz_padding * 9 + happyClear.Grid_conf.gz_width * 8;

		this.addChild(this.grid);

		console.log('grid:', this.grid.width, this.grid.height);

		// 添加背景
		let bg = ResourceUtils.createBitmapByName("game_json.24");
		this.grid.addChild(bg);

		bg.width = this.grid.width;
		bg.height = this.grid.height;

		// 初始化数据
		this.gameData.initGrid();

		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				let gz = ResourceUtils.createBitmapByName("game_json.23");
				this.grid.addChild(gz);
				gz.x = this.gameData.gameGrid[i][j].x;
				gz.y = this.gameData.gameGrid[i][j].y;
				gz.width = happyClear.Grid_conf.gz_width;
				gz.height = happyClear.Grid_conf.gz_width;
			}
		}
	}

	public createBlocks(): void {
		// 创建容器
		this.blockSprite = new egret.Sprite();
		this.addChild(this.blockSprite);

		this.blockSprite.x = 0;
		this.blockSprite.y = this.grid.y + this.grid.height + 30;

		this.blockSprite.width = this.stageW;
		this.blockSprite.height = 200;

		// 给容器添加背景图
		let bg_block = ResourceUtils.createBitmapByName("game_json.24");
		this.blockSprite.addChild(bg_block);

		bg_block.width = this.blockSprite.width;
		bg_block.height = this.blockSprite.height;

		// 随机3个组合格子
		this.resetBlock();
	}

	// 随机组合格子
	private resetBlock() {
		this.gameData.initBlock();

		this.gameData.blocks.forEach(blockinfo => {
			let blockview = new BlockView(blockinfo);
			this.blockSprite.addChild(blockview);
			blockview.touchEnabled = true;
			blockview.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlockTouchBegin1, this);
		});
	}

	private onBlockTouchBegin1(e: egret.TouchEvent): void {
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

	}

	private onBlockTouchBegin(e: egret.TouchEvent): void {

		this.curblockview.x = e.stageX - this.x;
		this.curblockview.y = e.stageY - this.y - 300;
		console.log('onBlockTouchBegin:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);
	}

	private onBlockTouchCancel(e: egret.TouchEvent): void {

		console.log('onBlockTouchCancel:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);
	}

	private onBlockTouchReleaeOutside(e: egret.TouchEvent): void {

		console.log('onBlockTouchReleaeOutside:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);
		this.onBlockTouchEnd(e);
	}


	private onBlockTouchMove(e: egret.TouchEvent): void {

		this.curblockview.x = e.stageX - this.x;
		this.curblockview.y = e.stageY - this.y - 300;

		// 计算canput
		// this.gameData.blockCanPut(this.curblockview.getBlockInfo().id);
		// 根据canput，决定是否预先填充

		//console.log('onBlockTouchMove:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);
	}

	private onBlockTouchEnd(e: egret.TouchEvent): void {
		console.log('onBlockTouchEnd:', e.stageX, e.stageY);

		// 点的转换
		let pos = this.gameData.getPos(this.curblockview.x - this.grid_start_x + happyClear.Grid_conf.gz_width / 2, this.curblockview.y - this.grid_start_y + happyClear.Grid_conf.gz_width / 2);
		let canPutDown = false;
		let r = 0;
		let c = 0;

		if (pos.find) {
			r = pos.r;
			c = pos.c;
			canPutDown = this.gameData.blockCanPutPoint(r, c, this.curblockview.getBlockInfo().id);
		}

		console.log('onBlockTouchEnd 1:', pos, r, c, canPutDown);

		if (canPutDown) {
			// 放下block，并删除blockview
			this.gameData.blockAddToGrid(r, c, this.curblockview.getBlockInfo().id);
			this.blockAddToGrid(r, c, this.curblockview.getBlockInfo());
			this.curblockview.setState(happyClear.Block_state.END);
			this.removeChild(this.curblockview);

			this.curblockview = null;

			this.checkClear();

		} else {
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
	}

	private checkClear() {
		// 清楚数据中的gz
		let clearData = this.gameData.doClear();

		// 从试图中清除掉gz
		if (clearData.gzs.length > 0) {
			for (let i = 0; i < clearData.gzs.length; i++) {
				this.grid.removeChild(clearData.gzs[i]);
			}
		}

		// 如果没有可用的组合，则再次生产
		if (this.gameData.haveBlockToUse() == false) {
			this.resetBlock();
		}
	}


	private blockAddToGrid(x: number, y: number, blockInfo: any): void {
		// blockInfo { blockId, colorId}

		let blockId = blockInfo.blockId;
		let colorId = blockInfo.colorId;

		let block = happyClear.Block_conf[blockId];
		let color = happyClear.Color_conf[colorId];

		let rows = block.length;
		let cols = block[0].length;

		console.log('addtogrid:', x, y, rows, cols);

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {

				if (block[i][j]) {
					let gz = ResourceUtils.createBitmapByName("game_json." + color);
					let gz_info = this.gameData.getGridInfoByPos(i + x, j + y);
					this.grid.addChild(gz);

					this.gameData.attachGz(i + x, j + y, gz);
					gz.x = gz_info.x;
					gz.y = gz_info.y;
					gz.width = happyClear.Grid_conf.gz_width;
					gz.height = happyClear.Grid_conf.gz_width;
				}

			}
		}
	}


}