# VidVerse Visual Editor - User Guide

## 🎨 Welcome to the Visual Editor!

This powerful, real-time visual editor allows developers and admins to add and customize elements directly on the VidVerse website.

## 🚀 Getting Started

### Access the Editor
1. **Development Only**: The editor only appears in development mode (`npm run dev`)
2. **Password Protection**: Click the golden ✨ button in the bottom-right corner
3. **Enter Password**: Use `mausi05` (or your custom `NEXT_PUBLIC_EDITOR_PASS`)

### First Time Setup
- The editor will show a helpful tutorial on first use
- You can skip or replay the tutorial anytime

## 🛠️ Core Features

### Adding Elements
- **+ Icon**: Add SVG/PNG icons that can be styled and positioned
- **+ Text**: Add text elements with full typography controls
- **Positioning**: Elements appear in the center of your viewport

### Element Interaction
- **Click to Select**: Click any element to select and edit it
- **Drag & Drop**: Click and drag elements to reposition them anywhere
- **Visual Feedback**: Selected elements show golden borders and handles
- **Element Info**: Hover shows element type and ID

### Editing Capabilities

#### 📍 Position & Layout
- **Free Positioning**: Place elements anywhere, even outside normal layout
- **Layering**: Control z-index for stacking order
- **Precise Controls**: Input exact pixel values or use sliders
- **Quick Presets**: Snap to common positions (center, corners, etc.)

#### 🎨 Visual Styling
- **Colors**: Full color picker for all properties
- **Backgrounds**: Solid colors, gradients, transparency
- **Borders**: Thickness, style, radius, shadows
- **Glassmorphism**: Built-in backdrop blur effects
- **Opacity**: Fine-tune transparency

#### 🔧 Icon Editor
- **File Upload**: Support for SVG, PNG, JPG, GIF
- **Transform**: Rotate, scale, skew with intuitive controls
- **Color Overlay**: Tint icons with any color
- **SVG Fill**: Direct manipulation of SVG fill colors
- **Layer Management**: Send forward/backward controls

#### ✍️ Text Editor
- **Rich Typography**: Font family, size, weight, line height
- **Styling**: Colors, shadows, strokes, decorations
- **Alignment**: Left, center, right, justify
- **Text Transform**: Uppercase, lowercase, capitalize
- **Live Preview**: See changes instantly

### 💾 Data Management
- **Local Storage**: All changes saved to browser localStorage
- **No Server**: No data sent to external servers - purely local
- **Session Persistence**: Work saved across browser sessions
- **Manual Save**: Use the "Save" button to commit changes

### ⏮️ History & Undo
- **Undo/Redo**: Full action history with Ctrl+Z / Ctrl+Shift+Z
- **Action Tracking**: Every add, delete, move, and edit is tracked
- **Reset Session**: Clear all elements and start fresh
- **Keyboard Shortcuts**: Standard shortcuts work throughout

## 🎯 Workflow Examples

### Adding a Logo
1. Click "**+ Icon**"
2. Select the new icon element
3. Go to "**Upload**" tab
4. Choose your logo file
5. Use "**Position**" tab to place it perfectly
6. Adjust size in "**Style**" tab
7. Save your changes

### Creating Call-out Text
1. Click "**+ Text**"
2. Edit content in "**Text**" tab
3. Choose "**Hero Text**" preset for impact
4. Position using drag & drop
5. Fine-tune in "**Visual**" tab
6. Save when satisfied

### Styling an Icon
1. Select your icon
2. "**Transform**" tab: Rotate or scale
3. "**Style**" tab: Resize and set opacity
4. "**Upload**" tab: Apply color overlay
5. "**Position**" tab: Layer management

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + Z**: Undo last action
- **Ctrl/Cmd + Shift + Z**: Redo action
- **Ctrl/Cmd + S**: Save changes
- **Delete**: Delete selected element (with confirmation)
- **Escape**: Deselect element / Exit editor

## 🔧 Technical Notes

### Element Selection
- **data-editable="true"**: Mark existing site elements as editable
- **Auto-ID Generation**: Elements get unique IDs automatically
- **Conflict Avoidance**: Editor elements don't interfere with site elements

### Performance
- **Lightweight**: Minimal impact on site performance
- **Development Only**: Zero production bundle size
- **Local Processing**: All operations happen in browser

### Storage
- **localStorage Key**: `vidverse-editor-elements`
- **Data Format**: JSON with element configurations
- **Browser Limit**: ~5-10MB depending on browser
- **Automatic Cleanup**: Old sessions can be manually cleared

## 🚨 Troubleshooting

### Element Not Selectable
- Ensure `data-editable="true"` attribute is present
- Check element isn't inside another editor element
- Verify element has proper ID

### Drag Not Working
- Make sure element is properly selected (golden border)
- Check that element isn't overlapped by other elements
- Try clicking directly on the element content

### Save Issues
- Browser localStorage might be full
- Check browser console for error messages
- Try clearing old editor data and refreshing

### Performance Issues
- Too many elements can slow down interactions
- Consider removing unused elements
- Check browser developer tools for memory usage

## 🎨 Best Practices

### Organization
- Use descriptive element IDs when possible
- Group related elements with similar z-indexes
- Keep element count reasonable for performance

### Design
- Test positioning across different screen sizes
- Use consistent color schemes with your brand
- Leverage built-in glassmorphism for modern effects

### Workflow
- Save frequently to avoid losing work
- Use undo/redo for experimenting safely
- Take screenshots of layouts before major changes

## 🔄 Updates & Maintenance

### Clearing Data
```javascript
// Clear all editor data
localStorage.removeItem('vidverse-editor-elements');
localStorage.removeItem('vidverse-editor-tutorial');
```

### Backup Data
```javascript
// Export current elements
const data = localStorage.getItem('vidverse-editor-elements');
console.log('Editor backup:', data);
```

### Development
- Editor automatically loads on dev server start
- Changes are reflected immediately
- Use browser dev tools for debugging

---

**Remember**: This editor is designed for development and admin use only. It provides powerful tools for precise visual adjustments and rapid prototyping directly in the browser.

For support or feature requests, check the project documentation or contact the development team.
