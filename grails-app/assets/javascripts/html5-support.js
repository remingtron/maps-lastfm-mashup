var Html5Support = Html5Support || {};

Html5Support.supportsGeolocation = function() {
    return 'geolocation' in navigator;
};

Html5Support.getCurrentPosition = function(success, error) {
    navigator.geolocation.getCurrentPosition(success, error);
};