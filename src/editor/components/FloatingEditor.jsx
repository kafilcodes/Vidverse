'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  X, 
  Palette,
  Settings,
  Move,
  Save,
  RotateCcw,
  Undo,
  Redo,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Maximize2,
  Minimize2,
  Upload
} from 'lucide-react';
import useEditorStore from '../store/editorStore';
import IconEditorDark from './modules/IconEditorDark';
import SavedIconManager from './SavedIconManager';

const FloatingEditor = ({ 
  onSave, 
  onUndo, 
  onRedo, 
  onReset, 
  onExit, 
  canUndo, 
  canRedo, 
  hasUnsavedChanges,
  onDeleteElement,
  isOpen: externalIsOpen,
  onToggle
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Start close to top-left
  const [size, setSize] = useState({ width: 400, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('editor'); // Add tab state
  const [manuallyCleared, setManuallyCleared] = useState(false); // Track manual clear
  const editorRef = useRef(null);
  const resizeRef = useRef(null);

  // Initialize position safely after component mounts - ALWAYS WITHIN VIEWPORT
  React.useEffect(() => {
    // Wait for next tick to ensure window is available
    const initializePosition = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Always start near top-left corner but with safe margins
      const safeX = 50; // 50px from left edge
      const safeY = 50; // 50px from top edge
      
      // Ensure it doesn't exceed viewport bounds
      const maxX = Math.max(50, viewportWidth - 450); // Account for editor width
      const maxY = Math.max(50, viewportHeight - 650); // Account for editor height
      
      console.log('Viewport:', { viewportWidth, viewportHeight });
      console.log('Safe position:', { x: Math.min(safeX, maxX), y: Math.min(safeY, maxY) });
      
      setPosition({ 
        x: Math.min(safeX, maxX), 
        y: Math.min(safeY, maxY) 
      });
    };

    // Use setTimeout to ensure proper initialization
    setTimeout(initializePosition, 100);
  }, []);

  // Sync with external state if provided
  React.useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
      
      // When opening, ensure position is safe
      if (externalIsOpen) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        setPosition(prev => ({
          x: Math.max(0, Math.min(prev.x, viewportWidth - 400)),
          y: Math.max(0, Math.min(prev.y, viewportHeight - 600))
        }));
      }
    }
  }, [externalIsOpen]);

  // Handle toggle function
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setIsOpen(!isOpen);
    }
  };
  
  const {
    isEditorOpen,
    setEditorOpen,
    selectedElement,
    setSelectedElement,
    elements,
    addElement,
    updateElement,
    deleteElement
  } = useEditorStore();

  // Clean up deleted icons from elements store
  const cleanupDeletedIcons = useCallback(async () => {
    try {
      const response = await fetch('/api/save-icon-config');
      if (response.ok) {
        const config = await response.json();
        const savedIconIds = new Set(Object.keys(config.icons || {}));
        
        // Remove any icons from elements store that are no longer in saved config
        elements.forEach((element, elementId) => {
          if (element.type === 'icon' && element.isSaved && !savedIconIds.has(elementId)) {
            console.log(`🧹 Cleaning up deleted icon: ${elementId}`);
            deleteElement(elementId);
          }
        });
      }
    } catch (error) {
      console.warn('Could not verify saved icons:', error);
    }
  }, [elements, deleteElement]);

  // Clean up when switching to manager tab
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (newTab === 'manager') {
      cleanupDeletedIcons();
    }
  };

  // Get active icon for editing - persistent selection logic
  const getActiveIcon = () => {
    // If an icon is explicitly selected, use it
    if (selectedElement && elements.has(selectedElement)) {
      const element = elements.get(selectedElement);
      if (element?.type === 'icon') {
        return { id: selectedElement, data: element };
      }
    }
    
    // If no selection or invalid selection, find the most recent icon
    const iconElements = Array.from(elements.entries())
      .filter(([id, element]) => element.type === 'icon')
      .sort((a, b) => {
        // Sort by creation time (ID contains timestamp)
        const timeA = parseInt(a[0].split('-')[1]) || 0;
        const timeB = parseInt(b[0].split('-')[1]) || 0;
        return timeB - timeA; // Most recent first
      });
    
    if (iconElements.length > 0) {
      const [mostRecentId, mostRecentData] = iconElements[0];
      return { id: mostRecentId, data: mostRecentData };
    }
    
    return null; // No icons available
  };

  const activeIcon = getActiveIcon();
  const selectedElementData = activeIcon?.data || null;

  // Auto-select the most recent icon if nothing is selected (moved to useEffect)
  React.useEffect(() => {
    if (!manuallyCleared && !selectedElement && elements.size > 0) {
      const activeIconData = getActiveIcon();
      if (activeIconData) {
        setSelectedElement(activeIconData.id);
      }
    }
  }, [elements, selectedElement, manuallyCleared, setSelectedElement, getActiveIcon]);

  // Clean up deleted icons when editor opens
  React.useEffect(() => {
    if (isOpen || externalIsOpen) {
      cleanupDeletedIcons();
    }
  }, [isOpen, externalIsOpen, cleanupDeletedIcons]);  // Hide/Show functionality
  const handleToggleVisibility = () => {
    if (!activeIcon) return;
    const currentOpacity = activeIcon.data.style?.opacity ?? 1;
    const newOpacity = currentOpacity === 0 ? 1 : 0;
    
    updateElement(activeIcon.id, {
      style: {
        ...activeIcon.data.style,
        opacity: newOpacity
      }
    });
  };

  // Duplicate functionality
  const handleDuplicate = () => {
    if (!activeIcon) return;
    const newIcon = {
      ...activeIcon.data,
      id: `icon-${Date.now()}`,
      style: {
        ...activeIcon.data.style,
        left: (activeIcon.data.style?.left || 0) + 20,
        top: (activeIcon.data.style?.top || 0) + 20,
        zIndex: (activeIcon.data.style?.zIndex || 1000) + 1
      }
    };
    addElement(newIcon);
    setSelectedElement(newIcon.id);
  };

  // Clear selection functionality
  const handleClearSelection = () => {
    console.log('Clearing selection...');
    setManuallyCleared(true); // Prevent auto-selection
    setSelectedElement(null);
  };

  // Delete functionality  
  const handleDelete = () => {
    if (!activeIcon) return;
    if (onDeleteElement) {
      onDeleteElement(activeIcon.id);
    }
    
    // After deletion, clear selection and let auto-selection pick the next one
    setSelectedElement(null);
  };

  // Comprehensive save functionality - Part 2 implementation
  const handleSaveIcon = async () => {
    if (!activeIcon) {
      console.warn('No active icon to save');
      return;
    }

    try {
      console.log('Starting save process for icon:', activeIcon.id);

      // 1. Generate unique filename
      const timestamp = Date.now();
      const originalFileName = activeIcon.data.fileName || `icon-${timestamp}`;
      const fileName = originalFileName.includes('.') ? originalFileName : `${originalFileName}.png`;

      // 2. Copy Icon File to public/logo directory FIRST
      let uploadResult = null;
      if (activeIcon.data.src) {
        uploadResult = await copyIconToPublicFolder(activeIcon.data.src, fileName);
        console.log('Upload result:', uploadResult);
      }

      // 3. Save Icon Settings
      const iconSettings = {
        id: activeIcon.id,
        fileName: fileName,
        publicPath: uploadResult?.filePath || `/logo/${fileName}`,
        settings: {
          position: {
            left: activeIcon.data.style?.left || 0,
            top: activeIcon.data.style?.top || 0,
            zIndex: activeIcon.data.style?.zIndex || 1000
          },
          size: {
            width: activeIcon.data.style?.width || 100,
            height: activeIcon.data.style?.height || 100
          },
          appearance: {
            opacity: activeIcon.data.style?.opacity ?? 1,
            transform: activeIcon.data.style?.transform || 'rotate(0deg) scale(1) skew(0deg)',
            filter: activeIcon.data.style?.filter || 'none',
            borderRadius: activeIcon.data.style?.borderRadius || 0,
            borderWidth: activeIcon.data.style?.borderWidth || 0,
            borderColor: activeIcon.data.style?.borderColor || 'transparent',
            backgroundColor: activeIcon.data.style?.backgroundColor || 'transparent'
          },
          properties: activeIcon.data.properties || {}
        },
        savedAt: new Date().toISOString()
      };

      // Save settings to localStorage
      const savedIcons = JSON.parse(localStorage.getItem('vidverse-icon-settings') || '{}');
      savedIcons[activeIcon.id] = iconSettings;
      localStorage.setItem('vidverse-icon-settings', JSON.stringify(savedIcons));

      // 4. Save to persistent config file
      try {
        const configResponse = await fetch('/api/save-icon-config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ iconSettings })
        });
        
        if (configResponse.ok) {
          const configResult = await configResponse.json();
          console.log('✅ Icon config saved to file:', configResult);
        } else {
          console.warn('⚠️ Failed to save icon config to file');
        }
      } catch (configError) {
        console.warn('⚠️ Error saving icon config:', configError);
      }

      // 5. Apply Real-time Changes (update the live website immediately)
      updateElement(activeIcon.id, {
        ...activeIcon.data,
        fileName: fileName,
        isSaved: true,
        lastSaved: new Date().toISOString(),
        publicPath: iconSettings.publicPath
      });

      // 6. Trigger any save callbacks
      if (onSave) {
        onSave(iconSettings);
      }

      console.log('✅ Icon saved successfully and will appear on website:', iconSettings);
      alert(`✅ Icon saved successfully!\n\n📁 File: ${iconSettings.publicPath}\n🌐 The icon will now appear on your website at the specified position.\n\n💡 Tip: You can now see it overlaid on your website background!`);
      
    } catch (error) {
      console.error('❌ Error saving icon:', error);
      alert(`❌ Failed to save icon: ${error.message}\n\nPlease check the console for more details.`);
    }
  };

  // Helper function to copy icon to public/logo folder
  const copyIconToPublicFolder = async (srcData, fileName) => {
    try {
      console.log('Uploading icon to public/logo:', fileName);
      
      // Convert base64 to blob
      const response = await fetch(srcData);
      const blob = await response.blob();
      
      // Determine file extension
      const extension = blob.type.split('/')[1] || 'png';
      const finalFileName = fileName.includes('.') ? fileName : `${fileName}.${extension}`;
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('icon', blob, finalFileName);
      formData.append('destination', 'public/logo');
      
      // Send to server endpoint
      const uploadResponse = await fetch('/api/upload-icon', {
        method: 'POST',
        body: formData
      });
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Failed to upload icon to server: ${errorText}`);
      }
      
      const result = await uploadResponse.json();
      console.log('✅ Icon uploaded to public/logo successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Error copying icon to public folder:', error);
      // Fallback: save to localStorage with base64 data
      const iconData = {
        fileName: fileName,
        data: srcData,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(`vidverse-icon-${fileName}`, JSON.stringify(iconData));
      throw error; // Re-throw to let calling function handle it
    }
  };

  const handleAddIcon = () => {
    // Create file input for icon upload
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,.svg';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newIcon = {
            id: `icon-${Date.now()}`,
            type: 'icon',
            src: event.target.result,
            fileName: file.name,
            fileType: file.type,
            isSaved: false, // Not saved initially
            style: {
              position: 'absolute',
              left: (window.innerWidth / 2) - 50, // Center horizontally
              top: (window.innerHeight / 2) - 50, // Center vertically
              width: 100,
              height: 100,
              zIndex: 10, // Background icon z-index
              opacity: 1,
              transform: 'rotate(0deg) scale(1) skew(0deg)',
              filter: 'none',
              borderRadius: 0,
              borderWidth: 0,
              borderColor: 'transparent',
              backgroundColor: 'transparent'
            },
            properties: {
              fill: '#ffffff',
              stroke: 'none',
              strokeWidth: 1
            }
          };
          
          console.log('Adding new icon:', newIcon);
          addElement(newIcon);
          setSelectedElement(newIcon.id);
        };
        reader.readAsDataURL(file);
      }
    };
    
    // Trigger file selection
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  // Dragging functionality
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.resize-handle') || e.target.closest('.no-drag')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  }, [position]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Proper viewport constraints with padding
      const padding = 20;
      const maxX = window.innerWidth - size.width - padding;
      const maxY = window.innerHeight - size.height - padding;
      
      setPosition({
        x: Math.max(padding, Math.min(maxX, newX)),
        y: Math.max(padding, Math.min(maxY, newY))
      });
    }
    
    if (isResizing) {
      const minWidth = 350;
      const maxWidth = Math.min(800, window.innerWidth - position.x - 20);
      const minHeight = 400;
      const maxHeight = window.innerHeight - position.y - 20;
      
      const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - position.x));
      const newHeight = Math.max(minHeight, Math.min(maxHeight, e.clientY - position.y));
      setSize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing, dragStart, position, size]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  // Resize functionality
  const handleResizeStart = useCallback((e) => {
    setIsResizing(true);
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Add/remove event listeners
  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isDragging ? 'grabbing' : 'nw-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <>
      {/* Floating Editor Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={editorRef}
            initial={{ 
              scale: 0.8, 
              opacity: 0
            }}
            animate={{ 
              scale: 1, 
              opacity: 1
            }}
            exit={{ 
              scale: 0.8, 
              opacity: 0
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bg-gradient-to-br from-black/95 via-black/90 to-black/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden z-50"
            style={{
              width: size.width,
              height: size.height,
              left: Math.max(0, Math.min(position.x, window.innerWidth - size.width)),
              top: Math.max(0, Math.min(position.y, window.innerHeight - size.height))
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Header with Drag Handle */}
            <div 
              className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-xl cursor-grab active:cursor-grabbing"
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg">
                    <Palette className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-white font-semibold text-base tracking-wide">Icon Studio</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-white/10 text-white text-xs border-white/20 px-2 py-1 backdrop-blur-sm">
                        {elements.size} {elements.size === 1 ? 'icon' : 'icons'}
                      </Badge>
                      {activeIcon && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-300 text-xs border-blue-400/30 px-2 py-1">
                          Active: {activeIcon.data.fileName || activeIcon.id.slice(-8)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeIcon && (
                    <Button
                      onClick={handleClearSelection}
                      variant="ghost"
                      size="sm"
                      className="bg-black/20 text-white/60 hover:text-white hover:bg-black/40 w-8 h-8 p-0 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20 no-drag"
                      title="Clear Active Icon"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-black/20 text-white/60 hover:text-white hover:bg-black/40 w-8 h-8 p-0 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20 no-drag"
                    title="Move"
                  >
                    <Move className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleToggle}
                    variant="ghost"
                    size="sm"
                    className="bg-black/20 text-white/60 hover:text-white hover:bg-black/40 w-8 h-8 p-0 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20 no-drag"
                    title="Close Editor"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-2 no-drag">
                {/* Primary Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleSaveIcon}
                    variant={hasUnsavedChanges ? "default" : "secondary"}
                    size="sm"
                    className={`h-9 text-sm font-medium transition-all duration-300 ${
                      hasUnsavedChanges
                        ? 'bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-lg border-emerald-500/30'
                        : 'bg-white/5 text-emerald-400 border-emerald-400/30 hover:bg-emerald-500/10'
                    } backdrop-blur-sm border rounded-lg`}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {hasUnsavedChanges ? 'Save' : 'Saved'}
                  </Button>
                  
                  {activeIcon && (
                    <Button
                      onClick={handleToggleVisibility}
                      variant="ghost"
                      size="sm"
                      className={`h-9 text-sm transition-all duration-300 backdrop-blur-sm border rounded-lg ${
                        (activeIcon.data.style?.opacity ?? 1) === 0 
                          ? 'bg-black/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 border-red-400/30' 
                          : 'bg-black/20 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 border-blue-400/30'
                      }`}
                    >
                      {(activeIcon.data.style?.opacity ?? 1) === 0 ? (
                        <><EyeOff className="w-4 h-4 mr-2" />Show</>
                      ) : (
                        <><Eye className="w-4 h-4 mr-2" />Hide</>
                      )}
                    </Button>
                  )}
                </div>

                {/* Secondary Actions */}
                {activeIcon && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleDuplicate}
                      variant="ghost"
                      size="sm"
                      className="h-9 text-sm bg-black/20 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 hover:border-blue-400/50 rounded-lg transition-all duration-300"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </Button>
                    
                    <Button
                      onClick={handleDelete}
                      variant="ghost"
                      size="sm"
                      className="h-9 text-sm bg-black/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 backdrop-blur-sm border border-red-400/30 hover:border-red-400/50 rounded-lg transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}

                {/* History Actions */}
                <div className="grid grid-cols-3 gap-1">
                  <Button
                    onClick={onUndo}
                    disabled={!canUndo}
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs bg-black/20 text-white/60 hover:text-white hover:bg-blue-500/20 disabled:opacity-30 backdrop-blur-sm border border-white/10 hover:border-blue-400/30 rounded-lg transition-all duration-300"
                  >
                    <Undo className="w-3 h-3 mr-1" />
                    Undo
                  </Button>
                  
                  <Button
                    onClick={onRedo}
                    disabled={!canRedo}
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs bg-black/20 text-white/60 hover:text-white hover:bg-blue-500/20 disabled:opacity-30 backdrop-blur-sm border border-white/10 hover:border-blue-400/30 rounded-lg transition-all duration-300"
                  >
                    <Redo className="w-3 h-3 mr-1" />
                    Redo
                  </Button>
                  
                  <Button
                    onClick={onReset}
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs bg-black/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 backdrop-blur-sm border border-red-400/30 hover:border-red-400/50 rounded-lg transition-all duration-300"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex bg-black/20 rounded-lg p-1 border border-white/10">
                <Button
                  onClick={() => handleTabChange('editor')}
                  variant="ghost"
                  size="sm"
                  className={`flex-1 h-8 text-xs transition-all duration-200 ${
                    activeTab === 'editor'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Palette className="w-3 h-3 mr-1" />
                  Editor
                </Button>
                <Button
                  onClick={() => handleTabChange('manager')}
                  variant="ghost"
                  size="sm"
                  className={`flex-1 h-8 text-xs transition-all duration-200 ${
                    activeTab === 'manager'
                      ? 'bg-green-500/20 text-green-300 border-green-400/30'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Saved Icons
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div 
              className="flex-1 relative overflow-hidden no-drag" 
              style={{ 
                height: size.height - 140,
                willChange: 'scroll-position',
                contain: 'layout style paint'
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <ScrollArea className="h-full w-full" style={{ scrollBehavior: 'smooth' }}>
                <div 
                  className="p-4"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {activeTab === 'editor' ? (
                    // Editor Tab Content
                    activeIcon ? (
                      <IconEditorDark activeIconId={activeIcon.id} />
                    ) : (
                      <div className="text-center py-8">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-lg backdrop-blur-sm"
                        >
                          <Palette className="w-8 h-8 text-white" />
                        </motion.div>
                        <h4 className="text-white font-semibold text-lg mb-2 tracking-wide">No Icon Available</h4>
                        <p className="text-white/60 text-sm mb-4 max-w-xs mx-auto leading-relaxed">
                          Upload an icon to begin editing
                        </p>
                        <Button
                          onClick={handleAddIcon}
                          className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 text-white border border-white/20 hover:border-white/30 font-medium px-4 py-2 rounded-xl text-sm transition-all duration-300 shadow-lg backdrop-blur-sm"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload New Icon
                        </Button>
                      </div>
                    )
                  ) : (
                    // Saved Icons Manager Tab Content
                    <SavedIconManager />
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Resize Handle */}
            <div
              ref={resizeRef}
              onMouseDown={handleResizeStart}
              className="absolute bottom-0 right-0 w-6 h-6 cursor-nw-resize bg-gradient-to-br from-blue-500/20 to-purple-600/20 hover:from-blue-500/40 hover:to-purple-600/40 border-l border-t border-white/10 hover:border-white/20 transition-all duration-200 resize-handle"
              title="Resize Editor"
            >
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/40 rounded-full" />
              <div className="absolute bottom-1 right-3 w-1 h-1 bg-white/40 rounded-full" />
              <div className="absolute bottom-3 right-1 w-1 h-1 bg-white/40 rounded-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingEditor;
