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

export interface Team {
  id: number;
  name: string;
  contactEmail?: string;
  description?: string;
}

export interface TeamJoinRequest {
  id: number;
  userId: number;
  userEmail: string;
  teamId: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  resolvedAt?: string;
}