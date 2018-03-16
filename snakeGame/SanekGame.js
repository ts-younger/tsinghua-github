var div = document.getElementsByClassName('main')[0],
	startBtn = document.getElementsByClassName('btn')[0],
	opause = document.getElementsByClassName('play')[0],
	opa = document.getElementsByClassName('opa')[0],
	oplay = document.getElementsByClassName('goon')[0],
	timer = null;

// snake 对象
function Snake(ele) {
	this.map = [
		['snake-head', 2, 0], ['snake-body', 1, 0], ['snake-body', 0, 0]
	];
	this.direct = 39;
	this.goleft = false;
	this.ele = ele;
	this.goup = true;
	this.godown = true;
	this.goright = false;

	// 包含snake 对象的身体数据,蛇头指向,可转弯指向
}
Snake.prototype = {
	init: function(){
		var snake = document.createElement('div');
		snake.setAttribute('id', 'snake')

		for(let i = 0; i < this.map.length; i++){
			let odiv = document.createElement('div');
			odiv.style.position = 'absolute';
			odiv.style.left = this.map[i][1]*20 + 'px';
			odiv.style.top = this.map[i][2] *20+ 'px';
			odiv.setAttribute('class', this.map[i][0]);
			snake.appendChild(odiv);
		}

		this.ele.appendChild(snake);
		let ohead = document.getElementsByClassName('snake-head')[0];
		ohead.style.zIndex = 6;
	},
	move: function(){
		for(let i = this.map.length-1; i > 0; i--){
			this.map[i][1] = this.map[i-1][1];
			this.map[i][2] = this.map[i-1][2];
		}
		switch (this.direct) {
			case 37:
			this.map[0][1] -= 1;
			break;
			case 38:
			this.map[0][2] -= 1;
			break;
			case 39:
			this.map[0][1] += 1;
			break;
			case 40:
			this.map[0][2] += 1;
			break;
		}
	},
	changeDirect: function(code){
		if(code == this.direct) return false;
		if(code !==37 && code !== 38 &&
		 code !==39 && code !== 40) return false;

		switch (code) {
			case 37:
			if (this.goleft) {
				this.direct = 37;
				this.goleft = false;
				this.goup = true;
				this.godown = true;
				this.goright = false;
			}
			break;
			case 38:
			if (this.goup) {
				this.direct = 38;
				this.goleft = true;
				this.goup = false;
				this.godown = false;
				this.goright = true;
			}
			break;
			case 39:
			if (this.goright) {
				this.direct = 39;
				this.goleft = false;
				this.goup = true;
				this.godown = true;
				this.goright = false;
			}
			break;
			case 40:
			if (this.godown) {
				this.direct = 40;
				this.goleft = true;
				this.goup = false;
				this.godown = false;
				this.goright = true;
			}
			break;
		}	
	},
	increment : function ( x, y) {
		this.map.push(['snake-body', x, y]);
	},

}
function Food (ele) {
	this.left = this.random();
	this.top = this.random();
	this.ele = ele;
	
}
Food.prototype = {
	random: function () {
		return Math.floor(Math.random()*20);
	},
	init: function () {
		var food = document.createElement('div');
		food.setAttribute('class','food');
		food.style.left = this.left*20 + 'px';
		food.style.top = this.top*20 + 'px';

		this.ele.appendChild(food);
	}
}

function Game (ele) {
	window.that = this;
	this.life = false;
	this.ele = ele;
	this.score = 0;
	this.keydownBool = true;
	this.snake = new Snake(ele);
	this.food = new Food(ele);
}

