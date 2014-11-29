describe("MapGenerator", function() {

    var DEFAULT_LATITUDE = -34.397, DEFAULT_LONGITUDE = 150.644;

    var MapsWrapper = {
        createLatLng: function(latitude, longitude) {
            return {lat: function() { return latitude; }, lng: function() { return longitude; }};
        },
        createMap: function() {},
        addMarker: function() {}
    };

    var sampleMap;

    var LastFmWrapper = {
        retrieveEvents: function() { return {'events': {'event': []}}; }
    };

    beforeEach(function() {
        loadFixtures("MapGeneratorFixture.html");

        var Html5Support = {
            supportsGeolocation: function() {},
            getCurrentPosition: function() {}
        };

        sampleMap = function() {
            var center = { lat: function() { return DEFAULT_LATITUDE }, lng: function() { return DEFAULT_LONGITUDE } };
            var getCenter = function() { return center };
            var setCenter = function(newCenter) { center = newCenter };
            return {getCenter: getCenter, setCenter: setCenter};
        }();

        MapGenerator.init(MapsWrapper, $j, LastFmWrapper);
        spyOn(MapsWrapper, "createMap").and.returnValue(sampleMap);
        spyOn(sampleMap, "setCenter").and.callThrough();
    });

    it("creates a map centered in Australia if browser does not support geolocation", function() {

        spyOn(Html5Support, "supportsGeolocation").and.returnValue(false);

        MapGenerator.initializeMap();

        expectMapToBeCreated();
    });

    it("shows the user a message if geolocation is not supported", function() {

        spyOn(Html5Support, "supportsGeolocation").and.returnValue(false);

        MapGenerator.initializeMap();

        expect($j('#user-message').text()).toBe('Your browser does not support geolocation, so you get to see Australia!');
    });

    it("shows the user a message if geolocation is blocked or fails", function() {

        spyOn(Html5Support, "supportsGeolocation").and.returnValue(true);
        spyOn(Html5Support, "getCurrentPosition").and.callFake(function() {
            arguments[1]();
        });

        MapGenerator.initializeMap();

        expect($j('#user-message').text()).toBe("We couldn't get your current location, so you get to see Australia!");
    });

    it("creates a map centered on the user's current location if geolocation success", function() {

        spyOn(Html5Support, "supportsGeolocation").and.returnValue(true);
        spyOn(Html5Support, "getCurrentPosition").and.callFake(function() {
            var position = { coords: { latitude: 32, longitude: -12 } };
            arguments[0](position);
        });

        MapGenerator.initializeMap();

        expectMapToBeCreated();

        var newCenter = sampleMap.setCenter.calls.argsFor(0)[0];
        expect(newCenter.lat()).toBe(32);
        expect(newCenter.lng()).toBe(-12);
    });

    it("draws a point for each local event", function() {
        var sampleEventData = { "events": {
                                    "event": [{
                                            "title": "Event 1",
                                            "venue": {
                                                "location": {
                                                    "geo:point": {
                                                        "geo:lat": 1,
                                                        "geo:long": -2
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            "title": "Event 2",
                                            "venue": {
                                                "location": {
                                                    "geo:point": {
                                                        "geo:lat": 3,
                                                        "geo:long": -4
                                                    }
                                                }
                                            }
                                        }]
                                    }
                                };

        spyOn(LastFmWrapper, "retrieveEvents").and.returnValue(sampleEventData);
        spyOn(MapsWrapper, "addMarker");

        MapGenerator.initializeMap();

        expect(LastFmWrapper.retrieveEvents).toHaveBeenCalledWith($j, DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
        expect(MapsWrapper.addMarker).toHaveBeenCalledWith(sampleMap, 1, -2, 'Event 1');
        expect(MapsWrapper.addMarker).toHaveBeenCalledWith(sampleMap, 3, -4, 'Event 2');
    });

    var expectMapToBeCreated = function(latitude, longitude) {
        expect(MapsWrapper.createMap).toHaveBeenCalledWith($j('#map-canvas')[0], {center: jasmine.any(Object), zoom: 8});

        var center = MapsWrapper.createMap.calls.argsFor(0)[1].center;
        expect(center.lat()).toBe(DEFAULT_LATITUDE);
        expect(center.lng()).toBe(DEFAULT_LONGITUDE);
    };

});
