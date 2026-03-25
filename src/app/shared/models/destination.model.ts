export enum DestinationType {
  RoadSectionSegment = 'roadSectionSegment',
  Destination = 'destination',
  Unknown = 'unknown',
}

export interface DestinationProperties {
  type: DestinationType;
  roadSectionId: number;
  accessible: boolean;
  reasons: unknown[];
}
