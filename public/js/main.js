var newsMap = (function(){

    var mapObj = null;
    var mapContainerId = '#map-canvas';

    $(document).ready(function() {
        var mapParams = {
            mountPoint: document.querySelector(mapContainerId) || 0,
            options: {
                center: {
                    lat: 48.856614,
                    lng: 2.352222
                },
                zoom: 4,
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false
            }
        };

        if (mapParams.mountPoint) {
            mapObj = new MapMonster(mapParams);
            mapObj.init();

            /*mapObj.addEvent({

                // unique event id
                id: 0,
                // provided by search API
                geo: {
                    latitude: 48.856614,
                    longtitude: 2.352222,
                    location: 'Paris',
                },
                newsContent: {
                    title: 'Terrorism Fears Fuel France’s National Front',
                    abstract: 'France’s anti-immigration National Front party is well positioned to benefit from the Paris terror attacks in regional elections.'
                },
                time: {
                    from: '2015-12-14',
                }
            });*/

            // add event listeners
            document.addEventListener('add_event', function(e) {
                mapObj.addEvent(e.detail.e);
            });
            document.addEventListener('remove_event', function(e) {
                mapObj.removeEvent(e.detail.id);
            });
            document.addEventListener('leak_events', function(e) {
                mapObj.peekAndSetView(e.detail.es);
            });
        }
    });

    return {
        addEvent: function(eventObj) {
            mapObj.addEvent(eventObj);
        },
        removeEvent: function(eventId) {
            mapObj.removeEvent(eventId);
        },
        removeAllEvents: function() {
            mapObj.removeAllEvents();
        }
    }

})();

function calculateOptimalView(markers) {
    var n = Object.keys(markers).length;
    var INF = 100000;
    var minLng, maxLng, minLat, maxLat;
    minLng = minLat = INF;
    maxLng = maxLat = -INF;
    for (k in markers) {
        var m = markers[k];
        minLng = Math.min(minLng, m.lng);
        maxLng = Math.max(maxLng, m.lng);
        minLat = Math.min(minLat, m.lat);
        maxLat = Math.max(maxLat, m.lat);
    }
    return calculateOptimalViewBase(n, minLng, maxLng, minLat, maxLat);
}
function calculateOptimalViewFromEventArray(events) {
    var n = events.length;
    var INF = 100000;
    var minLng, maxLng, minLat, maxLat;
    minLng = minLat = INF;
    maxLng = maxLat = -INF;
    events.forEach(function(e) {
        minLng = Math.min(minLng, e.geo.longtitude)
        maxLng = Math.max(maxLng, e.geo.longtitude)
        minLat = Math.min(minLat, e.geo.latitude)
        maxLat = Math.max(maxLat, e.geo.latitude)
    });
    return calculateOptimalViewBase(n, minLng, maxLng, minLat, maxLat);
}
function calculateOptimalViewBase(n, minLng, maxLng, minLat, maxLat) {
    if ( n == 0 ) return null;
    var lng0 = (minLng+maxLng)/2;
    var lat0 = (minLat+maxLat)/2;
    if ( n == 1 ) return {
        center: {
            lng: lng0,
            lat: lat0
        },
        zoom: 4
    };
    var lngSpan = (maxLng-lng0)+(maxLng-minLng)/(Math.log2(n)+1);
    var latSpan = (maxLat-lat0)+(maxLat-minLat)/(Math.log2(n)+1);
    var lngRatio = Math.max(360/lngSpan, 1);
    var latRatio = Math.max(180/latSpan, 1);
    var ratio = Math.min(lngRatio, latRatio);
    var zoom = Math.floor(Math.log2(ratio));
    console.log(minLng, maxLng, minLat, maxLat);
    console.log(lngSpan, latSpan, ratio, zoom);
    return {
        center: {
            lng: lng0,
            lat: lat0
        },
        zoom: zoom,
    };
}

