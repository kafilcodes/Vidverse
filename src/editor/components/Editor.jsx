'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEditorStore from '../store/editorStore';
import ElementSelector from './ElementSelector';
import FloatingEditor from './FloatingEditor';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import ElementRenderer from './ElementRenderer';
import EditorTutorial from './EditorTutorial';

const Editor = ({ onExit }) => {
  const {
    isEditorOpen,
    setEditorOpen,
    selectedElement,
    elements,
    showDeleteConfirmation,
    loadElements,
    canUndo,
    canRedo,
    undo,
    redo,
    resetSession,
    saveChanges,
    hasUnsavedChanges,
    deleteElement
  } = useEditorStore();

  // Load elements on mount
  useEffect(() => {
    loadElements();
  }, [loadElements]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle shortcuts when editor is active
      if (!isEditorOpen) return;
      
      // Prevent shortcuts when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'Escape':
            e.preventDefault();
            handleExit();
            break;
        }
      }
      
      // Delete key
      if (e.key === 'Delete' && selectedElement) {
        e.preventDefault();
        useEditorStore.getState().showDeleteDialog(selectedElement);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEditorOpen, selectedElement, undo, redo]);

  const handleSave = async () => {
    const result = await saveChanges();
    if (result.success) {
      // Show success notification
      console.log('✅ Changes saved successfully!');
    } else {
      console.error('❌ Failed to save changes:', result.error);
    }
  };

  const handleUndo = () => {
    if (canUndo()) {
      undo();
    }
  };

  const handleRedo = () => {
    if (canRedo()) {
      redo();
    }
  };

  const handleReset = () => {
    if (hasUnsavedChanges()) {
      const confirmed = window.confirm(
        'Are you sure you want to reset? All unsaved changes will be lost.'
      );
      if (confirmed) {
        resetSession();
      }
    } else {
      resetSession();
    }
  };

  const handleExit = () => {
    if (hasUnsavedChanges()) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to exit?'
      );
      if (confirmed) {
        onExit();
      }
    } else {
      onExit();
    }
  };

  return (
    <>
      {/* Editor Overlay */}
      <div className="fixed inset-0 z-[9000] pointer-events-none">
        {/* Element Selector - handles click detection */}
        <ElementSelector />
        
        {/* Rendered Elements */}
        <div className="absolute inset-0">
          {Array.from(elements.entries()).map(([id, element]) => (
            <ElementRenderer key={id} elementId={id} element={element} />
          ))}
        </div>
      </div>

      {/* Editor Sidebar */}
      <AnimatePresence>
        <FloatingEditor
          isOpen={isEditorOpen}
          onToggle={() => setEditorOpen(!isEditorOpen)}
          onSave={handleSave}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onReset={handleReset}
          onExit={handleExit}
          canUndo={canUndo()}
          canRedo={canRedo()}
          hasUnsavedChanges={hasUnsavedChanges()}
          onDeleteElement={deleteElement}
        />
      </AnimatePresence>

      {/* Toggle Button (when editor is closed) */}
      <AnimatePresence>
        {!isEditorOpen && (
          <motion.button
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            onClick={() => setEditorOpen(true)}
            className="fixed top-1/2 -translate-y-1/2 right-4 z-[9100] bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white p-4 rounded-full shadow-2xl transition-all duration-300 pointer-events-auto w-14 h-14 flex items-center justify-center"
            title="Open Icon Studio"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9H3V15H21V9ZM11 15H13V22H11V15Z"
                fill="currentColor"
              />
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && <DeleteConfirmationDialog />}

      {/* Tutorial */}
      <EditorTutorial />

      {/* Editor Mode Indicator */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9200] pointer-events-none">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/90 backdrop-blur-xl border border-amber-500/30 rounded-full px-6 py-3 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-white font-semibold">Visual Editor Active</span>
            <span className="text-amber-400 text-sm">
              {hasUnsavedChanges() ? '● Unsaved' : '● Saved'}
            </span>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Editor;
