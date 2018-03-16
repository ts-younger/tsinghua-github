
var obtn = document.getElementById('mine-start');
// keydown 左键 =>  判断是否为地雷 => 是,结束游戏 => 否,判断周边地雷数量 => 数量为0,继续寻找周边地雷 => 不为0,显示数字
//  keydown 右键 =>  次数为1: 标记地雷 => 次数为2:标记问号 => 复原
// mousemove => (判断是否为需要变换区域)恢复上一次划过地域的背景
// 	=>hover:(判断是否为可变换区域)变换格式为0背景,  

function Mine (ele, minec, canwidth, canheight) {
	this.ele = ele;
	this.PANEL_WIDTH = 20;
	this.mineCount = minec;
	this.canwidth = canwidth;
	this.canheight = canheight; 
	this.eleArr = [];
	this.oldpos = [];
	this.smile = obtn;
	this.mineArr = [];
	this.ele.ctx = this.ele.getContext('2d');
	this.numpic = ['./img/0.bmp', './img/1.bmp', './img/2.bmp',
	'./img/3.bmp', './img/4.bmp', './img/5.bmp', './img/6.bmp', 
	'./img/7.bmp', './img/8.bmp', './img/9.bmp'];
	this.flagpic = [
		'./img/blank.bmp', './img/flag.bmp', './img/ask.bmp',
	]
}
Mine.prototype = {
	// 坐标转化
	parseCode: function(ev) {
		let e = ev || window.event;
		let pos = [ev.layerX, ev.layerY];
		return pos.map(function (item) {
			return Math.floor(item / 20)
		})
	},
	// 初始化
	init: function () {	
		this.ele.style.width = this.canwidth*this.PANEL_WIDTH +'px';
		this.ele.style.height = this.canheight*this.PANEL_WIDTH +'px';

		for(let i = 0; i < this.canwidth; i++) {
			this.eleArr[i] = [];
			for(let j =0; j<this.canheight; j++) {
				this.eleArr[i][j] = {
					isopen: false,
					ismine: false,
					tag: 0,
				}
				let pos = [i, j]
				this.drawimage('./img/blank.bmp', pos)
			}
		}
		this.random();
		this.bindEvent();
	},
	// 地雷生成
	random: function () {
		this.mineArr = [];
		var count = this.mineCount;
		while (count) {
			let x = Math.floor(Math.random()* 20)
			let y = Math.floor(Math.random()* 20)
			if(this.eleArr[x][y].ismine) continue;
			this.eleArr[x][y].ismine = true;
			this.mineArr.push([x, y])
			count--
		}		
	},
	// 事件绑定
	bindEvent: function () {
		let that = this;
		this.ele.onmousedown = function (ev) {
			let pos = that.parseCode(ev);
			if(ev.button ==0 ){
				if(that.eleArr[pos[0]][pos[1]].isopen || that.eleArr[pos[0]][pos[1]].tag != 0) return;

				if(that.checkMine(pos)) {
					let spaceArr = [];
					let aroundMineNum = that.checkAroundMine(pos);

					if(aroundMineNum){
						that.drawimage(that.numpic[aroundMineNum], pos);
						that.eleArr[pos[0]][pos[1]].isopen = true;
					}else if(aroundMineNum == 0){
						that.checkAroundSpace(pos, spaceArr);
					}
				}else {
					that.failed(pos)
				}
			}else if( ev.button == 2) {
				if(that.eleArr[pos[0]][pos[1]].isopen) return;
				that.eleArr[pos[0]][pos[1]].tag++;
				
				if(that.eleArr[pos[0]][pos[1]].tag >2 ){
					that.eleArr[pos[0]][pos[1]].tag = 0;
					that.eleArr[pos[0]][pos[1]].isopen = false
				}

				let flag = that.eleArr[pos[0]][pos[1]].tag;
				that.drawimage(that.flagpic[flag], pos)
			}
			
		}
		this.ele.onmousemove = function (ev) {
			let pos = that.parseCode(ev);
			
			if(that.oldpos.length) {
				if(that.eleArr[that.oldpos[0]] && 
					that.eleArr[that.oldpos[0]][that.oldpos[1]] && 
					that.eleArr[that.oldpos[0]][that.oldpos[1]].isopen== false && 
				that.eleArr[that.oldpos[0]][that.oldpos[1]].tag == 0) {
					that.drawimage('./img/blank.bmp', that.oldpos)
				}
			}

			if(that.eleArr[pos[0]][pos[1]].isopen || 
				that.eleArr[pos[0]][pos[1]].tag != 0) return;
			if(that.eleArr[pos[0]] && that.eleArr[pos[0]][pos[1]] ) {
				that.drawimage('./img/0.bmp', pos)
				that.oldpos = pos;

			}
		}
		this.ele.onmouseout = function () {
			if(that.eleArr[that.oldpos[0]][that.oldpos[1]].isopen || 
				that.eleArr[that.oldpos[0]][that.oldpos[1]].tag != 0) return;
			if(that.oldpos.length) {
				if(that.eleArr[that.oldpos[0]] && 
					that.eleArr[that.oldpos[0]][that.oldpos[1]]) {
					that.drawimage('./img/blank.bmp', that.oldpos)
				}
			}
		}
		this.smile.onclick = function () {
			that.eleArr = [];
			that.mineArr = [];
			that.init();
			this.className = 'start';
		}

	},
	// 画像
	drawimage: function(url, pos){
		let that = this;
		let pwidth = this.PANEL_WIDTH;
		let img = document.createElement('img');
		img.src = url;
		img.onload = function() {
			that.ele.ctx.drawImage( img,20* pos[0] , 20*pos[1] , pwidth, pwidth)
		}
	},
	// 检查是否踩雷
	checkMine: function (pos) {		
		if(this.eleArr[pos[0]][pos[1]].ismine) {
			return false
		}
			return true
	},
	// 检查周边地雷数量
	checkAroundMine: function(pos){
		let num = 0;
		let x = pos[0];
		let y = pos[1];		
		let aroundArr = this.getAroundArr(pos)

		aroundArr.forEach( value => {
			if(this.eleArr[value[0]][value[1]].ismine) {
				num++;
			}
		})
		return num;
	},
	// 检查周边地雷书为0的空格数
	checkAroundSpace: function (pos, arr) {
		let x = pos[0];
		let y = pos[1];
		let that = this;
		if(pos.length>2) return;
		pos = [...pos, 0];
		this.eleArr[x][y].isopen = true;

		arr.push(pos)
		let aroundArr = this.getAroundArr(pos)
		
		for(let i = 0; i< aroundArr.length; i++) {
			let left = aroundArr[i][0];
			let top = aroundArr[i][1];
			let aroundMineNum = this.checkAroundMine(aroundArr[i]) 
			if(aroundMineNum == 0 && this.eleArr[left][top].isopen == false ){		
				that.drawimage(that.numpic[0], aroundArr[i]);
				this.checkAroundSpace(aroundArr[i], arr)
			}else{
				arr.push([...aroundArr[i], aroundMineNum]);		
				that.drawimage(that.numpic[aroundMineNum], aroundArr[i]);
				that.eleArr[left][top].isopen = true;		
			}

		}
		// this.openSpaceAround(aroundArr)
		return arr
	},
	// 点击 => 判定是否为雷 => 是,结束 =>非, 判定aroundMine => 0,调用space 系列方法, => 其他 
	// space系列 => 继续checkaroundMine => 是否含有space => 
	// 获取周边坐标
	getAroundArr: function (pos){
		let x = pos[0];
		let y = pos[1];
		let that = this;
		let arr = [ [x-1, y-1], [x-1, y], [x-1, y+1], [x, y-1], [x, y+1],
			 [x+1, y-1], [x+1, y],  [x+1, y+1]
		];

		arr = arr.filter(function (item) {
			return that.eleArr[item[0]] &&
			that.eleArr[item[0]][item[1]] &&
			that.eleArr[item[0]][item[1]].isopen == false
		})
		return arr
	},
	// 失败处理
	failed: function(pos) {
		this.showMine(pos);
		this.smile.className = 'failed'
		alert('failed')
	},
	// 失败后显示所有地雷及错误处理
	showMine: function (pos) {
		for(let i = 0; i< this.eleArr.length; i++) {
			for(let j = 0; j < this.eleArr[i].length; j++) {
				if(this.eleArr[i][j].ismine) {
					this.drawimage('./img/mine.bmp', [i, j])
				}
				if(this.eleArr[i][j].tag == 1 && this.eleArr[i][j].ismine == false){
					this.drawimage('./img/error.bmp', [i, j])
				}
				this.eleArr[i][j].isopen = true;
			}			
		}
		this.drawimage('./img/blood.bmp', pos);
	}

}
// window.mine = new Mine()
