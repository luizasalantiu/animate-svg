jasmine.getFixtures().fixturesPath = "spec/fixtures";

describe("When draw/fill methods are called with options", function() {
    var $expectedPaths;
    var expectedQueue;
    var expectedParams;
    var expectedDuration;
    var expectedDelay;

    beforeEach(function() {
        loadFixtures("svg.tmpl.html");

        var $svg = $("svg");
        AnimateSvg.init($svg);
        $expectedPaths = $svg.find("#path1, #path2, #path3");
        expectedDuration = random(0, 5000);
        expectedDelay = random(0, 5000);
        spyOn(AnimateSvg, "addAnimation");
    });

    it("drawstrokes should call addAnimation with correct parameters", function() {
        expectedQueue = AnimateSvg.queues.drawStrokes;
        expectedParams = {
            "stroke-dashoffset": 0
        };

        AnimateSvg.drawStrokes({
            duration: expectedDuration,
            delay: expectedDelay
        });

        expect(AnimateSvg.addAnimation).toHaveBeenCalledWith($expectedPaths, expectedQueue, expectedParams, expectedDuration, expectedDelay);
    });

    it("clearstrokes should call addAnimation with correct parameters", function() {
        var length1 = 217.59371948242188;
        var length2 = 369.4033203125;
        var length3 = 556.6350708007812;

        expectedQueue = AnimateSvg.queues.clearStrokes;

        var expectedParams1 = {
            "stroke-dashoffset": length1
        };
        var expectedParams2 = {
            "stroke-dashoffset": length2
        };
        var expectedParams3 = {
            "stroke-dashoffset": length3
        };

        AnimateSvg.clearStrokes({
            duration: expectedDuration,
            delay: expectedDelay
        });

        expect(AnimateSvg.addAnimation.calls.count()).toBe(3);
        expect(AnimateSvg.addAnimation).toHaveBeenCalledWith($expectedPaths[0], expectedQueue, expectedParams1, expectedDuration, expectedDelay);
        expect(AnimateSvg.addAnimation).toHaveBeenCalledWith($expectedPaths[1], expectedQueue, expectedParams2, expectedDuration, expectedDelay);
        expect(AnimateSvg.addAnimation).toHaveBeenCalledWith($expectedPaths[2], expectedQueue, expectedParams3, expectedDuration, expectedDelay);
    });

    it("fillIn should call addAnimation with correct parameters", function() {
        expectedQueue = AnimateSvg.queues.fillIn;
        expectedParams = {
            "fillOpacity": 1
        };

        AnimateSvg.fillIn({
            duration: expectedDuration,
            delay: expectedDelay
        });

        expect(AnimateSvg.addAnimation).toHaveBeenCalledWith($expectedPaths, expectedQueue, expectedParams, expectedDuration, expectedDelay);
    });

    it("clearFill should call addAnimation with correct parameters", function() {
        expectedQueue = AnimateSvg.queues.clearFill;
        expectedParams = {
            "fillOpacity": 0
        };

        AnimateSvg.clearFill({
            duration: expectedDuration,
            delay: expectedDelay
        });

        expect(AnimateSvg.addAnimation).toHaveBeenCalledWith($expectedPaths, expectedQueue, expectedParams, expectedDuration, expectedDelay);
    });
});

describe("When draw/fill methods are called with selector of one path element", function() {
    var selector;
    var $expectedElement;

    beforeEach(function() {
        loadFixtures("svg.tmpl.html");
        AnimateSvg.init($("svg"));

        selector = "#path2";
        $expectedElement = $(selector);

        spyOn(AnimateSvg, "addAnimation");
    });

    it("drawstrokes should provide correct element to addAnimation", function() {
        AnimateSvg.drawStrokes(selector);

        expect(AnimateSvg.addAnimation.calls.count()).toBe(1);
        expect(AnimateSvg.addAnimation.calls.first().args[0]).toEqual($expectedElement);
    });

    it("clearstrokes should provide correct element to addAnimation", function() {
        AnimateSvg.clearStrokes(selector);

        expect(AnimateSvg.addAnimation.calls.count()).toBe(1);
        expect(AnimateSvg.addAnimation.calls.first().args[0]).toEqual($expectedElement);
    });

    it("fillIn should provide correct element to addAnimation", function() {
        AnimateSvg.fillIn(selector);

        expect(AnimateSvg.addAnimation.calls.count()).toBe(1);
        expect(AnimateSvg.addAnimation.calls.first().args[0]).toEqual($expectedElement);
    });

    it("clearFill should provide correct element to addAnimation", function() {
        AnimateSvg.clearFill(selector);

        expect(AnimateSvg.addAnimation.calls.count()).toBe(1);
        expect(AnimateSvg.addAnimation.calls.first().args[0]).toEqual($expectedElement);
    });
});