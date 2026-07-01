import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['General', 'Career', 'Internships', 'Placements', 'Higher Studies', 'Projects', 'Startups'];

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [tagsInput, setTagsInput] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          category,
          tags,
          isAnonymous
        })
      });

      if (res.ok) {
        const post = await res.json();
        toast.success('Post created successfully!');
        navigate(`/forum/${post.id}`);
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to create post');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-6 py-10">
        <Link to="/forum" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Forum
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Create a New Discussion</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you want to discuss?"
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                maxLength={100}
                required
              />
              <p className="text-xs text-right text-slate-500 mt-1">{title.length}/100</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content <span className="text-red-500">*</span></label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, ask a question, or start a discussion... (Markdown supported)"
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[200px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tags (Optional)</label>
              <input 
                type="text" 
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. interviews, google, frontend (comma separated)"
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-slate-600 dark:text-slate-300 font-medium">Post Anonymously</span>
              </label>

              <button 
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="flex items-center px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting...' : (
                  <>Post Discussion <Send className="w-4 h-4 ml-2" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
