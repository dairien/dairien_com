const data = {
  highlights: [
    {name: "mmhmm OOO", className:"mmhmmOOO", mode: ""},
    {name: "mmhmm", className:"mmhmm", mode: ""},
    {name: "Culture Fit", className:"culturefit", mode: "light"},
    {name: "Creative Mornings", className:"creativemornings", mode: "light"},
    {name: "Google #MyDomain", className:"google", mode: ""},
    /*{name: "Apple M1", className:"apple", mode: "light"},*/
    {name: "Twisty Tongue", className:"twistytongue", mode: ""},
    {name: "All Turtles Studio", className:"allturtles", mode: ""},
    {name: "One Medical", className:"onemedical", mode: ""},
    {name: "Rise", className:"rise", mode: "light"},
    {name: "default", className:"", noise:"0.1", mode: ""}
  ]
}

$(document).ready(function(){

    /* Page fade on load */
    $('.wrapper section, .wrapper header').each(function(index) {
        var increment = (index+1)*1000
        $(this).css("opacity", 0).animate({
            opacity: 1
        }, increment, function() {
            // complete
        });
    });
    


    /* Highlight links */
    $(".highlights a").each(function(index) {
        $(this).bind("click", function(e){
            e.preventDefault();
            if (data.highlights[index].mode == "light") {
                $('body').attr("class", data.highlights[index].className+" light")
            } else {
                $('body').attr("class", data.highlights[index].className)
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
            if (Math.random() < 0.8) {
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
        }, (250 / 50));
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