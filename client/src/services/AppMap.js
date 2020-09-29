const TILE_URL = 'http://localhost:8080?x={x}&y={y}&zoom={z}';

export class AppMap {
  constructor(ref) {
    this._map = new window.google.maps.Map(ref, {
      zoom: 0,
      center: new window.google.maps.LatLng(0, 0),
      restriction: {
        latLngBounds: {
          north: 0,
          south: 90,
          west: 0,
          east: 180,
        },
        strictBounds: true,
      },
    });
    this._layerID = 'plan';
    this._layer = this.getLayer();
    this.applyLayer();
    this._map.addListener('click', (e) =>
      console.log(e, e.latLng.lat(), e.latLng.lng())
    );
  }

  applyLayer() {
    this._map.mapTypes.set(this._layerID, this._layer);
    this._map.setMapTypeId(this._layerID);
  }

  getLayer() {
    return new window.google.maps.ImageMapType({
      name: this._layerID,
      getTileUrl: this.getTileUrl,
      tileSize: new window.google.maps.Size(256, 256),
      minZoom: 0,
      maxZoom: 4,
      radius: 1738000,
    });
  }

  getTileUrl(coord, zoom) {
    console.log(coord, zoom);
    var url = TILE_URL.replace('{x}', coord.x)
      .replace('{y}', coord.y)
      .replace('{z}', zoom);
    return url;
  }
}
