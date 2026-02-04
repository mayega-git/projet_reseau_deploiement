'use client';

import { useState } from 'react';
import { Edit2, Trash2, ChevronDown, ChevronRight, Reply } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Comment } from '@/types/forum';

interface CommentTreeProps {
  comments: Comment[];
  onReply: (parentId: string, content: string) => Promise<void>;
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
  level?: number;
}

function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  level = 0
}: {
  comment: Comment;
  onReply: (parentId: string, content: string) => Promise<void>;
  onEdit: (comment: Comment) => void;
  onDelete: (id: string) => void;
  level: number;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const commentDate = comment.createdAt || comment.creationDate;
  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onReply(comment.commentaireId, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
      setShowReplies(true);
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extremely robust name logic: normalized from backend, or fallback to current user if IDs match
  const authorDisplayName = (comment.authorName && comment.authorName !== 'Utilisateur')
    ? comment.authorName
    : (comment.authorId === user?.id && user?.firstName)
      ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
      : comment.authorName || 'Utilisateur';

  const authorInitials = authorDisplayName
    ? authorDisplayName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';

  return (
    <div className="relative">
      {/* Connecting line for nested replies */}
      {level > 0 && (
        <div className="absolute -left-6 top-5 w-6 h-[2px] bg-grey-200" />
      )}

      <div className="flex gap-3 mb-4 group">
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          <div className="w-9 h-9 rounded-full bg-secondaryOrange-100 flex items-center justify-center text-secondaryOrange-700 font-bold text-xs shadow-sm border border-secondaryOrange-200">
            {authorInitials}
          </div>
        </div>

        {/* Comment Content + Actions */}
        <div className="flex-1 max-w-[90%]">
          {/* Bubble wrapper */}
          <div className="relative inline-block group/bubble max-w-full">
            {/* Main Bubble */}
            <div
              onClick={() => hasReplies && setShowReplies(!showReplies)}
              className={`bg-grey-100 rounded-2xl px-4 py-2.5 shadow-sm border border-transparent hover:border-grey-200 transition-colors ${hasReplies ? 'cursor-pointer' : ''}`}
            >
              <p className="paragraph-small-bold text-black-500 mb-0.5">{authorDisplayName}</p>
              <p className="paragraph-medium-normal text-black-400 break-words leading-tight">{comment.content}</p>
            </div>

            {/* Float Menu for author */}
            {comment.authorId === user?.id && (
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(comment)}
                  className="p-1.5 text-black-200 hover:text-secondaryOrange-600 hover:bg-white rounded-full transition-all shadow-sm"
                  title="Modifier"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(comment.commentaireId)}
                  className="p-1.5 text-black-200 hover:text-red-500 hover:bg-white rounded-full transition-all shadow-sm"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Action links */}
          <div className="flex items-center gap-4 mt-1 ml-2 text-[12px] font-semibold text-black-300">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="hover:text-secondaryOrange-600 transition-colors"
            >
              Répondre
            </button>
            <span className="text-[11px] font-normal text-black-200">
              {commentDate ? new Date(commentDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Date inconnue'}
            </span>
          </div>

          {/* Inline Reply Form */}
          {showReplyForm && (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
              <form onSubmit={handleReplySubmit} className="flex gap-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Répondre à ${comment.authorName}...`}
                  required
                  rows={1}
                  autoFocus
                  className="custom-input h-auto py-2 min-h-[40px] flex-1 bg-white rounded-xl text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleReplySubmit(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !replyContent.trim()}
                  className="px-4 py-2 bg-secondaryOrange-500 text-white rounded-xl hover:bg-secondaryOrange-600 disabled:opacity-50 text-xs font-bold transition-colors shadow-sm"
                >
                  {isSubmitting ? '...' : 'Envoyer'}
                </button>
              </form>
            </div>
          )}

          {/* Expand/Collapse Replies */}
          {hasReplies && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 mt-2 ml-2 text-secondaryOrange-600 hover:text-secondaryOrange-700 font-bold text-xs"
            >
              {showReplies ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              {showReplies ? 'Masquer les réponses' : `Afficher les réponses (${comment.replies!.length})`}
            </button>
          )}

          {/* Nested Replies Rendering */}
          {hasReplies && showReplies && (
            <div className="mt-4 border-l-2 border-grey-100 ml-2 pl-6 space-y-4">
              {comment.replies!.map((reply) => (
                <CommentItem
                  key={reply.commentaireId}
                  comment={reply}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentTree({
  comments,
  onReply,
  onEdit,
  onDelete,
  level = 0
}: CommentTreeProps) {
  return (
    <div className="space-y-6 pt-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.commentaireId}
          comment={comment}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          level={level}
        />
      ))}
    </div>
  );
}