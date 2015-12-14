
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
}

var timeline = new TL.Timeline('timeline', '../data/demo.json');

window.onresize = function(event) {
    timeline.updateDisplay();
};