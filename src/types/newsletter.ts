export interface NewsletterCategory {
  id?: string | null;
  nom?: string | null;
  description?: string | null;
}

export type NewsletterStatus =
  | 'BROUILLON'
  | 'PUBLIEE'
  | 'SOUMISE'
  | 'REJETEE'
  | 'VALIDEE';

export interface NewsletterCreateRequest {
  titre: string;
  contenu: string;
  categorieIds: string[];
}

export interface NewsletterResponse {
  id?: string | null;
  titre?: string | null;
  contenu?: string | null;
  statut?: NewsletterStatus | null;
  redacteurId?: string | null;
  redacteurNom?: string | null;
  categories?: NewsletterCategory[] | null;
  createdAt?: string | null;
  publishedAt?: string | null;
}

export interface LecteurRegistrationRequest {
  email: string;
  nom: string;
  prenom: string;
}

export interface LecteurResponse {
  id: string;
  userId?: string | null;
  email?: string | null;
  nom?: string | null;
  prenom?: string | null;
  categories?: NewsletterCategory[] | null;
  createdAt?: string | null;
}

export type RedacteurRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RedacteurRequestSubmission {
  email: string;
  nom?: string;
  prenom?: string;
  password?: string;
}

export interface RedacteurRequestResponse {
  id?: string | null;
  email?: string | null;
  nom?: string | null;
  prenom?: string | null;
  status?: RedacteurRequestStatus | null;
  createdAt?: string | null;
  processedAt?: string | null;
  rejectionReason?: string | null;
}

export type RedacteurResponse = RedacteurRequestResponse;