import { Injectable } from '@angular/core';
import { InaccessibleRoadSection } from '@shared/models';
import { FilterSpecification } from 'maplibre-gl';

@Injectable()
export class MapExpressionService {
  getInaccessibleRoadSectionExpressions(inaccessibleRoadSection: InaccessibleRoadSection[]): FilterSpecification {
    const inaccessibleRoadSectionIds = inaccessibleRoadSection.map((irs) => irs.roadSectionId);
    return ['in', ['get', 'roadSectionId'], ['literal', inaccessibleRoadSectionIds]];
  }

  getRoadsForRoadAuthorityExpressions(roadOperatorType: string, roadOperatorCode: string): FilterSpecification {
    return [
      'all',
      ['==', ['get', 'roadOperatorType'], roadOperatorType],
      ['==', ['get', 'roadOperatorCode'], roadOperatorCode],
    ];
  }
}
