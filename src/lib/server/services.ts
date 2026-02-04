// src/lib/server/services.ts
// Centralized server-only service URLs — never exposed to the browser.
// At build/runtime these come from non-NEXT_PUBLIC_ env vars so they stay
// on the server.  We fall back to the legacy NEXT_PUBLIC_ vars during the
// migration period so existing .env files keep working.

export const ServiceURLs = {
  education: process.env.NEXT_PUBLIC_EDUCATION_URL ?? '',
  user:  process.env.NEXT_PUBLIC_USER_URL ?? '',
  review:  process.env.NEXT_PUBLIC_REVIEW_URL ?? '',
  organisation: process.env.NEXT_PUBLIC_ORGANISATION_URL ?? '',
  newsletter: process.env.NEXT_PUBLIC_NEWSLETTER_URL ?? '',
  forum: process.env.NEXT_PUBLIC_FORUM_URL ?? '',
  gateway: process.env.NEXT_PUBLIC_GATEWAY_URL ?? '',
};

// Convenience route builders — mirrors the old api.ts but with server-only URLs
export const UserRoutes = {
  login: `${ServiceURLs.user}/api/users/login`,
  create: `${ServiceURLs.user}/api/users`,
  update: `${ServiceURLs.user}/api/users/update`,
  base: `${ServiceURLs.user}/api/users`,
  logout: `${ServiceURLs.user}/api/users/logout`,
  follow: `${ServiceURLs.user}/api/connections/follow`,
  isFollowing: `${ServiceURLs.user}/api/connections/isFollowing`,
  allFollowing: `${ServiceURLs.user}/api/connections/following`,
  allFollowers: `${ServiceURLs.user}/api/connections/followers`,
  unfollow: `${ServiceURLs.user}/api/connections/unfollow`,
  role: `${ServiceURLs.user}/api/roles`,
};

export const EducationRoutes = {
  tags: `${ServiceURLs.education}/tags`,
  category: `${ServiceURLs.education}/categories`,
  blogs: `${ServiceURLs.education}/blogs`,
  podcasts: `${ServiceURLs.education}/podcasts`,
  favorites: `${ServiceURLs.education}/favorites`,
};

export const ReviewRoutes = {
  ratings: `${ServiceURLs.review}`,
  comments: `${ServiceURLs.review}/comments`,
  commentReply: `${ServiceURLs.review}/comment_replies`,
  entityStats: `${ServiceURLs.review}/entity/stats`,
};

export const OrganisationRoutes = {
  organisation: `${ServiceURLs.organisation}/v1/organisation`,
  employee: `${ServiceURLs.organisation}/v1/employee`,
};

export const NewsletterRoutes = {
  categories: `${ServiceURLs.newsletter}/categorie`,
  lecteurs: `${ServiceURLs.newsletter}/lecteurs`,
  lecteursRegister: `${ServiceURLs.newsletter}/lecteurs/register`,
  newsletters: `${ServiceURLs.newsletter}/newsletters/newsletters`,
  redacteursRequest: `${ServiceURLs.newsletter}/redacteurs/request`,
  redacteursAdminRequests: `${ServiceURLs.newsletter}/admin/redacteurs/requests`,
  redacteurs: `${ServiceURLs.newsletter}/redacteurs`,
  redacteursByEmail: `${ServiceURLs.newsletter}/redacteurs/email`,

};

export const ForumRoutes = {
  base: `${ServiceURLs.forum}`,
  categorie : `${ServiceURLs.forum}/categories`,
  posts : `${ServiceURLs.forum}/posts`,
  comments : `${ServiceURLs.forum}/commentaires`,
};

