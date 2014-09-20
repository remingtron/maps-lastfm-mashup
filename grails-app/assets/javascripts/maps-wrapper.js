var MapsWrapper = MapsWrapper || {};

MapsWrapper.addDomListener = function(target, event, callback) {
    google.maps.event.addDomListener(target, event, callback);
};

MapsWrapper.createLatLng = function(latitude, longitude) {
    return new google.maps.LatLng(latitude, longitude);
};

MapsWrapper.createMap = function(targetElement, options) {
    return new google.maps.Map(targetElement, options);
}