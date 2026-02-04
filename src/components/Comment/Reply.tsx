import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

interface ReplyProps {
  id: string;
  text: string;
  author: string;
  replies?: ReplyProps[];
  onReply: (id: string, replyText: string) => void;
}

const Reply: React.FC<ReplyProps> = ({
  id,
  text,
  author,
  replies = [],
  onReply,
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(id, replyText);
      setReplyText('');
      setShowReplyBox(false);
    }
  };

  return (
    <div className="relative mb-4">
      {/* Curved Line */}
      <div className="absolute left-[-16px] top-0 h-full w-6 border-l-2 border-gray-300 rounded-bl-md"></div>

      {/* Reply Box */}
      <div className="bg-gray-50 p-3 rounded-md shadow-sm ml-6">
        <p className="font-semibold">{author}</p>
        <p className="text-gray-700">{text}</p>
        <button
          className="text-sm text-blue-600 flex items-center mt-2"
          onClick={() => setShowReplyBox(!showReplyBox)}
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          Reply
        </button>
      </div>

      {/* Reply Input Box */}
      {showReplyBox && (
        <div className="ml-10 mt-2">
          <textarea
            className="w-full border rounded-md p-2"
            rows={2}
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md"
            onClick={handleReply}
          >
            Reply
          </button>
        </div>
      )}

      {/* Nested Replies */}
      {replies.length > 0 && (
        <div className="ml-6 mt-2 border-l-2 border-gray-300 pl-4">
          {replies.map((reply) => (
            <Reply key={reply.id} {...reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reply;
