import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, ThumbsUp, Eye, Clock, Send, Share, Bookmark, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/forum/${postId}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      } else {
        toast.error('Post not found');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/forum/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const { liked } = await res.json();
        setPost((prev: any) => ({
          ...prev,
          likesCount: liked ? prev.likesCount + 1 : prev.likesCount - 1,
        }));
      }
    } catch (error) {
      toast.error('Failed to like post');
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/forum/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentContent })
      });
      if (res.ok) {
        const newComment = await res.json();
        setPost((prev: any) => ({
          ...prev,
          comments: [newComment, ...prev.comments]
        }));
        setCommentContent('');
        toast.success('Comment added');
      }
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]"><LoadingSpinner /></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Post not found</h2>
          <Link to="/forum" className="text-red-600 hover:underline mt-4 inline-block">Go back to forum</Link>
        </div>
      </div>
    );
  }

  const isStudent = post.author.role === 'STUDENT';
  const profile = isStudent ? post.author.studentProfile : post.author.mentorProfile;
  const authorName = post.isAnonymous ? 'Anonymous' : profile?.fullName || 'Unknown';
  const authorSubtitle = post.isAnonymous ? 'NSUT Student' : (isStudent ? profile?.department : profile?.industry);
  const initials = authorName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-10">
        <Link to="/forum" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Forum
        </Link>

        {/* Post Content */}
        <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              {post.isAnonymous ? (
                 <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-lg">AN</div>
              ) : profile?.profilePicture ? (
                 <img src={profile.profilePicture} alt={authorName} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                 <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-lg">{initials}</div>
              )}
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center text-lg">
                  {authorName}
                  {!post.isAnonymous && <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${isStudent ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                    {post.author.role}
                  </span>}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{authorSubtitle}</p>
                <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 mt-1">
                  <Clock className="w-3 h-3 mr-1" /> {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
               <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                 {post.category}
               </span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="prose dark:prose-invert max-w-none mb-8 text-slate-700 dark:text-slate-300">
            {/* Split by newline for simple paragraph rendering if not fully integrating a markdown parser */}
            {post.content.split('\n').map((para: string, idx: number) => (
              <p key={idx} className="mb-4">{para}</p>
            ))}
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 border-t border-slate-100 dark:border-slate-800 pt-6">
              {post.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
            <div className="flex items-center space-x-4 md:space-x-6">
              <button onClick={handleLike} className={`flex items-center space-x-2 text-sm font-medium transition-colors ${isLiking ? 'opacity-50' : ''} text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400`}>
                <ThumbsUp className="w-5 h-5" /> <span>{post.likesCount}</span>
              </button>
              <div className="flex items-center space-x-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                <MessageSquare className="w-5 h-5" /> <span>{post.comments.length}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                <Eye className="w-5 h-5" /> <span>{post.views}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" title="Bookmark">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" title="Share">
                <Share className="w-5 h-5" />
              </button>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-slate-400" />
            Discussion ({post.comments.length})
          </h3>
          
          {/* Add Comment */}
          <form onSubmit={handleComment} className="mb-8 flex space-x-4">
            <div className="flex-1">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Add to the discussion..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px] resize-y"
              />
              <div className="flex justify-end mt-2">
                <button 
                  type="submit"
                  disabled={isSubmitting || !commentContent.trim()}
                  className="flex items-center px-5 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : <>Post Comment <Send className="w-4 h-4 ml-2" /></>}
                </button>
              </div>
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-6">
            {post.comments.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-6">No comments yet. Be the first to start the discussion!</p>
            ) : (
              post.comments.map((comment: any) => {
                const cStudent = comment.author.role === 'STUDENT';
                const cProfile = cStudent ? comment.author.studentProfile : comment.author.mentorProfile;
                const cName = cProfile?.fullName || 'Unknown';
                const cInitials = cName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                
                return (
                  <div key={comment.id} className="flex space-x-4">
                    {cProfile?.profilePicture ? (
                       <img src={cProfile.profilePicture} alt={cName} className="h-10 w-10 rounded-full object-cover shrink-0 mt-1" />
                    ) : (
                       <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold shrink-0 mt-1">{cInitials}</div>
                    )}
                    <div className="flex-1 bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{cName}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">• {cStudent ? 'Student' : 'Mentor'}</span>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
