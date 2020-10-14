import { uuid } from './uuid';

export const convertMarkersToObjects = (marker) => ({
  id: marker.id,
  name: marker.name,
  position: {
    lat: marker?.position?.lat(),
    lng: marker?.position?.lng(),
  },
  proportions: marker?.proportions,
  meta: marker.meta,
  rotate: marker.rotate,
  draggable: marker.draggable,
});

export const addIdentifiers = (buildings) =>
  buildings.map((building) => ({
    ...building,
    id: building.id || uuid(),
    objects: building.objects.map((object) => ({
      ...object,
      id: object.id || uuid(),
    })),
  }));
