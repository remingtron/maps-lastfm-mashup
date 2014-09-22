describe("MapGenerator", function() {

    var MapsWrapper, sampleMap;

    beforeEach(function() {
        loadFixtures("MapGeneratorFixture.html");

        sampleMap = { setCenter: function() {} };

        MapsWrapper = {
            createLatLng: function(latitude, longitude) {
                return {latitude: latitude, longitude: longitude};
            },

            createMap: function() {
            }
        };
        MapGenerator.init(MapsWrapper, $j);
        spyOn(MapsWrapper, "createMap").and.returnValue(sampleMap);
        spyOn(sampleMap, "setCenter");
    });

    it("creates a map centered in Australia if browser does not support geolocation", function() {

        spyOn(Html5Support, "supportsGeolocation").and.returnValue(false);

        MapGenerator.initializeMap();

        expectMapToBeCreated();
    });

    it("creates a map centered on the user's current location if geolocation success", function() {

        spyOn(Html5Support, "supportsGeolocation").and.returnValue(true);
        spyOn(Html5Support, "getCurrentPosition").and.callFake(function() {
            var position = { coords: { latitude: 32, longitude: -12 } };
            arguments[0](position);
        });

        MapGenerator.initializeMap();

        expectMapToBeCreated();
        expect(sampleMap.setCenter).toHaveBeenCalledWith({latitude: 32, longitude: -12});
    });

    var expectMapToBeCreated = function() {
        expect(MapsWrapper.createMap).toHaveBeenCalledWith($j('#map-canvas')[0], {center: {latitude: -34.397, longitude: 150.644}, zoom: 8});
    };


});
