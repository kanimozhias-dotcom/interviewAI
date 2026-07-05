import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getMe, deleteAccount } from "../api/auth";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const [user, setUser] = useState({
  name: "",
  email: "",
  bio: "",
  avatar: "",
});

useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  fetchUser();
}, []);

const handleSave = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          bio: user.bio,
          avatar: user.avatar,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Profile Updated Successfully!");

      setUser(data.user);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    }
  } catch (err) {
    console.log(err);
  }
};

const navigate = useNavigate();

const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete your account?"
  );

  if (!confirmDelete) return;

  try {
    await deleteAccount();

    localStorage.clear();

    alert("Account deleted successfully!");

    // Force the browser to the root route
    window.location.replace("/");

  } catch (error) {
    console.error(error);
    alert("Failed to delete account.");
  }
};
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back
          </Link>
          <span className="font-semibold text-lg">Profile Settings</span>
          <div className="w-16"></div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-2">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 text-center mb-6">
              <div className="w-24 h-24 mx-auto rounded-full border-4 border-indigo-500/30 overflow-hidden mb-4">
                <img src={user.avatar ||`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Profile" className="w-full h-full bg-gray-800" />
              </div>
              <h2 className="font-bold text-lg sm:text-xl break-words">
  {user.name}
</h2>
              <p className="text-gray-400 text-sm mt-1">Pro Member</p>
            </div>
            
            <button className="w-full text-left px-4 py-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-medium">
              General Info
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-900 text-gray-400 hover:text-white transition-colors">
              Resume Parsed Data
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-900 text-gray-400 hover:text-white transition-colors">
              Subscription
            </button>
          </div>

          {/* Main Form Area */}
          <div className="flex-1 bg-gray-900/40 border border-gray-800 rounded-3xl p-5 sm:p-6 md:p-8">
            <h3 className="text-2xl font-bold mb-6">General Information</h3>
            
            <form className="space-y-6" onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                  <input type="text" value={user.name} onChange={(e)=> setUser({...user,name:e.target.value})}className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white" />
                </div>
            </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input type="email" value={user.email} readOnly className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Current Title</label>
                <input type="text" value={user.bio} onChange={(e)=> setUser({...user,bio:e.target.value})} placeholder="Tell us about yourself" className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white" />
              </div>

              <div className="pt-6 border-t border-gray-800 flex justify-end gap-4">
                <button type="button" className="px-6 py-2 rounded-xl text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all font-medium">Save Changes</button>
              </div>
            </form>

            <div className="mt-12 pt-8 border-t border-gray-800">
              <h4 className="text-lg font-bold text-red-400 mb-4">Danger Zone</h4>
              <button type="button" onClick={handleDelete} className="px-6 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium">
  Delete Account
</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Profile;
