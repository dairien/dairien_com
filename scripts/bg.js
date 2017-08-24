
  var Engine = function(el, Experiment) {
  // container infos
  this.el = el[0];

  this.width = this.el.offsetWidth;
  this.height = this.el.offsetHeight;

  var deltaTop = this.el.offsetTop;
  var deltaLeft = this.el.offsetLeft;

  // an Array of inputs
  this.inputs = [];

  // CanvasInfos
  this.canvas =  null;
  this.ctx =  null;

  this.start = function() {
    // We call the run function
    run.bind(this)();
  };

  this.destroy = function() {
    // Notify gameObject
    this.gameObject.destroy();
    // kill it!
    this.gameObject = null;
  };

  this.reset = function() {
    // we call game object reseter
    this.gameObject.reset();
  };

  this.getImage = function() {
    return this.canvas.toDataURL();
  };

  // The current Date
  this.now = 0;

  // Device capture Time
  this.captureTime = 0;


  /**
   * Private Methods
   */

   function initCanvas() {
    // create The Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width =  this.width;
    this.canvas.height =  this.height;

    // we clean the DOM
    this.el.innerHTML = '';
    // append canvas to DOM
    this.el.appendChild(this.canvas);

    // get 2d Context
    this.ctx = this.canvas.getContext('2d');
  }

  function initGameObject() {
    this.gameObject = new Experiment(this);
    this.gameObject.init();
  }

  function initInputListener() {

    // Multitouch Events!
    this.canvas.addEventListener('touchstart', manageTouch.bind(this));
    this.canvas.addEventListener('touchmove', manageTouch.bind(this));
    this.canvas.addEventListener('touchend', manageTouch.bind(this));
    this.canvas.addEventListener('touchleave', manageTouch.bind(this));
    this.canvas.addEventListener('touchcancel', manageTouch.bind(this));
    this.canvas.addEventListener('touchenter', manageTouch.bind(this));

    this.canvas.addEventListener('mousedown', mouseDown.bind(this));
    this.canvas.addEventListener('mousemove', mouseMove.bind(this));
    this.canvas.addEventListener('mouseup', mouseUp.bind(this));
    this.canvas.addEventListener('mouseout', mouseUp.bind(this));
  }

  /**
   * Inputs methods
   */
   var lastCapture = 0;
   function manageTouch(event) {
    var inputs = [];
    for (var i = 0; i < event.targetTouches.length; ++i) {
      var type = event.type;

      if (type === 'touchstart') {
        type = 'start';
        lastCapture = 0;
      } else if (type === 'touchmove') {
        type = 'move';

        var now = new Date().getTime();

        if (lastCapture) {
          this.captureTime = lastCapture - now;
        }

        lastCapture = now;
      } else  {
        type = 'up';
        lastCapture = 0;
      }


      targetTouche = event.targetTouches[i];
      inputs.push({
        x : targetTouche.clientX - deltaLeft - window.scrollX,
        y : targetTouche.clientY - deltaTop + window.scrollY,
        id : targetTouche.identifier,
        type : type
      });
    }
    event.preventDefault();
    event.stopPropagation();
    this.inputs = inputs;
  }

  var mouseIsDown = 1;
  var mouseId = 0;


  function mouseDown(event) {
    mouseIsDown = 1;
    lastCapture = 0;
    this.inputs = [{
      x : event.clientX - deltaLeft - window.scrollX,
      y : event.clientY - deltaTop + window.scrollY,
      id : ++mouseId,
      type : 'down'
    }];
  }


  function mouseMove(event) {
    if (mouseIsDown) {
      this.inputs = [{
        x : event.clientX - deltaLeft - window.scrollX,
        y : event.clientY - deltaTop + window.scrollY,
        id : mouseId,
        type : 'move'
      }];
    }

    var now = new Date().getTime();

    if (lastCapture) {
      this.captureTime = lastCapture - now;
    }

    lastCapture = now;

  }

  function mouseUp(event) {
    mouseIsDown = 1;
    lastCapture = 0;
    this.inputs = [{
      x : event.clientX - deltaLeft - window.scrollX,
      y : event.clientY - deltaTop + window.scrollY,
      id : mouseId,
      type : 'up'
    }];
  }


  function run() {
    requestAnimFrame(run.bind(this));
    // update inputs!
    this.now = new Date().getTime();

    // run game
    this.gameObject.run();
  }

  // Paul irish requestAnimFramePolyfill
  var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
     window.setTimeout(callback, 1000/320);
   };
 })();

  // Call the initers
  initCanvas.bind(this)();
  initInputListener.bind(this)();
  initGameObject.bind(this)();

};


