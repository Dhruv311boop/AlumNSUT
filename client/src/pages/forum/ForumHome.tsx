import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, MessageSquare, ThumbsUp, Eye, Clock } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likesCount: number;
  views: number;
  isAnonymous: boolean;
  createdAt: string;
  author: {
    role: string;
    studentProfile?: { fullName: string; department: string; profilePicture?: string };
    mentorProfile?: { fullName: string; industry: string; profilePicture?: string };
  };
  _count: { comments: number };
}

const CATEGORIES = ['All', 'Career', 'Internships', 'Placements', 'Higher Studies', 'Projects', 'Startups', 'General'];
const SORTS = ['Newest', 'Most Popular', 'Most Commented'];

export default function ForumHome() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Newest');

  useEffect(() => {
    fetchPosts();
  }, [category, sort]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({ category, sort });
      if (search) query.append('search', search);
      
      const res = await fetch(`/api/forum?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-250">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Community Forum</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Join the conversation with NSUT alumni and students.</p>
          </div>
          <Link to="/forum/new" className="flex items-center px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm">
            <Plus className="w-5 h-5 mr-2" />
            Create Post
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Filters */}
          <div className="space-y-6">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search discussions..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </form>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Categories</h3>
              <div className="flex flex-col space-y-1">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${category === cat ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Sort By</h3>
              <div className="flex flex-col space-y-1">
                {SORTS.map(s => (
                  <button 
                    key={s}
                    onClick={() => setSort(s)}
                    className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${sort === s ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className="lg:col-span-3 space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-20"><LoadingSpinner /></div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No posts found</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Try adjusting your filters or create a new post.</p>
              </div>
            ) : (
              posts.map(post => {
                const isStudent = post.author.role === 'STUDENT';
                const profile = isStudent ? post.author.studentProfile : post.author.mentorProfile;
                const name = post.isAnonymous ? 'Anonymous' : profile?.fullName || 'Unknown';
                const subtitle = post.isAnonymous ? 'NSUT Student' : (isStudent ? (profile as any)?.department : (profile as any)?.industry);
                const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                return (
                  <Link to={`/forum/${post.id}`} key={post.id} className="block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-shadow group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {post.isAnonymous ? (
                           <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold">AN</div>
                        ) : profile?.profilePicture ? (
                           <img src={profile.profilePicture} alt={name} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                           <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold">{initials}</div>
                        )}
                        <div>
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center">
                            {name}
                            {!post.isAnonymous && <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${isStudent ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                              {post.author.role}
                            </span>}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-4">
                      {post.content}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                          {post.category}
                        </span>
                        {post.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline-block">#{tag}</span>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center"><ThumbsUp className="w-4 h-4 mr-1.5" /> {post.likesCount}</span>
                        <span className="flex items-center"><MessageSquare className="w-4 h-4 mr-1.5" /> {post._count.comments}</span>
                        <span className="flex items-center"><Eye className="w-4 h-4 mr-1.5" /> {post.views}</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
