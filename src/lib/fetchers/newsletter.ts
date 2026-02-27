// src/lib/fetchers/newsletter.ts
// Server-only newsletter service fetchers using authFetch.

import {
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
import { NewsletterRoutes } from '@/lib/server/services';
import { authFetch, authFetchData, authFetchJson } from '@/lib/server/auth-fetch';

// Helper to unwrap { data: T } envelope used by newsletter service
async function unwrap<T>(res: Response): Promise<T | null> {
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  if (json && typeof json === 'object' && 'data' in json) return json.data as T;
  return json as T;
}

export async function fetchNewsletterCategories(): Promise<NewsletterCategory[]> {
  return (await authFetchData<NewsletterCategory[]>(NewsletterRoutes.categories)) ?? [];
}

export async function createNewsletterCategory(
  payload: Pick<NewsletterCategory, 'nom' | 'description'>,
): Promise<NewsletterCategory | null> {
  return authFetchData<NewsletterCategory>(NewsletterRoutes.categories, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateNewsletterCategory(
  categoryId: string,
  payload: Pick<NewsletterCategory, 'nom' | 'description'>,
): Promise<NewsletterCategory | null> {
  if (!categoryId) return null;
  const url = new URL(`${NewsletterRoutes.categories}/${categoryId}`);
  if (payload.description) url.searchParams.set('description', payload.description);
  if (payload.nom) url.searchParams.set('nom', payload.nom);
  return authFetchData<NewsletterCategory>(url.toString(), {
    method: 'PUT',
  });
}

export async function deleteNewsletterCategory(
  categoryId: string,
): Promise<boolean> {
  if (!categoryId) return false;
  const res = await authFetch(`${NewsletterRoutes.categories}/${categoryId}`, {
    method: 'DELETE',
  });
  return res.ok;
}

export async function fetchNewslettersByStatus(
  status?: NewsletterStatus,
): Promise<NewsletterResponse[]> {
  const url = new URL(NewsletterRoutes.newsletters);
  if (status) url.searchParams.set('statut', status);
  const res = await authFetch(url.toString());
  const data = await unwrap<NewsletterResponse[]>(res);
  return Array.isArray(data) ? data : [];
}

export async function fetchNewslettersByRedacteur(
  redacteurId: string,
): Promise<NewsletterResponse[]> {
  if (!redacteurId) return [];
  const res = await authFetch(
    `${NewsletterRoutes.newsletters}/redacteur/${redacteurId}`,
  );
  const data = await unwrap<NewsletterResponse[]>(res);
  return Array.isArray(data) ? data : [];
}

export async function createNewsletter(
  redacteurId: string,
  payload: NewsletterCreateRequest,
): Promise<NewsletterResponse | null> {
  console.log('[createNewsletter] RedacteurID:', redacteurId);
  console.log('[createNewsletter] Payload:', JSON.stringify(payload));

  if (!redacteurId) return null;
  const url = new URL(NewsletterRoutes.newsletters);
  url.searchParams.set('redacteurId', redacteurId);
  
  console.log('[createNewsletter] Requesting URL:', url.toString());
  
  const res = await authFetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return unwrap<NewsletterResponse>(res);
}

export async function updateNewsletter(
  newsletterId: string,
  payload: NewsletterCreateRequest,
): Promise<NewsletterResponse | null> {
  if (!newsletterId) return null;
  const res = await authFetch(`${NewsletterRoutes.newsletters}/${newsletterId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return unwrap<NewsletterResponse>(res);
}

export async function submitNewsletter(
  newsletterId: string,
  redacteurId: string,
): Promise<NewsletterResponse | null> {
  if (!newsletterId || !redacteurId) return null;
  const url = new URL(`${NewsletterRoutes.newsletters}/${newsletterId}/submit`);
  url.searchParams.set('redacteurId', redacteurId);
  const res = await authFetch(url.toString(), { method: 'POST' });
  return unwrap<NewsletterResponse>(res);
}

export async function validateNewsletter(
  newsletterId: string,
): Promise<NewsletterResponse | null> {
  if (!newsletterId) return null;
  const res = await authFetch(
    `${NewsletterRoutes.newsletters}/${newsletterId}/validate`,
    { method: 'POST' },
  );
  return unwrap<NewsletterResponse>(res);
}

export async function rejectNewsletter(
  newsletterId: string,
): Promise<NewsletterResponse | null> {
  if (!newsletterId) return null;
  const res = await authFetch(
    `${NewsletterRoutes.newsletters}/${newsletterId}/reject`,
    { method: 'POST' },
  );
  return unwrap<NewsletterResponse>(res);
}

export async function publishNewsletter(
  newsletterId: string,
): Promise<NewsletterResponse | null> {
  if (!newsletterId) return null;
  const res = await authFetch(
    `${NewsletterRoutes.newsletters}/${newsletterId}/publish`,
    { method: 'POST' },
  );
  return unwrap<NewsletterResponse>(res);
}

export async function registerLecteur(
  payload: LecteurRegistrationRequest,
): Promise<LecteurResponse | null> {
  const res = await authFetch(NewsletterRoutes.lecteursRegister, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return unwrap<LecteurResponse>(res);
}

export async function subscribeLecteurToCategories(
  lecteurId: string,
  categorieIds: string[],
): Promise<LecteurResponse | null> {
  const res = await authFetch(
    `${NewsletterRoutes.lecteurs}/${lecteurId}/subscribe`,
    {
      method: 'POST',
      body: JSON.stringify({ categorieIds }),
    },
  );
  return unwrap<LecteurResponse>(res);
}

export async function fetchLecteurPreferences(
  lecteurId: string,
): Promise<LecteurResponse | null> {
  if (!lecteurId) return null;
  const res = await authFetch(
    `${NewsletterRoutes.lecteurs}/${lecteurId}/preferences`,
  );
  return unwrap<LecteurResponse>(res);
}

export async function updateLecteurCategories(
  lecteurId: string,
  categorieIds: string[],
): Promise<LecteurResponse | null> {
  if (!lecteurId) return null;
  const res = await authFetch(
    `${NewsletterRoutes.lecteurs}/${lecteurId}/categories`,
    {
      method: 'PUT',
      body: JSON.stringify({ categorieIds }),
    },
  );
  return unwrap<LecteurResponse>(res);
}

export async function fetchLecteurByEmail(email: string): Promise<boolean | null> {
  if (!email) return null;
  const url = new URL(NewsletterRoutes.isLecteurs);
  url.searchParams.set('email', email);

  console.log('[fetchLecteurByEmail] Requesting:', url.toString());

  const res = await authFetch(url.toString());
  
  if (!res.ok) {
    console.error('[fetchLecteurByEmail] Request failed with status:', res.status);
    return null;
  }

  const text = await res.text();
  const trimmed = text.trim().toLowerCase();
  
  if (trimmed === 'true' || trimmed === '"true"') return true;
  if (trimmed === 'false' || trimmed === '"false"') return false;

  return null;
}

// ---------------------------------------------------------------------------
// Redacteurs
// ---------------------------------------------------------------------------

export async function fetchRedacteurRequests(): Promise<RedacteurRequestResponse[]> {
  return (await authFetchData<RedacteurRequestResponse[]>(NewsletterRoutes.redacteursAdminRequests)) ?? [];
}

export async function fetchPendingRedacteurRequests(): Promise<RedacteurRequestResponse[]> {
  return (await authFetchData<RedacteurRequestResponse[]>(NewsletterRoutes.redacteursAdminPending)) ?? [];
}

export async function fetchRedacteurByEmail(email: string): Promise<RedacteurResponse | boolean | null> {
  if (!email) return null;
  const url = new URL(NewsletterRoutes.redacteursByEmail);
  url.searchParams.set('email', email);
  
  console.log('[fetchRedacteurByEmail] Requesting:', url.toString());

  // Use authFetch directly to handle non-JSON responses (like "true" boolean)
  const res = await authFetch(url.toString());
  
  console.log('[fetchRedacteurByEmail] Status:', res.status, 'Content-Type:', res.headers.get('content-type'));

  if (!res.ok) {
    console.error('[fetchRedacteurByEmail] Request failed with status:', res.status);
    return null;
  }

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      const json = await res.json();
      console.log('[fetchRedacteurByEmail] JSON Response:', JSON.stringify(json));
      if (json && typeof json === 'object' && 'data' in json) {
        return json.data as RedacteurResponse;
      }
      return json as RedacteurResponse;
    } catch (e) {
      console.error('Error parsing JSON in fetchRedacteurByEmail:', e);
      return null;
    }
  }

  // Handle plain text response (e.g., "true" or "false")
  const text = await res.text();
  console.log('[fetchRedacteurByEmail] Text Response:', text);
  
  const trimmed = text.trim().toLowerCase();
  
  // Handle various boolean string representations
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  
  // Handle quoted strings just in case
  if (trimmed === '"true"') return true;
  if (trimmed === '"false"') return false;

  return null;
}

export async function approveRedacteurRequest(requestId: string): Promise<RedacteurRequestResponse | null> {
  if (!requestId) return null;
  return authFetchData<RedacteurRequestResponse>(
    `${NewsletterRoutes.redacteursAdminRequests}/${requestId}/approve`,
    { method: 'POST', body: JSON.stringify({}) }
  );
}

export async function rejectRedacteurRequest(requestId: string, reason: string): Promise<RedacteurRequestResponse | null> {
  if (!requestId) return null;
  return authFetchData<RedacteurRequestResponse>(
    `${NewsletterRoutes.redacteursAdminRequests}/${requestId}/reject`,
    { method: 'POST', body: JSON.stringify({ reason }) }
  );
}

export async function submitRedacteurRequest(payload: RedacteurRequestSubmission): Promise<RedacteurRequestResponse | null> {
  return authFetchData<RedacteurRequestResponse>(
    NewsletterRoutes.redacteursRequest,
    { method: 'POST', body: JSON.stringify(payload) }
  );
}

export async function fetchRedacteurRequestStatus(requestId: string): Promise<RedacteurRequestResponse | null> {
  if (!requestId) return null;
  return authFetchData<RedacteurRequestResponse>(`${NewsletterRoutes.redacteursRequest}/${requestId}`);
}
