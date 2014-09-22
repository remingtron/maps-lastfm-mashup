var MapGenerator = (function() {

    var map, mapsWrapper, $;

    var init = function(mapsWrapperIn, jquery) {
        $ = jquery;
        mapsWrapper = mapsWrapperIn;
    };

    var initializeMap = function() {
        var defaultCenter = mapsWrapper.createLatLng(-34.397, 150.644);
        var mapOptions = {
          center: defaultCenter,
          zoom: 8
        };
        map = mapsWrapper.createMap($("#map-canvas")[0], mapOptions);
        centerMap();
    };

    var centerMap = function() {
        if (Html5Support.supportsGeolocation()) {
            Html5Support.getCurrentPosition(function(position) {
                initialLocation = mapsWrapper.createLatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(initialLocation);
            }, function(error) {

            });
        }
    };

    return {
        init: init,
        initializeMap: initializeMap
    };
})();

var Html5Support = Html5Support || {};

Html5Support.supportsGeolocation = function() {
    return 'geolocation' in navigator;
};

Html5Support.getCurrentPosition = function(success, error) {
    navigator.geolocation.getCurrentPosition(success, error);
};
