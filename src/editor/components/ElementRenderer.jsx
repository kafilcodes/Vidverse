'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import useEditorStore from '../store/editorStore';
import ResizableIcon from './ResizableIcon';

const ElementRenderer = ({ elementId, element }) => {
  const { selectedElement, setSelectedElement, updateElement } = useEditorStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  const isSelected = selectedElement === elementId;

  // Mouse move handler with pixel values and extended boundaries
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Allow elements to move outside viewport boundaries for edge positioning
    const newLeft = elementStart.x + deltaX;
    const newTop = elementStart.y + deltaY;
    
    // Allow negative positioning (half outside viewport)
    const minLeft = -200; // Allow 200px outside left edge
    const minTop = -200;  // Allow 200px outside top edge
    const maxLeft = window.innerWidth + 200; // Allow 200px outside right edge
    const maxTop = window.innerHeight + 200; // Allow 200px outside bottom edge
    
    const boundedLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
    const boundedTop = Math.max(minTop, Math.min(newTop, maxTop));
    
    updateElement(elementId, {
      style: {
        ...element.style,
        left: `${boundedLeft}px`,
        top: `${boundedTop}px`,
        position: 'absolute'
      }
    });
  }, [isDragging, dragStart, elementStart, elementId, element.style, updateElement]);

  // Mouse up handler
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // For icon elements, use the ResizableIcon component
  if (element.type === 'icon') {
    return (
      <ResizableIcon
        elementId={elementId}
        element={element}
        onUpdate={updateElement}
        isSelected={isSelected}
        onSelect={setSelectedElement}
      />
    );
  }

  // Validate and sanitize style values with proper pixel handling
  const sanitizeStyle = (style) => {
    const sanitized = { ...style };
    
    // Convert values to proper numbers from pixel strings
    ['left', 'top', 'width', 'height'].forEach(prop => {
      if (sanitized[prop] !== undefined) {
        const val = sanitized[prop];
        if (typeof val === 'string') {
          // Remove 'px' and convert to number
          const num = parseFloat(val.replace('px', ''));
          sanitized[prop] = isNaN(num) ? 0 : num;
        } else if (typeof val === 'number') {
          sanitized[prop] = isNaN(val) ? 0 : val;
        }
      }
    });

    // Handle zIndex separately
    if (sanitized.zIndex !== undefined) {
      const zVal = parseInt(sanitized.zIndex);
      sanitized.zIndex = isNaN(zVal) ? 1000 : zVal;
    }

    // Ensure required position values
    if (sanitized.left === undefined || isNaN(sanitized.left)) sanitized.left = 0;
    if (sanitized.top === undefined || isNaN(sanitized.top)) sanitized.top = 0;
    if (!sanitized.position) sanitized.position = 'absolute';

    return sanitized;
  };

  const sanitizedStyle = sanitizeStyle(element.style || {});

  const handleMouseDown = (e) => {
    // Ignore if clicking on editor UI
    if (e.target.closest('[data-editor-ui]')) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Select the element
    setSelectedElement(elementId);
    
    // Start dragging
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
    
    // Get current position as numbers (not pixels)
    const currentLeft = sanitizedStyle.left || 0;
    const currentTop = sanitizedStyle.top || 0;
    
    setElementStart({
      x: currentLeft,
      y: currentTop
    });
  };

  const renderElement = () => {
    // Extract only size-related styles for inner elements
    const innerStyle = {
      width: sanitizedStyle.width ? `${sanitizedStyle.width}px` : '48px',
      height: sanitizedStyle.height ? `${sanitizedStyle.height}px` : '48px',
      ...Object.fromEntries(
        Object.entries(sanitizedStyle).filter(([key]) => 
          !['left', 'top', 'position', 'zIndex'].includes(key)
        )
      )
    };
    
    switch (element.type) {
      case 'icon':
        return (
          <div
            ref={elementRef}
            className={`cursor-grab active:cursor-grabbing select-none transition-opacity ${
              isDragging ? 'opacity-70 scale-105' : 'opacity-100'
            } ${isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black' : ''}`}
            style={innerStyle}
            onMouseDown={handleMouseDown}
            data-editable="true"
            data-element-id={elementId}
          >
            {element.src ? (
              <img
                src={element.src}
                alt="Icon"
                className="w-full h-full object-contain pointer-events-none select-none"
                style={{
                  filter: element.properties?.colorOverlay || element.style?.filter || 'none'
                }}
                draggable={false}
              />
            ) : (
              // Empty placeholder when no image uploaded
              <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-yellow-600/20 border-2 border-dashed border-amber-500/50 rounded-lg flex items-center justify-center text-amber-400 hover:border-amber-400 transition-all">
                <div className="text-center pointer-events-none select-none">
                  <div className="text-3xl mb-2">📁</div>
                  <p className="text-xs font-medium">Drop or Upload</p>
                  <p className="text-xs opacity-60">Icon Here</p>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'text':
        return (
          <div
            ref={elementRef}
            className={`cursor-grab active:cursor-grabbing select-none whitespace-pre-wrap transition-all ${
              isDragging ? 'opacity-70 scale-105' : 'opacity-100'
            } ${isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black' : ''}`}
            style={innerStyle}
            onMouseDown={handleMouseDown}
            data-editable="true"
            data-element-id={elementId}
          >
            {element.content || 'Click to edit text'}
          </div>
        );
        
      default:
        return (
          <div
            ref={elementRef}
            className={`cursor-grab active:cursor-grabbing select-none ${
              isDragging ? 'opacity-70' : 'opacity-100'
            }`}
            style={innerStyle}
            onMouseDown={handleMouseDown}
            data-editable="true"
            data-element-id={elementId}
          >
            Unknown Element: {element.type}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: isDragging ? 1.02 : 1,
        transition: { duration: 0.2 }
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`absolute pointer-events-auto ${isDragging ? 'z-[9020]' : ''}`}
      style={{
        left: `${sanitizedStyle.left}px`,
        top: `${sanitizedStyle.top}px`,
        zIndex: isDragging ? 9020 : (sanitizedStyle.zIndex || 1000)
      }}
    >
      {renderElement()}
      
      {/* Enhanced selection indicator */}
      {isSelected && !isDragging && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Selection border with glow */}
          <div className="absolute -inset-2 border-2 border-amber-400 rounded-lg bg-amber-400/5 backdrop-blur-sm shadow-lg shadow-amber-400/20">
            {/* Corner resize handles */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-amber-400 border-2 border-white rounded-full shadow-lg cursor-nw-resize hover:scale-110 transition-transform"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 border-2 border-white rounded-full shadow-lg cursor-ne-resize hover:scale-110 transition-transform"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-amber-400 border-2 border-white rounded-full shadow-lg cursor-sw-resize hover:scale-110 transition-transform"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-amber-400 border-2 border-white rounded-full shadow-lg cursor-se-resize hover:scale-110 transition-transform"></div>
            
            {/* Side handles for resizing */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-400 border-2 border-white rounded-full shadow-lg cursor-n-resize hover:scale-110 transition-transform"></div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-400 border-2 border-white rounded-full shadow-lg cursor-s-resize hover:scale-110 transition-transform"></div>
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 border-2 border-white rounded-full shadow-lg cursor-w-resize hover:scale-110 transition-transform"></div>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 border-2 border-white rounded-full shadow-lg cursor-e-resize hover:scale-110 transition-transform"></div>
          </div>
          
          {/* Element info tooltip */}
          <div className="absolute -top-10 left-0 bg-black/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-lg border border-amber-500/30">
            <span className="text-amber-400 font-medium">{element.type}</span>
            <span className="text-gray-400 mx-1">•</span>
            <span className="font-mono text-xs">{elementId}</span>
            <span className="text-gray-400 mx-1">•</span>
            <span className="text-green-400">📍 Drag to move</span>
          </div>
        </div>
      )}
      
      {/* Dragging indicator */}
      {isDragging && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -inset-3 border-2 border-amber-400 border-dashed rounded-lg bg-amber-400/10 animate-pulse">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
              🚀 Moving...
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ElementRenderer;
