var React = require('react/addons');
var Slider = require('./Slider.jsx');

var EventLine = React.createClass({

    getDefaultProps: function() {
        return {
            maxRows: 3,
            height: 150,
            yEventDisplace: 5,
            minEventWidth: 50,
            tsLeft: 0,
            tsRight: 0,
            events: []
        }
    },

    getInitialState: function() {
        var initState = {
            width: 0,
            rowCooldown: 0
        };
        return initState;
    },

    updateWidth: function() {
        var rootContainer = this.refs.rootContainer;
        var rootContainerWidth = rootContainer.clientWidth;
        // debug('updateWidth(), rootContainer width:', rootContainerWidth);
        if (!isNaN(rootContainerWidth)) {
            var span = this.props.tsRight - this.props.tsLeft;
            var cd = rootContainerWidth>0 ? this.props.minEventWidth / rootContainerWidth * span : 0;
            this.setState({
                width: rootContainerWidth,
                rowCooldown: cd
            });
        }
    },

    componentDidMount: function() {
        if(window) {
            window.addEventListener('resize', this.updateWidth);
        }
        this.updateWidth();
    },

    generateEventQueue: function(events) {
        var DEFAULT_SPAN = 3600; // 1 hour
        if (this.state.width < 1) return [];
        var res = [];
        var minSpan = Math.min(events.map(function(x) { return x.toTS ? DEFAULT_SPAN : x.toTS - x.fromTS; }));
        var self = this;
        events.forEach(function(e) {
            // entering event
            res.push({
                t: e.fromTS,
                x: (e.fromTS-self.props.tsLeft)/(self.props.tsRight-self.props.tsLeft),
                id: e.id,
                type: Slider.QEVENT.IN,
                e: e
            });
            // exiting event
            res.push({
                t: e.toTS ? e.toTS : e.fromTS + minSpan/2, // offshoot event has duration = half of minSpan
                x: (e.toTS-self.props.tsLeft)/(self.props.tsRight-self.props.tsLeft),
                id: e.id,
                type: Slider.QEVENT.OUT,
                e: e
            });
        });
        res.sort(function(a,b) {
            if (a.t != b.t) return a.t - b.t;
            return a.type - b.type;
        });
        return res;
    },

    calculateRenderedEvent: function() {
        var rowNum = 0;
        var rowPointer = [];
        var res = [];
        var es = [];
        var span = this.props.tsRight - this.props.tsLeft;
        var self = this;
        if (this.state.width < 1) return {};
        this.props.events.forEach(function(e, index) {
            var r;
            for (r=0; r<rowNum; r++) {
                if (e.fromTS >= rowPointer[r]) break;
            }
            if (rowNum < self.props.maxRows) {
                rowNum++;
                rowPointer.push(0);
            }
            // if some row is available, insert event, otherwise current event is discarded
            if (r<rowNum) {
                rowPointer[r] = Math.min(/*e.toTS,*/e.fromTS+self.state.rowCooldown);
                res.push({
                    r: r,
                    x: (e.fromTS-self.props.tsLeft) / span * self.state.width,
                    text: e.text
                });
                es.push(e);
            }
        });
        return {
            rowNum: rowNum,
            res: res,
            events: es
        };
    },

    // use rowNum, res to generate divs to be rendered
    calculateRenderedDiv: function(info) {
        var rowNum = info.rowNum;
        var res = info.res;
        var self = this;
        var divs = [];
        if (this.state.width < 1) return [];
        res.forEach(function(info, index) {
            var r = info.r;
            var x = info.x;
            var text = info.text;
            var rowHeight = (self.props.height-self.props.yEventDisplace) / rowNum;
            var eventHeight = rowHeight - self.props.yEventDisplace;
            // tl-timemarker-content-container-small
            // tl-timemarker-content-small
            divs.push(<div className="tl-timemarker" style={{ left: x, top: r*rowHeight+self.props.yEventDisplace }} key={'time-marker-'+index}>
                <div className="tl-timemarker-timespan" style={{ height: (rowNum-r)*rowHeight }} key="timespan">
                    <div className="tl-timemarker-timespan-content" style={{ height: eventHeight }} key="div">
                    </div>
                    <div className="tl-timemarker-line-left" key="lline"></div>
                    <div className="tl-timemarker-line-right" key="rline"></div>
                </div>
                <div className="tl-timemarker-content-container" style={{ height: eventHeight }} key='content'>
                    <div className="tl-timemarker-content">
                        <div className="tl-timemarker-text">
                            <h2 className="tl-headline" style={{
                            }}>
                                {text}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>)
        });
        return divs;
    },

    render: function() {
        var info = this.calculateRenderedEvent();
        var divs = this.calculateRenderedDiv(info);
        var eventQueue = this.generateEventQueue(info.events);
        return <div ref="rootContainer" id="event-line" style={{
            height: this.props.height,
            backgroundColor: '#4d6a79',
            overflow: 'hidden'
        }}>
            <Slider initWidth={this.state.width} eQueue={eventQueue} />
            {divs}
        </div>;
    }

});

module.exports = EventLine;
