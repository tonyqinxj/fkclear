/**
 *  一个组合的格子，代表了各种形状，一开始放到操作区间，点击之后，需要从操作区间取出来，放入游戏区间
 *  是以点阵的形式来存在的 
 * 
*/

class BlockView extends egret.Sprite{

	private blockInfo:any; 		// 组合格子的形态 {colorId, blockId}
	private gz_width:number; 	// 单格子尺寸
	private gz_padding:number;	// 单格子的间隔
	private block_scale:number; // 组合格子的缩放参数
	private state:number; 		// 组合格子的状态
	private o_width:number;
	private o_height:number;

	public constructor(blockinfo:any) {
		super();

		this.blockInfo = null;
		this.gz_width = happyClear.Grid_conf.gz_width;
		this.gz_padding = happyClear.Grid_conf.gz_padding;
		this.block_scale = 0.3;
		this.state = happyClear.Block_state.INIT;

		this.init(blockinfo);
	}

	public getBlockInfo(){
		return this.blockInfo;
	}



	public setState(state){
		this.state = state;
		if(state == happyClear.Block_state.INIT){
			this.resetScale(this.block_scale);
		}else if(state == happyClear.Block_state.MOVING){
			this.resetScale(0.9);
		}else if(state == happyClear.Block_state.END){
			this.removeChildren();
		}
	}

	private resetScale(scale){
		this.scaleX = scale;
		this.scaleY = scale;
	}

	private init(blockinfo:any):void{

		// 缩放
		this.blockInfo = blockinfo;
		let color = happyClear.Color_conf[blockinfo.colorId];
		let blockdata = happyClear.Block_conf[blockinfo.blockId];
		
		let rows = blockdata.length;
		let cols = blockdata[0].length;

		for(let r=0;r<rows;r++){
			for(let c=0;c<cols;c++){
				if(blockdata[r][c]){
					let x=c*(this.gz_padding+this.gz_width);
					let y=r*(this.gz_padding+this.gz_width);
	
					let fk = ResourceUtils.createBitmapByName('game_json.'+color);
					fk.x=x;
					fk.y=y;
					fk.width = this.gz_width;
					fk.height = this.gz_width;

					this.addChild(fk);
				}
			}
		}


		// 计算blockview的size
		this.x = blockinfo.x;
		this.y = blockinfo.y;
		this.width = rows * this.gz_width+this.gz_padding*(rows-1);
		this.height = cols * this.gz_width+this.gz_padding*(cols-1);

		this.setState(happyClear.Block_state.INIT);
	}

}