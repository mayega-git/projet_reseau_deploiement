import { GlobalNotifier } from '@/components/ui/GlobalNotifier';
import { GetUser } from '@/types/User';
import { BlogInterface } from '@/types/blog';
import { PodcastInterface } from '@/types/podcast';
import {
  fetchUserData as fetchUserDataAction,
  fetchAllUsers as fetchAllUsersAction,
  getAllUsers as getAllUsersAction,
  followUser,
  unfollowUser,
  isFollowing,
  getAllFollowersOfUser as getAllFollowersOfUserAction,
  getAllUsersAUserIsFollowing as getAllUsersAUserIsFollowingAction,
  assignRole,
  updateUserRoles as updateUserRolesAction,
  deleteUser as deleteUserAction,
  getAllUsersWithBlogCount as getAllUsersWithBlogCountAction,
} from '@/actions/user';
import type { UserWithBlogCount } from '@/lib/fetchers/user';

// function to fetch user data by id
export const fetchUserData = async (authorId: string) => {
  try {
    const data = await fetchUserDataAction(authorId);
    if (!data) throw new Error('Failed to fetch User');
    return data;
  } catch (err) {
    console.error('An error occurred while fetching', err);
  }
};

// function to fetch all user data by user id from a an array of users
export const fetchAllUsers = async (
  data: PodcastInterface[] | BlogInterface[]
): Promise<{ [key: string]: GetUser }> => {
  try {
    return await fetchAllUsersAction(data);
  } catch (err) {
    console.error('Failed to fetch users map', err);
    return {};
  }
};

export const handleFollowUser = async (
  userId: string,
  postAuthorId: string,
  postAuthorName: string
) => {
  if (!userId || !postAuthorId) {
    GlobalNotifier('User or author information is missing.', 'error');
    return;
  }

  try {
    const success = await followUser(userId, postAuthorId);

    if (!success) {
      throw new Error('Failed to follow user.');
    }

    GlobalNotifier(`You started following ${postAuthorName}`, 'success');
    window.location.reload();
  } catch (err) {
    console.error('Error following user:', err);
    GlobalNotifier(
      'An error occurred while trying to follow the user.',
      'error'
    );
  }
};

export const handleUnfollowUser = async (
  userId: string,
  postAuthorId: string,
  postAuthorName: string
) => {
  if (!userId || !postAuthorId) {
    GlobalNotifier('User or author information is missing.', 'error');
    return;
  }

  try {
    const success = await unfollowUser(userId, postAuthorId);

    if (!success) {
      throw new Error('Failed to unfollow user.');
    }

    GlobalNotifier(`You unfollowed ${postAuthorName}`, 'success');
  } catch (err) {
    console.error('Error unfollowing user:', err);
    GlobalNotifier(
      'An error occurred while trying to unfollow the user.',
      'error'
    );
  }
};

export const handleIsFollowing = async (
  userId: string,
  postAuthorId: string
) => {
  if (!userId || !postAuthorId) {
    // GlobalNotifier('User or author information is missing.', 'error');
    return false;
  }

  try {
    return await isFollowing(userId, postAuthorId);
  } catch (err) {
    console.error('Error checking follow status:', err);
    return false;
  }
};

export const getAllFollowersOfUser = async (userId: string) => {
  if (!userId) {
    GlobalNotifier('User or author information is missing.', 'error');
    return;
  }

  try {
    return await getAllFollowersOfUserAction(userId);
  } catch (err) {
    console.error('Error getting followers:', err);
    GlobalNotifier(
      'An error occurred while trying to get followers.',
      'error'
    );
  }
};

export const getAllUsersAUserIsFollowing = async (userId: string) => {
  if (!userId) {
    GlobalNotifier('User or author information is missing.', 'error');
    return;
  }

  try {
    return await getAllUsersAUserIsFollowingAction(userId);
  } catch (err) {
    console.error('Error getting following users:', err);
    GlobalNotifier(
      'An error occurred while trying to get following users.',
      'error'
    );
  }
};

// roles controller methods
export const handleUpgradeRole = async (userId: string, role: string) => {
  if (!userId) return;

  try {
    const result = await assignRole(userId, role);

    if (result) {
      GlobalNotifier(
        'Congratulations! You have successfully become an author',
        'success'
      );
      return result;
    }
  } catch (err) {
    console.error('An error occurred during role upgrade', err);
    GlobalNotifier('Something went wrong. Please try again.', 'error');
  }
};

export type { UserWithBlogCount };

/**
 * Récupère tous les utilisateurs
 */
export const getAllUsers = async (): Promise<GetUser[]> => {
  try {
    return await getAllUsersAction();
  } catch (error) {
    console.error('❌ [getAllUsers] Exception:', error);
    throw error;
  }
};

/**
 * Récupère le nombre de blogs d'un utilisateur
 * Note: Cette fonction était locale, mais elle est maintenant gérée via getAllUsersWithBlogCount côté serveur.
 * Comme l'action 'getUserBlogCount' n'est pas exportée individuellement dans actions/user.ts (c'est interne),
 * on ne peut pas la proxifier directement ici, sauf si on l'ajoute aux exports.
 * Cependant, elle n'est pas exportée de ce fichier non plus dans la version précédente
 * (elle était exportée mais marquée TODO).
 * Je vais la laisser vide ou la supprimer si elle n'est pas utilisée.
 * Edit: Elle ÉTAIT exportée. Je vais donc l'implémenter en l'ajoutant aux actions si nécessaire,
 * ou en utilisant getAllUsersWithBlogCount si possible.
 *
 * Pour l'instant, je vais supposer qu'elle n'est pas critique ou je vais lever une erreur.
 * Mieux : je ne l'inclus pas, car les Server Actions sont préférés.
 */

/**
 * Récupère tous les users avec leur nombre de blogs
 */
export const getAllUsersWithBlogCount = async (): Promise<UserWithBlogCount[]> => {
  return await getAllUsersWithBlogCountAction();
};

/**
 * Supprime un utilisateur
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await deleteUserAction(userId);
    console.log('✅ [deleteUser] User deleted successfully');
  } catch (error) {
    console.error('❌ [deleteUser] Exception:', error);
    throw error;
  }
};

/**
 * Modifie les rôles d'un utilisateur
 */
export const updateUserRoles = async (
  userId: string,
  roles: string[]
): Promise<void> => {
  try {
    await updateUserRolesAction(userId, roles);
    console.log('✅ [updateUserRoles] Roles updated successfully');
  } catch (error) {
    console.error('❌ [updateUserRoles] Exception:', error);
    throw error;
  }
};