Game.prototype = {
	init : function () {
		this.life = true;
		this.snake.init();
		this.bindEvent()
		this.foodInorder();
		// this.start()
	},
	// food随机值合法化检验
	foodInorder : function(){
		for(let i = 0; i < this.snake.map.length; i++) {
			if(this.food.left == this.snake.map[i][1] &&
			 this.food.top == this.snake.map[i][2]){
				this.food = new Food(this.ele);
				this.foodInorder();
			}
		}
		this.food.init()
	},
	// 事件绑定
	bindEvent : function() {
		var that = this;
		addEvent(opause, 'click', function () {
			that.pause();
			that.life = false
			opa.style.display = 'block';
			oplay.style.display = 'block';
			opause.setAttribute('class', 'icon pause')
		})
		addEvent(oplay, 'click', function () {
			that.life = true;
			that.start();
			opa.style.display = 'none';
			oplay.style.display = 'none';
			opause.setAttribute('class', 'icon play')

		})
		addEvent( startBtn, 'click', function () {
				// console.log(this)	
			that.start();

			opa.style.display = 'none'
			startBtn.style.display = 'none'
		})
	},

	// keydown 事件方法
	keydown: function(ev) {
		let code = ev.keyCode;
		if ( !that.keydownBool) return false;
		that.keydownBool = false;
		that.snake.changeDirect(code);

		setTimeout(function () {
			that.keydownBool = true;
		}, 200)
	},
	// game对象开始游戏方法 parentNode
	start : function () {
		if (that.life) {
			timer = setInterval(function(){	
				let osnake = document.getElementById('snake');
				let ele = document.getElementsByClassName('main')[0];
				this.snake.move();
				this.over();
				this.succes();
				osnake.parentNode.removeChild(osnake);
				this.snake.init();
			}.bind(this), 200)

			addEvent(document, 'keydown', this.keydown);
		}
	},
	// game对象游戏失败判定方法
	over: function () {
		let headx = this.snake.map[0][1];
		let heady = this.snake.map[0][2];
		if(this.snake.map[0][1] >19 || this.snake.map[0][1] <0 || 
			this.snake.map[0][2] >19 || this.snake.map[0][2] <0){
			this.failed();
		}
		
		for(let i = 1; i < this.snake.map.length; i++){
			if(this.snake.map[i][1] == headx && this.snake.map[i][2] == heady){		
				this.failed();
			}
		}
	},
	// game对象游戏得分判定方法
	succes : function () {
		let oscore = document.getElementsByClassName('score')[0];
		if(this.snake.map[0][1] == this.food.left && 
			this.snake.map[0][2]== this.food.top){

			let ofood = document.getElementsByClassName('food')[0];
			let len = this.snake.map.length-1;
			let endx = this.snake.map[len][1];
			let endy = this.snake.map[len][2];
			this.snake.increment(endx, endy);
			this.score += 1;
			oscore.innerHTML = '得分：' + this.score;

			this.ele.removeChild(ofood);
			this.food = new Food(this.ele);
			this.foodInorder(this.ele);

		}
	},
	// game对象游戏暂停方法
	pause: function () {
		clearInterval(timer);
		removeEvent(document, 'keydown', that.keydown);	
		// document.removeEventListener( 'keydown', that.snake.changeDirect)
	},
	// game对象游戏失败处理方法
	failed :function () {
		var that = this;
		var ow =document.createElement('div'),
			ob = document.createElement('div'),
			ograd = document.createElement('div'),
			obu = document.createElement('div'),
			oclose = document.createElement('div');

		this.life =false;
		this.pause();

		ow.setAttribute('class', 'dead');
		ob.setAttribute('class', 'failed');
		ograd.setAttribute('class', 'grad');
		obu.setAttribute('class', 'restart');
		oclose.setAttribute('class', 'close');
		oclose.innerHTML = 'x';

		ograd.innerHTML = '你的得分为' + that.score;
		obu.innerHTML = '重新开始';
		ob.appendChild(ograd);
		ob.appendChild(obu);
		ow.appendChild(ob);
		ob.appendChild(oclose);
		ob.style.background = '#fff';
		document.body.appendChild(ow);
		
		addEvent(oclose, 'click', function () {
			document.body.removeChild(ow);

			div.innerHTML = '';
			startBtn.style.display = 'block';
			opa.style.display = 'block';
			oplay.style.display = 'none';

			that.life = false;
			that.score = 0;
			that.snake = new Snake(that.ele);
			that.food = new Food(that.ele);
			that.life = true;
			that.snake.init();
			// that.bindEvent()
			that.foodInorder();
		})
		addEvent(obu, 'click', function() {
			document.body.removeChild(ow);

			div.innerHTML = '';
			startBtn.style.display = 'block';
			opa.style.display = 'block';
			oplay.style.display = 'none';

			that.life = false;
			that.score = 0;
			that.snake = new Snake(that.ele);
			that.food = new Food(that.ele);
			that.life = true;
			that.snake.init();
			// that.bindEvent()
			that.foodInorder();

			that.start();

			opa.style.display = 'none'
			startBtn.style.display = 'none'
		})
	},	
}

// 简易版添加事件监听
function addEvent (ele, type, fn) {
	if(ele.addEventListener){
		ele.addEventListener(type, fn, false)
	}else if(ele.attachEvent){
		ele.attachEvent('on'+type, fn)
	}else {
		ele['on'+type] =fn
	}
}
// 简易版移除事件监听
function removeEvent (ele, type, fn) {
	if(ele.removeEventListener){
		ele.removeEventListener(type, fn, false)
	}else if(ele.detachEvent){
		ele.detachEvent('on'+type, fn)
	}else {
		ele['on'+type] =null
	}
}
var game = new Game(div)
game.init()