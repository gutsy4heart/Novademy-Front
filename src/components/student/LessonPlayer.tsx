import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLesson, Lesson } from '../../api/lessonService';
import { markLessonAsWatched, getComments, sendComment, Comment } from '../../api/studentService';
import '../../styles/LessonPlayer.css';

interface RouteParams {
  courseId: string;
  lessonId: string;
  [key: string]: string | undefined;
}

const LessonPlayer: React.FC = () => {
  const { courseId, lessonId } = useParams<RouteParams>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  
  // Track if the progress update is in progress
  const isUpdatingProgress = useRef<boolean>(false);
  // Last saved position
  const lastSavedPosition = useRef<number>(0);
  
  useEffect(() => {
    const fetchLessonData = async () => {
      if (!lessonId) return;
      
      try {
        setLoading(true);
        const lessonData = await getLesson(lessonId);
        setLesson(lessonData);
        
        // Load comments
        loadComments();
        
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [lessonId]);
  
  const loadComments = async () => {
    if (!lessonId) return;
    
    try {
      const commentsData = await getComments(lessonId);
      setComments(commentsData);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };
  
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    
    // Calculate progress percentage
    const progressPercentage = Math.floor((currentTime / duration) * 100);
    setProgress(progressPercentage);
    
    // Check if video is 90% complete and not already marked as completed
    if (progressPercentage >= 90 && !completed && !isUpdatingProgress.current) {
      handleMarkAsWatched();
    }
    
    // Update progress on server every 5 seconds
    if (currentTime - lastSavedPosition.current >= 5 && !isUpdatingProgress.current) {
      updateProgress(currentTime);
    }
  };
  
  const updateProgress = async (currentTime: number) => {
    if (!lessonId || !courseId || isUpdatingProgress.current) return;
    
    isUpdatingProgress.current = true;
    
    try {
      await markLessonAsWatched(lessonId, currentTime);
      lastSavedPosition.current = currentTime;
    } catch (err) {
      console.error('Failed to update progress:', err);
    } finally {
      isUpdatingProgress.current = false;
    }
  };
  
  const handleMarkAsWatched = async () => {
    if (!lessonId || !courseId) return;
    
    try {
      await markLessonAsWatched(lessonId, videoRef.current?.currentTime || 0);
      setCompleted(true);
    } catch (err) {
      console.error('Failed to mark lesson as watched:', err);
    }
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !lessonId) return;
    
    setCommentLoading(true);
    
    try {
      await sendComment(lessonId, newComment);
      setNewComment('');
      // Reload comments
      await loadComments();
    } catch (err) {
      console.error('Failed to send comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };
  
  const handleNextLesson = () => {
    // Navigate to next lesson (this would need lesson order information)
    // For now, just go back to course view
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return <div className="loading">Dərs yüklənir...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!lesson) {
    return <div className="error-message">Dərs tapılmadı</div>;
  }

  return (
    <div className="lesson-player">
      <div className="lesson-header">
        <Link to={`/courses/${courseId}`} className="back-button">
          &larr; Kursa qayıt
        </Link>
        <h1>{lesson.title}</h1>
      </div>
      
      <div className="video-container">
        {lesson.videoUrl ? (
          <video 
            ref={videoRef}
            controls
            onTimeUpdate={handleTimeUpdate}
            src={lesson.videoUrl}
            poster={lesson.imageUrl}
          />
        ) : (
          <div className="no-video">Bu dərs üçün video mövcud deyil</div>
        )}
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="lesson-content">
        <div className="lesson-description">
          <h2>Dərs haqqında</h2>
          <p>{lesson.description}</p>
          
          {lesson.content && (
            <div className="materials">
              <h3>Əlavə materiallar</h3>
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </div>
          )}
        </div>
        
        <div className="lesson-actions">
          <button 
            className={`mark-watched ${completed ? 'completed' : ''}`}
            onClick={handleMarkAsWatched}
            disabled={completed}
          >
            {completed ? 'Tamamlanıb' : 'Tamamlandı kimi qeyd et'}
          </button>
          
          <button className="next-lesson" onClick={handleNextLesson}>
            Növbəti dərs
          </button>
        </div>
      </div>
      
      <div className="comments-section">
        <h2>Rəylər</h2>
        
        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Dərs haqqında rəy bildirin..."
            rows={3}
            disabled={commentLoading}
          />
          <button type="submit" disabled={commentLoading || !newComment.trim()}>
            {commentLoading ? 'Göndərilir...' : 'Göndər'}
          </button>
        </form>
        
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">Bu dərs üçün hələ rəy yoxdur.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.userName}</span>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString('az-AZ')}
                  </span>
                </div>
                <p className="comment-content">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer; 