import {
  fetchNewsletterCategories as fetchNewsletterCategoriesAction,
  createNewsletterCategory as createNewsletterCategoryAction,
  updateNewsletterCategory as updateNewsletterCategoryAction,
  deleteNewsletterCategory as deleteNewsletterCategoryAction,
  fetchNewslettersByStatus as fetchNewslettersByStatusAction,
  fetchNewslettersByRedacteur as fetchNewslettersByRedacteurAction,
  createNewsletter as createNewsletterAction,
  updateNewsletter as updateNewsletterAction,
  submitNewsletter as submitNewsletterAction,
  validateNewsletter as validateNewsletterAction,
  rejectNewsletter as rejectNewsletterAction,
  publishNewsletter as publishNewsletterAction,
  registerLecteur as registerLecteurAction,
  subscribeLecteurToCategories as subscribeLecteurToCategoriesAction,
  fetchLecteurPreferences as fetchLecteurPreferencesAction,
  updateLecteurCategories as updateLecteurCategoriesAction,
  fetchRedacteurRequests as fetchRedacteurRequestsAction,
  fetchRedacteurByEmail as fetchRedacteurByEmailAction,
  approveRedacteurRequest as approveRedacteurRequestAction,
  rejectRedacteurRequest as rejectRedacteurRequestAction,
  submitRedacteurRequest as submitRedacteurRequestAction,
  fetchRedacteurRequestStatus as fetchRedacteurRequestStatusAction,
} from '@/actions/newsletter';
import type {
  LecteurRegistrationRequest,
  LecteurResponse,
  NewsletterCategory,
  NewsletterCreateRequest,
  NewsletterResponse,
  NewsletterStatus,
  RedacteurRequestResponse,
  RedacteurRequestSubmission,
  RedacteurResponse,
} from '@/types/newsletter';

/**
 * Categories
 */

export const fetchNewsletterCategories = async (): Promise<NewsletterCategory[]> => {
  return fetchNewsletterCategoriesAction();
};

export const createNewsletterCategory = async (
  payload: Pick<NewsletterCategory, 'nom' | 'description'>
): Promise<NewsletterCategory | null> => {
  return createNewsletterCategoryAction(payload);
};

export const updateNewsletterCategory = async (
  categoryId: string,
  payload: Pick<NewsletterCategory, 'nom' | 'description'>
): Promise<NewsletterCategory | null> => {
  return updateNewsletterCategoryAction(categoryId, payload);
};

export const deleteNewsletterCategory = async (categoryId: string): Promise<boolean> => {
  return deleteNewsletterCategoryAction(categoryId);
};

/**
 * Newsletters
 */

export const fetchNewslettersByStatus = async (
  status?: NewsletterStatus
): Promise<NewsletterResponse[]> => {
  return fetchNewslettersByStatusAction(status);
};

export const fetchNewslettersByRedacteur = async (
  redacteurId: string
): Promise<NewsletterResponse[]> => {
  return fetchNewslettersByRedacteurAction(redacteurId);
};

export const createNewsletter = async (
  redacteurId: string,
  payload: NewsletterCreateRequest
): Promise<NewsletterResponse | null> => {
  return createNewsletterAction(redacteurId, payload);
};

export const updateNewsletter = async (
  newsletterId: string,
  payload: NewsletterCreateRequest
): Promise<NewsletterResponse | null> => {
  return updateNewsletterAction(newsletterId, payload);
};

export const submitNewsletter = async (
  newsletterId: string,
  redacteurId: string
): Promise<NewsletterResponse | null> => {
  return submitNewsletterAction(newsletterId, redacteurId);
};

export const validateNewsletter = async (
  newsletterId: string
): Promise<NewsletterResponse | null> => {
  return validateNewsletterAction(newsletterId);
};

export const rejectNewsletter = async (
  newsletterId: string
): Promise<NewsletterResponse | null> => {
  return rejectNewsletterAction(newsletterId);
};

export const publishNewsletter = async (
  newsletterId: string
): Promise<NewsletterResponse | null> => {
  return publishNewsletterAction(newsletterId);
};

/**
 * Lecteurs
 */

export const registerLecteur = async (
  payload: LecteurRegistrationRequest
): Promise<LecteurResponse | null> => {
  return registerLecteurAction(payload);
};

export const subscribeLecteurToCategories = async (
  lecteurId: string,
  categorieIds: string[]
): Promise<LecteurResponse | null> => {
  return subscribeLecteurToCategoriesAction(lecteurId, categorieIds);
};

export const fetchLecteurPreferences = async (
  lecteurId: string
): Promise<LecteurResponse | null> => {
  return fetchLecteurPreferencesAction(lecteurId);
};

export const updateLecteurCategories = async (
  lecteurId: string,
  categorieIds: string[]
): Promise<LecteurResponse | null> => {
  return updateLecteurCategoriesAction(lecteurId, categorieIds);
};

/**
 * Redacteurs
 */

export const fetchRedacteurRequests = async (): Promise<RedacteurRequestResponse[]> => {
  return fetchRedacteurRequestsAction();
};

export const fetchRedacteurByEmail = async (email: string): Promise<RedacteurResponse | boolean | null> => {
  return fetchRedacteurByEmailAction(email);
};

export const approveRedacteurRequest = async (
  requestId: string
): Promise<RedacteurRequestResponse | null> => {
  return approveRedacteurRequestAction(requestId);
};

export const rejectRedacteurRequest = async (
  requestId: string,
  reason: string
): Promise<RedacteurRequestResponse | null> => {
  return rejectRedacteurRequestAction(requestId, reason);
};

export const submitRedacteurRequest = async (
  payload: RedacteurRequestSubmission
): Promise<RedacteurRequestResponse | null> => {
  return submitRedacteurRequestAction(payload);
};

export const fetchRedacteurRequestStatus = async (
  requestId: string
): Promise<RedacteurRequestResponse | null> => {
  return fetchRedacteurRequestStatusAction(requestId);
};