'use client';

import { useState, useEffect, useMemo } from 'react';
//import { isUUID } from 'validator';
import { Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PostCard from './PostCard';


import type { DiscussionGroup, Category, Post } from '@/types/forum';


import LoadingSpinner from './LoadingSpinner';

import { api } from '@/lib/FetchFromForum';
//import { API_BASE_URL } from "@/types/constants";

import { User, GetUser, GetRoles } from '@/types/User';

const API_BASE_URL = process.env.NEXT_PUBLIC_FORUM_URL

interface GroupDetailProps {
  group: DiscussionGroup;
  onPostClick: (post: Post) => void;
  onBack: () => void;
}

export default function GroupDetail({ group, onPostClick, onBack }: GroupDetailProps) {
  const groupId = useMemo(() => group?.groupId ?? group?.groupId, [group]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, token } = useAuth();

  // Update API token when it changes
  useEffect(() => {
    if (token) {
      api.setToken(token);
    }
  }, [token]);

  useEffect(() => {
    if (!groupId) return;
    loadData();
  }, [groupId]);

  const loadData = async () => {
    if (!groupId) return;

    setLoading(true);
    setError(null);
    try {
      const [categoriesData, postsData] = await Promise.all([
        api.getCategoriesByGroup(groupId),
        api.getPostsByGroup(groupId)
      ]);
      setCategories(categoriesData ?? []);
      setPosts(postsData ?? []);
    } catch (e) {
      console.error(e);
      setError('Erreur lors du chargement du forum');
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (post: Post) => {
    onPostClick(post);
    // Recharger les posts quand l'utilisateur revient
  };
  const handleLike = async (postId: string) => {
    if (!user?.id) return;
    try {
      const updatedPost = await api.likePost(postId, user.id);
      setPosts(prev => prev.map(p => {
        if (p.postId === postId) {
          // Preserve commentCount if updatedPost has it as 0
          const commentCount = updatedPost.commentCount || p.commentCount;
          return { ...updatedPost, commentCount };
        }
        return p;
      }));
    } catch (err) {
      console.error('Like error:', err);
      setError('Erreur lors du like');
    }
  };

  const handleDislike = async (postId: string) => {
    if (!user?.id) return;
    try {
      const updatedPost = await api.dislikePost(postId, user.id);
      setPosts(prev => prev.map(p => {
        if (p.postId === postId) {
          // Preserve commentCount if updatedPost has it as 0
          const commentCount = updatedPost.commentCount || p.commentCount;
          return { ...updatedPost, commentCount };
        }
        return p;
      }));
    } catch (err) {
      console.error('Dislike error:', err);
      setError('Erreur lors du dislike');
    }
  };

  // Utiliser useEffect pour recharger quand on revient à cette vue
  useEffect(() => {
    loadData();
  }, [groupId]);

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget; // ✅ sauvegarde AVANT await
    if (!groupId) return;

    setError(null);

    const formData = new FormData(form);
    const name = (formData.get('name')?.toString() || '').trim();

    if (!name) {
      setError("Le nom de la catégorie est obligatoire");
      return;
    }

    try {
      await api.createCategory(groupId, name);

      form.reset(); // ✅ plus d'erreur
      setShowCategoryForm(false);

      const updatedCategories = await api.getCategoriesByGroup(groupId);
      setCategories(updatedCategories);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de la catégorie");
    }
  };



  console.log("memberId :", user?.id);

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!groupId) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = formData.get("title")?.toString().trim();
    const content = formData.get("content")?.toString().trim();
    const categoryId = formData.get("categoryId")?.toString().trim();

    if (!title || !content) {
      setError("Titre ou contenu manquant");
      return;
    }

    if (!categoryId) {
      setError("Veuillez sélectionner une catégorie");
      return;
    }

    try {
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      await api.createPost(
        groupId,
        title,
        content,
        user.id,
        categoryId
      );

      form.reset();
      setShowPostForm(false);
      loadData();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur lors de la création du post");
    }
  };


  if (!groupId) return <div className="text-gray-700">Forum non sélectionné</div>;
  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-grey-100 rounded-full transition-colors text-black-300"
          title="Retour aux forums"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <h2 className="h2-bold text-black-500">{group.name}</h2>
          <p className="paragraph-medium-normal text-black-300">{group.description}</p>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">{error}</div>}

      {/* Categories */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="h5-bold text-black-500">Catégories</h3>
          <button
            onClick={() => setShowCategoryForm(v => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-grey-100 hover:bg-grey-200 rounded-lg text-sm font-medium transition-colors text-black-500"
          >
            <Plus className="w-4 h-4" />
            Nouvelle catégorie
          </button>
        </div>

        {showCategoryForm && (
          <form onSubmit={handleCreateCategory} className="bg-grey-50 border border-grey-200 p-6 mb-6 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <input
              name="name"
              required
              placeholder="Nom de la catégorie"
              className="custom-input mb-4"
            />
            <div className="flex gap-3">
              <button className="px-6 py-2 bg-secondaryOrange-500 text-white rounded-lg hover:bg-secondaryOrange-600 transition-colors font-medium">Créer</button>
              <button type="button" onClick={() => setShowCategoryForm(false)} className="px-6 py-2 bg-white border border-grey-300 text-black-500 rounded-lg hover:bg-grey-50 transition-colors">Annuler</button>
            </div>
          </form>
        )}

        <div className="flex flex-wrap gap-2">
          {categories.map((cat, i) => (
            <span key={cat.categoryId ?? i} className="px-4 py-1.5 bg-secondaryOrange-50 text-secondaryOrange-600 rounded-full text-sm font-medium border border-secondaryOrange-100">
              {cat.categorieName}
            </span>
          ))}
        </div>
      </section>

      {/* Posts */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="h5-bold text-black-500">Discussions</h3>
          <button
            onClick={() => setShowPostForm(v => !v)}
            className="flex items-center gap-2 bg-secondaryOrange-500 text-white px-6 py-2.5 rounded-lg hover:bg-secondaryOrange-600 transition-all shadow-sm hover:shadow-md font-medium "
          >
            <Plus className="w-5 h-5 text-white" />
            Commencer une discussion
          </button>
        </div>

        {showPostForm && (
          <form onSubmit={handleCreatePost} className="bg-grey-50 border border-grey-200 p-8 mb-8 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="mb-4">
              <label className="form-label mb-2 block text-black-500">Titre de la discussion</label>
              <input name="title" required placeholder="De quoi souhaitez-vous discuter ?" className="custom-input" />
            </div>

            <div className="mb-4">
              <label className="form-label mb-2 block text-black-500">Message</label>
              <textarea name="content" required rows={6} placeholder="Écrivez votre message ici..." className="custom-input h-auto py-3 min-h-[150px]" />
            </div>

            <div className="mb-6">
              <label className="form-label mb-2 block text-black-500">Catégorie</label>
              <select
                name="categoryId"
                required
                className="custom-input appearance-none bg-white font-inter"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat, i) => {
                  const catId = cat.categorieId || cat.categoryId;
                  return (
                    <option key={catId ?? i} value={catId}>
                      {cat.categorieName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex gap-4">
              <button className="px-8 py-2.5 bg-secondaryOrange-500 text-white rounded-lg hover:bg-secondaryOrange-600 transition-colors font-semibold shadow-sm">Publier</button>
              <button type="button" onClick={() => setShowPostForm(false)} className="px-8 py-2.5 bg-white border border-grey-300 text-black-500 rounded-lg hover:bg-grey-50 transition-colors font-medium">Annuler</button>
            </div>
          </form>
        )}

        <div className="grid gap-4">
          {posts.map((post, i) => (
            <PostCard
              key={post.postId ?? i}
              post={post}
              onClick={() => onPostClick(post)}
              onLike={handleLike}
              onDislike={handleDislike}
            />
          ))}
          {posts.length === 0 && (
            <div className="text-center py-12 bg-grey-50 rounded-xl border border-dashed border-grey-300">
              <p className="text-black-300 paragraph-medium-normal">Aucune discussion pour le moment. Soyez le premier à contribuer !</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}