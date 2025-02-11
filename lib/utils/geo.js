'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lib_geoLat_lngJs = require('./lib_geo/lat_lng.js');

var _lib_geoLat_lngJs2 = _interopRequireDefault(_lib_geoLat_lngJs);

var _pointGeometry = require('point-geometry');

var _pointGeometry2 = _interopRequireDefault(_pointGeometry);

var _lib_geoTransformJs = require('./lib_geo/transform.js');

var _lib_geoTransformJs2 = _interopRequireDefault(_lib_geoTransformJs);

var Geo = (function () {
  function Geo(tileSize) {
    _classCallCheck(this, Geo);

    // left_top view пользует гугл
    // super();
    this.hasSize_ = false;
    this.hasView_ = false;
    this.transform_ = new _lib_geoTransformJs2['default'](tileSize || 512);
  }

  Geo.prototype.setView = function setView(center, zoom, bearing) {
    this.transform_.center = _lib_geoLat_lngJs2['default'].convert(center);
    this.transform_.zoom = +zoom;
    this.transform_.bearing = +bearing;
    this.hasView_ = true;
  };

  Geo.prototype.setViewSize = function setViewSize(width, height) {
    this.transform_.width = width;
    this.transform_.height = height;
    this.hasSize_ = true;
  };

  Geo.prototype.canProject = function canProject() {
    return this.hasSize_ && this.hasView_;
  };

  Geo.prototype.hasSize = function hasSize() {
    return this.hasSize_;
  };

  Geo.prototype.unproject = function unproject(ptXY, viewFromLeftTop) {
    var ptRes = undefined;
    if (viewFromLeftTop) {
      var ptxy = _extends({}, ptXY);
      ptxy.x -= this.transform_.width / 2;
      ptxy.y -= this.transform_.height / 2;
      ptRes = this.transform_.pointLocation(_pointGeometry2['default'].convert(ptxy));
    } else {
      ptRes = this.transform_.pointLocation(_pointGeometry2['default'].convert(ptXY));
    }

    ptRes.lng -= 360 * Math.round(ptRes.lng / 360); // convert 2 google format
    return ptRes;
  };

  Geo.prototype.project = function project(ptLatLng, viewFromLeftTop) {
    if (viewFromLeftTop) {
      var pt = this.transform_.locationPoint(_lib_geoLat_lngJs2['default'].convert(ptLatLng));
      pt.x -= this.transform_.worldSize * Math.round(pt.x / this.transform_.worldSize);

      pt.x += this.transform_.width / 2;
      pt.y += this.transform_.height / 2;

      return pt;
    }

    return this.transform_.locationPoint(_lib_geoLat_lngJs2['default'].convert(ptLatLng));
  };

  Geo.prototype.getWidth = function getWidth() {
    return this.transform_.width;
  };

  Geo.prototype.getHeight = function getHeight() {
    return this.transform_.height;
  };

  Geo.prototype.getZoom = function getZoom() {
    return this.transform_.zoom;
  };

  Geo.prototype.getCenter = function getCenter() {
    var ptRes = this.transform_.pointLocation({ x: 0, y: 0 });

    return ptRes;
  };

  Geo.prototype.getBounds = function getBounds(margins, roundFactor) {
    var bndT = margins && margins[0] || 0;
    var bndR = margins && margins[1] || 0;
    var bndB = margins && margins[2] || 0;
    var bndL = margins && margins[3] || 0;

    if (this.getWidth() - bndR - bndL > 0 && this.getHeight() - bndT - bndB > 0) {
      var topLeftCorner = this.unproject({ x: bndL - this.getWidth() / 2, y: bndT - this.getHeight() / 2 });
      var bottomRightCorner = this.unproject({ x: this.getWidth() / 2 - bndR, y: this.getHeight() / 2 - bndB });

      var res = [topLeftCorner.lat, topLeftCorner.lng, bottomRightCorner.lat, bottomRightCorner.lng];

      if (roundFactor) {
        res = res.map(function (r) {
          return Math.round(r * roundFactor) / roundFactor;
        });
      }
      return res;
    }

    return [0, 0, 0, 0];
  };

  return Geo;
})();

exports['default'] = Geo;
module.exports = exports['default'];