import { SourceSpecification } from 'maplibre-gl';

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
