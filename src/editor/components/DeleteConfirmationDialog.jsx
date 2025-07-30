'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEditorStore from '../store/editorStore';

const DeleteConfirmationDialog = () => {
  const {
    showDeleteConfirmation,
    elementToDelete,
    hideDeleteDialog,
    confirmDelete,
    elements
  } = useEditorStore();

  const elementData = elementToDelete ? elements.get(elementToDelete) : null;

  if (!showDeleteConfirmation) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9300] flex items-center justify-center"
        data-editor-ui="true"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 border border-red-500/30 rounded-xl p-6 max-w-md mx-4 shadow-2xl"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-red-400"
              >
                <path
                  d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Element</h3>
            <p className="text-gray-400">
              Are you sure you want to delete this element? This action cannot be undone.
            </p>
          </div>

          {elementData && (
            <div className="mb-6 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Element ID:</span>
                  <span className="text-white font-mono text-xs">{elementToDelete}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white capitalize">{elementData.type}</span>
                </div>
                {elementData.type === 'text' && elementData.content && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Content:</span>
                    <span className="text-white text-xs max-w-32 truncate">
                      &ldquo;{elementData.content}&rdquo;
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={hideDeleteDialog}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all duration-200 font-medium"
            >
              Delete
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Press <kbd className="bg-gray-800 px-1 py-0.5 rounded text-xs">Delete</kbd> key to quickly delete selected elements
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteConfirmationDialog;
