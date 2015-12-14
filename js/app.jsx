var React = require('react/addons');
var ReactDOM = require('react-dom');
var Timeline = require('./MyTimeline.jsx');
var mockEvents = require('../mock/real_mock.js')

ReactDOM.render(
    <Timeline initEvents={mockEvents} />, 
    document.getElementById('timeline-div')
); 
