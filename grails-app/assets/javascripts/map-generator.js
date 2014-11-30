var MapGenerator = (function() {

    var map, mapsWrapper, $, lastFmWrapper, infoWindowContentGenerator;

    var DEFAULT_LATITUDE = -34.397, DEFAULT_LONGITUDE = 150.644;

    var init = function(mapsWrapperIn, jquery, lastFmWrapperIn, infoWindowContentGeneratorIn) {
        $ = jquery;
        mapsWrapper = mapsWrapperIn;
        lastFmWrapper = lastFmWrapperIn;
        infoWindowContentGenerator = infoWindowContentGeneratorIn;
    };

    var initializeMap = function() {
        var defaultCenterInAustralia = mapsWrapper.createLatLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
        var mapOptions = {
          center: defaultCenterInAustralia,
          zoom: 8
        };
        map = mapsWrapper.createMap($("#map-canvas")[0], mapOptions);
        centerMap();
    };

    var centerMap = function() {
        if (Html5Support.supportsGeolocation()) {
            Html5Support.getCurrentPosition(function(position) {
                var initialLocation = mapsWrapper.createLatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(initialLocation);
                finishMap();
            }, function(error) {
                setUserMessage("We couldn't get your current location, so you get to see Australia!");
                finishMap();
            });
        } else {
            setUserMessage('Your browser does not support geolocation, so you get to see Australia!');
            finishMap();
        }
    };

    var setUserMessage = function(value) {
        $('#user-message').text(value);
    };

    var finishMap = function() {
        drawEventsOnMap();
        $('#map-loading').addClass('hide');
    };

    var drawEventsOnMap = function() {
        var mapCenter = map.getCenter();
        var eventsJson = lastFmWrapper.retrieveEvents($, mapCenter.lat(), mapCenter.lng());
        if (eventsJson.events.event.length > 0) {
            var eventsBounds = mapsWrapper.createBounds();
            $.each(eventsJson.events.event, function(index, event) {
                var location =  event.venue.location['geo:point'];
                var marker = mapsWrapper.addMarker(map, location['geo:lat'], location['geo:long'], event.title, infoWindowContentGenerator.generate(event));
                eventsBounds.extend(marker.getPosition());
            });
            map.fitBounds(eventsBounds);
        }
    };

    return {
        init: init,
        initializeMap: initializeMap
    };
})();

