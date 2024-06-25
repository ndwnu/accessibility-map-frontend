import { FeatureCollection } from 'geojson';
import { LngLat } from 'maplibre-gl';

export type TrafficSignFeatureCollection = FeatureCollection<any, TrafficSign>;

export interface TrafficSign {
  id: string;
  wvkId: string;
  rvvCode: string;
  countyCode: string;
  countyName: string;
  roadName: string;
  image: string;
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
  DIRECTION_ARROWS = 'DIRECTION_ARROWS',
  EXCLUDING = 'EXCLUDING',
  FREE_TEXT = 'FREE_TEXT',
  LICENSE_PLATE = 'LICENSE_PLATE',
  PRE_ANNOUNCEMENT = 'PRE_ANNOUNCEMENT',
  TIME_PERIOD = 'TIME_PERIOD',
}
