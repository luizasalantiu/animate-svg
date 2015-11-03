describe("When options are computed", function() {
    var methodDefaultOpts;
    var generalDefaultOpts;

    beforeEach(function() {
        methodDefaultOpts = {
            duration: 3000,
            delay: 0
        };
        generalDefaultOpts = {
            selector: 'path'
        };
    });

    it("and no custom params are provided, default selector and opts should be returned", function() {
        var res = AnimateSvg.computeOpts(undefined, undefined, methodDefaultOpts);

        expect(res.selector).toBe(generalDefaultOpts.selector);
        expect(res.delay).toBe(methodDefaultOpts.delay);
        expect(res.duration).toBe(methodDefaultOpts.duration);
    });

    it("and user opts are provided, user opts and default selector should be returned", function() {
        var userOpts = {
            duration: 5000,
            delay: 1000
        };

        var res = AnimateSvg.computeOpts(userOpts, undefined, methodDefaultOpts);

        expect(res.selector).toBe(generalDefaultOpts.selector);
        expect(res.delay).toBe(userOpts.delay);
        expect(res.duration).toBe(userOpts.duration);
    });

    it("and selector is provided, provided selector and default opts should be returned", function() {
        var customSelector = 'customSelector';

        var res = AnimateSvg.computeOpts(customSelector, undefined, methodDefaultOpts);

        expect(res.selector).toBe(customSelector);
        expect(res.delay).toBe(methodDefaultOpts.delay);
        expect(res.duration).toBe(methodDefaultOpts.duration);
    });

    it("and both selector and user opts are provided, selector and user opts should be returned", function() {
        var customSelector = 'customSelector';
        var userOpts = {
            duration: 5000,
            delay: 1000
        };

        var res = AnimateSvg.computeOpts(customSelector, userOpts, methodDefaultOpts);

        expect(res.selector).toBe(customSelector);
        expect(res.delay).toBe(userOpts.delay);
        expect(res.duration).toBe(userOpts.duration);
    });
});