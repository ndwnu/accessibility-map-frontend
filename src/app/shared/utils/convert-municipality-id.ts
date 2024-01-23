export function convertMunicipalityToNLS(municipalityId?: string): {
  roadOperatorType: string;
  roadOperatorCode: number;
} {
  if (!municipalityId) {
    throw Error('municipalityId is required');
  }
  // input: GM0344
  // output: { roadOperatorType: 'Municipality', roadOperatorCode: 344 }
  const roadOperatorType = 'Municipality';
  const roadOperatorCode = parseInt(municipalityId.replace('GM', ''));
  return { roadOperatorType, roadOperatorCode };
}
