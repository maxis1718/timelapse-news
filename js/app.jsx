var React = require('react/addons');
var ReactDOM = require('react-dom');
var Timeline = require('./Timeline.jsx');
//var mockEvents = require('../mock/real_mock.js')

ReactDOM.render(
    <Timeline/>,
    document.getElementById('timeline-div')
); 

document.addEventListener('initiate_events', function(e) {
    var events = e.detail.es;
    console.log(events, document.getElementById('timeline-div'));
    ReactDOM.render(
        <Timeline initEvents={events}/>,
        document.getElementById('timeline-div')
    );
});
