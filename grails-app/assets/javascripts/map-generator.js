var MapGenerator = (function() {

    var mapsWrapper, $;

    var init = function(mapsWrapperIn, jquery) {
        $ = jquery;
        mapsWrapper = mapsWrapperIn;
    };

    var initializeMap = function() {
        var mapOptions = {
          center: mapsWrapper.createLatLng(-34.397, 150.644),
          zoom: 8
        };
        var map = mapsWrapper.createMap($("#map-canvas")[0], mapOptions);
    };

    return {
        init: init,
        initializeMap: initializeMap
    };
})();
