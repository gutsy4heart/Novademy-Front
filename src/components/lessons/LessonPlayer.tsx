import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLesson, Lesson } from '../../api/lessonService';
import './LessonPlayer.css';

interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

const LessonPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'girish' | 'testlər' | 'məzmun'>('girish');

  useEffect(() => {
    if (id) {
      loadLesson();
      // In a real app, you would also load comments from an API
      // For now, we'll use mock data
      setComments([
        {
          id: '1',
          userId: '101',
          username: 'Fərid Quluzadə',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam quator tincidunt mauris ut amet pulvinar. Aenean id pretium turpis. Vestibulum viverra, et orci velit mattis ut ante erat.',
          createdAt: '2023-05-10T14:30:00Z'
        }
      ]);
    }
  }, [id]);

  const loadLesson = async () => {
    try {
      setIsLoading(true);
      const lessonData = await getLesson(id!);
      setLesson(lessonData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // In a real app, you would send this to the API
    const comment: Comment = {
      id: Date.now().toString(),
      userId: '102',
      username: 'Current User',
      text: newComment,
      createdAt: new Date().toISOString()
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  if (isLoading) {
    return <div>Yüklənir...</div>;
  }

  if (error || !lesson) {
    return <div className="error-message">{error || 'Dərs tapılmadı'}</div>;
  }

  return (
    <div className="lesson-player-container">
      <div className="lesson-sidebar">
        <div className="course-info">
          <h3>Girish</h3>
          <div className="sidebar-lesson-list">
            <div className="sidebar-section">
              <div className="sidebar-section-header">
                <h4>Natural ədədlər</h4>
              </div>
              <ul>
                <li className="active">
                  <span className="lesson-icon">►</span>
                  Dərs 2 - Toplama, çıxma, vurulma və bölünmə
                </li>
                <li>
                  <span className="lesson-icon">►</span>
                  Online sinif tərifi
                </li>
                <li>
                  <span className="lesson-icon">▣</span>
                  Məsələlər toplusu, mürəkkəb
                </li>
                {/* More lesson items */}
              </ul>
            </div>
            <div className="sidebar-section">
              <div className="sidebar-section-header">
                <h4>Adi və onluq kəsrlər</h4>
              </div>
              <ul>
                <li>
                  <span className="lesson-icon">►</span>
                  Sadə kəsrlər anlayışı
                </li>
                <li>
                  <span className="lesson-icon">⚑</span>
                  Ev tapşırığı
                </li>
                <li>
                  <span className="lesson-icon">▣</span>
                  Natural ədədlər - Test
                </li>
                {/* More lesson items */}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="lesson-content">
        <div className="lesson-header">
          <h2>{lesson.title}</h2>
          <div className="lesson-navigation">
            <span className="nav-button">◄ Əvvəlki</span>
            <span className="nav-button">Sonrakı ►</span>
          </div>
        </div>
        
        <div className="video-container">
          {lesson.videoUrl ? (
            <iframe 
              src={lesson.videoUrl} 
              title={lesson.title}
              allowFullScreen
            ></iframe>
          ) : (
            <div className="no-video">Video mövcud deyil</div>
          )}
        </div>

        <div className="lesson-tabs">
          <div 
            className={`tab ${activeTab === 'girish' ? 'active' : ''}`}
            onClick={() => setActiveTab('girish')}
          >
            Transkripsiya
          </div>
          <div 
            className={`tab ${activeTab === 'testlər' ? 'active' : ''}`}
            onClick={() => setActiveTab('testlər')}
          >
            Fayllar
          </div>
        </div>
        
        <div className="tab-content">
          {activeTab === 'girish' && (
            <div className="transcript">
              <h3>Transkripsiya:</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam quator tincidunt 
                mauris ut amet pulvinar. Aenean id pretium turpis. Vestibulum viverra, et orci 
                velit mattis ut ante erat.
              </p>
              <p>
                Diger bir lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam quator 
                tincidunt mauris ut amet pulvinar. Aenean id pretium turpis. Vestibulum viverra, 
                et orci velit mattis ut ante erat.
              </p>
            </div>
          )}
          
          {activeTab === 'testlər' && (
            <div className="lesson-files">
              <h3>Əlavə fayllar:</h3>
              <ul>
                <li><a href="#">Tapşırıq.pdf</a></li>
                <li><a href="#">Prezentasiya.pptx</a></li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="comments-section">
          <h3>Rəylər</h3>
          
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-avatar">
                  <img src={`https://ui-avatars.com/api/?name=${comment.username}&background=random`} alt="User" />
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comment.username}</span>
                  </div>
                  <div className="comment-text">{comment.text}</div>
                </div>
              </div>
            ))}
          </div>
          
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Rəyinizi yazın..."
              required
            ></textarea>
            <button type="submit" className="btn btn-primary">Göndər</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer; 