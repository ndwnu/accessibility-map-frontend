import { FeatureCollection, Geometry } from 'geojson';
import { LngLat } from 'maplibre-gl';

export type TrafficSignFeatureCollection = FeatureCollection<Geometry, TrafficSign>;

export interface TrafficSign {
  id: string;
  roadSectionId?: string;
  rvvCode: string;
  countyCode: string;
  countyName: string;
  blackCode?: string;
  roadName: string;
  imageUrl: string;
  bearing: number;
  side: SideEnum;
  textSigns: TextSign[];
  lnglat?: LngLat;
}

export interface TextSign {
  type: TextSignType;
  text: string;
}

export enum SideEnum {
  N = 'N',
  O = 'O',
  Z = 'Z',
  W = 'W',
}

export enum TextSignType {
  DirectionArrows = 'DIRECTION_ARROWS',
  Excluding = 'EXCLUDING',
  FreeText = 'FREE_TEXT',
  LicensePlate = 'LICENSE_PLATE',
  PreAnnouncement = 'PRE_ANNOUNCEMENT',
  TimePeriod = 'TIME_PERIOD',
}
