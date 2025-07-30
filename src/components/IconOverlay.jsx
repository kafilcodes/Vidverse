'use client';

import React, { useEffect, useState } from 'react';
import useEditorStore from '@/editor/store/editorStore';

const IconOverlay = () => {
  const { elements, isEditorOpen } = useEditorStore();
  const [savedIcons, setSavedIcons] = useState([]);

  // Load saved icons from localStorage and elements store
  useEffect(() => {
    const loadSavedIcons = async () => {
      const iconsArray = [];
      
      // Get icons from elements store (current session)
      elements.forEach((element, id) => {
        if (element.type === 'icon' && element.isSaved) {
          iconsArray.push({
            id,
            ...element
          });
        }
      });
      
      // Also load from persistent config file (previous sessions)
      try {
        const configResponse = await fetch('/api/save-icon-config');
        if (configResponse.ok) {
          const config = await configResponse.json();
          if (config.icons) {
            Object.values(config.icons).forEach(iconConfig => {
              // Only add if not already in current session and opacity > 0 (visible)
              const isVisible = (iconConfig.settings?.appearance?.opacity ?? 1) > 0;
              if (isVisible && !iconsArray.find(icon => icon.id === iconConfig.id)) {
                iconsArray.push({
                  id: iconConfig.id,
                  type: 'icon',
                  src: iconConfig.publicPath,
                  publicPath: iconConfig.publicPath,
                  fileName: iconConfig.fileName,
                  isSaved: true,
                  style: {
                    left: iconConfig.settings.position.left,
                    top: iconConfig.settings.position.top,
                    width: iconConfig.settings.size.width,
                    height: iconConfig.settings.size.height,
                    zIndex: iconConfig.settings.position.zIndex,
                    opacity: iconConfig.settings.appearance.opacity,
                    transform: iconConfig.settings.appearance.transform,
                    filter: iconConfig.settings.appearance.filter,
                    borderRadius: iconConfig.settings.appearance.borderRadius,
                    borderWidth: iconConfig.settings.appearance.borderWidth,
                    borderColor: iconConfig.settings.appearance.borderColor,
                    backgroundColor: iconConfig.settings.appearance.backgroundColor
                  }
                });
              }
            });
          }
        }
      } catch (error) {
        console.warn('Could not load persistent icon config:', error);
      }
      
      setSavedIcons(iconsArray);
    };

    loadSavedIcons();
    
    // Listen for changes in elements - reduced frequency to avoid spam
    const interval = setInterval(loadSavedIcons, 5000); // Every 5 seconds instead of 2
    return () => clearInterval(interval);
  }, [elements]);

  // Only show icons if they have been explicitly saved
  const visibleIcons = savedIcons.filter(icon => icon.isSaved);

  return (
    <>
      {visibleIcons.map((icon) => (
        <div
          key={icon.id}
          className="fixed pointer-events-none"
          style={{
            left: icon.style?.left || 0,
            top: icon.style?.top || 0,
            width: icon.style?.width || 100,
            height: icon.style?.height || 100,
            zIndex: icon.style?.zIndex || 1000,
            opacity: icon.style?.opacity ?? 1,
            transform: icon.style?.transform || 'none',
            filter: icon.style?.filter || 'none',
            borderRadius: icon.style?.borderRadius || 0,
            borderWidth: icon.style?.borderWidth || 0,
            borderColor: icon.style?.borderColor || 'transparent',
            borderStyle: 'solid',
            backgroundColor: icon.style?.backgroundColor || 'transparent',
            transition: 'all 0.3s ease',
            // Enable pointer events only when editor is open for editing
            pointerEvents: isEditorOpen ? 'auto' : 'none'
          }}
        >
          <img
            src={icon.publicPath || icon.src}
            alt={icon.fileName || 'Icon'}
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>
      ))}
    </>
  );
};

export default IconOverlay;
