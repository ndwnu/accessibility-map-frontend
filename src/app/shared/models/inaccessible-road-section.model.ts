export interface InaccessibleRoadSectionsResponse {
  inaccessibleRoadSections: InaccessibleRoadSection[];
}

export interface InaccessibleRoadSection {
  roadSectionId: number;
  forwardAccessible: boolean;
  backwardAccessible: boolean;
}
