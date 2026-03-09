import { FilterSpecification, Map, SourceSpecification } from 'maplibre-gl';
import { MapSource } from '@modules/map/elements/base/map-source';
import { environment } from '@env/environment';
import { MotorizedNoAccessLayer } from '@modules/map/elements/motorized-no-access/motorized-no-access-layer';
import { AccessibilityDataOldService } from '@shared/services';
import { AccessibilityFilter } from '@shared/models';
import { convertMunicipalityToNLS } from '@shared/utils/convert-municipality-id';

export class MotorizedNoAccessSource extends MapSource {
  constructor(
    map: Map,
    private readonly accessibilityDataService: AccessibilityDataOldService,
  ) {
    super('motorized-no-access', map);

    this.layers = [new MotorizedNoAccessLayer(map, this.id)];
  }

  override onInit(): void {
    super.onInit();

    this.filter$ = this.accessibilityDataService.filter$;
  }

  protected getSpecification(): Partial<SourceSpecification> {
    return {
      type: 'vector',
      tiles: [environment.ndw.roadSectionsUrl],
    };
  }

  protected override getFilterSpecification(filter: AccessibilityFilter): FilterSpecification {
    if (!filter?.municipalityId) {
      return ['==', ['get', 'municipalityId'], ''];
    }
    const municipality = convertMunicipalityToNLS(filter?.municipalityId);
    return ['==', ['get', 'municipalityId'], municipality.roadOperatorCode];
  }
}
