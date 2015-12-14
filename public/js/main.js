var myMap = (function(){

    var mapObj = null;
    var mapContainerId = '#map-canvas';

    $(document).ready(function() {
        var mapParams = {
            mountPoint: document.querySelector(mapContainerId) || 0,
            options: {
                center: {
                    lat: -34.397,
                    lng: 150.644
                },
                zoom: 8,
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false
            }
        };

        if (mapParams.mountPoint) {
            mapObj = new MapMonster(mapParams);
            mapObj.init();

            mapObj.addEvent({
                id: 0,
                lat: -34.397,
                lng: 150.644,
                title: 'test title',
                abstract: 'abstract'
            });
        }
    });

    return {
        removeMarker: function(eventId) {
            mapObj.removeEvent(eventId);
        }   
    }

})();

function MapMonster(params) {
    var oMap = this;

    // private property
    var map = null;

    var markers = [];

    //public methods
    oMap.init = function() {
        map = new google.maps.Map(params.mountPoint, params.options);
    };

    oMap.addEvent = function (eventObj) {
        var latlng = new google.maps.LatLng(eventObj.lat, eventObj.lng);
        var marker = new google.maps.Marker({
            position:latlng,
            map:map,
            title:"You are here!"
        });
        google.maps.event.addListener(marker,'click',function(){
            console.log('kerker');
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
            }
        }
    };

    //private methods
    var _getZoomLevel = function (eventList) {

    };
}


// var timeline = new TL.Timeline('timeline', '../data/demo.json');

// window.onresize = function(event) {
//     timeline.updateDisplay();
// };
