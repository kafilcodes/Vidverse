'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Download,
  Settings,
  AlertTriangle
} from 'lucide-react';
import useEditorStore from '../store/editorStore';

const SavedIconManager = () => {
  const { elements, updateElement, deleteElement, selectElement } = useEditorStore();
  const [savedIcons, setSavedIcons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Load saved icons from API
  const loadSavedIcons = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/save-icon-config');
      if (response.ok) {
        const config = await response.json();
        if (config.icons) {
          const iconsArray = Object.values(config.icons);
          setSavedIcons(iconsArray);
        }
      }
    } catch (error) {
      console.error('Failed to load saved icons:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSavedIcons();
  }, []);

  // Delete icon from website (removes from config and optionally deletes file)
  const handleDeleteIcon = async (iconId, deleteFile = true) => {
    try {
      const response = await fetch('/api/save-icon-config', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iconId, deleteFile })
      });

      if (response.ok) {
        // Remove from local state
        setSavedIcons(prev => prev.filter(icon => icon.id !== iconId));
        
        // Remove from editor elements store completely
        if (elements.has(iconId)) {
          deleteElement(iconId);
        }
        
        // Force reload of saved icons to ensure clean state
        setTimeout(() => {
          loadSavedIcons();
        }, 100);
        
        setDeleteConfirm(null);
        console.log(`✅ Icon ${iconId} deleted successfully`);
      } else {
        console.error('Failed to delete icon');
      }
    } catch (error) {
      console.error('Error deleting icon:', error);
    }
  };

  // Load icon into editor for modification
  const handleEditIcon = (icon) => {
    // Add or update in elements store
    updateElement(icon.id, {
      type: 'icon',
      src: icon.publicPath,
      publicPath: icon.publicPath,
      fileName: icon.fileName,
      isSaved: true,
      style: {
        left: icon.settings.position.left,
        top: icon.settings.position.top,
        width: icon.settings.size.width,
        height: icon.settings.size.height,
        zIndex: icon.settings.position.zIndex,
        opacity: icon.settings.appearance.opacity,
        transform: icon.settings.appearance.transform,
        filter: icon.settings.appearance.filter,
        borderRadius: icon.settings.appearance.borderRadius,
        borderWidth: icon.settings.appearance.borderWidth,
        borderColor: icon.settings.appearance.borderColor,
        backgroundColor: icon.settings.appearance.backgroundColor
      }
    });
    
    // Select the icon for editing
    selectElement(icon.id);
  };

  // Toggle icon visibility
  const handleToggleVisibility = async (icon) => {
    const updatedSettings = {
      ...icon,
      settings: {
        ...icon.settings,
        appearance: {
          ...icon.settings.appearance,
          opacity: icon.settings.appearance.opacity === 0 ? 1 : 0
        }
      }
    };

    try {
      const response = await fetch('/api/save-icon-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iconSettings: updatedSettings })
      });

      if (response.ok) {
        setSavedIcons(prev => 
          prev.map(i => i.id === icon.id ? updatedSettings : i)
        );
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  if (savedIcons.length === 0) {
    return (
      <div className="p-4 text-center text-white/60">
        <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No saved icons found</p>
        <p className="text-xs mt-1">Save icons to see them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/10">
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Saved Icons ({savedIcons.length})
        </h3>
        <Button
          onClick={loadSavedIcons}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
          disabled={loading}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Icons List */}
      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar" style={{ scrollBehavior: 'smooth' }}>
        {savedIcons.map((icon) => (
          <motion.div
            key={icon.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-black/20 rounded-lg border border-white/10 p-3 transform will-change-transform"
          >
            {/* Icon Preview and Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-black/40 rounded border border-white/20 flex items-center justify-center overflow-hidden">
                <img
                  src={icon.publicPath}
                  alt={icon.fileName}
                  className="w-full h-full object-contain"
                  style={{
                    filter: icon.settings.appearance.filter || 'none',
                    opacity: icon.settings.appearance.opacity ?? 1
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">
                  {icon.fileName}
                </p>
                <p className="text-xs text-white/60">
                  {icon.settings.size.width}×{icon.settings.size.height}px
                </p>
                <p className="text-xs text-white/40">
                  {icon.settings.appearance.opacity === 0 ? 'Hidden' : 'Visible'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-1">
              <Button
                onClick={() => handleEditIcon(icon)}
                size="sm"
                variant="ghost"
                className="h-8 text-xs bg-blue-500/20 text-blue-400 hover:text-blue-300 hover:bg-blue-500/30 border border-blue-400/30"
              >
                <Edit3 className="w-3 h-3" />
              </Button>
              
              <Button
                onClick={() => handleToggleVisibility(icon)}
                size="sm"
                variant="ghost"
                className={`h-8 text-xs border ${
                  icon.settings.appearance.opacity === 0
                    ? 'bg-gray-500/20 text-gray-400 hover:text-gray-300 hover:bg-gray-500/30 border-gray-400/30'
                    : 'bg-green-500/20 text-green-400 hover:text-green-300 hover:bg-green-500/30 border-green-400/30'
                }`}
              >
                {icon.settings.appearance.opacity === 0 ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </Button>
              
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = icon.fileName;
                  link.href = icon.publicPath;
                  link.click();
                }}
                size="sm"
                variant="ghost"
                className="h-8 text-xs bg-purple-500/20 text-purple-400 hover:text-purple-300 hover:bg-purple-500/30 border border-purple-400/30"
              >
                <Download className="w-3 h-3" />
              </Button>
              
              <Button
                onClick={() => setDeleteConfirm(icon.id)}
                size="sm"
                variant="ghost"
                className="h-8 text-xs bg-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/30 border border-red-400/30"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/90 border border-white/20 rounded-lg p-6 max-w-sm mx-4"
            >
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Delete Icon</h3>
                <p className="text-sm text-white/60 mb-6">
                  This will permanently remove the icon from your website and delete the file.
                </p>
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => setDeleteConfirm(null)}
                    variant="ghost"
                    className="flex-1 bg-white/10 text-white hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDeleteIcon(deleteConfirm, true)}
                    variant="ghost"
                    className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar {
          scroll-behavior: smooth;
          overscroll-behavior: contain;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
          margin: 2px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%);
          border-radius: 3px;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.2s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.4) 100%);
          border-color: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
};

export default SavedIconManager;
