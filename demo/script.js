var $svgContainer = $(".svgWrapper");
var demos = [];

/* ------------------- Setup svgs and animations ------------------- */

/* ---------- Fire loop ---------- */
function animateLoop($svg) {
    var drawDuration = 4000;
    var stay = 2000;

    AnimateSvg.init($svg);
    AnimateSvg
        .drawStrokes({
            duration: drawDuration
        })
        .fillIn({
            delay: drawDuration / 2,
            duration: drawDuration / 2
        })
        .clearStrokes({
            delay: drawDuration + stay
        })
        .clearFill({
            delay: drawDuration + stay
        });
}

var loop = {
    path: "img/loop.svg",
    func: animateLoop
};

/* ---------- Character ---------- */
function animateCharacter($svg) {
    // animating character's body parts
    AnimateSvg.init($svg)
        .setRoot($svg.find("#eyes"))
        .drawStrokes({
            duration: 5000
        })
        .fillIn({
            duration: 3000,
            delay: 3000
        })
        .setRoot($svg.find("#hands"))
        .drawStrokes({
            delay: 1000
        })
        .fillIn({
            delay: 2000
        })
        .setRoot($svg.find("#body"))
        .drawStrokes({
            delay: 2000
        })
        .fillIn({
            delay: 2500
        })
        .setRoot($svg.find("#legs :first-child"))
        .drawStrokes({
            delay: 3000
        })
        .fillIn({
            delay: 3500
        })
        .setRoot($svg.find("#legs :nth-child(2)"))
        .drawStrokes({
            delay: 3500
        })
        .fillIn({
            delay: 4000
        })
        .setRoot($svg)
        .fillIn("#head", {
            delay: 4800
        });


    // animating bubbles for random durations and delays
    $svg.find("#bubbles path").each(function() {
        AnimateSvg.setRoot($(this))
            .drawStrokes({
                delay: random(500, 2000),
                duration: random(600, 1500)
            })
            .fillIn({
                delay: random(1000, 3000)
            });
    });

    // animating last bubble
    AnimateSvg.init($svg.find("#bubble"))
        .drawStrokes({
            delay: 8000,
            duration: 500
        })
        .fillIn({
            delay: 8300,
            duration: 700
        });

    AnimateSvg.setRoot($svg)
        .clearStrokes({
            delay: 10000,
            duration: 500
        })
        .clearFill({
            delay: 10000,
            duration: 500
        });
}

var character = {
    path: "img/character.svg",
    func: animateCharacter
};

/* ---------- Fox ---------- */
function animateFox($svg) {
    AnimateSvg.init($svg);

    /* phase 1 - fox and first part of text */
    $svg.find("#letters path").each(function(i) {
        AnimateSvg.setRoot($(this))
            .drawStrokes({
                delay: i * 400,
                duration: 1200
            })
            .fillIn({
                delay: i * 450
            });
    });

    AnimateSvg.setRoot($svg.find("#fox"))
        .drawStrokes({
            duration: 5000
        })
        .fillIn({
            duration: 2500,
            delay: 2500
        });

    AnimateSvg.setRoot($svg.find("#fox_hand"))
        .drawStrokes({
            delay: 3500,
            duration: 2000
        })
        .fillIn({
            delay: 4000,
            duration: 1000
        });

    /* phase 2 - rest of the text and heart shape */
    $svg.find("#text_part2 path").each(function(i) {
        AnimateSvg.setRoot($(this))
            .drawStrokes({
                delay: 3000 + i * 500,
                duration: 3500
            })
            .fillIn({
                delay: 3000 + i * 750
            });
    });

    AnimateSvg.setRoot($svg.find("#heart"))
        .drawStrokes({
            delay: 4000,
            duration: 5000
        })
        .fillIn({
            delay: 4500
        });
}

var fox = {
    path: "img/fox.svg",
    func: animateFox
};

/* ------------------- End setup svgs and animations ---------------- */

demos.push(loop);
demos.push(character);
demos.push(fox);

function present(demo) {
    $svgContainer.load(demo.path, function() {
        var $svg = $svgContainer.find("svg");
        demo.func($svg);
    });
}

var oneDemoApproxDuration = 12000;
var repeatDelay = 2000;
var newIndex;
var wait;

function slideshow(demos, index) {
    present(demos[index]);

    if (index < demos.length - 1) {
        newIndex = index + 1;
        wait = oneDemoApproxDuration;
    } else {
        newIndex = 0;
        wait = oneDemoApproxDuration + repeatDelay;
    };

    setTimeout(function() {
        slideshow(demos, newIndex);
    }, wait);
}

function random(min, max) {
    return (Math.random() * (max - min)) + min;
}

$(document).ready(function() {
    slideshow(demos, 0);
});