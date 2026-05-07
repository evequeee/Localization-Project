export interface LocalizationSummary {
  status: string;
  language: string;
  teamNames: string[];
}

export interface Game {
  id: number;
  title: string;
  description: string;
  originalLanguage: string;
  translationStatus: string;
  localizations: LocalizationSummary[];
}