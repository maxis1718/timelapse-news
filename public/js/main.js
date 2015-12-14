(function(){

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
        }
    });
})();

function MapMonster(params) {
    var oMap = this;

    // private property
    var map = null;

    //public methods
    oMap.init = function(){
        map = new google.maps.Map(params.mountPoint, params.options);
    };
}


// var timeline = new TL.Timeline('timeline', '../data/demo.json');

// window.onresize = function(event) {
//     timeline.updateDisplay();
// };
