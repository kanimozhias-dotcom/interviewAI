import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Real stats from the backend
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  // User info from API
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            navigate('/');
            return;
          }
          throw new Error('Failed to load dashboard stats');
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        setStatsError(err.message);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  // Format a date string for the Recent Interviews table
  const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    const today = new Date();
    const yesterday = new Date(Date.now() - 864e5);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  let welcomeText = "Welcome Back...";
  if (!userLoading) {
    if (user && user.name) {
      welcomeText = `Welcome Back, ${user.name} 👋`;
    } else {
      welcomeText = "Welcome Back 👋";
    }
  }

  const sidebarName = user?.name || 'User';

  return (
    <div className="min-h-screen bg-gray-950 flex font-sans text-white">
      {/* Sidebar */}
      <aside className={`bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          <div className={`flex items-center gap-3 overflow-hidden ${!isSidebarOpen && 'hidden'}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-bold text-lg whitespace-nowrap">InterviewAI</span>
          </div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            {isSidebarOpen && <span className="font-medium">Dashboard</span>}
          </Link>
          <Link to="/setup" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            {isSidebarOpen && <span className="font-medium">New Interview</span>}
          </Link>
          <Link to="/results" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            {isSidebarOpen && <span className="font-medium">Analytics</span>}
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link to="/profile" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-indigo-500 overflow-hidden flex-shrink-0">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(sidebarName)}`}
                alt="Profile"
                className="w-full h-full bg-gray-800"
              />
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{sidebarName}</p>
                <p className="text-xs text-gray-500 truncate">
                  {stats ? `${stats.totalInterviews} interviews` : 'Loading…'}
                </p>
              </div>
            )}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-gray-900/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 lg:px-8 z-10 sticky top-0">
          <h1 className="text-xl font-semibold text-white">Overview</h1>
          <div className="flex items-center gap-4">
            <Link
              to="/setup"
              className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Start Practice
            </Link>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1">{welcomeText}</h2>
            <p className="text-gray-400">Here's a summary of your recent interview performance.</p>
          </div>

          {/* Stats Cards */}
          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 animate-pulse h-28" />
              ))}
            </div>
          ) : statsError ? (
            <div className="mb-8 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {statsError}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  title: 'Total Interviews',
                  value: stats.totalInterviews,
                  icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
                  color: 'text-blue-400',
                  bg: 'bg-blue-400/10',
                },
                {
                  title: 'Avg. Score',
                  value: `${stats.averageScore}%`,
                  icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-400/10',
                },
                {
                  title: 'Best Score',
                  value: `${stats.bestScore}%`,
                  icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
                  color: 'text-purple-400',
                  bg: 'bg-purple-400/10',
                },
                {
                  title: 'Day Streak 🔥',
                  value: stats.streak,
                  icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z',
                  color: 'text-amber-400',
                  bg: 'bg-amber-400/10',
                },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm flex items-center gap-4 hover:border-gray-700 transition-colors">
                  <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interview History Cards */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm p-6">
            <h3 className="font-bold text-lg mb-4">Interview History</h3>
            
            {statsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-800/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : !stats || stats.recentInterviews.length === 0 ? (
              <div className="p-10 text-center text-gray-500 border border-gray-800 border-dashed rounded-xl">
                <p className="text-lg font-medium mb-1">No Interviews Yet</p>
                <p className="text-sm">
                  <Link to="/setup" className="text-indigo-400 hover:text-indigo-300">Start your first interview</Link> to see your history here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.recentInterviews.map((row, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(`/results?sessionId=${row.sessionId}`)}
                    className="bg-gray-800/40 hover:bg-gray-800/70 border border-gray-700 hover:border-indigo-500/50 rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="mb-3">
                      <h4 className="font-bold text-white text-lg leading-tight mb-1">{row.role}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="bg-gray-900 px-2 py-1 rounded-md">{row.difficulty}</span>
                        <span>•</span>
                        <span>{formatDate(row.date)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-700/50">
                      <span className="text-sm text-gray-400">Overall Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${row.score >= 80 ? 'bg-emerald-500' : row.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${row.score}%` }}
                          />
                        </div>
                        <span className={`font-bold text-sm ${row.score >= 80 ? 'text-emerald-400' : row.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                          {row.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
