'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff } from 'lucide-react';

const AdminAuth = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_EDITOR_PASS || 'mausi05';
    
    if (password === correctPassword) {
      setError('');
      onAuthenticated(true);
    } else {
      setError('Incorrect password. Redirecting...');
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999] flex items-center justify-center">
      <motion.div
        className="bg-black border border-gold-DEFAULT/30 rounded-2xl p-8 shadow-2xl w-full max-w-md mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="text-center mb-6">
          <motion.div 
            className="inline-block p-3 bg-gradient-to-r from-gold-light to-gold-DEFAULT rounded-full mb-4"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Shield className="text-black" size={28} />
          </motion.div>
          <h2 className="text-2xl font-bold text-white">Admin Access Required</h2>
          <p className="text-gold-DEFAULT/70 mt-2">Please enter the password to continue.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-black border border-gold-DEFAULT/30 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-DEFAULT focus:border-gold-DEFAULT transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-DEFAULT/60 hover:text-gold-DEFAULT transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gold-light to-gold-DEFAULT text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Unlock Admin Panel
          </button>
        </form>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-center mt-4 text-sm"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default AdminAuth;
