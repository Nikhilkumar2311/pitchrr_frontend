/**
 * EditorToolbar — Top Action Bar for Pitch Deck Editor
 *
 * Features:
 * - Deck title (editable inline)
 * - Add element buttons (text, image, shapes)
 * - Undo / Redo
 * - Delete selected element
 * - Save / Unsaved indicator
 * - Keyboard shortcut hints as tooltips
 */

import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Type,
  ImagePlus,
  Square,
  Circle,
  Triangle,
  Minus,
  Star,
  ArrowRight,
  Diamond,
  Undo2,
  Redo2,
  Trash2,
  Save,
  Copy,
  Clipboard,
  ArrowLeft,
} from 'lucide-react';
import { useDeckEditorStore } from '@/store/useDeckEditorStore';
import type { ShapeType } from '@/types/deck-editor.types';

interface EditorToolbarProps {
  onSave?: () => void;
  isSaving?: boolean;
}

export default function EditorToolbar({ onSave, isSaving }: EditorToolbarProps) {
  const navigate = useNavigate();
  const {
    deck,
    selectedElementId,
    isDirty,
    undoStack,
    redoStack,
    clipboard,
    setTitle,
    addText,
    addImage,
    addShape,
    deleteElement,
    undo,
    redo,
    copyElement,
    pasteElement,
  } = useDeckEditorStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        addImage(reader.result);
      }
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  };

  const shapeButtons: { type: ShapeType; icon: React.ReactNode; label: string }[] = [
    { type: 'rectangle', icon: <Square className="w-4 h-4" />, label: 'Rectangle' },
    { type: 'circle', icon: <Circle className="w-4 h-4" />, label: 'Circle' },
    { type: 'triangle', icon: <Triangle className="w-4 h-4" />, label: 'Triangle' },
    { type: 'line', icon: <Minus className="w-4 h-4" />, label: 'Line' },
    { type: 'star', icon: <Star className="w-4 h-4" />, label: 'Star' },
    { type: 'arrow', icon: <ArrowRight className="w-4 h-4" />, label: 'Arrow' },
    { type: 'diamond', icon: <Diamond className="w-4 h-4" />, label: 'Diamond' },
  ];

  return (
    <div className="flex items-center gap-1 px-4 py-2.5 bg-white border-b border-gray-200 flex-wrap">
      {/* Back to list */}
      <button
        onClick={() => navigate('/dashboard/pitch')}
        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors mr-1"
        title="Back to Pitch Decks"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      {/* Deck Title */}
      <input
        type="text"
        value={deck.title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-sm font-semibold text-gray-900 bg-transparent border-none outline-none px-2 py-1 rounded hover:bg-gray-100 focus:bg-gray-100 focus:ring-1 focus:ring-blue-300 w-[180px] transition-colors"
        placeholder="Untitled Deck"
      />

      {/* Unsaved indicator */}
      {isDirty && (
        <span className="text-[10px] text-amber-500 font-medium px-1.5 py-0.5 bg-amber-50 rounded-full">
          Unsaved
        </span>
      )}

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200 mx-2" />

      {/* Add Text */}
      <ToolbarButton
        icon={<Type className="w-4 h-4" />}
        label="Text"
        tooltip="Add Text (T)"
        onClick={() => addText()}
      />

      {/* Add Image */}
      <ToolbarButton
        icon={<ImagePlus className="w-4 h-4" />}
        label="Image"
        tooltip="Add Image (I)"
        onClick={handleImageUpload}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Shape Buttons */}
      {shapeButtons.map(({ type, icon, label }) => (
        <ToolbarButton
          key={type}
          icon={icon}
          tooltip={label}
          onClick={() => addShape(type)}
        />
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Copy / Paste */}
      <ToolbarButton
        icon={<Copy className="w-4 h-4" />}
        tooltip="Copy (Ctrl+C)"
        onClick={copyElement}
        disabled={!selectedElementId}
      />
      <ToolbarButton
        icon={<Clipboard className="w-4 h-4" />}
        tooltip="Paste (Ctrl+V)"
        onClick={pasteElement}
        disabled={!clipboard}
      />

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Undo / Redo */}
      <ToolbarButton
        icon={<Undo2 className="w-4 h-4" />}
        tooltip="Undo (Ctrl+Z)"
        onClick={undo}
        disabled={undoStack.length === 0}
      />
      <ToolbarButton
        icon={<Redo2 className="w-4 h-4" />}
        tooltip="Redo (Ctrl+Shift+Z)"
        onClick={redo}
        disabled={redoStack.length === 0}
      />

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Delete */}
      <ToolbarButton
        icon={<Trash2 className="w-4 h-4" />}
        tooltip="Delete (Del)"
        onClick={() => selectedElementId && deleteElement(selectedElementId)}
        disabled={!selectedElementId}
        variant="danger"
      />

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Save */}
      <button
        onClick={onSave}
        disabled={isSaving || !isDirty}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
          ${isDirty
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-95'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        <Save className="w-3.5 h-3.5" />
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}

// =============================================================================
// TOOLBAR BUTTON COMPONENT
// =============================================================================

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label?: string;
  tooltip?: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
}

function ToolbarButton({
  icon,
  label,
  tooltip,
  onClick,
  disabled,
  variant = 'default',
}: ToolbarButtonProps) {
  const baseClasses = `
    flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all
    disabled:opacity-40 disabled:cursor-not-allowed active:scale-95
  `;

  const variantClasses = {
    default: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    danger: 'text-red-500 hover:bg-red-50 hover:text-red-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
      title={tooltip}
    >
      {icon}
      {label && <span className="hidden sm:inline">{label}</span>}
    </button>
  );
}
