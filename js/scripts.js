// Background color rotation
var colors = ["#403AE9", "#DC6872", "#403D5A"];
for (var j = colors.length - 1; j > 0; j--) {
  var k = Math.floor(Math.random() * (j + 1));
  var tmp = colors[j]; colors[j] = colors[k]; colors[k] = tmp;
}
var i = 0;
function cycle() {
  i = (i + 1) % colors.length;
  document.body.style.backgroundColor = colors[i];
}
setTimeout(function() {
  cycle();
  setInterval(cycle, 15000);
}, 5000);

// Noise overlay
(function() {
  var canvas = document.getElementById('noise');
  var ctx = canvas.getContext('2d');
  var noiseData = [];
  var frame = 0;
  var loopTimeout;

  function createNoise(w, h) {
    var idata = ctx.createImageData(w, h);
    var buffer32 = new Uint32Array(idata.data.buffer);
    for (var j = 0; j < buffer32.length; j++) {
      if (Math.random() < 0.8) buffer32[j] = 0xff000000;
    }
    noiseData.push(idata);
  }

  function paintNoise() {
    frame = (frame + 1) % 10;
    ctx.putImageData(noiseData[frame], 0, 0);
  }

  function loop() {
    paintNoise();
    loopTimeout = setTimeout(function() {
      requestAnimationFrame(loop);
    }, 5);
  }

  function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    noiseData = [];
    for (var j = 0; j < 10; j++) createNoise(canvas.width, canvas.height);
    loop();
  }

  setup();
  window.addEventListener('resize', function() {
    clearTimeout(loopTimeout);
    setup();
  });
})();
