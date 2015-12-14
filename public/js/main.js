(function(){

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
                lat: 48.856614,
                lng: 2.352222,
                contentString: '<div class="info-card">' +
                    '<h1>Terrorism Fears Fuel France’s National Front </h1>' +
                    '<div>France’s anti-immigration National Front party is well positioned to benefit from the Paris terror attacks in regional elections.</div>' +
                    '</div>'
            });
        }
    });
})();

function MapMonster(params) {
    var oMap = this;

    // private property
    var map = null;

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
        var infowindow = new google.maps.InfoWindow({
            content: eventObj.contentString
        });
        google.maps.event.addListener(marker,'click',function(){
            infowindow.open(map, marker);
        });
    };

    oMap.removeEvent = function (eventId) {

    };

    //private methods
    var _getZoomLevel = function (eventList) {

    };
}


// var timeline = new TL.Timeline('timeline', '../data/demo.json');

// window.onresize = function(event) {
//     timeline.updateDisplay();
// };
