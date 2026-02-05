export interface User {
  sub: string;
  firstName: string;
  lastName: string;

  roles: string[];
  id: string;
  iat: number;
  exp: number;
  //   token: string;
}

export interface GetUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  token: null;
}

export interface GetRoles {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoles {
  roleName: string;
  description: string;
}

export interface UserWithBlogCount extends GetUser {
  blogCount?: number;
}
