var LastFmWrapper = LastFmWrapper || {};

LastFmWrapper.retrieveEvents = function($, latitude, longitude) {
    var locationQuery = '&lat='+latitude+'&long='+longitude;
    var result;
    $.ajax({
        url: 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents&api_key=3c5264cf38ed6e7d133a5a2862ca8352&format=json'+locationQuery,
        dataType: 'json',
        async: false,
        success: function(json) {
            result = json;
        }
    });
    return result;
};