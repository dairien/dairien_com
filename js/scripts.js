const data = {
  highlights: [
    {name: "mmhmm OOO", color:"#DC6872", noise:"0.03", mode: ""},
    {name: "mmhmm", color:"#403AE9", noise:"0.06", mode: ""},
    {name: "Culture Fit", color:"#EDD83F", noise:"0.03", mode: "light"},
    {name: "Creative Mornings", color:"#FFDE8A", noise:"0.03", mode: "light"},
    {name: "Google #MyDomain", color:"#6890E5", noise:"0.04", mode: ""},
    {name: "Apple M1", color:"#F5F5F7", noise:"0.03", mode: "light"},
    {name: "Twisty Tongue", color:"#403D5A", noise:"0.06", mode: ""},
    {name: "All Turtles Studio", color:"#EB5757", noise:"0.05", mode: ""},
    {name: "One Medical", color:"#4F8069", noise:"0.05", mode: ""},
    {name: "Rise", color:"#03D6B0", noise:"0.03", mode: "light"}
  ]
}

$(document).ready(function(){
    var underlay = $("#underlay")
    var noise = $("#noise")
    $(".highlights a").each(function(index) {
        $(this).bind("click", function(e){
            e.preventDefault();
            underlay.css("background-color", data.highlights[index].color)
            noise.css("opacity", data.highlights[index].noise)
            if (data.highlights[index].mode == "light") {
                $('body').addClass("light")
            } else {
                $('body').removeClass("light")
            }
            /* alert( index + ": " + $( this ).text() ); */
        });
    });
});

const noise = () => {
    let canvas, ctx;

    let wWidth, wHeight;

    let noiseData = [];
    let frame = 0;

    let loopTimeout;


    // Create Noise
    const createNoise = () => {
        const idata = ctx.createImageData(wWidth, wHeight);
        const buffer32 = new Uint32Array(idata.data.buffer);
        const len = buffer32.length;

        for (let i = 0; i < len; i++) {
            if (Math.random() < 0.5) {
                buffer32[i] = 0xff000000;
            }
        }

        noiseData.push(idata);
    };


    // Play Noise
    const paintNoise = () => {
        if (frame === 9) {
            frame = 0;
        } else {
            frame++;
        }

        ctx.putImageData(noiseData[frame], 0, 0);
    };


    // Loop
    const loop = () => {
        paintNoise(frame);

        loopTimeout = window.setTimeout(() => {
            window.requestAnimationFrame(loop);
        }, (1000 / 25));
    };


    // Setup
    const setup = () => {
        wWidth = window.innerWidth;
        wHeight = window.innerHeight;

        canvas.width = wWidth;
        canvas.height = wHeight;

        for (let i = 0; i < 10; i++) {
            createNoise();
        }

        loop();
    };


    // Reset
    let resizeThrottle;
    const reset = () => {
        window.addEventListener('resize', () => {
            window.clearTimeout(resizeThrottle);

            resizeThrottle = window.setTimeout(() => {
                window.clearTimeout(loopTimeout);
                setup();
            }, 200);
        }, false);
    };


    // Init
    const init = (() => {
        canvas = document.getElementById('noise');
        ctx = canvas.getContext('2d');

        setup();
    })();
};

noise();