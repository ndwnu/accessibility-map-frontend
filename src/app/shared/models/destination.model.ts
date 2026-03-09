export enum DestinationType {
  roadSectionSegment = 'roadSectionSegment',
  destination = 'destination',
  unknown = 'unknown',
}

export interface DestinationProperties {
  type: DestinationType;
  roadSectionId: number;
  accessible: boolean;
  reasons: unknown[];
}
