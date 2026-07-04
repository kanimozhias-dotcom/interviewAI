import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editable form fields
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  // ── Fetch user on mount ─────────────────────────────────────────────
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            navigate('/');
            return;
          }
          throw new Error('Failed to load profile');
        }

        const data = await res.json();
        const u = data.user;
        setUser(u);
        // Pre-fill form
        setName(u.name || '');
        setBio(u.bio || '');
        setAvatar(u.avatar || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // ── Save changes ─────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim(), bio, avatar }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save changes');
      }

      // Update local state so UI immediately reflects changes
      setUser((prev) => ({ ...prev, ...data.user }));
      setName(data.user.name || '');
      setBio(data.user.bio || '');
      setAvatar(data.user.avatar || '');

      // Keep localStorage in sync
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem(
        'user',
        JSON.stringify({ ...storedUser, ...data.user })
      );

      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-400">Loading profile…</p>
        </div>
      </div>
    );
  }

  const avatarSrc =
    avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'user')}`;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Top nav */}
      <header className="h-16 bg-gray-900/70 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-10">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-lg font-semibold">Edit Profile</h1>
        <div className="w-24" /> {/* spacer */}
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* Avatar section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full border-4 border-indigo-500 overflow-hidden shadow-xl shadow-indigo-500/20 mb-4">
            <img
              src={avatarSrc}
              alt="Profile avatar"
              className="w-full h-full object-cover bg-gray-800"
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'user')}`;
              }}
            />
          </div>
          <h2 className="text-2xl font-bold">{user?.name || 'Your Profile'}</h2>
          <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
          <div className="flex gap-6 mt-4 text-center">
            <div>
              <p className="text-2xl font-bold text-indigo-400">{user?.totalInterviews ?? 0}</p>
              <p className="text-xs text-gray-500 mt-0.5">Interviews</p>
            </div>
            <div className="w-px bg-gray-800" />
            <div>
              <p className="text-2xl font-bold text-amber-400">{user?.streak ?? 0}🔥</p>
              <p className="text-xs text-gray-500 mt-0.5">Day Streak</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSave}
          className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-6 backdrop-blur-sm"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="profile-name">
              Full Name
            </label>
            <input
              id="profile-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-500 outline-none transition-all"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="profile-email">
              Email Address
            </label>
            <input
              id="profile-email"
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-gray-900/30 border border-gray-800 rounded-xl text-gray-500 cursor-not-allowed outline-none"
            />
            <p className="text-xs text-gray-600 mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="profile-bio">
              Bio
            </label>
            <textarea
              id="profile-bio"
              rows={3}
              maxLength={200}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-500 outline-none transition-all resize-none"
              placeholder="Tell us a bit about yourself…"
            />
            <p className="text-xs text-gray-600 mt-1 text-right">{bio.length}/200</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="profile-avatar">
              Avatar URL <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <input
              id="profile-avatar"
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-500 outline-none transition-all"
              placeholder="https://…"
            />
            <p className="text-xs text-gray-600 mt-1">Leave blank to use the auto-generated avatar.</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
          >
            {saving ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Profile;
