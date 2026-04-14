import { FilterSpecification, SourceSpecification } from 'maplibre-gl';
import { environment } from '@env/environment';
import { MotorizedNoAccessLayer } from '@modules/map/elements/motorized-no-access/motorized-no-access-layer';
import { AccessibilityFilterService } from '@shared/services';
import { AccessibilityFilter } from '@shared/models';
import { convertMunicipalityToNLS } from '@shared/utils/convert-municipality-id';
import { BerMapElementConfig, BerMapSource } from '@modules/map/elements/base';

export class MotorizedNoAccessSource extends BerMapSource {
  constructor(
    config: BerMapElementConfig,
    private readonly accessibilityFilterService: AccessibilityFilterService,
  ) {
    super('motorized-no-access', config);

    this.layers = [new MotorizedNoAccessLayer(config, this.id)];
  }

  override onInit(): void {
    super.onInit();

    this.filter$ = this.accessibilityFilterService.filter$;
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
