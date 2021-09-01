var lastRender = 0;
var editorWidth = 100;
var editorHeight = 20;
var output = "";
var objs = [];
var keys = {};
var framesCount = 0;
var stop = false;
var $results = $("#results");
var fps, fpsInterval, startTime, now, then, elapsed;
fps = 5;


var Player = function () {
  objs.push(this);
  this.isDead = false;
  this.x = parseInt(editorWidth / 2);
  this.y = editorHeight - 1;

  this.update = function () {
    if (keys[0]) {
      this.x--;
    } else if (keys[1]) {
      this.x++;
    }
    //this.x = constain(this.x, 0, editorHeight-1);
  }

  this.render = function () {
    output[this.y * editorHeight + this.x] = "X";
  }
}

var Block = function (x, y) {
  objs.push(this);
  this.isDead = false;
  this.x = x;
  this.y = y;

  this.update = function () {
    this.y--;
    if (this.y >= editorHeight - 1) this.isDead = true;
  }

  this.render = function () {
    output[this.y * editorHeight + this.x] = "B";
  }
}

function update(progress) {
  output = ".".repeat(editorWidth) + "\n";
  output = output.repeat(editorHeight);
  output += "\n" + framesCount;
  framesCount++;

  for (let i = objs.length - 1; i >= 0; i--) {
    objs[i].update();
    objs[i].render();
    if (objs[i].isDead) {
      objs.splice(i, 1);
    }
  }

  new Block(parseInt(editorWidth * Math.random()), 0);


  setCode(output);
}

document.onkeypress = function (e) {
  e = e || window.event;
  console.log(e);
  // use e.keyCode
};


function init() {
  new Player();

  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;

  window.requestAnimationFrame(loop);
}


function loop(timestamp) {
  requestAnimationFrame(loop);

  // calc elapsed time since last loop

  now = Date.now();
  elapsed = now - then;

  if (elapsed > fpsInterval) {

    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % fpsInterval);

    update();

  }

}


function setCode(x) {
  window.top.postMessage('{"code":' + JSON.stringify(x) + '}', 'https://www.khanacademy.org');
}


init();