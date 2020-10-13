import { uuid } from './uuid';

export const convertMarkersToObjects = (object) => ({
  name: object.name,
  position: {
    lat: object?.position?.lat(),
    lng: object?.position?.lng(),
  },
  proportions: object?.proportions,
  meta: object.meta,
  rotate: object.rotate,
  svg: object.svg,
  draggable: object.draggable,
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
