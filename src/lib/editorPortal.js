/**
 * Editor Portal Management
 * Ensures the high-priority editor portal is always available for ResizableIcon components
 */

export const initializeEditorPortal = () => {
  if (typeof window === 'undefined') return null;
  
  let container = document.getElementById('editor-icons-portal');
  if (!container) {
    container = document.createElement('div');
    container.id = 'editor-icons-portal';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999999999;
      isolation: isolate;
    `;
    document.body.appendChild(container);
  }
  return container;
};

export const cleanupEditorPortal = () => {
  if (typeof window === 'undefined') return;
  
  const container = document.getElementById('editor-icons-portal');
  if (container && container.children.length === 0) {
    document.body.removeChild(container);
  }
};
