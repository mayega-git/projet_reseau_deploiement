// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useGlobalState } from '@/context/GlobalStateContext';

export const BASE_URL_USER_API = process.env.NEXT_PUBLIC_USER_API;
export const BASE_URL_EDUCATION_API = process.env.NEXT_PUBLIC_EDUCATION_API;
export const BASE_URL_REWIEW_API = process.env.NEXT_PUBLIC_REVIEW_API;
export const BASE_URL_ORGANISATION_API =
  process.env.NEXT_PUBLIC_ORGANISATION_API;
export const BASE_URL_NEWSLETTER_API =
  process.env.NEXT_PUBLIC_NEWSLETTER_API;

export const UserServiceRoutes = {
  login: `${BASE_URL_USER_API}/api/users/login`,
  create: `${BASE_URL_USER_API}/api/users`,
  update: `${BASE_URL_USER_API}/api/users/update`,
  base: `${BASE_URL_USER_API}/api/users`,
  logout: `${BASE_URL_USER_API}/api/users/logout`,
  follow: `${BASE_URL_USER_API}/api/connections/follow`,
  isFollowing: `${BASE_URL_USER_API}/api/connections/isFollowing`,
  allFollowing: `${BASE_URL_USER_API}/api/connections/following`,
  allFollowers: `${BASE_URL_USER_API}/api/connections/followers`,
  unfollow: `${BASE_URL_USER_API}/api/connections/unfollow`,
  role: `${BASE_URL_USER_API}/api/roles`,
};

export const EducationServiceRoutes = {
  tags: `${BASE_URL_EDUCATION_API}/tags`,
  category: `${BASE_URL_EDUCATION_API}/categories`,
  blogs: `${BASE_URL_EDUCATION_API}/blogs`,
  podcasts: `${BASE_URL_EDUCATION_API}/podcasts`,
  favoritess: `${BASE_URL_EDUCATION_API}/favorites`,
};

export const ReviewServiceRoutes = {
  ratings: `${BASE_URL_REWIEW_API}/ratings`,
  comments: `${BASE_URL_REWIEW_API}/comments`,
  commentReply: `${BASE_URL_REWIEW_API}/comment_replies`,
  entityStats: `${BASE_URL_REWIEW_API}/entity/stats`,
};

export const OrganisationServiceRoutes = {
  organisation: `${BASE_URL_ORGANISATION_API}/v1/organisation`,
  employee: `${BASE_URL_ORGANISATION_API}/v1/employee`,
};

export const NewsletterServiceRoutes = {
  categories: `${BASE_URL_NEWSLETTER_API}/categorie`,
  lecteurs: `${BASE_URL_NEWSLETTER_API}/lecteurs`,
  lecteursRegister: `${BASE_URL_NEWSLETTER_API}/lecteurs/register`,
  newsletters: `${BASE_URL_NEWSLETTER_API}/newsletters/newsletters`,
  adminRedacteurs: `${BASE_URL_NEWSLETTER_API}/admin/redacteurs`,
  redacteursRequest: `${BASE_URL_NEWSLETTER_API}/admin/redacteurs`,



};
