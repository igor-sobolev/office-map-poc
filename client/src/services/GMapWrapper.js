const TILE_URL = 'http://localhost:8080/tiles/{building}?x={x}&y={y}&zoom={z}';

export class GMapWrapper {
  constructor(root, menu) {
    this._el = root;
    this._menu = menu;
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
    this._initMenu();
  }

  _initMenu() {
    this._map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(
      this._menu
    );
    this._hideMenu();

    window.google.maps.event.addListener(this._map, 'rightclick', (event) => {
      // this._showMenu(event); @TODO: could improve
    });

    window.google.maps.event.addListener(this._map, 'click', () => {
      this._hideMenu();
    });
  }

  _showMenu({ pixel: { x, y } }) {
    console.dir(this._menu);
    this._menu.style.display = 'block';
    this._menu.style.top = `${y}px`;
    this._menu.style.left = `${x}px`;
  }

  _hideMenu() {
    this._menu.style.display = 'none';
  }

  _applyLayer(id, layer) {
    this._map.mapTypes.set(id, layer);
    this._map.setMapTypeId(id);
  }

  _getLayer() {
    const layerID = 'plan';

    const layer = new window.google.maps.ImageMapType({
      name: layerID,
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
    this._markers = objects.map((object, index) => {
      const markerIcon = {
        url: 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(object.svg),
      };
      const marker = new window.google.maps.Marker({
        ...object,
        position: object.position || new window.google.maps.LatLng(0, 0),
        map: this._map,
        title: object.name,
        icon: markerIcon,
        draggable: object.draggable || false,
      });
      marker.addListener('click', () => {
        if (!object.meta) return;
        this._infoWindow.setContent(JSON.stringify(object.meta));
        this._infoWindow.open(this._map, marker);
      });
      marker.addListener('dragend', () => this._onObjectsUpdate(this._markers));
      marker.addListener('dblclick', () => this._deleteMarker(index));

      return marker;
    });
  }

  _deleteMarker(index) {
    const marker = this._markers[index];
    const shouldDelete = window.confirm('Delete object?');
    if (!shouldDelete) return;
    this._markers.splice(index, 1);
    marker.setMap(null);
    this._onObjectsUpdate(this._markers);
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

  onObjectsUpdate(cb) {
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
