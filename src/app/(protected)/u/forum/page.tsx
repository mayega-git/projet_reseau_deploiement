'use client';

import { useState, useEffect } from 'react';
//import { MOCK_USER } from '@/app/forum-app/lib/constants';
import { getValidatedGroups, getAllGroups } from '@/actions/forum';
import { User } from '@/types/User';
import type { DiscussionGroup, Post } from '@/types/forum';
import GroupsList from '@/components/Forum/GroupList';
import GroupDetail from '@/components/Forum/GroupDetail';
import PostDetail from '@/components/Forum/PostDetail';
import AdminView from '@/components/Forum/AdminView';
import LoadingSpinner from '@/components/Forum/LoadingSpinner';
import ErrorMessage from '@/components/Forum/ErrorMessage';
//import {Header} from '@/components/Header/Header2'
import HeaderWrapper from '@/components/Header/HeaderWrapper';
import { useAuth } from '@/context/AuthContext';
import { AppRoles } from '@/constants/roles';

type View = 'groups' | 'group-detail' | 'post-detail' | 'admin';

export default function HomePage() {
  const [view, setView] = useState<View>('groups');
  const [groups, setGroups] = useState<DiscussionGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<DiscussionGroup | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, role } = useAuth();
  const isAdmin = role?.includes(AppRoles.ADMIN) || role?.includes(AppRoles.SUPER_ADMIN);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getValidatedGroups();
      setGroups(data);
    } catch (err) {
      setError('Erreur lors du chargement des forums');
    } finally {
      setLoading(false);
    }
  };

  const loadAdminGroups = async () => {
    if (!isAdmin) {
      setError("Accès refusé : Droits insuffisants");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getAllGroups();
      setGroups(data);
      setView('admin');
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleGroupClick = (group: DiscussionGroup) => {
    setSelectedGroup(group);
    setView('group-detail');
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setView('post-detail');
  };

  const handleBackToGroups = () => {
    setView('groups');
    setSelectedGroup(null);
    setSelectedPost(null);
    loadGroups();
  };

  const handleBackToGroup = () => {
    setView('group-detail');
    setSelectedPost(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
      {/* Search and context could go here if needed, but SideBarHeader already has a search bar */}

      {/* Forum Title and Back button (local navigation) */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1
            className="h3-bold text-black-500 cursor-pointer"
            onClick={handleBackToGroups}
          >
            Forum Community
          </h1>
          {view !== 'groups' && view !== 'admin' && (
            <button
              onClick={handleBackToGroups}
              className="text-primary-purple-500 hover:text-primary-purple-600 flex items-center gap-1 paragraph-medium-medium transition-colors"
            >
              ← Retour
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <button
              onClick={loadAdminGroups}
              className="px-4 py-2 bg-black-500 text-white rounded-lg hover:bg-black-400 transition-colors paragraph-medium-medium"
            >
              Administration
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {error && <ErrorMessage message={error} />}

        {loading && view === 'groups' ? (
          <LoadingSpinner />
        ) : view === 'groups' ? (
          <GroupsList
            initialGroups={groups}
            onGroupClick={handleGroupClick}
            onGroupsUpdate={loadGroups}
          />
        ) : view === 'admin' ? (
          <AdminView
            groups={groups}
            onBack={handleBackToGroups}
            onUpdate={loadAdminGroups}
          />
        ) : view === 'group-detail' && selectedGroup ? (
          <GroupDetail
            group={selectedGroup}
            onPostClick={handlePostClick}
            onBack={handleBackToGroups}
          />
        ) : view === 'post-detail' && selectedPost ? (
          <PostDetail
            post={selectedPost}
            onBack={handleBackToGroup}
          />
        ) : null}
      </div>
    </div>
  );
}