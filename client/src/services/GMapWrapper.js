import { ImageToBase64 } from '../helpers/image';
import { RotatableIcon } from './RotatableIcon';

const TILE_URL = 'http://localhost:8080/tiles/{building}?x={x}&y={y}&zoom={z}';
const ICON_SIZE_FACTOR = 8; //the size of the icon at zoom level 0, at zoom level 2 it'll be 8*2^2=32

const imageLoader = new ImageToBase64();

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

  async _createMarkers(objects) {
    this._markers = await Promise.all(
      objects.map(async (object, index) => {
        const base64Image = await imageLoader.fetch(
          // `http://localhost:8080/static/data/store/objects/${object.name}.svg` // if served from static
          `http://localhost:8080/buildings/objects/${object.name}/image` // default endpoint
        );
        const markerIcon = RotatableIcon.makeIcon(base64Image);
        await markerIcon.load();
        const markerIconUrl = markerIcon
          .setRotation({ deg: object.rotate })
          .getUrl();
        const marker = new window.google.maps.Marker({
          ...object,
          position: object?.position || new window.google.maps.LatLng(0, 0),
          map: this._map,
          title: object.name,
          icon: {
            url: markerIconUrl,
          },
          draggable: object.draggable,
        });
        marker.addListener('click', () => {
          if (!object.meta) return;
          this._infoWindow.setContent(JSON.stringify(object.meta));
          this._infoWindow.open(this._map, marker);
        });
        marker.addListener('dragend', () =>
          this._onObjectsUpdate(this._markers)
        );
        marker.addListener('dblclick', () => this._deleteMarker(index));

        return marker;
      })
    );
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
    const zoom = this._map.getZoom();
    const width = (proportions) =>
      Math.round(ICON_SIZE_FACTOR * proportions?.width * Math.pow(2, zoom));
    const height = (proportions) =>
      Math.round(ICON_SIZE_FACTOR * proportions?.height * Math.pow(2, zoom));

    //change the size of the icon
    this._markers.forEach((marker) =>
      marker.setIcon({
        ...marker.getIcon(), //marker's same icon graphic
        scaledSize: new window.google.maps.Size(
          width(marker.proportions),
          height(marker.proportions)
        ), //changes the scale
        size: new window.google.maps.Size(
          width(marker.proportions),
          height(marker.proportions)
        ), //changes the scale
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(
          width(marker.proportions) / 2,
          height(marker.proportions) / 2
        ),
      })
    );
  }

  onObjectsUpdate(cb) {
    this._onObjectsUpdate = cb;
  }

  async renderObjects(objects) {
    this._clearMarkers();
    await this._createMarkers(objects);
    this._scaleMarkers();
  }

  setBuilding(buildingName) {
    if (this._building !== buildingName) {
      this._building = buildingName;
      this._loadMap();
    }
  }
}
