export interface LocalizationSummary {
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