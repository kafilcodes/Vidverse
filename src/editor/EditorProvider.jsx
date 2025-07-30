'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from './components/Editor';

const EditorProvider = ({ children }) => {
  const [isEditorActive, setIsEditorActive] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Only render in development environment
  const isDevelopment = process.env.NODE_ENV === 'development';

  const handleEditorAccess = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_EDITOR_PASS || 'vidverse2025';
    
    if (password === correctPassword) {
      setIsAuthorized(true);
      setIsEditorActive(true);
      setShowPasswordModal(false);
      setPassword('');
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword('');
  };

  const handleExitEditor = () => {
    setIsEditorActive(false);
    setIsAuthorized(false);
  };

  // Don't render anything in production
  if (!isDevelopment) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      
      {/* Editor Access Button - Only show if not already active */}
      {!isEditorActive && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEditorAccess}
          className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold p-4 rounded-full shadow-2xl transition-all duration-300 border-2 border-amber-300"
          title="Open Visual Editor"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path
              d="M12 2L13.09 8.26L19 7L17.74 13.09L24 12L17.74 10.91L19 5L13.09 6.26L12 0L10.91 6.26L5 5L6.26 10.91L0 12L6.26 13.09L5 19L10.91 17.74L12 24L13.09 17.74L19 19L17.74 13.09L24 12Z"
              fill="currentColor"
            />
          </svg>
        </motion.button>
      )}

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[10000] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.95) 100%)',
              }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-black"
                  >
                    <path
                      d="M12 1L14.09 8.26L22 7L20.18 14.18L23 16L20.18 9.82L22 17L14.09 15.74L12 23L9.91 15.74L2 17L3.82 9.82L1 8L3.82 14.18L2 7L9.91 8.26L12 1Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">VidVerse Editor</h2>
                <p className="text-gray-400">Enter password to access the visual editor</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter editor password"
                  className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  autoFocus
                />
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-semibold rounded-lg transition-all duration-200"
                  >
                    Access Editor
                  </button>
                </div>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                Development environment only
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Component */}
      {isEditorActive && isAuthorized && (
        <Editor onExit={handleExitEditor} />
      )}
    </>
  );
};

export default EditorProvider;
