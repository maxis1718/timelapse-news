var React = require('react/addons');

var Slider = React.createClass({

    /* contant */
    statics: {
        QEVENT: {
            IN: 0,
            OUT: 1
        }
    },

    getDefaultProps: function() {
        return {
            initWidth: 0,
            initLeft: '0%',
            eQueue: []
        };
    },

    getInitialState: function() {
        var initState = {
            width: this.props.initWidth,
            left: '0%',
        };
        return initState;
    },

    updateWidth: function() {
        var rootContainer = this.refs.sliderRoot;
        var rootContainerWidth = rootContainer.clientWidth;
        if (!isNaN(rootContainerWidth)) {
            this.setState({
                width: rootContainerWidth,
            });
        }
    },

    componentDidMount: function() {
        var slider = this.refs.sliderHandle;
        var self = this;
        //
        if(window) {
            window.addEventListener('resize', this.updateWidth);
        }
        this.updateWidth();
        //
        slider.dragging = false;
        slider.onmousedown = function() {
            slider.dragging = true;
        }
        window.addEventListener('mouseup', function(e) {
            slider.dragging = false;
        });
        window.addEventListener('mousemove', function(e) {
            if (!slider.dragging) return;
            if (self.state.width<1) return;
            self.setState({
                left: String(Math.min(Math.max((e.pageX-self.refs.sliderRoot.clientLeft)/self.state.width*100,0),100))+'%'
            });
        });
        //
        this.setState({
            left: this.props.initLeft
        });
    },

    getFirstLargerIndex: function(x) {
        var l = -1;
        var r = this.props.eQueue.length;
        while (l+1<r) {
            var m = Math.floor((l+r)/2);
            if (this.props.eQueue[m].x > x) r = m;
            else l = m;
        }
        return r;
    },
    componentWillUpdate: function(nextProps, nextState) {
        var x0 = parseFloat(this.state.left)/100;
        var x1 = parseFloat(nextState.left)/100;
        // inc/dec all event from x0~x1
        var iStart, iEnd, de, etype;
        iStart = this.getFirstLargerIndex(x0);
        iEnd = this.getFirstLargerIndex(x1);
        if (iStart<iEnd) {
            for (var i=iStart; i<iEnd; i++) {
                var e = this.props.eQueue[i];
                etype = (e.type == Slider.QEVENT.IN)? 'add_event' : 'remove_event';
                de = new CustomEvent(etype, { 'detail': {
                    id: e.id,
                    e: e.e
                }});
                //console.log(de);
                if(document) document.dispatchEvent(de);
            }
        } else if(iStart>iEnd) {
            for (var i=iStart-1; i>=iEnd; i--) {
                var e = this.props.eQueue[i];
                etype = (e.type == Slider.QEVENT.IN)? 'remove_event' : 'add_event';
                de = new CustomEvent(etype, { 'detail': {
                    id: e.id,
                    e: e.e
                }});
                //console.log(de);
                if(document) document.dispatchEvent(de);
            }
        }
    },

    render: function() {
        return <div ref="sliderRoot" className="slider" style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%'
            //backgroundColor: '#ff0000',
            //opacity: 0.2
        }}>
            <span ref="sliderHandle" className="slider-handle" style={{
                cursor: 'pointer',
                position: 'absolute',
                zIndex: 100,
                top: 0,
                width: 2,
                height: '100%',
                backgroundColor: '#d3e0ff',
                border: 'none',
                overflow: 'visible',
                left: this.state.left
            }}>
                <span className="slider_shade_gradient" style={{
                    position: 'inherit',
                    height: '100%',
                    width: 5,
                    border: 'none'
                }}/>
            </span>
        </div>
    }

});

module.exports = Slider;
