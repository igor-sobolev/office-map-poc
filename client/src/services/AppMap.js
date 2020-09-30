const TILE_URL = 'http://localhost:8080?x={x}&y={y}&zoom={z}';
const BOUNDS_SHRINK_PERCENTAGE = 0.08;

export class AppMap {
  constructor(ref) {
    this._map = new window.google.maps.Map(ref, {
      zoom: 2,
      center: new window.google.maps.LatLng(0, 0),
    });
    this._layerID = 'plan';
    this._layer = this.getLayer();
    this.applyLayer();
    this._map.addListener('click', (e) =>
      console.log(e, e.latLng.lat(), e.latLng.lng())
    );

    // @TODO: feels weird
    // this._map.addListener('idle', () => this.worldViewFit(this._map)); // don't go to repeatable image on x axis
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
      minZoom: 2,
      maxZoom: 6,
    });
  }

  getTileUrl(coord, zoom) {
    console.log(coord, zoom);
    var url = TILE_URL.replace('{x}', coord.x)
      .replace('{y}', coord.y)
      .replace('{z}', zoom);
    return url;
  }

  slightlySmallerBounds(southWest, northEast) {
    const adjustmentAmount = (value1, value2) =>
      Math.abs(value1 - value2) * BOUNDS_SHRINK_PERCENTAGE;

    let latAdjustment = adjustmentAmount(northEast.lat(), southWest.lat());
    let lngAdjustment = adjustmentAmount(northEast.lng(), southWest.lng());

    return [
      {
        lat: southWest.lat() + latAdjustment,
        lng: southWest.lng() + lngAdjustment,
      },
      {
        lat: northEast.lat() - latAdjustment,
        lng: northEast.lng() - lngAdjustment,
      },
    ];
  }

  worldViewFit(map) {
    const bounds = map.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    console.log(northEast.lng(), southWest.lng());
    if (northEast.lng() > 179 || southWest.lng() < -179) {
      const [newSouthWest, newNorthEast] = this.slightlySmallerBounds(
        southWest,
        northEast
      );
      map.fitBounds(
        new window.google.maps.LatLngBounds(newSouthWest, newNorthEast)
      );
    }
  }
}
