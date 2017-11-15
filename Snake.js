var snake = window.snake || {};

snake.game = (function() {
        var canvas = document.getElementById('snake-canvas');
        var ctx = canvas.getContext('2d');
        var status=false;
        var old_direction = 'right';
        var direction = 'right';
        var block = 10;
        var score = 0;
        var refresh_rate = 10;
        var pos = [[5,1],[4,1],[3,1],[2,1],[1,1]];
        
        var callbackControl  = null;
        var callbackGameOver = null;

        function adjust() {
		canvas.width=850;
		canvas.height=600;
		control.style.display='inline';
        }
        
        var food = [Math.round(Math.random(4)*(canvas.width - 10)), Math.round(Math.random(4)*(canvas.height - 10)),];
        
        function todraw() {
		for(var i = 0; i < pos.length; i++) {
			draw(pos[i]);
		}
	}
	
        function giveLife() {
		var nextPosition = pos[0].slice();
		
		switch(old_direction) {
		case 'right':
			nextPosition[0] += 1;
			break;
		case 'left':
			nextPosition[0] -= 1;
			break;
		case 'up':
			nextPosition[1] -= 1;
			break;
		case 'down':
			nextPosition[1] += 1;
			break;
		}
		
		pos.unshift(nextPosition);
		pos.pop();
	}
		
        function grow() {
		var nextPosition = pos[0].slice();
		switch(old_direction) {
		case 'right':
			nextPosition[0] += 1;
			break;
		case 'left':
			nextPosition[0] -= 1;
			break;
		case 'up':
			nextPosition[1] -= 1;
			break;
		case 'down':
			nextPosition[1] += 1;
			break;    
		}
		pos.unshift(nextPosition);
	}
	
        function loop() {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		var direction = callbackControl();
		setWay(direction);
		todraw();
		giveLife();
		feed();

		if(is_catched(pos[0][0]*block,pos[0][1]*block,block,block,food[0],food[1],10,10)) {
			score += 10;
			createfood();
			grow();
		}

		snake.game.status = setTimeout(function() { loop(); },refresh_rate);
        }
        
	function setWay(direction) {
		switch(direction) {
		case 0:
			if(old_direction!='right')
				old_direction = 'left';
			break;
		case 1:
			if(old_direction!='left')
				old_direction = 'right';
			break;
		case 2:
			if(old_direction!='down')
				old_direction = 'up';
			break;
		case 3:
			if(old_direction!='up')
				old_direction = 'down';
			break;
		}
	}
        
        function feed() {
		ctx.beginPath();
		ctx.fillStyle = "#ff0000";
		ctx.fillRect(food[0],food[1],10,10);
		ctx.fill();
		ctx.closePath();
        }
        
        function createfood() {
		food = [Math.round(Math.random(4)*850), Math.round(Math.random(4)*600)];
        }
        
        function is_catched(ax,ay,awidth,aheight,bx,by,bwidth,bheight) {
		return !(
		((ay + aheight) < (by)) ||
		(ay > (by + bheight)) ||
		((ax + awidth) < bx) ||
		(ax > (bx + bwidth))
		);
        }
        
        function draw(pos) {
            var x = pos[0] * block;
            var y = pos[1] * block;
            if(x >= canvas.width || x <= 0 || y >= canvas.height || y<= 0) {
            	callbackGameOver();
            	snake.game.status=false;
		ctx.clearRect(0,0,canvas.width,canvas.height);
            } else {
		ctx.beginPath();
		ctx.fillStyle='#000000';
		ctx.fillRect(x,y,block,block);
		ctx.closePath();
            }
        }
        
        function getPos() {
        	return pos;
        }
        
        function getFoodPos() {
        	return food;
        }
        
        function getScore() {
        	return score;
        }
        
        function restart() {
        	clearTimeout(status);
        	status = false;
	        score = 0;
		pos = [[5,1],[4,1],[3,1],[2,1],[1,1]];
	}

        function start() {
            ctx.fillStyle='#000000';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            loop();
	}
	
	function setControlCallback(callback) {
		callbackControl = callback;
	}
	
	function setGameOverCallback(callback) {
		callbackGameOver = callback;
	}
	
	function setRefreshRate(_refresh_rate) {
		refresh_rate = _refresh_rate;
	}
	
	return {
		restart : restart,
		start : start,
		getPos: getPos,
		getFoodPos: getFoodPos,
		getScore: getScore,
		setControlCallback: setControlCallback,
		setGameOverCallback: setGameOverCallback,
		setRefreshRate: setRefreshRate
        };
      
})();
