import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from "../api/auth";
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
const [loading, setLoading] = useState(false);
  const handleRegister = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    const response = await register(name, email, password);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    navigate("/dashboard");

  } catch (error) {
    alert(error.response?.data?.message || "Registration Failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-teal-900/40 via-gray-950 to-gray-950 relative overflow-hidden">
      
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative w-full max-w-md p-8 m-4 rounded-3xl bg-gray-900/60 backdrop-blur-xl border border-gray-800 shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">Join InterviewAI</h2>
          <p className="text-gray-400 mt-2">Start your journey to interview success</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="name">Full Name</label>
            <input 
              id="name" 
              type="text" 
              required
              className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              required
              className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              required
              className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
  type="submit"
  disabled={loading}
  className="w-full py-3 px-4 mt-2 flex justify-center items-center gap-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-600/30 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? "Creating Account..." : "Create Account"}
</button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link
  to="/"
  className="font-semibold text-teal-400 hover:text-teal-300 transition-colors"
>
  Sign in
</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
