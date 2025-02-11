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

var _marker_dispatcherJs = require('./marker_dispatcher.js');

var _marker_dispatcherJs2 = _interopRequireDefault(_marker_dispatcherJs);

var _google_map_mapJs = require('./google_map_map.js');

var _google_map_mapJs2 = _interopRequireDefault(_google_map_mapJs);

var _google_map_markersJs = require('./google_map_markers.js');

var _google_map_markersJs2 = _interopRequireDefault(_google_map_markersJs);

var _google_map_markers_prerenderJs = require('./google_map_markers_prerender.js');

var _google_map_markers_prerenderJs2 = _interopRequireDefault(_google_map_markers_prerenderJs);

var _utilsLoadersGoogle_map_loaderJs = require('./utils/loaders/google_map_loader.js');

var _utilsLoadersGoogle_map_loaderJs2 = _interopRequireDefault(_utilsLoadersGoogle_map_loaderJs);

var _utilsDetectJs = require('./utils/detect.js');

var _utilsDetectJs2 = _interopRequireDefault(_utilsDetectJs);

var _utilsGeoJs = require('./utils/geo.js');

var _utilsGeoJs2 = _interopRequireDefault(_utilsGeoJs);

var _utilsArray_helperJs = require('./utils/array_helper.js');

var _utilsArray_helperJs2 = _interopRequireDefault(_utilsArray_helperJs);

var _lodashIsfunction = require('lodash.isfunction');

var _lodashIsfunction2 = _interopRequireDefault(_lodashIsfunction);

var _lodashIsplainobject = require('lodash.isplainobject');

var _lodashIsplainobject2 = _interopRequireDefault(_lodashIsplainobject);

var _lodashPick = require('lodash.pick');

var _lodashPick2 = _interopRequireDefault(_lodashPick);

var _lodashAssign = require('lodash.assign');

var _lodashAssign2 = _interopRequireDefault(_lodashAssign);

var _lodashIsnumber = require('lodash.isnumber');

var _lodashIsnumber2 = _interopRequireDefault(_lodashIsnumber);

var kEPS = 0.00001;
var K_GOOGLE_TILE_SIZE = 256;

function defaultOptions_() /*maps*/{
  return {
    overviewMapControl: false,
    streetViewControl: false,
    rotateControl: true,
    mapTypeControl: false,
    // disable poi
    styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }],
    minZoom: 3 // i need to dynamically calculate possible zoom value
  };
}

var style = {
  width: '100%',
  height: '100%',
  margin: 0,
  padding: 0,
  position: 'relative'
};

