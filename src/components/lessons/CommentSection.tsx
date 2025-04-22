import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Comment, getLessonComments as getComments, addComment, deleteComment } from '../../api/studentService';

interface CommentSectionProps {
  lessonId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ lessonId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await getComments(lessonId);
        setComments(data);
      } catch (err: any) {
        setError(err.message || 'Şərhləri yükləmək mümkün olmadı');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [lessonId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const comment = await addComment({ lessonId, text: newComment });
      setComments([...comments, comment]);
      setNewComment('');
    } catch (err: any) {
      setError(err.message || 'Şərhi əlavə etmək mümkün olmadı');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err: any) {
      setError(err.message || 'Şərhi silmək mümkün olmadı');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-10 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Şərhlər</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            rows={3}
            placeholder="Şərhinizi yazın..."
            disabled={submitting}
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            submitting || !newComment.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {submitting ? 'Göndərilir...' : 'Şərh əlavə et'}
        </button>
      </form>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          Hələ şərh yoxdur. İlk şərhi siz yazın!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{comment.userName}</p>
                    <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
                {user && comment.userId === user.id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Sil
                  </button>
                )}
              </div>
              <div className="mt-3 text-gray-700 whitespace-pre-wrap">
                {comment.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection; 