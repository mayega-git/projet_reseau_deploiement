//responnse backend
export interface TagInterface {
  id: string;
  name: string;
  description: string;
  domain: string;
  createdAt: string; // localDateTime
  updatedAt: string; // localDateTime
}

export interface CreateTagInterface {
  name: string;
  description: string;
  domain: string;
}
