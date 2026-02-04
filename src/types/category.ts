//responnse backend
export interface CategoryInterface {
  id: string;
  name: string;
  description: string;
  domain: string;
  createdAt: string; // localDateTime
  updatedAt: string; // localDateTime
}

export interface CreateCategoryInterface {
  name: string;
  description: string;
  domain: string;
}
