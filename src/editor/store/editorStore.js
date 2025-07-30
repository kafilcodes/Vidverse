import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useEditorStore = create(
  subscribeWithSelector((set, get) => ({
    // Editor UI State
    isEditorOpen: true,
    selectedElement: null,
    activeModule: 'website', // 'website', 'elements', 'visual', 'text', 'icon'
    
    // Editable Elements State
    elements: new Map(), // Map of element IDs to their configuration
    
    // History Management
    history: [],
    historyIndex: -1,
    maxHistorySize: 50,
    
    // Draft Changes (unsaved)
    draftChanges: new Map(),
    
    // UI State
    showDeleteConfirmation: false,
    elementToDelete: null,
    
    // Actions
    setEditorOpen: (isOpen) => set({ isEditorOpen: isOpen }),
    
    setSelectedElement: (elementId) => {
      const state = get();
      set({ 
        selectedElement: elementId,
        activeModule: elementId ? 'elements' : 'website'
      });
    },
    
    setActiveModule: (module) => set({ activeModule: module }),
    
    // Element Management
    addElement: (element) => {
      const state = get();
      const newElements = new Map(state.elements);
      newElements.set(element.id, element);
      
      // Add to history
      const action = {
        type: 'ADD_ELEMENT',
        elementId: element.id,
        element: { ...element },
        timestamp: Date.now()
      };
      
      set({
        elements: newElements,
        selectedElement: element.id,
        activeModule: element.type === 'icon' ? 'icon' : 'visual'
      });
      
      get().addToHistory(action);
    },
    
    updateElement: (elementId, updates) => {
      const state = get();
      const element = state.elements.get(elementId);
      if (!element) return;
      
      const updatedElement = { ...element, ...updates };
      const newElements = new Map(state.elements);
      newElements.set(elementId, updatedElement);
      
      // Store as draft change
      const newDraftChanges = new Map(state.draftChanges);
      newDraftChanges.set(elementId, updatedElement);
      
      set({
        elements: newElements,
        draftChanges: newDraftChanges
      });
    },
    
    deleteElement: (elementId) => {
      const state = get();
      const element = state.elements.get(elementId);
      if (!element) return;
      
      const newElements = new Map(state.elements);
      newElements.delete(elementId);
      
      const newDraftChanges = new Map(state.draftChanges);
      newDraftChanges.delete(elementId);
      
      // Add to history
      const action = {
        type: 'DELETE_ELEMENT',
        elementId,
        element: { ...element },
        timestamp: Date.now()
      };
      
      set({
        elements: newElements,
        draftChanges: newDraftChanges,
        selectedElement: state.selectedElement === elementId ? null : state.selectedElement,
        activeModule: state.selectedElement === elementId ? null : state.activeModule,
        showDeleteConfirmation: false,
        elementToDelete: null
      });
      
      get().addToHistory(action);
    },
    
    // Delete Confirmation
    showDeleteDialog: (elementId) => set({ 
      showDeleteConfirmation: true, 
      elementToDelete: elementId 
    }),
    
    hideDeleteDialog: () => set({ 
      showDeleteConfirmation: false, 
      elementToDelete: null 
    }),
    
    confirmDelete: () => {
      const state = get();
      if (state.elementToDelete) {
        get().deleteElement(state.elementToDelete);
      }
    },
    
    // History Management
    addToHistory: (action) => {
      const state = get();
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(action);
      
      // Limit history size
      if (newHistory.length > state.maxHistorySize) {
        newHistory.shift();
      }
      
      set({
        history: newHistory,
        historyIndex: newHistory.length - 1
      });
    },
    
    undo: () => {
      const state = get();
      if (state.historyIndex < 0) return;
      
      const action = state.history[state.historyIndex];
      
      switch (action.type) {
        case 'ADD_ELEMENT':
          // Remove the element
          const newElements1 = new Map(state.elements);
          newElements1.delete(action.elementId);
          set({ 
            elements: newElements1,
            selectedElement: state.selectedElement === action.elementId ? null : state.selectedElement
          });
          break;
          
        case 'DELETE_ELEMENT':
          // Restore the element
          const newElements2 = new Map(state.elements);
          newElements2.set(action.elementId, action.element);
          set({ elements: newElements2 });
          break;
          
        case 'UPDATE_ELEMENT':
          // Restore previous state
          const newElements3 = new Map(state.elements);
          newElements3.set(action.elementId, action.previousState);
          set({ elements: newElements3 });
          break;
      }
      
      set({ historyIndex: state.historyIndex - 1 });
    },
    
    redo: () => {
      const state = get();
      if (state.historyIndex >= state.history.length - 1) return;
      
      const nextIndex = state.historyIndex + 1;
      const action = state.history[nextIndex];
      
      switch (action.type) {
        case 'ADD_ELEMENT':
          // Re-add the element
          const newElements1 = new Map(state.elements);
          newElements1.set(action.elementId, action.element);
          set({ elements: newElements1 });
          break;
          
        case 'DELETE_ELEMENT':
          // Re-delete the element
          const newElements2 = new Map(state.elements);
          newElements2.delete(action.elementId);
          set({ 
            elements: newElements2,
            selectedElement: state.selectedElement === action.elementId ? null : state.selectedElement
          });
          break;
          
        case 'UPDATE_ELEMENT':
          // Re-apply the update
          const newElements3 = new Map(state.elements);
          newElements3.set(action.elementId, action.newState);
          set({ elements: newElements3 });
          break;
      }
      
      set({ historyIndex: nextIndex });
    },
    
    // Session Management
    resetSession: () => {
      set({
        elements: new Map(),
        draftChanges: new Map(),
        history: [],
        historyIndex: -1,
        selectedElement: null,
        activeModule: null,
        showDeleteConfirmation: false,
        elementToDelete: null
      });
    },
    
    // Save to localStorage
    saveChanges: async () => {
      const state = get();
      try {
        const elementsData = {};
        state.elements.forEach((element, id) => {
          elementsData[id] = element;
        });

        localStorage.setItem('vidverse-editor-elements', JSON.stringify({
          elements: elementsData,
          lastUpdated: new Date().toISOString(),
          version: '1.0'
        }));

        // Clear draft changes after successful save
        set({ draftChanges: new Map() });
        console.log('✅ Changes saved to localStorage');

        return { success: true };
      } catch (error) {
        console.error('❌ Failed to save changes:', error);
        return { success: false, error: error.message };
      }
    },
    
    // Load from localStorage
    loadElements: async () => {
      try {
        const stored = localStorage.getItem('vidverse-editor-elements');
        
        if (stored) {
          const data = JSON.parse(stored);
          const elementsMap = new Map();
          
          Object.entries(data.elements || {}).forEach(([id, element]) => {
            elementsMap.set(id, element);
          });
          
          set({ 
            elements: elementsMap,
            draftChanges: new Map(),
            history: [],
            historyIndex: -1
          });
          
          console.log(`✅ Loaded ${elementsMap.size} elements from localStorage`);
          return { success: true, count: elementsMap.size };
        } else {
          console.log('📄 No saved elements found');
          return { success: true, count: 0 };
        }
      } catch (error) {
        console.error('❌ Failed to load elements:', error);
        return { success: false, error: error.message };
      }
    },
    
    // Utility functions
    canUndo: () => {
      const state = get();
      return state.historyIndex >= 0;
    },
    
    canRedo: () => {
      const state = get();
      return state.historyIndex < state.history.length - 1;
    },
    
    hasUnsavedChanges: () => {
      const state = get();
      return state.draftChanges.size > 0 || state.history.length > 0;
    },
    
    // Z-index management
    bringForward: (elementId) => {
      const state = get();
      const element = state.elements.get(elementId);
      if (!element) return;
      
      const currentZIndex = element.style?.zIndex || 1000;
      get().updateElement(elementId, {
        style: { ...element.style, zIndex: currentZIndex + 1 }
      });
    },
    
    sendBackward: (elementId) => {
      const state = get();
      const element = state.elements.get(elementId);
      if (!element) return;
      
      const currentZIndex = element.style?.zIndex || 1000;
      get().updateElement(elementId, {
        style: { ...element.style, zIndex: Math.max(1, currentZIndex - 1) }
      });
    }
  }))
);

export default useEditorStore;
