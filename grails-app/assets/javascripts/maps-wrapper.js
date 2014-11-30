var MapsWrapper = function() {

    var lastInfoWindow;

    var addDomListener = function(target, event, callback) {
        google.maps.event.addDomListener(target, event, callback);
    };

    var createLatLng = function(latitude, longitude) {
        return new google.maps.LatLng(latitude, longitude);
    };

    var createMap = function(targetElement, options) {
        return new google.maps.Map(targetElement, options);
    };

    var addMarker = function(map, latitude, longitude, title, infoWindowContent) {
        var marker = new google.maps.Marker({position: this.createLatLng(latitude, longitude), map: map, title: title});
        var infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent
        });
        google.maps.event.addListener(marker, 'click', function() {
            if (lastInfoWindow != undefined) {
                lastInfoWindow.close();
            }
            infoWindow.open(map, marker);
            lastInfoWindow = infoWindow;
        });
        return marker;
    };

    var createBounds = function() {
        return new google.maps.LatLngBounds();
    };

    return {
        addDomListener: addDomListener,
        createLatLng: createLatLng,
        createMap: createMap,
        addMarker: addMarker,
        createBounds: createBounds
    };
}();