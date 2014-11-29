describe("LastFmWrapper", function() {

    it("retrieves events for specified location in json format", function() {
        var jQueryMock = {ajax: function() {}};
        var latitude = 12, longitude = 24, expectedResult = "lots of events!";

        spyOn(jQueryMock, "ajax").and.callFake(function() {
            arguments[0].success(expectedResult);
        });

        var result = LastFmWrapper.retrieveEvents(jQueryMock, latitude, longitude);
        expect(result).toBe(expectedResult);

        expect(jQueryMock.ajax).toHaveBeenCalledWith(jasmine.any(Object));

        var eventsUrl = 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents&api_key=3c5264cf38ed6e7d133a5a2862ca8352&format=json&limit=50&lat=12&long=24';

        var ajaxOptions = jQueryMock.ajax.calls.argsFor(0)[0];
        expect(ajaxOptions.dataType).toBe('json');
        expect(ajaxOptions.url).toBe(eventsUrl);
        expect(ajaxOptions.async).toBe(false);
    });
});