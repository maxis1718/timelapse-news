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

            mapObj.addEvent({

                // unique event id
                id: 0,

                // provided by search API
                lat: 48.856614,
                lng: 2.352222,
                title: 'Terrorism Fears Fuel France’s National Front',
                abstract: 'France’s anti-immigration National Front party is well positioned to benefit from the Paris terror attacks in regional elections.',
                location: 'Paris',
                date: '2015/12/14',

                // optional
                img: '20151213055533.jpg'
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


function MapMonster(params) {
    var oMap = this;

    // private property
    var map = null;

    var markers = [];

    var prevInfoWindow = null;

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
    oMap.init = function() {
        map = new google.maps.Map(params.mountPoint, params.options);
    };

    oMap.composeContent = function(eventObj) {
        return sprintf(cardTemplate, eventObj);
    };

    oMap.addEvent = function (eventObj) {
        var latlng = new google.maps.LatLng(eventObj.lat, eventObj.lng);

        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: eventObj.title
        });

        var infowindow = new google.maps.InfoWindow({
            content: this.composeContent(eventObj),
            maxWidth: 300
        });

        google.maps.event.addListener(marker,'click',function(){
            if (prevInfoWindow !== null) {
                prevInfoWindow.close();
            }
            
            infowindow.open(map, marker);
            prevInfoWindow = infowindow;
        });

        markers.push({
            id: eventObj.id,
            title: eventObj.title,
            abstract: eventObj.abstract,
            marker: marker
        });
    };

    oMap.removeEvent = function (eventId) {
        for (i = 0; i < markers.length; ++i) {
            if (markers[i].id === eventId) {
                markers[i].marker.setMap(null);
                markers.splice(i, 1);

                return;
            }
        }
    };

    oMap.removeAllEvents = function () {
        for (i = 0; i < markers.length; ++i) {
            markers[i].marker.setMap(null);
        }

        markers.splice(0, markers.length);
    };

    //private methods
    var _getZoomLevel = function (eventList) {

    };
}

// var timeline = new TL.Timeline('timeline', '../data/demo.json');

// window.onresize = function(event) {
//     timeline.updateDisplay();
// };
