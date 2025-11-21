// src/pages/Login.jsx
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Uğurlu girişdən sonra Admin panelə yönəlt
      navigate('/admin');
    } catch (err) {
      setError("Email və ya şifrə yanlışdır!");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium-black px-4">
      <div className="w-full max-w-md bg-gray-900/80 p-8 rounded-2xl border border-gold/20 shadow-2xl backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-gold mb-2">Admin Giriş</h1>
          <p className="text-off-white/60 text-sm">Qr Menu idarəetmə paneli</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-off-white/70 text-sm mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white focus:border-gold focus:outline-none transition-colors"
              placeholder="admin@qrmenutest.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-off-white/70 text-sm mb-1">Şifrə</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white focus:border-gold focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-gold hover:bg-yellow-600 text-premium-black font-bold py-3 rounded-lg transition-all duration-300 mt-4"
          >
            Daxil Ol
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;