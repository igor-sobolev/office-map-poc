const TILE_URL = 'http://localhost:8080/tile?x={x}&y={y}&zoom={z}';
const BOUNDS_SHRINK_PERCENTAGE = 0.08;

export class AppMap {
  constructor(ref) {
    this._map = new window.google.maps.Map(ref, {
      zoom: 2,
      center: new window.google.maps.LatLng(0, 0),
    });
    this._markers = [];
    this._layerID = 'plan';
    this._layer = this._getLayer();
    this._applyLayer();
    this._map.addListener('click', (e) =>
      console.log(e, e.latLng.lat(), e.latLng.lng())
    );
    this._infoWindow = new window.google.maps.InfoWindow();

    this._map.addListener('zoom_changed', () => this._scaleMarkers());

    // @TODO: feels weird
    // this._map.addListener('idle', () => this._worldViewFit(this._map)); // don't go to repeatable image on x axis
  }

  _applyLayer() {
    this._map.mapTypes.set(this._layerID, this._layer);
    this._map.setMapTypeId(this._layerID);
  }

  _getLayer() {
    return new window.google.maps.ImageMapType({
      name: this._layerID,
      getTileUrl: this._getTileUrl,
      tileSize: new window.google.maps.Size(256, 256),
      minZoom: 2,
      maxZoom: 6,
    });
  }

  _getTileUrl(coord, zoom) {
    var url = TILE_URL.replace('{x}', coord.x)
      .replace('{y}', coord.y)
      .replace('{z}', zoom);
    return url;
  }

  _createMarkers(objects) {
    this._markers = objects.map((object) => {
      const markerIcon = {
        path: object.svg.path,
        rotation: object.rotate,
        strokeWeight: 1,
        dimensions: object.svg.dimensions, // store dimensions
      };
      const marker = new window.google.maps.Marker({
        position: object.position,
        map: this._map,
        title: object.type,
        icon: markerIcon,
      });
      marker.addListener('click', () => {
        this._infoWindow.setContent(JSON.stringify(object.meta));
        this._infoWindow.open(this._map, marker);
      });

      return marker;
    });
  }

  _clearMarkers() {
    this._markers.forEach((marker) => marker.setMap(null));
    this._markers = [];
  }

  _scaleMarkers() {
    const pixelSizeAtZoom0 = 8; //the size of the icon at zoom level 0, at zoom level 2 it'll be 8*2^2=32
    const maxPixelSize = 450; //restricts the maximum size of the icon, otherwise the browser will choke at higher zoom levels trying to scale an image to millions of pixels

    const zoom = this._map.getZoom();
    let relativePixelSize = Math.round(pixelSizeAtZoom0 * Math.pow(2, zoom)); // use 2 to the power of current zoom to calculate relative pixel size.  Base of exponent is 2 because relative size should double every time you zoom in

    if (relativePixelSize > maxPixelSize)
      //restrict the maximum size of the icon
      relativePixelSize = maxPixelSize;

    //change the size of the icon
    this._markers.forEach((marker) =>
      marker.setIcon({
        ...marker.getIcon(), //marker's same icon graphic
        test: console.log(marker),
        scale: relativePixelSize / marker.icon.dimensions.width,
      })
    );
  }

  _slightlySmallerBounds(southWest, northEast) {
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

  _worldViewFit(map) {
    const bounds = map.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    console.log(northEast.lng(), southWest.lng());
    if (northEast.lng() > 179 || southWest.lng() < -179) {
      const [newSouthWest, newNorthEast] = this._slightlySmallerBounds(
        southWest,
        northEast
      );
      map.fitBounds(
        new window.google.maps.LatLngBounds(newSouthWest, newNorthEast)
      );
    }
  }

  renderObjects(objects) {
    this._clearMarkers();
    this._createMarkers(objects);
    this._scaleMarkers();
  }
}
