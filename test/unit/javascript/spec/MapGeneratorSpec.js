describe("MapGenerator", function() {

    var DEFAULT_LATITUDE = -34.397, DEFAULT_LONGITUDE = 150.644;

    var SAMPLE_EVENT_DATA = { "events": {
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

    var MapsWrapper = {
        createLatLng: function(latitude, longitude) {
            return {lat: function() { return latitude; }, lng: function() { return longitude; }};
        },
        createMap: function() {},
        addMarker: function(jquery, latitude, longitude, title) { return {getPosition: function() { return MapsWrapper.createLatLng(latitude, longitude); }} },
        createBounds: function() {}
    };

    var sampleMap;

    var bounds = {
        extend: function() {}
    };

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
            var center = MapsWrapper.createLatLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
            var getCenter = function() { return center; };
            var setCenter = function(newCenter) { console.log(newCenter); center = newCenter; };
            return {getCenter: getCenter, setCenter: setCenter, fitBounds: function() {}};
        }();

        MapGenerator.init(MapsWrapper, $j, LastFmWrapper);
        spyOn(sampleMap, "setCenter").and.callThrough();
        spyOn(sampleMap, "fitBounds");
        spyOn(LastFmWrapper, "retrieveEvents").and.returnValue(SAMPLE_EVENT_DATA);
        spyOn(MapsWrapper, "createMap").and.returnValue(sampleMap);
        spyOn(MapsWrapper, "addMarker").and.callThrough();
        spyOn(MapsWrapper, "createBounds").and.returnValue(bounds);
        spyOn(bounds, "extend");
    });

    it("creates a map centered in Australia if browser does not support geolocation", function() {
        setupGeolocationNotSupported();

        MapGenerator.initializeMap();

        expectMapToBeCreated();
    });

    it("shows the user a message if geolocation is not supported", function() {
        setupGeolocationNotSupported();

        MapGenerator.initializeMap();

        expect($j('#user-message').text()).toBe('Your browser does not support geolocation, so you get to see Australia!');
    });

    it("shows the user a message if geolocation is blocked or fails", function() {
        setupGeolocationBlocked();

        MapGenerator.initializeMap();

        expect($j('#user-message').text()).toBe("We couldn't get your current location, so you get to see Australia!");
    });

    it("creates a map centered on the user's current location if geolocation success", function() {
        setupGeolocationSuccess();

        MapGenerator.initializeMap();

        expectMapToBeCreated();

        var newCenter = sampleMap.setCenter.calls.argsFor(0)[0];
        expect(newCenter.lat()).toBe(32);
        expect(newCenter.lng()).toBe(-12);
    });

    it("draws a point for each local event when geolocation not supported", function() {
        setupGeolocationNotSupported();

        MapGenerator.initializeMap();

        expect(LastFmWrapper.retrieveEvents).toHaveBeenCalledWith($j, DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
        expectCorrectPointsToBeDrawn();
    });

    it("draws a point for each local event when geolocation blocked or fails", function() {
        setupGeolocationBlocked();

        MapGenerator.initializeMap();

        expect(LastFmWrapper.retrieveEvents).toHaveBeenCalledWith($j, DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
        expectCorrectPointsToBeDrawn();
    });

    it("draws a point for each local event when geolocation succeeds", function() {
        setupGeolocationSuccess();

        MapGenerator.initializeMap();

        expect(LastFmWrapper.retrieveEvents).toHaveBeenCalledWith($j, 32, -12);
        expectCorrectPointsToBeDrawn();
    });

    it("fits the map to the found events", function() {
        MapGenerator.initializeMap();

        expect(sampleMap.fitBounds).toHaveBeenCalledWith(bounds);
        expect(bounds.extend.calls.count()).toEqual(2);
        var firstLatLng = bounds.extend.calls.argsFor(0)[0];
        expect(firstLatLng.lat()).toBe(1);
        expect(firstLatLng.lng()).toBe(-2);
        var secondLatLng = bounds.extend.calls.argsFor(1)[0];
        expect(secondLatLng.lat()).toBe(3);
        expect(secondLatLng.lng()).toBe(-4);
    });

    it("does not adjust map zoom if no events are found", function() {
        LastFmWrapper.retrieveEvents.and.returnValue({"events": {"event": []}});

        MapGenerator.initializeMap();

        expect(sampleMap.fitBounds.calls.any()).toBe(false);
    });

    it("hides the map after done loading", function() {
        MapGenerator.initializeMap();

        expect($j('#map-loading').hasClass('hide')).toBe(true);
    });

    var setupGeolocationNotSupported = function() {
        spyOn(Html5Support, "supportsGeolocation").and.returnValue(false);
    };

    var setupGeolocationBlocked = function() {
        spyOn(Html5Support, "supportsGeolocation").and.returnValue(true);
        spyOn(Html5Support, "getCurrentPosition").and.callFake(function() {
            arguments[1]();
        });
    };

    var setupGeolocationSuccess = function() {
        spyOn(Html5Support, "supportsGeolocation").and.returnValue(true);
        spyOn(Html5Support, "getCurrentPosition").and.callFake(function() {
            var position = { coords: { latitude: 32, longitude: -12 } };
            arguments[0](position);
        });
    };

    var expectMapToBeCreated = function(latitude, longitude) {
        expect(MapsWrapper.createMap).toHaveBeenCalledWith($j('#map-canvas')[0], {center: jasmine.any(Object), zoom: 8});

        var center = MapsWrapper.createMap.calls.argsFor(0)[1].center;
        expect(center.lat()).toBe(DEFAULT_LATITUDE);
        expect(center.lng()).toBe(DEFAULT_LONGITUDE);
    };

    var expectCorrectPointsToBeDrawn = function() {
        expect(MapsWrapper.addMarker).toHaveBeenCalledWith(sampleMap, 1, -2, 'Event 1');
        expect(MapsWrapper.addMarker).toHaveBeenCalledWith(sampleMap, 3, -4, 'Event 2');
    };

});
