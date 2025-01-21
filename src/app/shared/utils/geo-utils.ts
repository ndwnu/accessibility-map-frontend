import { Position } from 'geojson';

export function extractPdokLngLatValue(pdokPoint: string) {
  const coordinate = pdokPoint.substring(6).replace(')', '').split(' ');
  return [Number(coordinate[0]), Number(coordinate[1])] as Position;
}
