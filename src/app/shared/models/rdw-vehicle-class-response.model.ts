export interface RdwVehicleClassResponse {
  kenteken: string;
  brandstof_volgnummer: string;
  brandstof_omschrijving: string;
  emissiecode_omschrijving: string;
  nominaal_continu_maximumvermogen?: string;
  klasse_hybride_elektrisch_voertuig: string;
  uitlaatemissieniveau: string;
  brandstofverbruik_buiten?: string;
  brandstofverbruik_gecombineerd?: string;
  brandstofverbruik_stad?: string;
  co2_uitstoot_gecombineerd?: string;
  geluidsniveau_rijdend?: string;
  geluidsniveau_stationair?: string;
  milieuklasse_eg_goedkeuring_licht?: string;
  nettomaximumvermogen?: string;
  toerental_geluidsniveau?: string;
}
