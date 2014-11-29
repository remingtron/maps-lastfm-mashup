var MapGenerator = (function() {

    var map, mapsWrapper, $, lastFmWrapper;

    var init = function(mapsWrapperIn, jquery, lastFmWrapperIn) {
        $ = jquery;
        mapsWrapper = mapsWrapperIn;
        lastFmWrapper = lastFmWrapperIn;
    };

    var initializeMap = function() {
        var defaultCenter = mapsWrapper.createLatLng(-34.397, 150.644);
        var mapOptions = {
          center: defaultCenter,
          zoom: 8
        };
        map = mapsWrapper.createMap($("#map-canvas")[0], mapOptions);
        centerMap();
        drawEventsOnMap();
    };

    var centerMap = function() {
        if (Html5Support.supportsGeolocation()) {
            Html5Support.getCurrentPosition(function(position) {
                initialLocation = mapsWrapper.createLatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(initialLocation);
            }, function(error) {
                setUserMessage("We couldn't get your current location, so you get to see Australia!");
            });
        } else {
            setUserMessage('Your browser does not support geolocation, so you get to see Australia!');
        }
    };

    var setUserMessage = function(value) {
        $('#user-message').text(value);
    };

    var drawEventsOnMap = function() {
        var mapCenter = map.getCenter();
        var eventsJson = lastFmWrapper.retrieveEvents($, mapCenter.lat(), mapCenter.lng());
        $.each(eventsJson.events.event, function(index, event) {
            var location =  event.venue.location['geo:point'];
            mapsWrapper.addMarker(map, location['geo:lat'], location['geo:long'], event.title);
        });
    };

    return {
        init: init,
        initializeMap: initializeMap
    };
})();

