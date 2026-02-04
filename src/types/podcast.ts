export interface PodcastInterface {
  id: string; //UUID
  coverImage: string; //.png, .jpg
  authorId: string; // UUIDs are represented as strings in TypeScript
  organisationId: string | null;
  title: string;
  status: string;
  description: string;
  audioUrl: string; //required
  audioLength: number; //required
  createdAt: string; //localdatetime as ISO string
  publishedAt: string; //localdatetime as ISO string;
  tags: string[];
  domain: string;
  contentType: string;
  categories: string [];
}

export interface CreatePodcastInterface {
  coverImage: string; //.png, .jpg
  authorId: string; // UUIDs are represented as strings in TypeScript
  title: string;
  organisationId?: string;
  description: string;
  audioUrl: string; // e.g .mp3 //required
  tags: string[];
  categories: string [];
  domain: string;
}

// no content and readingTime in Podcast
