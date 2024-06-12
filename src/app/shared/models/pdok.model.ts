export interface PdokSuggestion {
  id: string;
  type: string;
  weergavenaam: string;
  score: number;
}

export interface PdokLookup {
  id: string;
  nwb_id: number;
  bron: string;
  woonplaatscode: number;
  type: string;
  woonplaatsnaam: string;
  openbareruimtetype: string;
  gemeentecode: number;
  rdf_seealso: string;
  weergavenaam: string;
  straatnaam_verkort: string;
  gemeentenaam: string;
  identificatie: number;
  openbareruimte_id: number;
  provinciecode: string;
  provincienaam: string;
  provincieafkorting: string;
  straatnaam: string;
  centroide_ll: string;
  centroide_rd: string;
}

export interface BasePdokDetails {
  numFound: number;
  start: number;
  maxScore: number;
  numFoundExact: boolean;
}

export interface PdokSuggestionDetails extends BasePdokDetails {
  docs: PdokSuggestion[];
}
export interface PdokLookupDetails extends BasePdokDetails {
  docs: PdokLookup[];
}

export interface PdokSuggestionResponse {
  response: PdokSuggestionDetails;
}

export interface PdokLookupResponse {
  response: PdokLookupDetails;
}
