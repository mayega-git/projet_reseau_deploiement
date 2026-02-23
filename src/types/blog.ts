//server response DTO
export interface BlogInterface {
  id: string;
  authorId: string; // UUIDs are represented as strings in TypeScript
  organisationId: string | null;
  title: string;
  coverImage: string;
  description: string;
  content: string;
  status: string;
  audioUrl?: string; //optional
  audioLength?: number; //backend //optional
  createdAt: string;
  publishedAt: string;
  domain: string;
  contentType: string;
  readingTime: number;
  tags: string[]; // id of tags
  category: string[]; //id of category
  id_ressource?: string; // resource ID for audio/image
}

//frontend request body for creation
export interface CreateBlogInterface {
  coverImage: string; //.png, .jpg
  authorId: string; // UUIDs are represented as strings i
  // n TypeScript
  organisationId?: string; // UUIDs are represented as strings in Type
  title: string;
  description: string;
  content: string;
  publishedAt?: string;
  domain: string;
  audioUrl?: string; //send the mp3/wav audio url //optional
  readingTime: number; //frontend
  tags: string[]; // id of tags
  categories: string[]; // id of category
}


export interface CreateCourseInterface extends CreateBlogInterface {
  formateur : string;
  nombreHeures : string;
  niveau : string;
  
}