describe("MapGenerator", function() {

    var MapsWrapper;

    beforeEach(function() {
        loadFixtures("MapGeneratorFixture.html");
        MapsWrapper = {
            createLatLng: function(latitude, longitude) {
                return {latitude: latitude, longitude: longitude};
            },

            createMap: function() {
            }
        };
        MapGenerator.init(MapsWrapper, $j);
        spyOn(MapsWrapper, "createMap");
    });

    it("creates a map", function() {
        MapGenerator.initializeMap();
        expect(MapsWrapper.createMap).toHaveBeenCalledWith($j('#map-canvas')[0], {center: {latitude: -34.397, longitude: 150.644}, zoom: 8});
    });

});
