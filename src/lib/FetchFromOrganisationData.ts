import { GetOrganisation } from '@/types/organisation';
import { fetchAllOrganisations as fetchAllOrganisationsAction } from '@/actions/organisation';

export const fetchAllOrganisations = async (): Promise<GetOrganisation[]> => {
  try {
    return await fetchAllOrganisationsAction();
  } catch (error) {
    console.error('Failed to fetch organisations', error);
    return [];
  }
};