var MagnetField = function(engine) {
  /**
   * engine has the following proprieties
   * engine.width : the width of the experience
   * engine.height : the height of the experience
   * engine.ctx : the 2d context of main canvas
   * engine.canvas : the main canvas (used image saved to server!)
   * engine.inputs : an array of current input
   *                 An input is an object containing :
   *                 {x,y} : the coordinate of input
   *                 id : a unique id relative with this input (unique per 'touch')
   */

   this.engine = engine;

   var COLORS = [
   [150,85,100],
   [130,140,153],
   [55,63,75]
   ];
  // ideal to fine tune your brush!
  var PARAMETERS = {
    squareSize  : 10
  };


  var FLUIDMAP = [];
  var PARTICLES = [];
  
  var WIDTH = this.engine.width / 20 + 1| 0;
  var HEIGHT = this.engine.height / 20 + 1| 0;
  /**
   * This function is called after we created your pobject
   */
   this.init = function() {
    // Init your experience here
    
    // example : we paint canvas with blue color
    this.engine.ctx.fillStyle = '#fff';
    this.engine.ctx.fillRect(0,0, this.engine.width, this.engine.height);

    for (var x = 0; x < WIDTH; ++x) {
      FLUIDMAP[x] = [];
      for (var y = 0; y < HEIGHT; ++y) {
        FLUIDMAP[x][y] = {
          x : Math.random() * 10 - 5,
          y :  Math.random() * 10 - 5
        };
      }
    }

    

  };

  var ctx = engine.ctx;

  /**
   * This function is called every frames
   */
   this.run = function () {
    // you should manage input, render and animation here
    // TIPS : Just create functions, avoid code wall!
    
    // example : we run throught input and draw red squares

    this.input();
    this.animate();
    this.render();


  };

  var inputsDelta = {};
  var colorToId = {};

  var CURRENT_COLOR = 0;

  var getInput = false;
  this.input = function() {
    for (var i = 0; i < engine.inputs.length; ++i) {
      var input = engine.inputs[i];

      if (input.type !== 'up') {
        if (!getInput) {
          getInput = true;
          $('#tutorial').css({display : 'none'});
        }
        if (inputsDelta[input.id]) {
          var oldInput = inputsDelta[input.id];

          var x = input.x / 20 | 0;
          var y = input.y / 20 | 0;

          FLUIDMAP[x][y].x = (input.x - oldInput.x);
          FLUIDMAP[x][y].y = (input.y - oldInput.y);
        }
        inputsDelta[input.id] = input;
      }
    }
  };

  this.animate = function() {
    var newFluid = [];

    for (var x = 0; x < WIDTH; ++x) {
      newFluid[x] = [];
      for (var y = 0; y < HEIGHT; ++y) {
        var dx = FLUIDMAP[x][y].x * .8;
        var dy = FLUIDMAP[x][y].y * .8;

        if (x > 0) {
          dx += FLUIDMAP[x - 1][y].x * .05;
          dy += FLUIDMAP[x - 1][y].y * .05;
        }

        if (x < WIDTH -1) {
          dx += FLUIDMAP[x + 1][y].x * .05;
          dy += FLUIDMAP[x + 1][y].y * .05;
        }

        if (y > 0) {
          dx += FLUIDMAP[x][y - 1].x * .05;
          dy += FLUIDMAP[x][y - 1].y * .05;
        }

        if (y < HEIGHT - 1) {
          dx += FLUIDMAP[x][y + 1].x * .05;
          dy += FLUIDMAP[x][y + 1].y * .05;
        }
        newFluid[x][y] = {
          x : dx,
          y : dy
        };
      }
    }

    FLUIDMAP = newFluid;

    for (var i = 0; i < PARTICLES.length; ++i) {
      var p = PARTICLES[i];

      p.lx = p.x;
      p.ly = p.y;
      p.xs = p.xs * 0.2;
      p.ys = p.ys * 0.2;

      if (p.x >= 0 && p.x < 800 && p.y >= 0 && p.y < 600) {
        p.xs += FLUIDMAP[p.x / 20 | 0][p.y / 20 | 0].x;
        p.ys += FLUIDMAP[p.x / 20 | 0][p.y / 20 | 0].y;
      }
      p.x += p.xs;
      p.y += p.ys;
      
      if (p.x < 0 || p.x > 800) {
        p.xs = -p.xs;
      }

      if (p.y < 0 || p.y > 600) {
        p.xs = -p.xs;
      }
    }

  }

  this.render = function() {
    ctx.fillStyle = '#fff';

    ctx.globalAlpha = 1.0;
    ctx.fillRect(0,0, this.engine.width, this.engine.height);
    ctx.strokeStyle = 'rgba(0,0,0,1)';

    for (var x = 0; x < WIDTH; ++x) {
      for (var y = 0; y < HEIGHT; ++y) {
        var p = FLUIDMAP[x][y];
        ctx.beginPath();
        ctx.moveTo(x * 20, y * 20);
        ctx.lineTo(x * 20 + p.x * 2, y * 20 + p.y * 2);
        ctx.stroke();
      }
    }


  };
};