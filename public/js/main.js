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
                id: 0,
                lat: 48.856614,
                lng: 2.352222,
                title: 'Terrorism Fears Fuel France’s National Front',
                abstract: 'France’s anti-immigration National Front party is well positioned to benefit from the Paris terror attacks in regional elections.'
            });
        }
    });

    return {
        addEvent: function(eventObj) {
            mapObj.addEvent(eventObj);
        },
        removeEvent: function(eventId) {
            mapObj.removeEvent(eventId);
        }   
    }

})();

function MapMonster(params) {
    var oMap = this;

    // private property
    var map = null;

    var markers = [];

    var prevInfoWindow = null;

    //public methods
    oMap.init = function() {
        map = new google.maps.Map(params.mountPoint, params.options);
    };

    oMap.composeContent = function(eventObj) {
        return '<div class="info-card"><div class="window_title"><h1>' + eventObj.title + 
                   '</h1></div><div>' + eventObj.abstract + '</div></div>';
    };

    oMap.addEvent = function (eventObj) {
        var latlng = new google.maps.LatLng(eventObj.lat, eventObj.lng);
        var marker = new google.maps.Marker({
            position:latlng,
            map:map,
            title:"You are here!"
        });
        var infowindow = new google.maps.InfoWindow({
            content: this.composeContent(eventObj)
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
