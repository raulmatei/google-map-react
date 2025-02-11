'use strict';

var LatLng = require('./lat_lng');
var Point = require('point-geometry');
var wrap = require('./wrap.js').wrap;

// A single transform, generally used for a single tile to be scaled, rotated, and zoomed.

function Transform(tileSize, minZoom, maxZoom) {
  this.tileSize = tileSize || 512; // constant

  this._minZoom = minZoom || 0;
  this._maxZoom = maxZoom || 52;

  this.latRange = [-85.05113, 85.05113];

  this.width = 0;
  this.height = 0;
  this.zoom = 0;
  this.center = new LatLng(0, 0);
  this.angle = 0;
}

Transform.prototype = Object.defineProperties({

  zoomScale: function zoomScale(zoom) {
    return Math.pow(2, zoom);
  },
  scaleZoom: function scaleZoom(scale) {
    return Math.log(scale) / Math.LN2;
  },

  project: function project(latlng, worldSize) {
    return new Point(this.lngX(latlng.lng, worldSize), this.latY(latlng.lat, worldSize));
  },

  unproject: function unproject(point, worldSize) {
    return new LatLng(this.yLat(point.y, worldSize), this.xLng(point.x, worldSize));
  },

  // lat/lon <-> absolute pixel coords convertion
  lngX: function lngX(lon, worldSize) {
    return (180 + lon) * (worldSize || this.worldSize) / 360;
  },
  // latitude to absolute y coord
  latY: function latY(lat, worldSize) {
    var y = 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
    return (180 - y) * (worldSize || this.worldSize) / 360;
  },

  xLng: function xLng(x, worldSize) {
    return x * 360 / (worldSize || this.worldSize) - 180;
  },
  yLat: function yLat(y, worldSize) {
    var y2 = 180 - y * 360 / (worldSize || this.worldSize);
    return 360 / Math.PI * Math.atan(Math.exp(y2 * Math.PI / 180)) - 90;
  },

  locationPoint: function locationPoint(latlng) {
    var p = this.project(latlng);
    return this.centerPoint._sub(this.point._sub(p)._rotate(this.angle));
  },

  pointLocation: function pointLocation(p) {
    var p2 = this.centerPoint._sub(p)._rotate(-this.angle);
    return this.unproject(this.point.sub(p2));
  }

}, {
  minZoom: {
    get: function get() {
      return this._minZoom;
    },
    set: function set(zoom) {
      this._minZoom = zoom;
      this.zoom = Math.max(this.zoom, zoom);
    },
    configurable: true,
    enumerable: true
  },
  maxZoom: {
    get: function get() {
      return this._maxZoom;
    },
    set: function set(zoom) {
      this._maxZoom = zoom;
      this.zoom = Math.min(this.zoom, zoom);
    },
    configurable: true,
    enumerable: true
  },
  worldSize: {
    get: function get() {
      return this.tileSize * this.scale;
    },
    configurable: true,
    enumerable: true
  },
  centerPoint: {
    get: function get() {
      return new Point(0, 0); // this.size._div(2);
    },
    configurable: true,
    enumerable: true
  },
  size: {
    get: function get() {
      return new Point(this.width, this.height);
    },
    configurable: true,
    enumerable: true
  },
  bearing: {
    get: function get() {
      return -this.angle / Math.PI * 180;
    },
    set: function set(bearing) {
      this.angle = -wrap(bearing, -180, 180) * Math.PI / 180;
    },
    configurable: true,
    enumerable: true
  },
  zoom: {
    get: function get() {
      return this._zoom;
    },
    set: function set(zoom) {
      zoom = Math.min(Math.max(zoom, this.minZoom), this.maxZoom);
      this._zoom = zoom;
      this.scale = this.zoomScale(zoom);
      this.tileZoom = Math.floor(zoom);
      this.zoomFraction = zoom - this.tileZoom;
    },
    configurable: true,
    enumerable: true
  },
  x: {
    get: function get() {
      return this.lngX(this.center.lng);
    },
    configurable: true,
    enumerable: true
  },
  y: {
    get: function get() {
      return this.latY(this.center.lat);
    },
    configurable: true,
    enumerable: true
  },
  point: {
    get: function get() {
      return new Point(this.x, this.y);
    },
    configurable: true,
    enumerable: true
  }
});

module.exports = Transform;