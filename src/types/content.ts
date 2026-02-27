// Types de contenu supportés 
export type ContentType = 'blog' | 'podcast' | 'cours';

// Interface de base commune à blog, podcast, cours
// + les champs optionnels spécifiques
export interface ContentItem {
  id: string;
  authorId: string;
  organisationId: string | null;
  title: string;
  coverImage: string;
  description: string;
  status: string;
  createdAt: string;
  publishedAt: string;
  domain: string;
  contentType: string;
  tags: string[];
  id_ressource?: string;
  // Champs optionnels spécifiques à certains types
  content?: string;           // blog, cours
  readingTime?: number;       // blog, cours
  audioUrl?: string;          // podcast, blog (optionnel)
  audioLength?: number;       // podcast
  category?: string[];        // blog (ancien nom)
  categories?: string[];      // podcast, cours
  level?: string;             // cours
  duration?: string;          // cours
}
