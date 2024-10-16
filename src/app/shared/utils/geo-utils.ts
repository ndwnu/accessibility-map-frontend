import { FeatureCollection, Position } from 'geojson';

export function pointToFeatureCollection(point?: Position): FeatureCollection {
  const feature = point
    ? {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: point,
        },
        properties: {},
      }
    : {};
  return {
    type: 'FeatureCollection',
    features: [feature],
  } as FeatureCollection;
}

export function extractPdokLngLatValue(pdokPoint: string) {
  const coordinate = pdokPoint.substring(6).replace(')', '').split(' ');
  return [Number(coordinate[0]), Number(coordinate[1])] as Position;
}
