/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { getInitials } from '@/helper/getInitials';
import React, { useEffect, useState } from 'react';
import TextArea from '../ui/textarea';
import { Button } from '../ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  GetCommentInteface,
  parseReplyToComment,
  ReplyCommentResponseInterface,
} from '@/types/comment';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GetUser } from '@/types/User';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import {
  replyComment,
  fetchCommentReplies,
} from '@/actions/review';
import LikeDislikeButton from '../ui/LikeDislikeButton';
import { entityType } from '@/constants/entityType';
import { Ellipsis, Trash2 } from 'lucide-react';
import { fetchUserData } from '@/actions/user';
import DeleteDialog from '../Dialogs/DeleteDialog';
import UserAvatar from '../UserAvatar';

interface CommentProps {
  comment: GetCommentInteface;
  reply?: ReplyCommentResponseInterface[];
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentId, setCurrentId] = useState('');
  const { user } = useAuth();
  const [replyText, setReplyText] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [commentByUserData, setCommentByUserData] = useState<GetUser | null>(
    null
  );
  const [replies, setReplies] = useState<ReplyCommentResponseInterface[]>([]);

  // Fetch user data for the comment author
  const fetchCommentByUser = async () => {
    try {
      const user = await fetchUserData(comment.commentByUser);
      if (user) {
        setCommentByUserData(user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch replies for the comment
  const fetchReplies = async () => {
    try {
      const replies = await fetchCommentReplies(comment.id);
      if (replies) {
        setReplies(replies);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setShowDialog((prev) => !prev);
    setCurrentId(commentId);
    setTitle(`Delete comment`);
    setDescription(`Are you sure you want to delete this comment`);
  };

  // Handle submitting a reply
  const handleReplySubmit = async () => {
    console.log(comment.id, 'comment id');
    if (user && replyText.trim()) {
      try {
        const replyCommentData = {
          content: replyText,
          replyByUserId: user.id,
          commentId: comment.id,
        };
        const response = await replyComment(replyCommentData);
        if (response) {
          setReplies((prev) => [...prev, response]); // Add new reply to the list
          setReplyText(''); // Clear input after submission
          setShowReplyBox(false); // Hide reply box
        }
      } catch (error) {
        console.error('Error submitting reply:', error);
      }
    }
  };

  // Fetch user data and replies on component mount
  useEffect(() => {
    fetchCommentByUser();
    fetchReplies();
  }, [comment]);

  return (
    <div className="mb-2  mt-2 py-2 w-full">
      <div className="flex gap-3 items-start">
        {commentByUserData && (
          <UserAvatar
            userId={commentByUserData.id}
            fullName={commentByUserData?.firstName+" "+commentByUserData?.lastName}
            size="sm"
          />
        )}
        <div className="w-full flex flex-col gap-0">
          <div className="w-full flex items-center justify-between">
            {/* Author Info */}
            {commentByUserData && (
              <div className="flex items-center gap-1">
                <p className="text-black-500 text-[14.5px] paragraph-medium-medium">
                  {commentByUserData?.firstName+" "+commentByUserData?.lastName}
                </p>
                <p>·</p>
                <p className="text-sm paragraph-small-normal text-black-300">
                  {formatDateOrRelative(comment.createdAt)}
                </p>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[180px]" align="end">
                <DropdownMenuItem
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-redTheme hover:text-redTheme"
                >
                  <Trash2 /> Delete comment
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Comment Content */}
          <p className="paragraph-medium-normal">{comment.content}</p>

          <div className="mt-3 flex flex-col gap-1">
            <LikeDislikeButton
              entityId={comment.id}
              entityType={entityType.comment}
            />

            {/* Reply Button */}
            <div className="w-full flex justify-start">
              <button
                onClick={() => setShowReplyBox(!showReplyBox)}
                className="text-black-300 mt-2 paragraph-small-medium"
              >
                Reply
              </button>
            </div>
          </div>

          {/* Reply Input Box */}
          {showReplyBox && (
            <div className="mt-2 w-full">
              <TextArea
                value={replyText}
                label="Blog Description"
                height="60px"
                placeholder="Write a reply..."
                maxWords={50}
                onChange={(value) => setReplyText(value)}
              />
              <div className="flex w-full justify-end">
                <Button
                  size="sm"
                  disabled={!replyText.trim()}
                  className="rounded-full mt-1"
                  onClick={handleReplySubmit}
                >
                  Submit
                </Button>
              </div>
            </div>
          )}

          {replies.length > 0 && (
            <div className="ml-6 border-l-2 border-gray-300 pl-4 mt-2">
              {replies.map((reply) => (
                // Pass each reply as a 'comment' prop
                <Comment
                  key={reply.id}
                  comment={parseReplyToComment(reply, reply.commentId,"Comment")}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DeleteDialog
        id={currentId}
        title={title}
        type={'comment'}
        description={description}
        action="delete"
        setShowDialog={setShowDialog}
        showDialog={showDialog}
      />
    </div>
  );
};

export default Comment;
