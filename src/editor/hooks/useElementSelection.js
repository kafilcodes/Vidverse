'use client';

import { useEffect, useRef } from 'react';
import useEditorStore from '../store/editorStore';

const useElementSelection = () => {
  const { setSelectedElement, selectedElement } = useEditorStore();
  const highlightRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      // Ignore clicks on editor UI
      if (e.target.closest('[data-editor-ui]')) return;
      
      // Check if clicking on an existing editor element
      const editorElement = e.target.closest('[data-element-id]');
      if (editorElement) {
        // Element selection is handled by ElementRenderer
        return;
      }

      // Check for data-editable elements in the main site
      const editableElement = e.target.closest('[data-editable="true"]');
      if (editableElement && !editableElement.closest('[data-element-id]')) {
        e.preventDefault();
        e.stopPropagation();
        
        const elementId = editableElement.getAttribute('data-element-id') || 
                         editableElement.id || 
                         generateElementId(editableElement);
        
        setSelectedElement(elementId);
        showSelectionHighlight(editableElement);
      } else {
        // Clicked on empty space - deselect
        setSelectedElement(null);
        hideSelectionHighlight();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSelectedElement(null);
        hideSelectionHighlight();
      }
    };

    // Add event listeners
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [setSelectedElement]);

  const generateElementId = (element) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    const elementType = element.tagName.toLowerCase();
    return `${elementType}-${timestamp}-${random}`;
  };

  const showSelectionHighlight = (element) => {
    const rect = element.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    if (!highlightRef.current) {
      const highlight = document.createElement('div');
      highlight.id = 'editor-selection-highlight';
      highlight.style.cssText = `
        position: absolute;
        pointer-events: none;
        border: 3px solid #D4AF37;
        background: rgba(212, 175, 55, 0.1);
        backdrop-filter: blur(4px);
        z-index: 9060;
        border-radius: 6px;
        box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
      `;
      document.body.appendChild(highlight);
      highlightRef.current = highlight;
    }

    highlightRef.current.style.left = (rect.left + scrollX) + 'px';
    highlightRef.current.style.top = (rect.top + scrollY) + 'px';
    highlightRef.current.style.width = rect.width + 'px';
    highlightRef.current.style.height = rect.height + 'px';
    highlightRef.current.style.display = 'block';
  };

  const hideSelectionHighlight = () => {
    if (highlightRef.current) {
      highlightRef.current.style.display = 'none';
    }
  };

  // Update selection highlight when selected element changes
  useEffect(() => {
    if (!selectedElement) {
      hideSelectionHighlight();
      return;
    }

    // Don't highlight editor elements (they have their own selection UI)
    const element = document.querySelector(`[data-element-id="${selectedElement}"]`);
    if (element) {
      // This is an editor element, don't show site highlight
      hideSelectionHighlight();
      return;
    }

    // Highlight site elements
    const siteElement = document.querySelector(`[data-editable="true"][data-element-id="${selectedElement}"]`) ||
                       document.getElementById(selectedElement);

    if (siteElement) {
      showSelectionHighlight(siteElement);
    }
  }, [selectedElement]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (highlightRef.current) {
        highlightRef.current.remove();
      }
    };
  }, []);

  return {
    selectedElement,
    showSelectionHighlight,
    hideSelectionHighlight
  };
};

export default useElementSelection;
