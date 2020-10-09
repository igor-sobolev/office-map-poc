const TILE_URL = 'http://localhost:8080/tiles/{building}?x={x}&y={y}&zoom={z}';

export class GMapWrapper {
  constructor(ref) {
    this._el = ref;
    this._onObjectsUpdate = () => {};
    this._markers = [];
    this._building = '';

    this._layer = this._getLayer();

    this._loadMap();

    this._infoWindow = new window.google.maps.InfoWindow();
  }

  _loadMap() {
    this._map = new window.google.maps.Map(this._el, {
      zoom: 2,
      center: new window.google.maps.LatLng(0, 0),
    });
    this._layer.apply();

    this._map.addListener('zoom_changed', () => this._scaleMarkers());
  }

  _applyLayer(id, layer) {
    this._map.mapTypes.set(id, layer);
    this._map.setMapTypeId(id);
  }

  _getLayer() {
    const layerID = 'plan';

    const layer = new window.google.maps.ImageMapType({
      name: this._layerID,
      getTileUrl: this._getTileUrl,
      tileSize: new window.google.maps.Size(256, 256),
      minZoom: 2,
      maxZoom: 6,
    });

    const apply = () => this._applyLayer(layerID, layer);

    return {
      layer,
      apply,
    };
  }

  _getTileUrl = (coord, zoom) => {
    const url = TILE_URL.replace('{x}', coord.x)
      .replace('{y}', coord.y)
      .replace('{z}', zoom)
      .replace('{building}', this._building);

    return url;
  };

  _createMarkers(objects) {
    this._markers = objects.map((object) => {
      const markerIcon = {
        url: 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(object.svg),
      };
      const marker = new window.google.maps.Marker({
        ...object,
        position: object.position || this._map.getCenter(),
        map: this._map,
        title: object.type,
        icon: markerIcon,
        draggable: object.draggable,
      });
      marker.addListener('click', () => {
        this._infoWindow.setContent(JSON.stringify(object.meta));
        this._infoWindow.open(this._map, marker);
      });
      marker.addListener('dragend', () => this._onObjectsUpdate(this._markers));

      return marker;
    });
  }

  _addObject(object) {
    const markerIcon = {
      url: 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(object.svg),
    };
    const marker = new window.google.maps.Marker({
      position: new window.google.maps.LatLng(0, 0),
      map: this._map,
      animation: window.google.maps.Animation.DROP,
      title: object.type,
      icon: markerIcon,
    });
    this._markers.push(marker);
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
        scaledSize: new window.google.maps.Size(
          relativePixelSize,
          relativePixelSize
        ), //changes the scale
        size: new window.google.maps.Size(relativePixelSize, relativePixelSize), //changes the scale
      })
    );
  }

  setObjectsUpdateCallback(cb) {
    this._onObjectsUpdate = cb;
  }

  renderObjects(objects) {
    this._clearMarkers();
    this._createMarkers(objects);
    this._scaleMarkers();
  }

  setBuilding(buildingName) {
    this._building = buildingName;
    this._loadMap();
  }
}