function MapMonster(params) {
    var oMap = this;

    // private property
    var map = null;

    var markers = {};

    var prevInfoWindow = null;
    var dynamicUpdate = false;

    var cardTemplate = 
        '<div class="info-card">' +
            '<header class="image-wrap">' +
            '</header>' +
            '<section class="content-wrap">' +
                '<div class="title-wrap">%(title)s</div>' +
                '<div class="meta-wrap">' +
                    '<div class="date-text">%(date)s</div>' +
                    '<div class="location-wrap">'+
                        '<i class="fa fa-map-marker"></i>' +
                        '<span class="location-text">%(location)s</span>' +
                    '</div>' +
                '</div>' +
            '</section>' +
            '<section class="abstract-wrap">' +
                '<div class="abtract-text">%(abstract)s</div>' +
            '</section>' +
            '<footer>' +
                '<div class="event-trace-wrap"></div>' +
            '</footer>' +
        '</div>';

    //public methods
    function updateView() {
        if(!dynamicUpdate) return;
        var cfg = calculateOptimalView(markers);
        if(cfg) map.setOptions(cfg);
    }

    oMap.init = function() {
        map = new google.maps.Map(params.mountPoint, params.options);
    };

    oMap.composeContent = function(eventObj) {
        if (eventObj.newsContent.abstract.indexOf('UNKOWN') > -1){
            eventObj.newsContent.abstract = '';
        }
        var cardPayload = {
            title: eventObj.newsContent.title,
            date: eventObj.time.from,
            location: eventObj.geo.location,
            abstract: eventObj.newsContent.abstract,
        };
        return sprintf(cardTemplate, cardPayload);
    };

    oMap.stopBounce = function (marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        }
    };

    oMap.setCenter = function (latitude, longitude) {
        var latlon = new google.maps.LatLng(latitude, longitude);
        map.panTo(latlon);
        map.setCenter(latlon);
    };

    oMap.addEvent = function (eventObj) {
        //console.log('receive:', eventObj);
        eventObj.geo.latitude = parseFloat(eventObj.geo.latitude);
        eventObj.geo.longtitude = parseFloat(eventObj.geo.longtitude);
        // console.log('latlon', eventObj.geo.latitude, eventObj.geo.longtitude);
        var latlng = new google.maps.LatLng(eventObj.geo.latitude, eventObj.geo.longtitude);

        oMap.setCenter(eventObj.geo.latitude, eventObj.geo.longtitude);

        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            animation: google.maps.Animation.BOUNCE,
            title: eventObj.newsContent.title
        });

        // trigger click after bouncing for 800 ms
        setTimeout(function() {
            google.maps.event.trigger(marker, 'click');
        }, 800);

        var infowindow = new google.maps.InfoWindow({
            content: oMap.composeContent(eventObj),
            maxWidth: 300
        });

        google.maps.event.addListener(marker,'click',function(){
            if (prevInfoWindow !== null) {
                prevInfoWindow.close();
            }
            oMap.stopBounce(marker);
            infowindow.open(map, marker);
            prevInfoWindow = infowindow;
        });

        markers[eventObj.id] = {
            title: eventObj.newsContent.title,
            abstract: eventObj.newsContent.abstract,
            lat: eventObj.geo.latitude,
            lng: eventObj.geo.longtitude,
            marker: marker
        };
        updateView();
    };

    oMap.removeEvent = function (eventId) {
        markers[eventId].marker.setMap(null);
        delete markers[eventId];
        updateView();
    };

    oMap.removeAllEvents = function () {
        for (k in markers) {
            markers[k].marker.setMap(null);
        }
        markers = {};
    };

    oMap.peekAndSetView = function (events) {
        var cfg = calculateOptimalViewFromEventArray(events);
        if(cfg) map.setOptions(cfg);
    };

    //private methods
    var _getZoomLevel = function (eventList) {

    };
}

// var timeline = new TL.Timeline('timeline', '../data/demo.json');

// window.onresize = function(event) {
//     timeline.updateDisplay();
// };
