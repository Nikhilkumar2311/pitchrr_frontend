/**
 * EditorToolbar — Top Action Bar with Theme Toggle & Export
 *
 * Features:
 * - Deck title (editable inline)
 * - Add element buttons (text, image, shapes)
 * - Undo / Redo / Delete / Copy / Paste
 * - Light/Dark theme toggle
 * - Export PPT (screenshot-based, pixel-perfect)
 * - Save with gradient accent when dirty
 */

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Type, ImagePlus, Square, Circle, Triangle, Minus, Star,
  ArrowRight, Diamond, Undo2, Redo2, Trash2, Save, Copy,
  Clipboard, ArrowLeft, Sun, Moon, Download, Loader2,
} from 'lucide-react';
import { useDeckEditorStore } from '@/store/useDeckEditorStore';
import { useExportDeckAsImages } from '@/hooks/useDeckEditor';
import { useEditorTheme } from './editorTheme';
import type { EditorThemeTokens } from './editorTheme';
import { useSlideCapture } from './useSlideCapture';
import type { ShapeType } from '@/types/deck-editor.types';

interface EditorToolbarProps {
  onSave?: () => void;
  isSaving?: boolean;
}

export default function EditorToolbar({ onSave, isSaving }: EditorToolbarProps) {
  const navigate = useNavigate();
  const t = useEditorTheme((s) => s.tokens);
  const mode = useEditorTheme((s) => s.mode);
  const toggleMode = useEditorTheme((s) => s.toggleMode);

  const {
    deck, selectedElementId, isDirty, undoStack, redoStack, clipboard,
    setTitle, addText, addImage, addShape, deleteElement, undo, redo, copyElement, pasteElement,
  } = useDeckEditorStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const { captureAllSlides, isCapturing } = useSlideCapture();
  const { mutate: exportPptx } = useExportDeckAsImages();

  const handleImageUpload = () => { fileInputRef.current?.click(); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') addImage(reader.result); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleExportPPT = async () => {
    setIsExporting(true);
    try {
      const slideImages = await captureAllSlides();
      exportPptx({
        slideImages,
        title: deck.title || 'Pitch Deck',
      });
    } catch {
      // Error handled by the hook
    } finally {
      setIsExporting(false);
    }
  };

  const exportBusy = isExporting || isCapturing;

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
    <div
      className="flex items-center gap-1 px-4 py-2 flex-wrap"
      style={{ background: t.panelBg, borderBottom: `1px solid ${t.panelBorder}` }}
    >
      {/* Back */}
      <ToolbarBtn t={t} icon={<ArrowLeft className="w-4 h-4" />} tooltip="Back to Pitch Decks" onClick={() => navigate('/dashboard/pitch')} />

      {/* Title */}
      <input
        type="text"
        value={deck.title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-sm font-semibold bg-transparent border-none outline-none px-2 py-1 rounded-lg transition-all w-[200px]"
        style={{ color: t.textPrimary, borderBottom: '1px solid transparent' }}
        onFocus={(e) => { e.currentTarget.style.background = t.inputBg; e.currentTarget.style.borderBottomColor = t.inputFocus; }}
        onBlur={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
        placeholder="Untitled Deck"
      />

      {/* Unsaved */}
      {isDirty && (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: t.unsavedBg, color: t.unsavedText, border: `1px solid ${t.unsavedBorder}` }}>
          Unsaved
        </span>
      )}

      <Divider color={t.divider} />

      <ToolbarBtn t={t} icon={<Type className="w-4 h-4" />} label="Text" tooltip="Add Text (T)" onClick={() => addText()} />
      <ToolbarBtn t={t} icon={<ImagePlus className="w-4 h-4" />} label="Image" tooltip="Add Image" onClick={handleImageUpload} />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      <Divider color={t.divider} />

      {shapeButtons.map(({ type, icon, label }) => (
        <ToolbarBtn key={type} t={t} icon={icon} tooltip={label} onClick={() => addShape(type)} />
      ))}

      <div className="flex-1" />

      {/* Theme toggle */}
      <button
        onClick={toggleMode}
        className="p-1.5 rounded-lg transition-all mr-1"
        style={{ background: t.btnBg, color: t.btnText }}
        onMouseEnter={(e) => { e.currentTarget.style.background = t.accentLight; e.currentTarget.style.color = t.accent; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = t.btnBg; e.currentTarget.style.color = t.btnText; }}
        title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      >
        {mode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>

      <Divider color={t.divider} />

      <ToolbarBtn t={t} icon={<Copy className="w-4 h-4" />} tooltip="Copy (Ctrl+C)" onClick={copyElement} disabled={!selectedElementId} />
      <ToolbarBtn t={t} icon={<Clipboard className="w-4 h-4" />} tooltip="Paste (Ctrl+V)" onClick={pasteElement} disabled={!clipboard} />

      <Divider color={t.divider} />

      <ToolbarBtn t={t} icon={<Undo2 className="w-4 h-4" />} tooltip="Undo (Ctrl+Z)" onClick={undo} disabled={undoStack.length === 0} />
      <ToolbarBtn t={t} icon={<Redo2 className="w-4 h-4" />} tooltip="Redo (Ctrl+Shift+Z)" onClick={redo} disabled={redoStack.length === 0} />

      <Divider color={t.divider} />

      <ToolbarBtn t={t} icon={<Trash2 className="w-4 h-4" />} tooltip="Delete (Del)" onClick={() => selectedElementId && deleteElement(selectedElementId)} disabled={!selectedElementId} variant="danger" />

      <Divider color={t.divider} />

      {/* Export PPT */}
      <button
        onClick={handleExportPPT}
        disabled={exportBusy || deck.slides.length === 0}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
        style={{
          background: t.inputBg,
          border: `1px solid ${t.inputBorder}`,
          color: t.textPrimary,
          cursor: exportBusy ? 'wait' : 'pointer',
          opacity: exportBusy || deck.slides.length === 0 ? 0.5 : 1,
        }}
        title="Export as PowerPoint (pixel-perfect)"
      >
        {exportBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
        {exportBusy ? 'Exporting...' : 'Export PPT'}
      </button>

      {/* Save */}
      <button
        onClick={onSave}
        disabled={isSaving || !isDirty}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
        style={{
          background: isDirty ? t.saveBg : t.saveDisabledBg,
          color: isDirty ? '#FFFFFF' : t.saveDisabledText,
          boxShadow: isDirty ? `0 2px 12px ${t.accentGlow}` : 'none',
          cursor: isSaving || !isDirty ? 'not-allowed' : 'pointer',
          opacity: isSaving || !isDirty ? 0.6 : 1,
        }}
      >
        <Save className="w-3.5 h-3.5" />
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}

// =============================================================================
// HELPERS
// =============================================================================

function Divider({ color }: { color: string }) {
  return <div className="mx-1.5" style={{ width: '1px', height: '20px', background: color }} />;
}

interface ToolbarBtnProps {
  t: EditorThemeTokens;
  icon: React.ReactNode;
  label?: string;
  tooltip?: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
}

function ToolbarBtn({ t, icon, label, tooltip, onClick, disabled, variant = 'default' }: ToolbarBtnProps) {
  const baseColor = variant === 'danger' ? t.dangerText : t.btnText;
  const hoverBg = variant === 'danger' ? t.dangerBg : t.btnHoverBg;
  const hoverColor = variant === 'danger' ? t.dangerText : t.btnHoverText;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
      style={{ color: baseColor, opacity: disabled ? 0.3 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = hoverColor; } }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = baseColor; }}
      title={tooltip}
    >
      {icon}
      {label && <span className="hidden sm:inline">{label}</span>}
    </button>
  );
}
