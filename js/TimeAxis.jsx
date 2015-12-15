var React = require('react/addons');
var Moment = require('moment');
var UTC_OFFSET = 8;

var INTEGRAL_VERIFIER_STRING = {
    hour: 'hour',
    day: 'day',
    
}

function isIntegralTimestamp(ts, timestring) {
    var tsStart = Number(Moment(ts, 'X').utcOffset(UTC_OFFSET).startOf(timestring).format('X'));
    return ts == tsStart;
}

function getStartOfTimeInterval(ts, timestring) {
    return Number(Moment(ts, 'X').utcOffset(UTC_OFFSET).startOf(timestring).format('X'));
}

function getNextTimestamp(ts, timestring) {
    return Number(Moment(ts, 'X').utcOffset(UTC_OFFSET).add(1, timestring).format('X'));
}

function getTrailingTimestamp(ts, timestring) {
    return isIntegralTimestamp(ts, timestring) ? ts : getNextTimestamp(getStartOfTimeInterval(ts, timestring), timestring);
}

var TimeAxis = React.createClass({

    statics: {
        TIME_UNIT_SCALE: ['minute', 'hour', 'day', 'month', 'year'],
        APPROX_TIME: [60, 3600, 86400, 2592000, 31104000],
        FORMAT_STRING: ['mm', 'HH', 'DD', 'MMM', 'YYYY']
    },

    bestTimeString: '',

    getDefaultProps: function() {
        return {
            height: 50,
            initWidth: 0,
            minScaleWidth: 50, // min pixel/#scale
            tsLeft: null,
            tsRight: null
        };
    },

    getInitialState: function() {
        var initState = {
            width: this.props.initWidth,
        };
        return initState;
    },

    timestringToIndex: function(str) {
        for (var i=0; i<TimeAxis.TIME_UNIT_SCALE.length; i++) {
            if (TimeAxis.TIME_UNIT_SCALE[i] == str) return i;
        }
        return 0;
    },
    getBestTimestring: function(minTime) {
        for (var i=0; i<TimeAxis.TIME_UNIT_SCALE.length; i++) {
            if (TimeAxis.APPROX_TIME[i] >= minTime) return TimeAxis.TIME_UNIT_SCALE[i];
        }
        return TimeAxis.TIME_UNIT_SCALE[TimeAxis.TIME_UNIT_SCALE.length-1];
    },
    getLargestTimeUnitIndex: function(ts) {
        for (var i=TimeAxis.TIME_UNIT_SCALE.length-1; i>=0; i--) {
            if (isIntegralTimestamp(ts, TimeAxis.TIME_UNIT_SCALE[i])) return i;
        }
        return 0;
    },
    getLargestTimeUnit: function(ts) {
        for (var i=TimeAxis.TIME_UNIT_SCALE.length-1; i>=0; i--) {
            if (isIntegralTimestamp(ts, TimeAxis.TIME_UNIT_SCALE[i])) return TimeAxis.TIME_UNIT_SCALE[i];
        }
        return TimeAxis.TIME_UNIT_SCALE[0];
    },
    getStringRep: function(ts) {
        for (var i=TimeAxis.TIME_UNIT_SCALE.length-1; i>=0; i--) {
            if (isIntegralTimestamp(ts, TimeAxis.TIME_UNIT_SCALE[i])) return Moment(ts, 'X').utcOffset(UTC_OFFSET).format(TimeAxis.FORMAT_STRING[i]);
        }
        return Moment(ts, 'X').utcOffset(UTC_OFFSET).format(TimeAxis.FORMAT_STRING[0]);
    },

    updateWidth: function() {
        console.log('timeAxis updateWidth');
        var rootContainer = this.refs.rootContainer || {};
        var rootContainerWidth = rootContainer.clientWidth;
        // debug('updateWidth(), rootContainer width:', rootContainerWidth);
        if (!isNaN(rootContainerWidth) && rootContainerWidth>1) {
            if (this.state.width!=rootContainerWidth) {
                this.setState({
                    width: rootContainerWidth
                });
            }
        }
    },

    componentDidUpdate: function() {
        this.updateWidth();
    },

    componentDidMount: function() {
        if(window) {
            window.addEventListener('resize', this.updateWidth);
        }
        this.updateWidth();
    },

    calculateScales: function() {
        var scales = [];
        // return empty array if width is too small.
        if (this.state.width < 1) return scales;
        // calculate scales..
        var tsFirst = getTrailingTimestamp(this.props.tsLeft, this.bestTimeString);
        for (var ts=tsFirst; ts<=this.props.tsRight; ts=getNextTimestamp(ts, this.bestTimeString)) {
            scales.push(ts);
        }
        //console.log(scales);
        return scales;
    },

    renderAxisFromScale: function(scales) {
        var minor = [];
        var major = [];
        var span = this.props.tsRight - this.props.tsLeft;
        var self = this;
        var baseIndex = this.timestringToIndex(this.bestTimeString);
        if (this.state.width < 1) return { minor: minor, major: major };
        scales.forEach(function(ts, index) {
            var offset = (ts-self.props.tsLeft) / span * self.state.width;
            var str = self.getStringRep(ts);
            var intIndex = self.getLargestTimeUnitIndex(ts);
            var hiddenClass;
            var par;
            if (intIndex < baseIndex) { // minor + hidden
                par = minor;
                hiddenClass = 'tl-timeaxis-tick-hidden'
            } else if(intIndex <= baseIndex) { // minor
                par = minor;
                hiddenClass = '';
            } else { // major
                par = major;
                hiddenClass = '';
            }
            par.push(<div className={"tl-timeaxis-tick "+hiddenClass} style={{ left: offset }} key={'tl-tick-'+index}>
                <span className="tl-timeaxis-tick-text tl-animate-opacity" style={{ opacity: 1 }}>
                    {str}
                </span>
            </div>);
        });
        return { minor: minor, major: major };
    },

    render: function() {
        console.log('timeAxis rerender ', this.props.tsLeft, this.props.tsRight);
        //
        var span = this.props.tsRight - this.props.tsLeft;
        var minTime = this.props.minScaleWidth / this.state.width * span;
        this.bestTimeString = this.getBestTimestring(minTime);
        //
        var scales = this.calculateScales();
        var inner = this.renderAxisFromScale(scales);
        return <div ref="rootContainer" id="time-axis" className="tl-timeaxis" style={{
            height: this.props.height,
            backgroundColor: '#354852',
            overflow: 'hidden'
        }}>
            <div className="tl-timeaxis-content-container">
                <div className="tl-timeaxis-major tl-timeaxis-animate" style={{ opacity: 1 }} key='axis-major'>
                    {inner.major}
                </div>
                <div className="tl-timeaxis-minor tl-timeaxis-animate" style={{ opacity: 1 }} key='axis-minor'>
                    {inner.minor}
                </div>
            </div>
        </div>;
    }

});

module.exports = TimeAxis;
