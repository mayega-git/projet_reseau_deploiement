export interface Category {
  categoryId?: string;      // Frontend property
  categorieId?: string;     // Backend property
  categorieName: string;
  description?: string;
}

export interface DiscussionGroup {
  groupId: string;
  name: string;
  description: string;
  status: 'PENDING' | 'VALIDATED';
  createdAt?: string;       // Frontend property
  creationDate?: string;    // Backend property
}

export interface Post {
  postId: string;
  title: string;
  content: string;
  groupId: string;
  categoryId?: string;
  authorId: string;
  authorName?: string;
  likes?: number;  // Frontend property
  dislikes?: number;  // Frontend property
  numberOfLikes?: number;  // Backend property
  numberOfDislikes?: number;  // Backend property
  commentCount: number;
  createdAt?: string;  // Frontend property
  creationDate?: string;  // Backend property
  modificationDate?: string;
  suppressionDate?: string;
  categoriesIds?: string[];
  postLikes?: string[];      // IDs des utilisateurs qui ont liké
  postDislikes?: string[];   // IDs des utilisateurs qui ont disliké
}

export interface Comment {
  commentaireId: string;
  postId: string;
  parentCommentId?: string;
  parentId?: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt?: string;       // Frontend property
  creationDate?: string;    // Backend property
  replies?: Comment[];
}