'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RotateCw, Move, Square } from 'lucide-react';

const ResizableIcon = ({ 
  elementId,
  element, 
  onUpdate, 
  isSelected, 
  onSelect, 
  className = '' 
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const elementRef = useRef(null);
  const rotationCenter = useRef({ x: 0, y: 0 });
  const initialState = useRef({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    rotation: 0,
    mouseStart: { x: 0, y: 0 }
  });

  // Parse current rotation from transform
  const getCurrentRotation = () => {
    const transform = element.style?.transform || '';
    const rotateMatch = transform.match(/rotate\(([^)]+)deg\)/);
    return rotateMatch ? parseFloat(rotateMatch[1]) : 0;
  };

  // Update transform while preserving other values
  const updateTransform = (rotation, scale = null) => {
    const currentTransform = element.style?.transform || 'rotate(0deg) scale(1)';
    let newTransform = currentTransform;
    
    if (rotation !== null) {
      newTransform = newTransform.replace(/rotate\([^)]*\)/, `rotate(${rotation}deg)`);
    }
    
    if (scale !== null) {
      newTransform = newTransform.replace(/scale\([^)]*\)/, `scale(${scale})`);
    }
    
    return newTransform;
  };

  // Mouse down handler for different actions
  const handleMouseDown = useCallback((e, action) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSelected && action !== 'select') {
      onSelect(elementId);
      return;
    }

    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Store initial state
    initialState.current = {
      width: element.style?.width || 100,
      height: element.style?.height || 100,
      left: element.style?.left || 0,
      top: element.style?.top || 0,
      rotation: getCurrentRotation(),
      mouseStart: { x: e.clientX, y: e.clientY }
    };

    // Calculate center for rotation
    rotationCenter.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    switch (action) {
      case 'drag':
        setIsDragging(true);
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        document.body.style.cursor = 'grabbing';
        break;
        
      case 'resize':
        setIsResizing(true);
        setResizeHandle(e.target.dataset.handle);
        document.body.style.cursor = getResizeCursor(e.target.dataset.handle);
        break;
        
      case 'rotate':
        setIsRotating(true);
        document.body.style.cursor = 'grabbing';
        break;
    }

    document.body.style.userSelect = 'none';
  }, [isSelected, onSelect, elementId, element]);

  // Get appropriate cursor for resize handle
  const getResizeCursor = (handle) => {
    const cursors = {
      'nw': 'nw-resize',
      'ne': 'ne-resize',
      'sw': 'sw-resize',
      'se': 'se-resize'
    };
    return cursors[handle] || 'default';
  };

  // Mouse move handler
  const handleMouseMove = useCallback((e) => {
    if (!isSelected) return;

    const deltaX = e.clientX - initialState.current.mouseStart.x;
    const deltaY = e.clientY - initialState.current.mouseStart.y;

    if (isDragging) {
      // Free dragging - allow positioning beyond viewport for creative flexibility
      const newLeft = e.clientX - dragOffset.x;
      const newTop = e.clientY - dragOffset.y;
      
      onUpdate(elementId, {
        style: {
          ...element.style,
          left: newLeft,
          top: newTop
        }
      });
    }
    
    else if (isResizing && resizeHandle) {
      // Smooth resizing with proper constraints
      let newWidth = initialState.current.width;
      let newHeight = initialState.current.height;
      let newLeft = initialState.current.left;
      let newTop = initialState.current.top;

      const minSize = 20;
      const maxSize = 800;

      switch (resizeHandle) {
        case 'se': // Bottom-right
          newWidth = Math.max(minSize, Math.min(maxSize, initialState.current.width + deltaX));
          newHeight = Math.max(minSize, Math.min(maxSize, initialState.current.height + deltaY));
          break;
          
        case 'sw': // Bottom-left
          newWidth = Math.max(minSize, Math.min(maxSize, initialState.current.width - deltaX));
          newHeight = Math.max(minSize, Math.min(maxSize, initialState.current.height + deltaY));
          if (newWidth > minSize) {
            newLeft = initialState.current.left + deltaX;
          }
          break;
          
        case 'ne': // Top-right
          newWidth = Math.max(minSize, Math.min(maxSize, initialState.current.width + deltaX));
          newHeight = Math.max(minSize, Math.min(maxSize, initialState.current.height - deltaY));
          if (newHeight > minSize) {
            newTop = initialState.current.top + deltaY;
          }
          break;
          
        case 'nw': // Top-left
          newWidth = Math.max(minSize, Math.min(maxSize, initialState.current.width - deltaX));
          newHeight = Math.max(minSize, Math.min(maxSize, initialState.current.height - deltaY));
          if (newWidth > minSize) {
            newLeft = initialState.current.left + deltaX;
          }
          if (newHeight > minSize) {
            newTop = initialState.current.top + deltaY;
          }
          break;
      }

      onUpdate(elementId, {
        style: {
          ...element.style,
          width: newWidth,
          height: newHeight,
          left: newLeft,
          top: newTop
        }
      });
    }
    
    else if (isRotating) {
      // Smooth rotation
      const angle = Math.atan2(
        e.clientY - rotationCenter.current.y,
        e.clientX - rotationCenter.current.x
      );
      const degrees = (angle * 180 / Math.PI) + 90; // Add 90 to make 0 degrees point up
      const normalizedDegrees = ((degrees % 360) + 360) % 360; // Normalize to 0-360
      
      onUpdate(elementId, {
        style: {
          ...element.style,
          transform: updateTransform(normalizedDegrees)
        }
      });
    }
  }, [isDragging, isResizing, isRotating, resizeHandle, dragOffset, element, onUpdate, elementId, isSelected]);

  // Mouse up handler
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
    setResizeHandle(null);
    setDragOffset({ x: 0, y: 0 });
    
    // Reset cursor and selection
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Set up global event listeners
  useEffect(() => {
    if (isDragging || isResizing || isRotating) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, isResizing, isRotating, handleMouseMove, handleMouseUp]);

  // Click handler for selection
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (!isSelected) {
      onSelect(elementId);
    }
  }, [isSelected, onSelect, elementId]);

  if (!element || element.type !== 'icon') return null;

  return (
    <div
      ref={elementRef}
      className={`absolute select-none ${className} ${isSelected ? 'z-50' : ''}`}
      style={{
        left: element.style?.left || 0,
        top: element.style?.top || 0,
        width: element.style?.width || 100,
        height: element.style?.height || 100,
        zIndex: isSelected ? 999999 : (element.style?.zIndex || 1000),
        opacity: element.style?.opacity || 1,
        transform: element.style?.transform || 'rotate(0deg) scale(1)',
        filter: element.style?.filter || 'none',
        pointerEvents: 'auto',
        cursor: isDragging ? 'grabbing' : (isSelected ? 'grab' : 'pointer')
      }}
      onMouseDown={(e) => handleMouseDown(e, 'drag')}
      onClick={handleClick}
    >
      {/* Icon Content */}
      {element.src ? (
        <img
          src={element.src}
          alt="Icon"
          className="w-full h-full object-contain pointer-events-none select-none"
          style={{
            fill: element.properties?.fill,
            stroke: element.properties?.stroke,
            strokeWidth: element.properties?.strokeWidth
          }}
          draggable={false}
        />
      ) : (
        <div className="w-full h-full bg-gray-800/30 border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-400 text-xs backdrop-blur-sm">
          <Square className="w-6 h-6" />
        </div>
      )}

      {/* Selection Border */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-400 rounded-sm pointer-events-none shadow-lg">
        </div>
      )}

      {/* Interactive Handles - Only show when selected */}
      {isSelected && (
        <>
          {/* Corner resize handles */}
          <div
            className="absolute w-3 h-3 bg-blue-500 border-2 border-white shadow-lg cursor-nw-resize -top-1.5 -left-1.5 rounded-full hover:bg-blue-400 hover:scale-110 transition-all"
            data-handle="nw"
            onMouseDown={(e) => handleMouseDown(e, 'resize')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border-2 border-white shadow-lg cursor-ne-resize -top-1.5 -right-1.5 rounded-full hover:bg-blue-400 hover:scale-110 transition-all"
            data-handle="ne"
            onMouseDown={(e) => handleMouseDown(e, 'resize')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border-2 border-white shadow-lg cursor-sw-resize -bottom-1.5 -left-1.5 rounded-full hover:bg-blue-400 hover:scale-110 transition-all"
            data-handle="sw"
            onMouseDown={(e) => handleMouseDown(e, 'resize')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border-2 border-white shadow-lg cursor-se-resize -bottom-1.5 -right-1.5 rounded-full hover:bg-blue-400 hover:scale-110 transition-all"
            data-handle="se"
            onMouseDown={(e) => handleMouseDown(e, 'resize')}
          />

          {/* Rotation handle */}
          <div
            className="absolute w-7 h-7 bg-purple-500 border-2 border-white shadow-lg cursor-grab -top-10 left-1/2 transform -translate-x-1/2 rounded-full hover:bg-purple-400 hover:scale-110 transition-all flex items-center justify-center"
            onMouseDown={(e) => handleMouseDown(e, 'rotate')}
          >
            <RotateCw className="w-3 h-3 text-white" />
          </div>

          {/* Center move indicator */}
          <div className="absolute w-2 h-2 bg-green-500 border border-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 pointer-events-none">
          </div>

          {/* Connection line from rotation handle */}
          <div className="absolute w-0.5 h-6 bg-purple-400/50 -top-9 left-1/2 transform -translate-x-1/2 pointer-events-none">
          </div>
        </>
      )}
    </div>
  );
};

export default ResizableIcon;
