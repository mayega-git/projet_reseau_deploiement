import { ContentType } from '@/types/content';
import {
  fetchBlogImage,
  fetchPodcastImage,
} from '@/actions/blog';

// Configuration centralisée pour chaque type de contenu.
// Pour ajouter un futur type (ex: "tutoriel"), il suffit d'ajouter une entrée ici
// et dans le type union ContentType.

export interface ContentTypeConfig {
  type: ContentType;
  label: string;                  // "Blog", "Podcast", "Cours"
  entityType: string;             // "BLOG", "PODCAST", "COURS"
  routePrefix: string;            // "/blog", "/podcast", "/cours"
  updateRoute: string;            // "/u/update/blog", etc.
  defaultFallbackImage: string;   // image par défaut
  hasDuration: boolean;           // afficher audioLength ?
  hasReadingTime: boolean;        // afficher readingTime ?
  hasContent: boolean;            // contenu texte riche (Draft.js) ?
  emptyMessage: string;           // message quand pas de données
  deleteLabel: string;            // "Delete blog", "Delete podcast", etc.
  // Référence vers le fetcher d'image existant
  fetchImage: (itemId: string) => Promise<Record<string, number[]>>;
}

export const contentConfigs: Record<ContentType, ContentTypeConfig> = {
  blog: {
    type: 'blog',
    label: 'Blog',
    entityType: 'BLOG',
    routePrefix: '/blog',
    updateRoute: '/u/update/blog',
    defaultFallbackImage: '/Gemini_Blog_Default_Cover.png',
    hasDuration: false,
    hasReadingTime: true,
    hasContent: true,
    emptyMessage: 'No blog posts available.',
    deleteLabel: 'Delete blog',
    fetchImage: fetchBlogImage,
  },
  podcast: {
    type: 'podcast',
    label: 'Podcast',
    entityType: 'PODCAST',
    routePrefix: '/podcast',
    updateRoute: '/u/update/podcast',
    defaultFallbackImage: '/Gemini_Blog_Default_Cover.png',
    hasDuration: true,
    hasReadingTime: false,
    hasContent: false,
    emptyMessage: 'No podcasts available.',
    deleteLabel: 'Delete podcast',
    fetchImage: fetchPodcastImage,
  },
  cours: {
    type: 'cours',
    label: 'Cours',
    entityType: 'COURS',
    routePrefix: '/cours',
    updateRoute: '/u/update/cours',
    defaultFallbackImage: '/Gemini_Blog_Default_Cover.png',
    hasDuration: false,
    hasReadingTime: true,
    hasContent: true,
    emptyMessage: 'No courses available.',
    deleteLabel: 'Delete cours',
    // Placeholder — à remplacer quand le fetcher cours sera disponible
    fetchImage: fetchBlogImage,
  },
};

// Helper pour obtenir la config à partir du type
export function getContentConfig(type: ContentType): ContentTypeConfig {
  return contentConfigs[type];
}
