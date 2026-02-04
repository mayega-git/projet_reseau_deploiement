'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Edit2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CommentTree from './CommentTree';
import LoadingSpinner from './LoadingSpinner';
import type { Post, Comment } from '@/types/forum';
import { getCommentsByPost, likePost, dislikePost, createForumComment, updateForumComment, deleteForumComment } from '@/actions/forum';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
}

export default function PostDetail({ post: initialPost, onBack }: PostDetailProps) {

  const [post, setPost] = useState<Post | null>(initialPost ?? null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (post?.postId) {
      loadComments();
    }
  }, [post?.postId]);

  useEffect(() => {
    if (initialPost) {
      setPost(initialPost);
    }
  }, [initialPost]);



  const loadComments = async () => {
    if (!post?.postId) return;
    setLoading(true);
    try {
      const data = await getCommentsByPost(post.postId);
      setComments(data);
    } catch (err) {
      setError('Erreur lors du chargement des commentaires');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post?.postId || isLiking || !user?.id) return;

    setIsLiking(true);
    setError(null);
    try {
      const updatedPost = await likePost(post.postId, user.id);
      setPost(updatedPost);
    } catch (err) {
      console.error('Like error:', err);
      setError('Erreur lors du like');
    } finally {
      setIsLiking(false);
    }
  };


  const handleDislike = async () => {
    if (!post?.postId || isDisliking || !user?.id) return;

    setIsDisliking(true);
    setError(null);
    try {
      const updatedPost = await dislikePost(post.postId, user.id);
      setPost(updatedPost);
    } catch (err) {
      console.error('Dislike error:', err);
      setError('Erreur lors du dislike');
    } finally {
      setIsDisliking(false);
    }
  };




  const handleCreateComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!post?.postId || !user?.id) return;

    const form = e.currentTarget;
    const content = (form.elements.namedItem('content') as HTMLTextAreaElement).value;

    try {
      await createForumComment(post.postId, content, user.id);
      form.reset();
      loadComments();
      setPost({ ...post, commentCount: post.commentCount + 1 });
    } catch (err) {
      setError('Erreur lors de la création du commentaire');
    }
  };

  // Handler for inline replies from CommentTree
  const handleInlineReply = async (parentCommentId: string, content: string) => {
    if (!post?.postId || !user?.id) return;

    try {
      await createForumComment(post.postId, content, user.id, parentCommentId);
      loadComments();
      setPost({ ...post, commentCount: post.commentCount + 1 });
    } catch (err) {
      setError('Erreur lors de la création de la réponse');
      throw err; // Re-throw to let CommentTree handle UI feedback
    }
  };

  const handleUpdateComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const content = (form.elements.namedItem('content') as HTMLTextAreaElement).value;

    try {
      await updateForumComment(editingComment!.commentaireId, content);

      setEditingComment(null);
      loadComments();
    } catch (err) {
      setError('Erreur lors de la modification');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    if (!post || !user?.id) return;

    try {
      await deleteForumComment(commentId, user.id);
      loadComments();
      setPost({ ...post, commentCount: Math.max(0, post.commentCount - 1) });
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  if (!post) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-grey-200">
        <button onClick={onBack} className="flex items-center gap-2 text-primary-purple-600 font-medium mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Retour au forum
        </button>
        <div className="text-black-300 text-center py-20">Post non trouvé</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-grey-100 rounded-full transition-colors text-black-300"
          title="Retour au forum"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="paragraph-medium-medium text-black-300">Détails de la discussion</span>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">{error}</div>}

      {/* Post Content */}
      <div className="bg-grey-50 rounded-2xl border border-grey-200 p-8 mb-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6">
          <span className="bg-primary-purple-100 text-primary-purple-700 px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider">Forum Post</span>
        </div>

        <h2 className="h2-bold text-black-500 mb-6 pr-24">{post.title}</h2>
        <div className="prose prose-blue max-w-none">
          <p className="paragraph-large-normal text-black-400 mb-8 whitespace-pre-wrap leading-relaxed">{post.content}</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-grey-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
              {post.authorName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="paragraph-medium-bold text-black-500">Par {post.authorName || 'Utilisateur'}</p>
              <p className="paragraph-xsmall-normal text-black-300">{post.createdAt ? new Date(post.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date inconnue'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${post.likes && post.likes > 0 ? 'bg-green-100 text-green-700' : 'bg-white border border-grey-300 text-black-300 hover:bg-grey-50'} disabled:opacity-50`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{post.likes || 0}</span>
            </button>
            <button
              onClick={handleDislike}
              disabled={isDisliking}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${post.dislikes && post.dislikes > 0 ? 'bg-red-100 text-red-700' : 'bg-white border border-grey-300 text-black-300 hover:bg-grey-50'} disabled:opacity-50`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{post.dislikes || 0}</span>
            </button>
            <div className="h-8 w-[1px] bg-grey-300 mx-2 hidden sm:block"></div>
            <span className="flex items-center gap-2 text-black-300 paragraph-small-medium">
              <MessageSquare className="w-5 h-5" />
              {post.commentCount} commentaires
            </span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-2xl border border-grey-200 p-8">
        <h3 className="h4-bold text-black-500 mb-8">Commentaires</h3>

        {/* New Comment Form */}
        <form onSubmit={handleCreateComment} className="mb-10 group">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
              {user?.firstName?.charAt(0).toUpperCase() || 'V'}
            </div>
            <textarea
              name="content"
              placeholder="Ajouter un commentaire..."
              required
              rows={4}
              className="custom-input h-auto py-3 min-h-[100px] flex-1 font-inter"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-2.5 bg-primary-purple-600 text-black-300 rounded-lg hover:bg-primary-purple-700 transition-all font-semibold shadow-sm hover:translate-y-[-1px]"
            >
              Commenter
            </button>
          </div>
        </form>

        {/* Edit Comment Form */}
        {editingComment && (
          <form onSubmit={handleUpdateComment} className="mb-10 bg-primary-purple-50 border border-primary-purple-200 p-6 rounded-xl">
            <h4 className="paragraph-medium-bold text-primary-purple-800 mb-4 flex items-center gap-2">
              <Edit2 className="w-4 h-4" /> Modifier votre commentaire
            </h4>
            <textarea
              name="content"
              defaultValue={editingComment.content}
              required
              rows={4}
              className="custom-input h-auto py-3 min-h-[100px] mb-4 bg-white"
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setEditingComment(null)}
                className="px-5 py-2 bg-white text-black-300 rounded-lg hover:bg-grey-50 transition-colors border border-grey-300 font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary-purple-600 text-black-500 rounded-lg hover:bg-primary-purple-700 transition-colors font-semibold shadow-sm"
              >
                Enregistrer
              </button>
            </div>
          </form>
        )}

        {/* Comments List */}
        {loading ? (
          <LoadingSpinner />
        ) : comments.length > 0 ? (
          <CommentTree
            comments={comments}
            onReply={handleInlineReply}
            onEdit={setEditingComment}
            onDelete={handleDeleteComment}
          />
        ) : (
          <p className="text-black-200 text-center py-12 font-inter italic">Aucun commentaire pour le moment. Soyez le premier à exprimer votre avis !</p>
        )}
      </div>
    </div>
  );
}