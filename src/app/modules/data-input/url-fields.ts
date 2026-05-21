export interface UrlField {
  name: string;
  parse: (raw: string) => unknown;
}

export const URL_FIELDS: readonly UrlField[] = [
  { name: 'vehicleType', parse: String },
  { name: 'height', parse: Number },
  { name: 'trailer', parse: () => true },
  { name: 'vehicleCurbWeight', parse: Number },
  { name: 'vehicleLoad', parse: Number },
  { name: 'vehicleTotalWeight', parse: Number },
  { name: 'vehicleAxleLoad', parse: Number },
  { name: 'vehicleLength', parse: Number },
  { name: 'vehicleWidth', parse: Number },
  { name: 'vehicleEmissionClass', parse: String },
];
