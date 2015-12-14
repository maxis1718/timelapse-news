var React = require('react/addons');
var _clone = require('lodash/lang/clone');
var EventLine = require('./EventLine.jsx');
var TimeAxis = require('./TimeAxis.jsx');

function getStartTimeFromEvent(event) {
    return Number(event.fromTimestamp);
}

function getEndTimeFromEvent(event) {
    return event.toTimestamp===null || isNaN(event.toTimestamp) ? getStartTimeFromEvent(event) : Number(event.toTimestamp);
}

var Timeline = React.createClass({

    /* contant */
    statics: {
        QEVENT: {
            IN: 0,
            OUT: 1
        }
    },

    /* utility */

    preprocessEvents: function(events) {
        var res = _clone(events);
        // adapt TS field if necessary
        for (var i=0; i<res.length; i++) {
            res[i].fromTS = getStartTimeFromEvent(res[i]);
            res[i].toTS = getEndTimeFromEvent(res[i]);
        }
        // sort events by start time
        res.sort(function(a,b) { return a.fromTS - b.fromTS; });
        // generate unique id for events
        res.forEach(function(e, index) {
            e.id = index;
        });
        return res;
    },

    generateEventQueue: function(events) {
        var DEFAULT_SPAN = 3600; // 1 hour
        var res = [];
        var minSpan = Math.min(events.map(function(x) { return x.toTS ? DEFAULT_SPAN : x.toTS - x.fromTS; }));
        events.forEach(function(e) {
            // entering event
            res.push({
                t: e.fromTS,
                id: e.id,
                type: Timeline.QEVENT.IN
            });
            // exiting event
            res.push({
                t: e.toTS ? e.toTS : e.fromTS + minSpan/2, // offshoot event has duration = half of minSpan
                id: e.id,
                type: Timeline.QEVENT.OUT
            });
        });
        res.sort(function(a,b) {
            if (a.t != b.t) return a.t - b.t;
            return a.type - b.type;
        });
        return res;
    },

    /* lifecycle */

    getDefaultProps: function() {
        return {
            initEvents: [],
            // config
            maxRows: 3,
            // style
            mainHeight: 400,
            axisHeight: 50
        }
    },

    getInitialState: function() {
        var initState = {
            events: [],
            eventQueue: [],
            tsLeft: null,
            tsRight: null,
            tsFirstStart: null,
            tsLastEnd: null,
            tsFocus: null
        };
        var rearPadding;
        //
        initState.events = this.preprocessEvents(this.props.initEvents);
        initState.eventQueue = this.generateEventQueue(initState.events);
        initState.tsFirstStart = Math.min(...initState.events.map(function(x) { return x.fromTS; }));
        initState.tsLastEnd = Math.max(...initState.events.map(function(x) { return x.toTS; }));
        if (initState.tsFirstStart == initState.tsLastEnd) {
            // only one-shot of event
            rearPadding = 86400;
        } else {
            rearPadding = (initState.tsLastEnd - initState.tsFirstStart)/(initState.events.length);
        }
        //console.log(rearPadding);
        initState.tsLeft = initState.tsFirstStart - rearPadding;
        initState.tsRight = initState.tsLastEnd + rearPadding;
        initState.tsFocus = initState.tsLeft;
        //console.log(initState);
        return initState;
    },

    render: function() {
        return <div id="timeline" style={{
            display: 'block',
            width: '100%',
            position: 'absolute',
            bottom: '0',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'block' }}>
                <EventLine events={this.state.events} tsLeft={this.state.tsLeft} tsRight={this.state.tsRight}/>
            </div>
            <div style={{ display: 'block' }}>
                <TimeAxis tsLeft={this.state.tsLeft} tsRight={this.state.tsRight}/>
            </div>
        </div>;
    }

});

module.exports = Timeline;
