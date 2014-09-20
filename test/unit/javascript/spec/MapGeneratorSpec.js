describe("MapGenerator", function() {

    var MapsWrapper;

    beforeEach(function() {
        loadFixtures("MapGeneratorFixture.html");
        MapsWrapper = {
            createLatLng: function() {
                return "fakeLatLng";
            },

            createMap: function() {
            }
        };
        MapGenerator.init(MapsWrapper, $j);
        spyOn(MapsWrapper, "createMap");
    });

    it("creates a map", function() {
        MapGenerator.initializeMap();
        expect(MapsWrapper.createMap).toHaveBeenCalledWith($j('#map-canvas')[0], {center: "fakeLatLng", zoom: 8});
    });

});
