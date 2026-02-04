// src/lib/fetchers/organisation.ts
// Server-only organisation service fetchers using authFetch.

import { GetOrganisation } from '@/types/organisation';
import { OrganisationRoutes } from '@/lib/server/services';
import { authFetch, authFetchJson } from '@/lib/server/auth-fetch';

export async function fetchAllOrganisations(): Promise<GetOrganisation[]> {
  return (
    (await authFetchJson<GetOrganisation[]>(OrganisationRoutes.organisation)) ?? []
  );
}

export async function createOrganisation(data: Record<string, unknown>): Promise<unknown> {
  const res = await authFetch(`${OrganisationRoutes.organisation}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? 'Failed to create organisation');
  }
  return res.json();
}
