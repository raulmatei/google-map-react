'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPureRenderFunction = require('react-pure-render/function');

var _reactPureRenderFunction2 = _interopRequireDefault(_reactPureRenderFunction);

var mainStyle = {
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,
  margin: 0,
  padding: 0,
  position: 'absolute'
};

var style = {
  width: 0,
  height: 0,
  left: 0,
  top: 0,
  backgroundColor: 'transparent',
  position: 'absolute'
};

var GoogleMapMarkers = (function (_Component) {
  _inherits(GoogleMapMarkers, _Component);

  _createClass(GoogleMapMarkers, null, [{
    key: 'propTypes',
    value: {
      geoService: _react.PropTypes.any,
      style: _react.PropTypes.any,
      distanceToMouse: _react.PropTypes.func,
      dispatcher: _react.PropTypes.any,
      onChildClick: _react.PropTypes.func,
      onChildMouseLeave: _react.PropTypes.func,
      onChildMouseEnter: _react.PropTypes.func,
      hoverDistance: _react.PropTypes.number,
      projectFromLeftTop: _react.PropTypes.bool
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      projectFromLeftTop: false
    },
    enumerable: true
  }]);

  function GoogleMapMarkers(props) {
    var _this = this;

    _classCallCheck(this, GoogleMapMarkers);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRenderFunction2['default'];

    this._getState = function () {
      return {
        children: _this.props.dispatcher.getChildren(),
        updateCounter: _this.props.dispatcher.getUpdateCounter()
      };
    };

    this._onChangeHandler = function () {
      if (!_this.dimesionsCache_) {
        return;
      }

      var state = _this._getState();
      _this.setState(state);
    };

    this._onChildClick = function () {
      if (_this.props.onChildClick) {
        if (_this.hoverChildProps_) {
          var hoverKey = _this.hoverKey_;
          var childProps = _this.hoverChildProps_;
          // click works only on hovered item
          _this.props.onChildClick(hoverKey, childProps);
        }
      }
    };

    this._onChildMouseEnter = function (hoverKey, childProps) {
      if (!_this.dimesionsCache_) {
        return;
      }

      if (_this.props.onChildMouseEnter) {
        _this.props.onChildMouseEnter(hoverKey, childProps);
      }

      _this.hoverChildProps_ = childProps;
      _this.hoverKey_ = hoverKey;
      _this.setState({ hoverKey: hoverKey });
    };

    this._onChildMouseLeave = function () {
      if (!_this.dimesionsCache_) {
        return;
      }

      var hoverKey = _this.hoverKey_;
      var childProps = _this.hoverChildProps_;

      if (hoverKey !== undefined && hoverKey !== null) {
        if (_this.props.onChildMouseLeave) {
          _this.props.onChildMouseLeave(hoverKey, childProps);
        }

        _this.hoverKey_ = null;
        _this.hoverChildProps_ = null;
        _this.setState({ hoverKey: null });
      }
    };

    this._onMouseAllow = function (value) {
      if (!value) {
        _this._onChildMouseLeave();
      }

      _this.allowMouse_ = value;
    };

    this._onMouseChangeHandler = function () {
      if (_this.allowMouse_) {
        _this._onMouseChangeHandler_raf();
      }
    };

    this._onMouseChangeHandler_raf = function () {
      if (!_this.dimesionsCache_) {
        return;
      }

      var mp = _this.props.dispatcher.getMousePosition();

      if (mp) {
        (function () {
          var distances = [];

          _react2['default'].Children.forEach(_this.state.children, function (child, childIndex) {
            var childKey = child.key !== undefined && child.key !== null ? child.key : childIndex;
            var dist = _this.props.distanceToMouse(_this.dimesionsCache_[childKey], mp, child.props);
            if (dist < _this.props.hoverDistance) {
              distances.push({
                key: childKey,
                dist: dist,
                props: child.props
              });
            }
          });

          if (distances.length) {
            distances.sort(function (a, b) {
              return a.dist - b.dist;
            });
            var hoverKey = distances[0].key;
            var childProps = distances[0].props;

            if (_this.hoverKey_ !== hoverKey) {
              _this._onChildMouseLeave();

              _this._onChildMouseEnter(hoverKey, childProps);
            }
          } else {
            _this._onChildMouseLeave();
          }
        })();
      } else {
        _this._onChildMouseLeave();
      }
    };

    this._getDimensions = function (key) {
      var childKey = key;
      return _this.dimesionsCache_[childKey];
    };

    this.props.dispatcher.on('kON_CHANGE', this._onChangeHandler);
    this.props.dispatcher.on('kON_MOUSE_POSITION_CHANGE', this._onMouseChangeHandler);
    this.props.dispatcher.on('kON_CLICK', this._onChildClick);

    this.dimesionsCache_ = {};
    this.hoverKey_ = null;
    this.hoverChildProps_ = null;
    this.allowMouse_ = true;

    this.state = _extends({}, this._getState(), { hoverKey: null });
  }

  GoogleMapMarkers.prototype.componentWillUnmount = function componentWillUnmount() {
    this.props.dispatcher.removeListener('kON_CHANGE', this._onChangeHandler);
    this.props.dispatcher.removeListener('kON_MOUSE_POSITION_CHANGE', this._onMouseChangeHandler);
    this.props.dispatcher.removeListener('kON_CLICK', this._onChildClick);

    this.dimesionsCache_ = null;
  };

  GoogleMapMarkers.prototype.render = function render() {
    var _this2 = this;

    var mainElementStyle = this.props.style || mainStyle;

    this.dimesionsCache_ = {};

    var markers = _react2['default'].Children.map(this.state.children, function (child, childIndex) {
      var pt = _this2.props.geoService.project({ lat: child.props.lat, lng: child.props.lng }, _this2.props.projectFromLeftTop);
      var stylePtPos = {
        left: pt.x,
        top: pt.y
      };

      var dx = 0;
      var dy = 0;

      if (!_this2.props.projectFromLeftTop) {
        // center projection
        if (_this2.props.geoService.hasSize()) {
          dx = _this2.props.geoService.getWidth() / 2;
          dy = _this2.props.geoService.getHeight() / 2;
        }
      }

      // to prevent rerender on child element i need to pass const params $getDimensions and $dimensionKey instead of dimension object
      var childKey = child.key !== undefined && child.key !== null ? child.key : childIndex;
      _this2.dimesionsCache_[childKey] = { x: pt.x + dx, y: pt.y + dy, lat: child.props.lat, lng: child.props.lng };

      return _react2['default'].createElement(
        'div',
        { key: childKey, style: _extends({}, style, stylePtPos) },
        _react2['default'].cloneElement(child, {
          $hover: childKey === _this2.state.hoverKey,
          $getDimensions: _this2._getDimensions,
          $dimensionKey: childKey,
          $geoService: _this2.props.geoService,
          $onMouseAllow: _this2._onMouseAllow
        })
      );
    });

    return _react2['default'].createElement(
      'div',
      { style: mainElementStyle },
      markers
    );
  };

  return GoogleMapMarkers;
})(_react.Component);

exports['default'] = GoogleMapMarkers;
module.exports = exports['default'];