export const convertMarkersToObjects = (object) => ({
  name: object.name,
  position: {
    lat: object?.position?.lat(),
    lng: object?.position?.lng(),
  },
  meta: object.meta,
  rotate: object.rotate,
  svg: object.svg,
  draggable: object.draggable,
});
