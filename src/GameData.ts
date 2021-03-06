
namespace happyClear {
	// 定义组合形态，一个点阵，1表示有方块，0表示没有
	export const Block_conf = [
		// 0
		[
			[1]
		],
		// 1
		[
			[1, 1]
		],
		// 2
		[
			[1, 1, 1]
		],
		// 3
		[
			[1, 1, 1, 1]
		],
		// 4
		[
			[1, 1, 1, 1, 1]
		],
		// 5
		[
			[1],
			[1]
		],
		// 6
		[
			[1],
			[1],
			[1]
		],
		// 7
		[
			[1],
			[1],
			[1],
			[1],
		],
		// 8
		[
			[1],
			[1],
			[1],
			[1],
			[1]
		],
		// 9
		[
			[0, 1, 1],
			[1, 1, 0]
		],
		// 10
		[
			[1, 1],
			[1, 0]
		],
		// 11
		[
			[1, 1],
			[1, 1],
		],
		// 12
		[
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1],
		],
		// 13
		[
			[1, 1, 1],
			[0, 0, 1],
			[0, 0, 1],
		],
		// 14
		[
			[1, 0, 0],
			[1, 1, 1],
		],
		// 15
		[
			[0, 1, 0],
			[1, 1, 1],
		],

	];

	// 各种颜色方块对应的game.json中的id（资源名）
	export const Color_conf = [
		'game_gz_fang_png', 'game_gz_hong_png', 'game_gz_hei_png', 'game_gz_mei_png'
	];

	export const Grid_conf = {


		gz_width: 76, 		// 格子边长
		fk_width: 74,		// 方块边长

		gz_padding: 2, 		// 方块之间的间隔
		grid_line_width: 10,	// 游戏区边框厚度
		grid_left_width: 10, // 游戏区留空（两边）

		// 定义操作区中的三个组合的位置
		op_start_x: 100,
		op_start_y: 40,
		op_size: 150,
	};

	export const Block_state = {
		INIT: 1,
		MOVING: 2,
		END: 3,
	}

	export class GameData {

		public gameScore: number; // 游戏分数
		public gameGrid: Array<Array<any>>; // 游戏格子管理 {colorId, num, x, y, gz}
		public blocks: Array<any>; // 可选择的组件 {id, x, y, colorId, blockId, canPut, isPut}


		public constructor() {
			// 初始化分数
			this.gameScore = 0;

			// 初始化网格
			this.gameGrid = new Array<Array<number>>();

			// 初始化一批block（每一批3个）
			this.blocks = new Array<any>();
			// this.initBlock();
		}

		public initGrid() {
			let x = 0;
			let y = 0;

			for (let i = 0; i < 8; i++) {
				this.gameGrid.push([]);
				for (let j = 0; j < 8; j++) {
					x = Grid_conf.gz_width*j+(Grid_conf.gz_width-Grid_conf.fk_width)/2;
					y = Grid_conf.gz_width*i+(Grid_conf.gz_width-Grid_conf.fk_width)/2;

					this.gameGrid[i].push({
						num: 0,
						colorId: 0,
						x: x,
						y: y,
						gz: null,
					});
				}
			}
		}

		public attachGz(r: number, c: number, gz: any) {
			this.gameGrid[r][c].gz = gz;
		}


		public getGridInfoByPos(x: number, y: number): any {
			return this.gameGrid[x][y];
		}

		public getPos(px: number, py: number): any {
			// px,py 是相对于gameGroup的坐标
			for (let i = 0; i < 8; i++) {
				for (let j = 0; j < 8; j++) {
					if (
						this.gameGrid[i][j].x <= px && px <= this.gameGrid[i][j].x + happyClear.Grid_conf.gz_width &&
						this.gameGrid[i][j].y <= py && py <= this.gameGrid[i][j].y + happyClear.Grid_conf.gz_width
					) {
						return {
							r: i,
							c: j,
							find: true,
						}
					}
				}
			}

			return {
				find: false
			}
		}

		// 初始化一批block（每一批3个）
		public initBlock() {
			if (this.blocks.length > 0) {
				this.blocks = [];
			}

			let x = Grid_conf.op_start_x;
			let y = Grid_conf.op_start_y;

			for (let i = 0; i < 3; i++) {
				let colorId = Math.floor(Math.random() * Color_conf.length);
				let blockId = Math.floor(Math.random() * Block_conf.length);
				this.blocks.push({
					id: i,
					x: x,
					y: y,
					colorId: colorId,
					blockId: blockId,
					canPut: false,
					isPut: false
				});

				x += Grid_conf.op_size;
			}

			for (let i = 0; i < 3; i++) {
				this.blockCanPut(i);
			}
		}


		// 检测x,y为起始点（左上角）的地方是否能够放入blockId对应的block，拖动的过程中，需要调用，拖动结束的时候需要调用
		public blockCanPutPoint(r: number, c: number, id: number) {
			if (this.blocks.length < id) return false;

			let blockId = this.blocks[id].blockId;

			console.log('blockCanPutPoint:', r, c, blockId);

			let block = happyClear.Block_conf[blockId];
			let rows = block.length;
			let cols = block[0].length;

			// 顶到边了
			if (c + cols > 8 || r + rows > 8) return false;

			for (let i = 0; i < rows; i++) {
				for (let j = 0; j < cols; j++) {
					if (block[i][j] + this.gameGrid[i + r][j + c].num > 1) return false;
				}
			}

			return true;
		}

		// 判断是否可以放入grid中, 每次生成新的block或者拜访block成功的时候，需要调用一次
		public blockCanPut(id: number) {
			// 没找到
			if (this.blocks.length < id) return false;


			for (let i = 0; i < 8; i++) {
				for (let j = 0; j < 8; j++) {
					if (this.blockCanPutPoint(i, j, id)) {
						this.blocks.forEach(b => {
							if (b.id == id) {
								b.canPut = true;
							}
						})

						return true;
					}
				}
			}

			this.blocks.forEach(b => {
				if (b.id == id) {
					b.canPut = false;
				}
			})

			return false;
		}

		// 将block放入grid，拖动结束的时候需要调用
		public blockAddToGrid(r: number, c: number, id: number) {

			// 没找到
			if (this.blocks.length < id) return false;

			let blockId = this.blocks[id].blockId;
			let colorId = this.blocks[id].colorId;

			this.blocks[id].canPut = false;
			this.blocks[id].isPut = true;

			if (!this.blockCanPutPoint(r, c, id)) return;

			// 加入grid
			let block = happyClear.Block_conf[blockId];
			let rows = block.length;
			let cols = block[0].length;

			let addscore = 0;
			for (let i = 0; i < rows; i++) {
				for (let j = 0; j < cols; j++) {
					if (block[i][j]) {
						addscore++;
						this.gameGrid[r + i][c + j].num += block[i][j];
						this.gameGrid[r + i][c + j].colorId = colorId;
					}

				}
			}

			this.gameScore += addscore;
		}

		// 消除
		public doClear() {

			let clears = 0;
			let gzs = [];

			for (let i = 0; i < 8; i++) {
				let sums = 0;
				for (let j = 0; j < 8; j++) {
					sums += this.gameGrid[i][j].num;
				}

				if (sums >= 8) {

					clears++;
					for (let j = 0; j < 8; j++) {
						if (this.gameGrid[i][j].gz != null) {
							gzs.push(this.gameGrid[i][j].gz);
							this.gameGrid[i][j].gz = null;
							this.gameGrid[i][j].num = 0;
						}
					}

				};
			}

			for (let i = 0; i < 8; i++) {
				let sums = 0;
				for (let j = 0; j < 8; j++) {
					sums += this.gameGrid[j][i].num;
				}

				if (sums >= 8) {
					clears++;
					for (let j = 0; j < 8; j++) {
						if (this.gameGrid[j][i].gz != null) {
							gzs.push(this.gameGrid[j][i].gz);
							this.gameGrid[j][i].gz = null;
							this.gameGrid[j][i].num = 0;
						}
					}
				}
			}


			let addscore = 0;

			if (clears > 0) {
				addscore = this.getScore(clears);
			}

			this.gameScore += addscore;

			return {
				gzs: gzs,
				addscore: addscore
			}
		}

		// 计算消除需要添加的分数
		private getScore(clears: number): number {

			let scores = 0;
			while (clears) {
				scores += 10 * clears;
				clears--;
			}
			return
		}

		// 判断是否还有可用的组合
		public haveBlockToUse() {

			let len = this.blocks.length;
			if (len == 0) return false;

			for (let i = 0; i < len; i++) {
				if (this.blocks[i].isPut == false) return true;
			}

			return false;
		}
	}
}

