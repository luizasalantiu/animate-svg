var AnimateSvg = (function($) {
    'use strict';

    var module = {};
    var $svg;
    var opts;

    /* Queue names used for jQuery animations */
    var queues = {
        drawStrokes: "drawStrokes",
        clearStrokes: "clearStrokes",
        fillIn: "fillIn",
        clearFill: "clearFill"
    };

    /* ------------------- Default options ------------------- */

    var generalDefaultOpts = {
        // by default, all paths will be animated. user can provide other selectors to target specific elements
        selector: 'path',
        // only elements of type path are supported at the moment
        animatable: 'path',
        // flag indicating whether or not svg starts as hidden
        hidden: true
    };

    var drawStrokesDefaultOpts = {
        duration: 4000,
        delay: 0
    };

    var fillInDefaultOpts = {
        duration: 1500,
        delay: 2000
    };

    // todo: clear delay if svg starts as hidden
    var clearStrokesDefaultOpts = {
        duration: 3500,
        delay: 6000
    };

    // todo: clear delay if svg starts as hidden
    var clearFillDefaultOpts = {
        duration: 2500,
        delay: 6500
    };

    /* ----------------- End default options ----------------- */

    /**
     * Initializes module.
     * @param {jQuery object} $svgElem jQuery wrapped svg element.
     * @param {string} [generalOpts.selector] Selector of elements to be animated.
     * @param {boolean} [generalOpts.hidden] Flag indicating whether or not svg starts as hidden.
     */
    module.init = function($svgElem, generalOpts) {
        $svg = $svgElem;
        opts = $.extend({}, generalDefaultOpts, generalOpts);

        // if svg needs to start as hidden, setup is done in one go for better performance
        if (opts.hidden) {
            module.hide();
        } else {
            setupSvg($svg);
        }

        return module;
    };

    module.setRoot = function($elem) {
        $svg = $elem;

        return module;
    };

    /**
     * Setup paths to allow clearing of strokes later.
     */
    function setupSvg($svg) {
        $svg.find(opts.selector).each(function() {
            var length = this.getTotalLength();
            $(this).css({
                'stroke-dasharray': length + ' ' + length,
            });
        });
    }



    /**
     * Hides svg path strokes and fills.
     * @param {jQuery object} [$svgElem] jQuery wrapped svg element. When not provided, hide applies to the object supplied in the init method.
     */
    module.hide = function($svgElem) {
        var $elem;

        if (isDefined($svgElem)) {
            $elem = $svgElem;
        } else if (isDefined($svg)) {
            $elem = $svg;
        } else {
            throw new TypeError('An element must be provided to either the init() or the hide() function.');
        }

        var selector = isDefined(opts) ? opts.selector : generalDefaultOpts.selector;

        var $pathElements = getAnimatableElements($elem, selector);
        $pathElements.each(function() {
            var length = this.getTotalLength();
            $(this).css({
                'stroke-dashoffset': length,
                'stroke-dasharray': length + ' ' + length,
                'fillOpacity': 0
            });

            // force element refresh
            this.getBoundingClientRect();
        });

        return module;
    };

    /**
     * Computes final options to be used in draw/fill methods using default parameters for what has not been supplied.
     * @param {string} [param1] selector that identifies element(s) to be animated OR user options for animation
     * @param {obj} [param2] user options for animation (when selector has been supplied in param1)
     * @returns object containing selector, duration and delay.
     */
    function computeOpts(param1, param2, defaultOpts) {
        var selector;
        var opts;

        // check if first parameter is the element selector
        if (isString(param1)) {
            selector = param1;
            opts = param2;
        } else {
            opts = param1;
        }

        // fill in defaults
        selector = selector ? selector : generalDefaultOpts.selector;
        opts = $.extend({}, defaultOpts, opts);

        return {
            selector: selector,
            duration: opts.duration,
            delay: opts.delay
        };
    }

    // Using queues to support custom delays and overlap between animations on the same element. Details below:
    // 1. By default, jQuery queues animations that are set on the same element. This means that any animation cannot start before
    //    the previous one ends. We solve this by setting queue param to false.
    // 2. Once queue is set to false, delays no longer apply. For a fine timing control, we need to use delays. We solve this by
    //    using separate queues (by providing distinct queuenames) for different types of animations.
    module.addAnimation = function($elem, queueName, params, duration, delay) {
        $elem.delay(delay, queueName)
            .queue(queueName, function() {
                $(this).animate(params, {
                    duration: duration,
                    queue: false
                });
            })
            .dequeue(queueName);
    };

    /**
     * Draws strokes
     * @param {string} [param1] selector that identifies element(s) to be animated OR user options for animation
     * @param {object} [param2] user options for the animation (when selector has been supplied in param1)
     * @param {number} [param2.duration] Duration of animation
     * @param {number} [param2.delay] Delay of animation (delay 0 means it starts immediately)
     */
    module.drawStrokes = function(param1, param2) {
        var opts = computeOpts(param1, param2, drawStrokesDefaultOpts);
        var $paths = getAnimatableElements($svg, opts.selector);
        var params = {
            "stroke-dashoffset": 0
        };

        module.addAnimation($paths, queues.drawStrokes, params, opts.duration, opts.delay);

        return module;
    };

    /**
     * Clear strokes
     * @param {string} [param1] selector that identifies element(s) to be animated OR user options for animation
     * @param {object} [param2] user options for the animation (when selector has been supplied in param1)
     * @param {number} [param2.duration] Duration of animation
     * @param {number} [param2.delay] Delay of animation (delay 0 means it starts immediately)
     */
    module.clearStrokes = function(param1, param2) {
        var opts = computeOpts(param1, param2, clearStrokesDefaultOpts);
        var $paths = getAnimatableElements($svg, opts.selector);

        $paths.each(function(i, path) {
            var length = this.getTotalLength();
            var params = {
                "stroke-dashoffset": length
            };
            module.addAnimation($(path), queues.clearStrokes, params, opts.duration, opts.delay);
        });

        return module;
    };


    /**
     * Fade in the fill of the element(s)
     * @param {string} [param1] selector that identifies element(s) to be animated OR user options for animation
     * @param {object} [param2] user options for the animation (when selector has been supplied in param1)
     * @param {number} [param2.duration] Duration of animation
     * @param {number} [param2.delay] Delay of animation (delay 0 means it starts immediately)
     */
    module.fillIn = function(param1, param2) {
        var opts = computeOpts(param1, param2, fillInDefaultOpts);
        var $paths = getAnimatableElements($svg, opts.selector);
        var params = {
            "fillOpacity": 1
        };

        module.addAnimation($paths, queues.fillIn, params, opts.duration, opts.delay);

        return module;
    };

    /**
     * Fade out the fill of the element(s)
     * @param {string} [param1] selector that identifies element(s) to be animated OR user options for animation
     * @param {object} [param2] user options for the animation (when selector has been supplied in param1)
     * @param {number} [param2.duration] Duration of animation
     * @param {number} [param2.delay] Delay of animation (delay 0 means it starts immediately)
     */
    module.clearFill = function(param1, param2) {
        var opts = computeOpts(param1, param2, clearFillDefaultOpts);
        var $paths = getAnimatableElements($svg, opts.selector);
        var params = {
            "fillOpacity": 0
        };

        module.addAnimation($paths, queues.clearFill, params, opts.duration, opts.delay);

        return module;
    };

    /**
     * Returns all animatable elements under and including an element identified by the selector provided.
     */
    function getAnimatableElements($parent, selector) {
        var $targeted = $parent.find(selector).addBack(selector);
        return $targeted.find(generalDefaultOpts.animatable).addBack(generalDefaultOpts.animatable);
    }

    function isDefined(arg) {
        return typeof arg !== 'undefined';
    }

    function isString(arg) {
        return typeof arg === 'string' || (arg instanceof String);
    }

    /* test-code */
    module.queues = queues;
    module.computeOpts = computeOpts;
    /* end test-code */

    return module;
})(jQuery);