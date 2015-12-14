var React = require('react/addons');

var Slider = React.createClass({

    /* contant */
    statics: {
        QEVENT: {
            IN: 0,
            OUT: 1
        }
    },

    itv: null,

    getDefaultProps: function() {
        return {
            initWidth: 0,
            initLeft: '0%',
            driftRatio: 10,
            dampRatio: 0.0001,
            refreshInterval: 40,
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

    clearDrift: function(x) {
        if (this.itv) clearInterval(this.itv);
    },

    updateWidth: function() {
        var rootContainer = this.refs.sliderRoot || {};
        var rootContainerWidth = rootContainer.clientWidth;
        if (!isNaN(rootContainerWidth)) {
            if (this.state.width!=rootContainerWidth) {
                this.setState({
                    width: rootContainerWidth,
                });
            }
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
            self.clearDrift();
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
        console.log('slider!!!!');
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

    componentDidUpdate: function() {
        this.updateWidth();
    },

    setSlider: function(x) {
        this.clearDrift();
        this.setState({
            left: String(x*100)+'%'
        });
    },

    render: function() {
        var self = this;
        function sliderDriftHandler(e) {
            //console.log('?');
            if (self.state.width<1) return;
            var x = (e.pageX-self.refs.sliderRoot.clientLeft)/self.state.width;
            //console.log(e,self.state.left,x);
            // left should go from left -> x
            if(self.itv) clearInterval(self.itv);
            self.itv = setInterval(function() {
                var ll = parseFloat(self.state.left);
                var dt = 100*x-ll;
                var step = dt*Math.abs(dt) / (self.props.driftRatio*1000/self.props.refreshInterval*Math.abs(dt)+self.props.dampRatio);
                //console.log(self.state.left, ' ', step);
                self.setState({
                    left: String(ll+step)+'%'
                });
            }, self.props.refreshInterval);
        };
        //
        function doubleClickHandler(e) {
            var x = (e.pageX-self.refs.sliderRoot.clientLeft)/self.state.width;
            self.setSlider(x);
        }
        //
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
            <div ref="leftPane" key="left-div" style={{
                height: '100%',
                float: 'left',
                zIndex: 10,
                width: this.state.left
                //backgroundColor: '#ff0000',
                //opacity: 0.2
            }} onClick={sliderDriftHandler} onDoubleClick={doubleClickHandler} />
            <div ref="rightPane" key="right-div" style={{
                height: '100%',
                overflow: 'hidden',
                margin: '0 auto',
                zIndex: 10
                //backgroundColor: '#aaff00',
                //opacity: 0.2
            }} onClick={sliderDriftHandler} onDoubleClick={doubleClickHandler} />
        </div>
    }

});

module.exports = Slider;
