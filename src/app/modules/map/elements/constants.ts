import { DataDrivenPropertyValueSpecification, SourceSpecification } from 'maplibre-gl';

export const MAP_DEFAULT_ZOOM = 15;
export const MAP_MAX_ZOOM = 18;
export const MAP_MIN_ZOOM = 7;

export const ACCESSIBLE_ROAD_SECTION_COLOR = '#8fc4ff';
export const INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR = '#d198da';
export const INACCESSIBLE_ROAD_SECTION_COLOR = '#d41159';
export const ACCESSIBLE_RVV_BUT_NOT_EZ_COLOR = '#F5B700';
export const ACCESSIBLE_EZ_BUT_NOT_RVV_COLOR = '#C247FF';

export const EMPTY_SOURCE_SPECIFICATION = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [],
  },
} as Partial<SourceSpecification>;

export const lineWidthFrcSpecification = [
  'interpolate',
  ['exponential', 1.1],
  ['zoom'],
  10,
  ['match', ['get', 'functionalRoadClass'], '0', 2.5, '1', 2.5, '2', 2.5, '3', 1.5, '4', 1.5, '5', 1, 0],
  13,
  ['match', ['get', 'functionalRoadClass'], '0', 7, '1', 7, '2', 5.7, '3', 4.1, '4', 4.1, '5', 2.7, '6', 1.5, 0],
  15,
  [
    'match',
    ['get', 'functionalRoadClass'],
    '0',
    10.4,
    '1',
    10.4,
    '2',
    8.4,
    '3',
    6.4,
    '4',
    6.4,
    '5',
    5.4,
    '6',
    3.4,
    '7',
    3.4,
    2,
  ],
  20,
  ['match', ['get', 'functionalRoadClass'], '0', 24, '1', 24, '2', 22, '3', 20, '4', 18, '5', 16, '6', 14, '7', 10, 4],
] as DataDrivenPropertyValueSpecification<number>;
