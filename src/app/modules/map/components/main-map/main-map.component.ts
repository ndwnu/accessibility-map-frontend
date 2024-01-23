import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseMapComponent } from '@shared/components/base-map/base-map.component';
import { MapService } from '@shared/services/map.service';
import { MapSourceService } from '@shared/services/map-source.service';
import { MapLayerService } from '@shared/services/map-layer.service';

@Component({
  selector: 'ber-main-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss',
  providers: [MapService, MapSourceService, MapLayerService],
})
export class MainMapComponent extends BaseMapComponent {
  private readonly _source = inject(MapSourceService);
  private readonly _layer = inject(MapLayerService);

  protected async onLoadMap() {
    this._source.addVectorSources(this.map);
    this._layer.addVectorLayers(this.map);
  }
}
