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
  bio?: string;
}

export interface GetRoles {
  id: string; // UUID of the role
  name: string; // Name of the role (e.g., 'SUPER_ADMIN')
}

export interface UserOrganisation {
  id: string;
  name?: string; // or firstName depending on what the backend uses for the org name
  firstName?: string;
  domain?: string;
  bio?: string;
  email?: string;
}

export interface CreateRoles {
  roleName: string;
  description: string;
}

export interface UserWithBlogCount extends GetUser {
  blogCount?: number;
}