var GoogleMap = (function (_Component) {
  _inherits(GoogleMap, _Component);

  _createClass(GoogleMap, null, [{
    key: 'propTypes',
    value: {
      apiKey: _react.PropTypes.string,
      center: _react.PropTypes.array.isRequired,
      zoom: _react.PropTypes.number.isRequired,
      onBoundsChange: _react.PropTypes.func,
      onChildClick: _react.PropTypes.func,
      onChildMouseEnter: _react.PropTypes.func,
      onChildMouseLeave: _react.PropTypes.func,
      options: _react.PropTypes.any,
      distanceToMouse: _react.PropTypes.func,
      hoverDistance: _react.PropTypes.number,
      debounced: _react.PropTypes.bool,
      margin: _react.PropTypes.array,
      googleMapLoader: _react.PropTypes.any
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      distanceToMouse: function distanceToMouse(pt, mousePos /*, markerProps*/) {
        var x = pt.x;
        var y = pt.y; // - 20;
        return Math.sqrt((x - mousePos.x) * (x - mousePos.x) + (y - mousePos.y) * (y - mousePos.y));
      },
      hoverDistance: 30,
      debounced: true,
      options: defaultOptions_,
      googleMapLoader: _utilsLoadersGoogle_map_loaderJs2['default']
    },
    enumerable: true
  }]);

  function GoogleMap(props) {
    var _this = this;

    _classCallCheck(this, GoogleMap);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRenderFunction2['default'];

    this._initMap = function () {
      var center = _this.props.center;
      _this.geoService_.setView(center, _this.props.zoom, 0);

      _this._onBoundsChanged(); // now we can calculate map bounds center etc...

      _this.props.googleMapLoader(_this.props.apiKey).then(function (maps) {
        if (!_this.mounted_) {
          return;
        }

        var centerLatLng = _this.geoService_.getCenter();

        var propsOptions = {
          zoom: _this.props.zoom,
          center: new maps.LatLng(centerLatLng.lat, centerLatLng.lng)
        };

        // prevent to exapose full api
        // next props must be exposed (console.log(Object.keys(pick(maps, isPlainObject))))
        // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
        // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
        // "event", "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
        // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
        // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
        var mapPlainObjects = _lodashPick2['default'](maps, _lodashIsplainobject2['default']);
        var options = _lodashIsfunction2['default'](_this.props.options) ? _this.props.options(mapPlainObjects) : _this.props.options;
        var defaultOptions = defaultOptions_(mapPlainObjects);

        var mapOptions = _extends({}, defaultOptions, options, propsOptions);

        var map = new maps.Map(_react2['default'].findDOMNode(_this.refs.google_map_dom), mapOptions);
        _this.map_ = map;
        _this.maps_ = maps;

        // render in overlay
        var this_ = _this;
        var overlay = _this.overlay_ = _lodashAssign2['default'](new maps.OverlayView(), {
          onAdd: function onAdd() {
            var K_MAX_WIDTH = typeof screen !== 'undefined' ? screen.width + 'px' : '2000px';
            var K_MAX_HEIGHT = typeof screen !== 'undefined' ? screen.height + 'px' : '2000px';

            var div = document.createElement('div');
            this.div = div;
            div.style.backgroundColor = 'transparent';
            div.style.position = 'absolute';
            div.style.left = '0px';
            div.style.top = '0px';
            div.style.width = K_MAX_WIDTH; // prevents some chrome draw defects
            div.style.height = K_MAX_HEIGHT;

            var panes = this.getPanes();
            panes.overlayMouseTarget.appendChild(div);

            _react2['default'].render(_react2['default'].createElement(_google_map_markersJs2['default'], {
              onChildClick: this_._onChildClick,
              onChildMouseEnter: this_._onChildMouseEnter,
              onChildMouseLeave: this_._onChildMouseLeave,
              geoService: this_.geoService_,
              projectFromLeftTop: true,
              distanceToMouse: this_.props.distanceToMouse,
              hoverDistance: this_.props.hoverDistance,
              dispatcher: this_.markersDispatcher_ }), div, function () {
              // remove prerendered markers
              this_.setState({ overlayCreated: true });
            });
          },

          onRemove: function onRemove() {
            _react2['default'].unmountComponentAtNode(this.div);
          },

          draw: function draw() {
            var div = overlay.div;
            var overlayProjection = overlay.getProjection();
            var bounds = map.getBounds();
            var ne = bounds.getNorthEast();
            var sw = bounds.getSouthWest();
            var ptx = overlayProjection.fromLatLngToDivPixel(new maps.LatLng(ne.lat(), sw.lng()));

            // need round for safari still can't find what need for firefox
            var ptxRounded = _utilsDetectJs2['default']().isSafari ? { x: Math.round(ptx.x), y: Math.round(ptx.y) } : { x: ptx.x, y: ptx.y };

            this_.updateCounter_++;
            this_._onBoundsChanged(map, maps, !this_.props.debounced);

            div.style.left = ptxRounded.x + 'px';
            div.style.top = ptxRounded.y + 'px';
            if (this_.markersDispatcher_) {
              this_.markersDispatcher_.emit('kON_CHANGE');
            }
          }
        });

        overlay.setMap(map);

        maps.event.addListener(map, 'idle', function () {
          if (_this.resetSizeOnIdle_) {
            _this._setViewSize();
            _this.resetSizeOnIdle_ = false;
          }

          var div = overlay.div;
          var overlayProjection = overlay.getProjection();
          var bounds = map.getBounds();
          var ne = bounds.getNorthEast();
          var sw = bounds.getSouthWest();
          var ptx = overlayProjection.fromLatLngToDivPixel(new maps.LatLng(ne.lat(), sw.lng()));
          // need round for safari still can't find what need for firefox
          var ptxRounded = _utilsDetectJs2['default']().isSafari ? { x: Math.round(ptx.x), y: Math.round(ptx.y) } : { x: ptx.x, y: ptx.y };

          this_.updateCounter_++;
          this_._onBoundsChanged(map, maps);

          this_.dragTime_ = 0;
          div.style.left = ptxRounded.x + 'px';
          div.style.top = ptxRounded.y + 'px';
          if (this_.markersDispatcher_) {
            this_.markersDispatcher_.emit('kON_CHANGE');
            if (this_.fireMouseEventOnIdle_) {
              this_.markersDispatcher_.emit('kON_MOUSE_POSITION_CHANGE');
            }
          }

          if (_this.props.onIdle && typeof _this.props.onIdle === 'function') {
            _this.props.onIdle();
          }
        });

        maps.event.addListener(map, 'mouseover', function () {
          // has advantage over div MouseLeave
          this_.mouseInMap_ = true;
        });

        maps.event.addListener(map, 'mouseout', function () {
          // has advantage over div MouseLeave
          this_.mouseInMap_ = false;
          this_.mouse_ = null;
          this_.markersDispatcher_.emit('kON_MOUSE_POSITION_CHANGE');
        });

        maps.event.addListener(map, 'drag', function () {
          this_.dragTime_ = new Date().getTime();
        });
      })['catch'](function (e) {
        console.error(e); // eslint-disable-line no-console
        throw e;
      });
    };

    this._onChildClick = function () {
      if (_this.props.onChildClick) {
        var _props;

        return (_props = _this.props).onChildClick.apply(_props, arguments);
      }
    };

    this._onChildMouseEnter = function () {
      if (_this.props.onChildMouseEnter) {
        var _props2;

        return (_props2 = _this.props).onChildMouseEnter.apply(_props2, arguments);
      }
    };

    this._onChildMouseLeave = function () {
      if (_this.props.onChildMouseLeave) {
        var _props3;

        return (_props3 = _this.props).onChildMouseLeave.apply(_props3, arguments);
      }
    };

    this._setViewSize = function () {
      var mapDom = _react2['default'].findDOMNode(_this.refs.google_map_dom);
      _this.geoService_.setViewSize(mapDom.clientWidth, mapDom.clientHeight);
      _this._onBoundsChanged();
    };

    this._onWindowResize = function () {
      _this.resetSizeOnIdle_ = true;
    };

    this._onBoundsChanged = function (map, maps, callExtBoundsChange) {
      if (map) {
        var gmC = map.getCenter();
        _this.geoService_.setView([gmC.lat(), gmC.lng()], map.getZoom(), 0);
      }

      if (_this.props.onBoundsChange && _this.geoService_.canProject()) {
        var zoom = _this.geoService_.getZoom();
        var bounds = _this.geoService_.getBounds();
        var centerLatLng = _this.geoService_.getCenter();

        if (!_utilsArray_helperJs2['default'](bounds, _this.prevBounds_, kEPS)) {
          if (callExtBoundsChange !== false) {
            var marginBounds = _this.geoService_.getBounds(_this.props.margin);
            _this.props.onBoundsChange([centerLatLng.lat, centerLatLng.lng], zoom, bounds, marginBounds);
            _this.prevBounds_ = bounds;
          }
        }
        // uncomment for strange bugs
        if (process.env.NODE_ENV !== 'production') {
          // compare with google calculations
          if (map) {
            var locBounds = map.getBounds();
            var ne = locBounds.getNorthEast();
            var sw = locBounds.getSouthWest();

            var gmC = map.getCenter();
            // compare with google map

            if (!_utilsArray_helperJs2['default']([centerLatLng.lat, centerLatLng.lng], [gmC.lat(), gmC.lng()], kEPS)) {
              console.info('GoogleMap center not eq:', [centerLatLng.lat, centerLatLng.lng], [gmC.lat(), gmC.lng()]); // eslint-disable-line no-console
            }

            if (!_utilsArray_helperJs2['default'](bounds, [ne.lat(), sw.lng(), sw.lat(), ne.lng()], kEPS)) {
              // this is normal if this message occured on resize
              console.info('GoogleMap bounds not eq:', '\n', bounds, '\n', [ne.lat(), sw.lng(), sw.lat(), ne.lng()]); // eslint-disable-line no-console
            }
          }
        }
      }
    };

    this._onMouseMove = function (e) {
      if (!_this.mouseInMap_) return;

      var currTime = new Date().getTime();
      var K_RECALC_CLIENT_RECT_MS = 3000;

      if (currTime - _this.mouseMoveTime_ > K_RECALC_CLIENT_RECT_MS) {
        _this.boundingRect_ = e.currentTarget.getBoundingClientRect();
      }
      _this.mouseMoveTime_ = currTime;

      var mousePosX = e.clientX - _this.boundingRect_.left;
      var mousePosY = e.clientY - _this.boundingRect_.top;

      if (!_this.mouse_) {
        _this.mouse_ = { x: 0, y: 0, lat: 0, lng: 0 };
      }
      var K_IDLE_TIMEOUT = 100;

      _this.mouse_.x = mousePosX;
      _this.mouse_.y = mousePosY;

      var latLng = _this.geoService_.unproject(_this.mouse_, true);
      _this.mouse_.lat = latLng.lat;
      _this.mouse_.lng = latLng.lng;

      if (currTime - _this.dragTime_ < K_IDLE_TIMEOUT) {
        _this.fireMouseEventOnIdle_ = true;
      } else {
        _this.markersDispatcher_.emit('kON_MOUSE_POSITION_CHANGE');
        _this.fireMouseEventOnIdle_ = false;
      }
    };

    this._onMapClick = function () {
      if (_this.markersDispatcher_) {
        var K_IDLE_TIMEOUT = 100;
        var currTime = new Date().getTime();
        if (currTime - _this.dragTime_ > K_IDLE_TIMEOUT) {
          _this.markersDispatcher_.emit('kON_CLICK');
        }
      }
    };

    this._isCenterDefined = function (center) {
      return center && center.length === 2 && _lodashIsnumber2['default'](center[0]) && _lodashIsnumber2['default'](center[1]);
    };

    this.mounted_ = false;

    this.map_ = null;
    this.maps_ = null;
    this.prevBounds_ = null;

    this.mouse_ = null;
    this.mouseMoveTime_ = 0;
    this.boundingRect_ = null;
    this.mouseInMap_ = true;

    this.dragTime_ = 0;
    this.fireMouseEventOnIdle_ = false;
    this.updateCounter_ = 0;

    this.markersDispatcher_ = new _marker_dispatcherJs2['default'](this);
    this.geoService_ = new _utilsGeoJs2['default'](K_GOOGLE_TILE_SIZE);
    if (this._isCenterDefined(this.props.center)) {
      this.geoService_.setView(this.props.center, this.props.zoom, 0);
    }

    this.state = {
      overlayCreated: false
    };
  }

  GoogleMap.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    this.mounted_ = true;
    window.addEventListener('resize', this._onWindowResize);

    setTimeout(function () {
      // to detect size
      _this2._setViewSize();
      if (_this2._isCenterDefined(_this2.props.center)) {
        _this2._initMap();
      } else {
        _this2.props.googleMapLoader(_this2.props.apiKey); // начать подгружать можно уже сейчас
      }
    }, 0, this);
  };

  GoogleMap.prototype.componentWillUnmount = function componentWillUnmount() {
    this.mounted_ = false;

    window.removeEventListener('resize', this._onWindowResize);

    if (this.overlay_) {
      // this triggers overlay_.onRemove(), which will unmount the <GoogleMapMarkers/>
      this.overlay_.setMap(null);
    }

    if (this.maps_ && this.map_) {
      this.maps_.event.clearInstanceListeners(this.map_);
    }

    this.map_ = null;
    this.maps_ = null;
    this.markersDispatcher_.dispose();

    this.resetSizeOnIdle_ = false;

    delete this.map_;
    delete this.markersDispatcher_;
  };

  GoogleMap.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var _this3 = this;

    if (!this._isCenterDefined(this.props.center) && this._isCenterDefined(nextProps.center)) {
      setTimeout(function () {
        return _this3._initMap();
      }, 0);
    }

    if (this.map_) {
      var centerLatLng = this.geoService_.getCenter();
      if (nextProps.center) {
        if (Math.abs(nextProps.center[0] - centerLatLng.lat) + Math.abs(nextProps.center[1] - centerLatLng.lng) > kEPS) {
          this.map_.panTo({ lat: nextProps.center[0], lng: nextProps.center[1] });
        }
      }

      // if zoom chaged by user
      if (Math.abs(nextProps.zoom - this.props.zoom) > 0) {
        this.map_.setZoom(nextProps.zoom);
      }
    }
  };

  GoogleMap.prototype.componentDidUpdate = function componentDidUpdate() {
    this.markersDispatcher_.emit('kON_CHANGE');
  };

  GoogleMap.prototype.render = function render() {
    var mapMarkerPrerender = !this.state.overlayCreated ? _react2['default'].createElement(_google_map_markers_prerenderJs2['default'], {
      onChildClick: this._onChildClick,
      onChildMouseEnter: this._onChildMouseEnter,
      onChildMouseLeave: this._onChildMouseLeave,
      geoService: this.geoService_,
      projectFromLeftTop: false,
      distanceToMouse: this.props.distanceToMouse,
      hoverDistance: this.props.hoverDistance,
      dispatcher: this.markersDispatcher_ }) : null;

    return _react2['default'].createElement(
      'div',
      { style: style, onMouseMove: this._onMouseMove, onClick: this._onMapClick },
      _react2['default'].createElement(_google_map_mapJs2['default'], { ref: "google_map_dom" }),
      mapMarkerPrerender
    );
  };

  return GoogleMap;
})(_react.Component);

exports['default'] = GoogleMap;
module.exports = exports['default'];
/*render markers before map load done*/