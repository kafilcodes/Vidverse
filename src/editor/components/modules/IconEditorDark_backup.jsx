'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Image, 
  Layers,
  Palette,
  Move,
  RotateCw,
  Eye,
  EyeOff,
  Settings,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Plus,
  Minus,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Copy,
  Trash2,
  Download,
  Grid,
  Lock,
  Unlock,
  ZoomIn,
  ZoomOut,
  MoreHorizontal,
  Sliders
} from 'lucide-react';
import useEditorStore from '../../store/editorStore';

const IconEditorDark = ({ activeIconId }) => {
  const {
    selectedElement,
    elements,
    updateElement,
    bringForward,
    sendBackward,
    showDeleteDialog
  } = useEditorStore();

  const [expandedSections, setExpandedSections] = useState({
    position: true,
    size: true,
    appearance: true,
    transform: false,
    layers: false,
    effects: false,
    advanced: false
  });
  
  const [isLocked, setIsLocked] = useState(false);
  
  // Use activeIconId if provided, otherwise fall back to selectedElement
  const workingElementId = activeIconId || selectedElement;
  const element = workingElementId ? elements.get(workingElementId) : null;
  
  if (!element || element.type !== 'icon') return null;

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle section button clicks with proper event handling
  const handleSectionToggle = (section, e) => {
    e?.stopPropagation();
    e?.preventDefault();
    toggleSection(section);
  };

  // Update element style with lock check
  const handleStyleUpdate = (property, value) => {
    if (isLocked && ['left', 'top', 'width', 'height'].includes(property)) {
      return; // Prevent updates if locked
    }
    
    updateElement(workingElementId, {
      style: {
        ...element.style,
        [property]: value
      }
    });
  };

  // Handle transform updates
  const updateTransform = (type, value) => {
    const currentTransform = element.style?.transform || 'rotate(0deg) scale(1) skew(0deg)';
    let newTransform = currentTransform;
    
    if (type === 'rotation') {
      newTransform = newTransform.replace(/rotate\([^)]*\)/, `rotate(${value}deg)`);
    } else if (type === 'scale') {
      newTransform = newTransform.replace(/scale\([^)]*\)/, `scale(${value})`);
    } else if (type === 'skew') {
      newTransform = newTransform.replace(/skew\([^)]*\)/, `skew(${value}deg)`);
    }
    
    handleStyleUpdate('transform', newTransform);
  };

  // Get transform value
  const getTransformValue = (transform, type) => {
    if (!transform) return 0;
    const regex = type === 'rotation' ? /rotate\(([^)]+)deg\)/ : 
                  type === 'scale' ? /scale\(([^)]+)\)/ : 
                  /skew\(([^)]+)deg\)/;
    const match = transform.match(regex);
    return match ? parseFloat(match[1]) : 0;
  };

  // Handle duplication
  const handleDuplicate = () => {
    const newIcon = {
      ...element,
      id: `icon-${Date.now()}`,
      style: {
        ...element.style,
        left: (element.style?.left || 0) + 20,
        top: (element.style?.top || 0) + 20,
        zIndex: (element.style?.zIndex || 1000) + 1
      }
    };
    updateElement(newIcon.id, newIcon);
  };

  // Position presets
  const applyPositionPreset = (preset) => {
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const iconSize = { 
      width: element.style?.width || 100, 
      height: element.style?.height || 100 
    };
    
    const positions = {
      'top-left': { left: 50, top: 50 },
      'top-center': { left: viewport.width / 2 - iconSize.width / 2, top: 50 },
      'top-right': { left: viewport.width - iconSize.width - 50, top: 50 },
      'center-left': { left: 50, top: viewport.height / 2 - iconSize.height / 2 },
      'center': { left: viewport.width / 2 - iconSize.width / 2, top: viewport.height / 2 - iconSize.height / 2 },
      'center-right': { left: viewport.width - iconSize.width - 50, top: viewport.height / 2 - iconSize.height / 2 },
      'bottom-left': { left: 50, top: viewport.height - iconSize.height - 50 },
      'bottom-center': { left: viewport.width / 2 - iconSize.width / 2, top: viewport.height - iconSize.height - 50 },
      'bottom-right': { left: viewport.width - iconSize.width - 50, top: viewport.height - iconSize.height - 50 }
    };
    
    const pos = positions[preset];
    if (pos) {
      handleStyleUpdate('left', pos.left);
      handleStyleUpdate('top', pos.top);
    }
  };

  return (
    <div 
      className="space-y-3 text-white h-full overflow-y-auto"
      style={{
        scrollBehavior: 'smooth',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.2) transparent'
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Size Section */}
      <div className="border border-white/10 rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm">
        <button
          onClick={(e) => handleSectionToggle('size', e)}
          className="w-full flex items-center justify-between p-3 bg-black/20 hover:bg-black/40 transition-colors border border-white/10 hover:border-white/20 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Size & Scale</span>
          </div>
          {expandedSections.size ? <ChevronDown className="w-4 h-4 text-white/60" /> : <ChevronRight className="w-4 h-4 text-white/60" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.size && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 space-y-4 bg-black/10"
            >
              {/* Size Controls */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/80 block mb-1">Width</label>
                  <Input
                    type="number"
                    value={element.style?.width || 0}
                    onChange={(e) => handleStyleUpdate('width', parseFloat(e.target.value) || 0)}
                    className="bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm"
                    disabled={isLocked}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/80 block mb-1">Height</label>
                  <Input
                    type="number"
                    value={element.style?.height || 0}
                    onChange={(e) => handleStyleUpdate('height', parseFloat(e.target.value) || 0)}
                    className="bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm"
                    disabled={isLocked}
                  />
                </div>
              </div>

              {/* Quick Sizes */}
              <div>
                <label className="text-xs text-white/80 block mb-2">Quick Sizes</label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { size: 24, label: 'XS' },
                    { size: 48, label: 'S' },
                    { size: 100, label: 'M' },
                    { size: 200, label: 'L' }
                  ].map(preset => (
                    <Button
                      key={preset.size}
                      onClick={() => {
                        handleStyleUpdate('width', preset.size);
                        handleStyleUpdate('height', preset.size);
                      }}
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs bg-black/20 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
                      disabled={isLocked}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Appearance Section */}
      <div className="border border-white/10 rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm">
        <button
          onClick={(e) => handleSectionToggle('appearance', e)}
          className="w-full flex items-center justify-between p-3 bg-black/20 hover:bg-black/40 transition-colors border border-white/10 hover:border-white/20 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white">Appearance & Style</span>
          </div>
          {expandedSections.appearance ? <ChevronDown className="w-4 h-4 text-white/60" /> : <ChevronRight className="w-4 h-4 text-white/60" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.appearance && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 space-y-4 bg-black/10"
            >
              {/* Opacity */}
              <div>
                <label className="text-xs text-white/80 block mb-2">
                  Opacity: {Math.round((element.style?.opacity || 1) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={element.style?.opacity || 1}
                  onChange={(e) => handleStyleUpdate('opacity', parseFloat(e.target.value))}
                  className="w-full h-2 bg-black/40 rounded-lg appearance-none slider accent-blue-500"
                />
              </div>

              {/* Universal Color Tint for all images */}
              <div>
                <label className="text-xs text-white/80 block mb-2">Color Tint</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="color"
                    value="#ff0000"
                    onChange={(e) => {
                      // Convert color to filter
                      const color = e.target.value;
                      const r = parseInt(color.substr(1, 2), 16);
                      const g = parseInt(color.substr(3, 2), 16);
                      const b = parseInt(color.substr(5, 2), 16);
                      
                      // Create a color overlay effect using CSS filters
                      const hue = Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * 180 / Math.PI;
                      handleStyleUpdate('filter', `hue-rotate(${hue}deg) saturate(2) brightness(1.2)`);
                    }}
                    className="w-10 h-8 rounded border border-white/20 cursor-pointer bg-black/40"
                  />
                  <Select
                    value={element.style?.filter || 'none'}
                    onValueChange={(value) => handleStyleUpdate('filter', value)}
                  >
                    <SelectTrigger className="flex-1 bg-black/40 border-white/20 text-white text-xs h-8">
                      <SelectValue placeholder="No filter" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20 text-white">
                      <SelectItem value="none">No Tint</SelectItem>
                      <SelectItem value="hue-rotate(0deg) saturate(2) brightness(1) sepia(100%) saturate(10000%) hue-rotate(0deg)">Red Tint</SelectItem>
                      <SelectItem value="hue-rotate(120deg) saturate(2) brightness(1) sepia(100%) saturate(10000%) hue-rotate(120deg)">Green Tint</SelectItem>
                      <SelectItem value="hue-rotate(240deg) saturate(2) brightness(1) sepia(100%) saturate(10000%) hue-rotate(240deg)">Blue Tint</SelectItem>
                      <SelectItem value="hue-rotate(60deg) saturate(2) brightness(1) sepia(100%) saturate(10000%) hue-rotate(60deg)">Yellow Tint</SelectItem>
                      <SelectItem value="hue-rotate(300deg) saturate(2) brightness(1) sepia(100%) saturate(10000%) hue-rotate(300deg)">Purple Tint</SelectItem>
                      <SelectItem value="hue-rotate(180deg) saturate(2) brightness(1) sepia(100%) saturate(10000%) hue-rotate(180deg)">Cyan Tint</SelectItem>
                      <SelectItem value="grayscale(100%)">Grayscale</SelectItem>
                      <SelectItem value="sepia(100%)">Sepia</SelectItem>
                      <SelectItem value="invert(100%)">Invert</SelectItem>
                      <SelectItem value="brightness(150%)">Bright</SelectItem>
                      <SelectItem value="brightness(50%)">Dark</SelectItem>
                      <SelectItem value="contrast(200%)">High Contrast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* SVG Color Controls */}
              {element.fileType?.includes('svg') && (
                <>
                  <div>
                    <label className="text-xs text-white/80 block mb-2">SVG Fill Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={element.properties?.fill || '#ffffff'}
                        onChange={(e) => updateElement(workingElementId, {
                          properties: { ...element.properties, fill: e.target.value }
                        })}
                        className="w-10 h-8 rounded border border-white/20 cursor-pointer bg-black/40"
                      />
                      <Input
                        type="text"
                        value={element.properties?.fill || '#ffffff'}
                        onChange={(e) => updateElement(workingElementId, {
                          properties: { ...element.properties, fill: e.target.value }
                        })}
                        className="flex-1 bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/80 block mb-2">SVG Stroke Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={element.properties?.stroke || '#000000'}
                        onChange={(e) => updateElement(workingElementId, {
                          properties: { ...element.properties, stroke: e.target.value }
                        })}
                        className="w-10 h-8 rounded border border-white/20 cursor-pointer bg-black/40"
                      />
                      <Input
                        type="text"
                        value={element.properties?.stroke || 'none'}
                        onChange={(e) => updateElement(workingElementId, {
                          properties: { ...element.properties, stroke: e.target.value }
                        })}
                        className="flex-1 bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm"
                        placeholder="none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/80 block mb-2">SVG Stroke Width</label>
                    <Input
                      type="number"
                      min="0"
                      max="20"
                      value={element.properties?.strokeWidth || 1}
                      onChange={(e) => updateElement(workingElementId, {
                        properties: { ...element.properties, strokeWidth: parseFloat(e.target.value) || 0 }
                      })}
                      className="bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm"
                    />
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transform Section */}
      <div className="border border-white/10 rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm">
        <button
          onClick={(e) => handleSectionToggle('transform', e)}
          className="w-full flex items-center justify-between p-3 bg-black/20 hover:bg-black/40 transition-colors border border-white/10 hover:border-white/20 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <RotateCw className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white">Transform & Effects</span>
          </div>
          {expandedSections.transform ? <ChevronDown className="w-4 h-4 text-white/60" /> : <ChevronRight className="w-4 h-4 text-white/60" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.transform && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 space-y-4 bg-black/10"
            >
              {/* Rotation */}
              <div>
                <label className="text-xs text-white/80 block mb-2">
                  Rotation: {getTransformValue(element.style?.transform, 'rotation')}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={getTransformValue(element.style?.transform, 'rotation')}
                  onChange={(e) => updateTransform('rotation', parseInt(e.target.value))}
                  className="w-full h-2 bg-black/40 rounded-lg appearance-none slider accent-purple-500"
                />
              </div>

              {/* Scale */}
              <div>
                <label className="text-xs text-white/80 block mb-2">
                  Scale: {getTransformValue(element.style?.transform, 'scale').toFixed(2)}x
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={getTransformValue(element.style?.transform, 'scale')}
                  onChange={(e) => updateTransform('scale', parseFloat(e.target.value))}
                  className="w-full h-2 bg-black/40 rounded-lg appearance-none slider accent-purple-500"
                />
              </div>

              {/* Flip Controls */}
              <div>
                <label className="text-xs text-white/80 block mb-2">Flip</label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      const currentScale = getTransformValue(element.style?.transform, 'scale');
                      const newScale = currentScale > 0 ? -Math.abs(currentScale) : Math.abs(currentScale);
                      updateTransform('scale', newScale);
                    }}
                    size="sm"
                    variant="ghost"
                    className="flex-1 h-8 bg-black/20 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    <FlipHorizontal className="w-3 h-3 mr-1" />
                    Horizontal
                  </Button>
                  <Button
                    onClick={() => {
                      const transform = element.style?.transform || '';
                      const hasVerticalFlip = transform.includes('scaleY(-1)');
                      const newTransform = hasVerticalFlip 
                        ? transform.replace('scaleY(-1)', 'scaleY(1)')
                        : `${transform} scaleY(-1)`;
                      handleStyleUpdate('transform', newTransform);
                    }}
                    size="sm"
                    variant="ghost"
                    className="flex-1 h-8 bg-black/20 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    <FlipVertical className="w-3 h-3 mr-1" />
                    Vertical
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Layers Section - Enhanced with proper layering */}
      <div className="border border-white/10 rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm">
        <button
          onClick={(e) => handleSectionToggle('layers', e)}
          className="w-full flex items-center justify-between p-3 bg-black/20 hover:bg-black/40 transition-colors border border-white/10 hover:border-white/20 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-white">Layers & Depth</span>
          </div>
          {expandedSections.layers ? <ChevronDown className="w-4 h-4 text-white/60" /> : <ChevronRight className="w-4 h-4 text-white/60" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.layers && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 space-y-4 bg-black/10"
            >
              {/* Z-Index with Layer Controls */}
              <div>
                <label className="text-xs text-white/80 block mb-2">
                  Layer Order (Z-Index): {element.style?.zIndex || 1000}
                </label>
                <div className="flex gap-2 mb-3">
                  <Input
                    type="number"
                    value={element.style?.zIndex || 1000}
                    onChange={(e) => handleStyleUpdate('zIndex', parseInt(e.target.value) || 1000)}
                    className="flex-1 bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm"
                  />
                </div>
                
                {/* Layer Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => bringForward && bringForward(workingElementId)}
                    size="sm"
                    variant="ghost"
                    className="h-9 bg-green-500/20 text-green-400 hover:text-green-300 hover:bg-green-500/30 border border-green-400/30 hover:border-green-400/50 transition-all duration-200"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Bring Forward
                  </Button>
                  <Button
                    onClick={() => sendBackward && sendBackward(workingElementId)}
                    size="sm"
                    variant="ghost"
                    className="h-9 bg-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 transition-all duration-200"
                  >
                    <Minus className="w-3 h-3 mr-1" />
                    Send Backward
                  </Button>
                </div>
                
                {/* Quick Layer Presets */}
                <div className="grid grid-cols-3 gap-1 mt-2">
                  <Button
                    onClick={() => handleStyleUpdate('zIndex', 1)}
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs bg-black/20 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => handleStyleUpdate('zIndex', 1000)}
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs bg-black/20 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    Normal
                  </Button>
                  <Button
                    onClick={() => handleStyleUpdate('zIndex', 9999)}
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs bg-black/20 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    Front
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Effects Section */}
      <div className="border border-white/10 rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm">
        <button
          onClick={(e) => handleSectionToggle('effects', e)}
          className="w-full flex items-center justify-between p-3 bg-black/20 hover:bg-black/40 transition-colors border border-white/10 hover:border-white/20 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-medium text-white">Visual Effects</span>
          </div>
          {expandedSections.effects ? <ChevronDown className="w-4 h-4 text-white/60" /> : <ChevronRight className="w-4 h-4 text-white/60" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.effects && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 space-y-4 bg-black/10"
            >
              {/* Border Radius */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/80 block mb-1">Border Radius</label>
                  <Input
                    type="number"
                    min="0"
                    value={parseInt(element.style?.borderRadius) || 0}
                    onChange={(e) => handleStyleUpdate('borderRadius', `${parseInt(e.target.value) || 0}px`)}
                    className="bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/80 block mb-1">Border Width</label>
                  <Input
                    type="number"
                    min="0"
                    value={parseInt(element.style?.borderWidth) || 0}
                    onChange={(e) => handleStyleUpdate('borderWidth', `${parseInt(e.target.value) || 0}px`)}
                    className="bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Border Color */}
              <div>
                <label className="text-xs text-white/80 block mb-2">Border Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={element.style?.borderColor || '#ffffff'}
                    onChange={(e) => handleStyleUpdate('borderColor', e.target.value)}
                    className="w-10 h-8 rounded border border-white/20 cursor-pointer bg-black/40"
                  />
                  <Input
                    type="text"
                    value={element.style?.borderColor || 'transparent'}
                    onChange={(e) => handleStyleUpdate('borderColor', e.target.value)}
                    className="flex-1 bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm"
                    placeholder="transparent"
                  />
                </div>
              </div>

              {/* Background */}
              <div>
                <label className="text-xs text-white/80 block mb-2">Background</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={element.style?.backgroundColor || '#000000'}
                    onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                    className="w-10 h-8 rounded border border-white/20 cursor-pointer bg-black/40"
                  />
                  <Select
                    value={element.style?.backgroundColor || 'transparent'}
                    onValueChange={(value) => handleStyleUpdate('backgroundColor', value)}
                  >
                    <SelectTrigger className="flex-1 bg-black/40 border-white/20 text-white text-xs h-8">
                      <SelectValue placeholder="Transparent" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20 text-white">
                      <SelectItem value="transparent">Transparent</SelectItem>
                      <SelectItem value="#000000">Black</SelectItem>
                      <SelectItem value="#ffffff">White</SelectItem>
                      <SelectItem value="#ef4444">Red</SelectItem>
                      <SelectItem value="#3b82f6">Blue</SelectItem>
                      <SelectItem value="#10b981">Green</SelectItem>
                      <SelectItem value="#f59e0b">Yellow</SelectItem>
                      <SelectItem value="#8b5cf6">Purple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced Section */}
      <div className="border border-white/10 rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm">
        <button
          onClick={(e) => handleSectionToggle('advanced', e)}
          className="w-full flex items-center justify-between p-3 bg-black/20 hover:bg-black/40 transition-colors border border-white/10 hover:border-white/20 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-white">Advanced Controls</span>
          </div>
          {expandedSections.advanced ? <ChevronDown className="w-4 h-4 text-white/60" /> : <ChevronRight className="w-4 h-4 text-white/60" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.advanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 space-y-4 bg-black/10"
            >
              {/* CSS Transform */}
              <div>
                <label className="text-xs text-white/80 block mb-2">
                  Custom CSS Transform
                </label>
                <Input
                  type="text"
                  value={element.style?.transform || ''}
                  onChange={(e) => handleStyleUpdate('transform', e.target.value)}
                  className="bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm font-mono"
                  placeholder="rotate(0deg) scale(1)"
                />
              </div>

              {/* CSS Filter */}
              <div>
                <label className="text-xs text-white/80 block mb-2">
                  Custom CSS Filter
                </label>
                <Input
                  type="text"
                  value={element.style?.filter || ''}
                  onChange={(e) => handleStyleUpdate('filter', e.target.value)}
                  className="bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm font-mono"
                  placeholder="blur(0px) brightness(100%)"
                />
              </div>

              {/* Export/Delete */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => {
                    // Download functionality
                    const link = document.createElement('a');
                    link.download = element.fileName || 'icon.png';
                    link.href = element.src || '';
                    link.click();
                  }}
                  size="sm"
                  variant="ghost"
                  className="flex-1 h-8 bg-green-500/20 text-green-400 hover:text-green-300 hover:bg-green-500/30 border border-green-400/30 hover:border-green-400/50 transition-all duration-200"
                  disabled={!element.src}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
                <Button
                  onClick={() => showDeleteDialog && showDeleteDialog(workingElementId)}
                  size="sm"
                  variant="ghost"
                  className="flex-1 h-8 bg-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 transition-all duration-200"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
                    variant="ghost"
                    className="flex-1 h-8 bg-black/20 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    <FlipHorizontal className="w-3 h-3 mr-1" />
                    Horizontal
                  </Button>
                  <Button
                    onClick={() => {
                      const transform = element.style?.transform || '';
                      const hasVerticalFlip = transform.includes('scaleY(-1)');
                      const newTransform = hasVerticalFlip 
                        ? transform.replace('scaleY(-1)', 'scaleY(1)')
                        : `${transform} scaleY(-1)`;
                      handleStyleUpdate('transform', newTransform);
                    }}
                    size="sm"
                    variant="ghost"
                    className="flex-1 h-8 bg-black/20 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    <FlipVertical className="w-3 h-3 mr-1" />
                    Vertical
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Layers Section */}
      <div className="border border-white/10 rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm">
        <button
          onClick={(e) => handleSectionToggle('layers', e)}
          className="w-full flex items-center justify-between p-3 bg-black/20 hover:bg-black/40 transition-colors border border-white/10 hover:border-white/20 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-white">Layers & Depth</span>
          </div>
          {expandedSections.layers ? <ChevronDown className="w-4 h-4 text-white/60" /> : <ChevronRight className="w-4 h-4 text-white/60" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.layers && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 space-y-4 bg-black/10"
            >
              {/* Z-Index */}
              <div>
                <label className="text-xs text-white/80 block mb-2">
                  Layer Order (Z-Index): {element.style?.zIndex || 1000}
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={element.style?.zIndex || 1000}
                    onChange={(e) => handleStyleUpdate('zIndex', parseInt(e.target.value) || 1000)}
                    className="flex-1 bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm"
                  />
                  <Button
                    onClick={() => bringForward && bringForward(workingElementId)}
                    size="sm"
                    variant="ghost"
                    className="h-8 bg-black/20 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => sendBackward && sendBackward(workingElementId)}
                    size="sm"
                    variant="ghost"
                    className="h-8 bg-black/20 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Effects Section */}
      <div className="border border-white/10 rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm">
        <button
          onClick={(e) => handleSectionToggle('effects', e)}
          className="w-full flex items-center justify-between p-3 bg-black/20 hover:bg-black/40 transition-colors border border-white/10 hover:border-white/20 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-medium text-white">Visual Effects</span>
          </div>
          {expandedSections.effects ? <ChevronDown className="w-4 h-4 text-white/60" /> : <ChevronRight className="w-4 h-4 text-white/60" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.effects && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 space-y-4 bg-black/10"
            >
              {/* Border Radius */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/80 block mb-1">Border Radius</label>
                  <Input
                    type="number"
                    min="0"
                    value={parseInt(element.style?.borderRadius) || 0}
                    onChange={(e) => handleStyleUpdate('borderRadius', `${parseInt(e.target.value) || 0}px`)}
                    className="bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/80 block mb-1">Border Width</label>
                  <Input
                    type="number"
                    min="0"
                    value={parseInt(element.style?.borderWidth) || 0}
                    onChange={(e) => handleStyleUpdate('borderWidth', `${parseInt(e.target.value) || 0}px`)}
                    className="bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Border Color */}
              <div>
                <label className="text-xs text-white/80 block mb-2">Border Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={element.style?.borderColor || '#ffffff'}
                    onChange={(e) => handleStyleUpdate('borderColor', e.target.value)}
                    className="w-10 h-8 rounded border border-white/20 cursor-pointer bg-black/40"
                  />
                  <Input
                    type="text"
                    value={element.style?.borderColor || 'transparent'}
                    onChange={(e) => handleStyleUpdate('borderColor', e.target.value)}
                    className="flex-1 bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm"
                    placeholder="transparent"
                  />
                </div>
              </div>

              {/* Background */}
              <div>
                <label className="text-xs text-white/80 block mb-2">Background</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={element.style?.backgroundColor || '#000000'}
                    onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                    className="w-10 h-8 rounded border border-white/20 cursor-pointer bg-black/40"
                  />
                  <Select
                    value={element.style?.backgroundColor || 'transparent'}
                    onValueChange={(value) => handleStyleUpdate('backgroundColor', value)}
                  >
                    <SelectTrigger className="flex-1 bg-black/40 border-white/20 text-white text-xs h-8">
                      <SelectValue placeholder="Transparent" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20 text-white">
                      <SelectItem value="transparent">Transparent</SelectItem>
                      <SelectItem value="#000000">Black</SelectItem>
                      <SelectItem value="#ffffff">White</SelectItem>
                      <SelectItem value="#ef4444">Red</SelectItem>
                      <SelectItem value="#3b82f6">Blue</SelectItem>
                      <SelectItem value="#10b981">Green</SelectItem>
                      <SelectItem value="#f59e0b">Yellow</SelectItem>
                      <SelectItem value="#8b5cf6">Purple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced Section */}
      <div className="border border-white/10 rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm">
        <button
          onClick={(e) => handleSectionToggle('advanced', e)}
          className="w-full flex items-center justify-between p-3 bg-black/20 hover:bg-black/40 transition-colors border border-white/10 hover:border-white/20 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-white">Advanced Controls</span>
          </div>
          {expandedSections.advanced ? <ChevronDown className="w-4 h-4 text-white/60" /> : <ChevronRight className="w-4 h-4 text-white/60" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.advanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 space-y-4 bg-black/10"
            >
              {/* CSS Transform */}
              <div>
                <label className="text-xs text-white/80 block mb-2">
                  Custom CSS Transform
                </label>
                <Input
                  type="text"
                  value={element.style?.transform || ''}
                  onChange={(e) => handleStyleUpdate('transform', e.target.value)}
                  className="bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm font-mono"
                  placeholder="rotate(0deg) scale(1)"
                />
              </div>

              {/* CSS Filter */}
              <div>
                <label className="text-xs text-white/80 block mb-2">
                  Custom CSS Filter
                </label>
                <Input
                  type="text"
                  value={element.style?.filter || ''}
                  onChange={(e) => handleStyleUpdate('filter', e.target.value)}
                  className="bg-black/40 border-white/20 text-white text-xs h-8 backdrop-blur-sm font-mono"
                  placeholder="blur(0px) brightness(100%)"
                />
              </div>

              {/* Export/Delete */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => {
                    // Download functionality
                    const link = document.createElement('a');
                    link.download = element.fileName || 'icon.png';
                    link.href = element.src || '';
                    link.click();
                  }}
                  size="sm"
                  variant="ghost"
                  className="flex-1 h-8 bg-green-500/20 text-green-400 hover:text-green-300 hover:bg-green-500/30 border border-green-400/30 hover:border-green-400/50 transition-all duration-200"
                  disabled={!element.src}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
                <Button
                  onClick={() => showDeleteDialog && showDeleteDialog(workingElementId)}
                  size="sm"
                  variant="ghost"
                  className="flex-1 h-8 bg-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 transition-all duration-200"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IconEditorDark;
