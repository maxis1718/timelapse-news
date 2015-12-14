
var timeline = new TL.Timeline('timeline', '../data/demo.json');

window.onresize = function(event) {
    timeline.updateDisplay();
};

var map;

function initMap() {
    map = new google.maps.Map(document.querySelector('.tl-storyslider'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
}

