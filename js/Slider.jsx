var React = require('react/addons');

var Slider = React.createClass({

    getDefaultProps: function() {
        return {
            initWidth: 0,
            initLeft: '0%'
        };
    },

    getInitialState: function() {
        var initState = {
            width: this.props.initWidth,
            left: this.props.initLeft
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
            console.log(self.refs.sliderRoot);
            self.setState({
                left: String(Math.min(Math.max((e.pageX-self.refs.sliderRoot.clientLeft)/self.state.width*100,0),100))+'%'
            });
        });
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
