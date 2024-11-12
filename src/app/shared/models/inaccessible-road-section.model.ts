export interface InaccessibleRoadSectionsResponse {
  inaccessibleRoadSections: InaccessibleRoadSection[];
  matchedRoadSection?: InaccessibleRoadSection;
}

export interface InaccessibleRoadSection {
  roadSectionId: number;
  forwardAccessible: boolean;
  backwardAccessible: boolean;
}
