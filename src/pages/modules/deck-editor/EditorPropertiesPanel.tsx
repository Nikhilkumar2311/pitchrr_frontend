/**
 * EditorPropertiesPanel — Contextual Properties Panel
 *
 * Shows contextual controls for the selected element:
 * - No selection: Slide background controls
 * - Text: Font, size, color, alignment, decoration
 * - Image: Border, corner radius, replace
 * - Shape: Fill, stroke, corner radius
 * - Common: Position, size, rotation, opacity, layer order
 *
 * Supports light/dark theme via editor theme tokens.
 */

import { useRef } from 'react';
import {
  Lock, Unlock, Trash2, Copy, ArrowUp, ArrowDown,
  ChevronsUp, ChevronsDown, Eye, EyeOff,
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, ImagePlus,
} from 'lucide-react';
import { useDeckEditorStore } from '@/store/useDeckEditorStore';
import { useEditorTheme } from './editorTheme';
import type { EditorThemeTokens } from './editorTheme';
import {
  FONT_FAMILIES, PRESET_BACKGROUNDS, FONT_SIZE_PRESETS,
} from '@/types/deck-editor.types';
import type {
  TextElement, ImageElement, ShapeElement, SlideElement,
} from '@/types/deck-editor.types';

export default function EditorPropertiesPanel() {
  const t = useEditorTheme((s) => s.tokens);
  const {
    deck, activeSlideIndex, getSelectedElement, updateElement,
    deleteElement, duplicateElement, setSlideBackground,
    bringForward, sendBackward, bringToFront, sendToBack,
  } = useDeckEditorStore();

  const selectedElement = getSelectedElement();
  const slide = deck.slides[activeSlideIndex];

  // =========================================================================
  // NO SELECTION — show slide controls
  // =========================================================================
  if (!selectedElement) {
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: t.panelBg, borderLeft: `1px solid ${t.panelBorder}` }}>
        <PanelHeader t={t} title="Slide" subtitle="Background & settings" />
        <div className="p-3 space-y-4">
          <Section t={t} title="Background">
            <div className="grid grid-cols-6 gap-1.5">
              {PRESET_BACKGROUNDS.map((bg) => {
                const isGrad = bg.includes('gradient');
                return (
                  <button
                    key={bg}
                    onClick={() => setSlideBackground(bg)}
                    className="w-full aspect-square rounded-md transition-all"
                    style={{
                      background: isGrad ? bg : undefined,
                      backgroundColor: !isGrad ? bg : undefined,
                      boxShadow: slide?.background === bg
                        ? `0 0 0 2px ${t.accent}, 0 0 8px ${t.accentGlow}`
                        : `inset 0 0 0 1px ${t.inputBorder}`,
                    }}
                    title={bg}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="color" value={slide?.background?.startsWith('#') ? slide.background : '#FFFFFF'} onChange={(e) => setSlideBackground(e.target.value)} className="w-8 h-8 rounded cursor-pointer" style={{ border: `1px solid ${t.inputBorder}`, background: t.inputBg }} />
              <input type="text" value={slide?.background || '#FFFFFF'} onChange={(e) => setSlideBackground(e.target.value)} className="flex-1 px-2 py-1 text-xs font-mono rounded outline-none transition-all" style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText }} onFocus={(e) => { e.currentTarget.style.borderColor = t.inputFocus; }} onBlur={(e) => { e.currentTarget.style.borderColor = t.inputBorder; }} placeholder="#FFFFFF" />
            </div>
          </Section>
          <Section t={t} title="Info">
            <div className="text-xs space-y-1" style={{ color: t.textSecondary }}>
              <div>Slide {activeSlideIndex + 1} of {deck.slides.length}</div>
              <div>{slide?.elements.length || 0} elements</div>
              <div>Canvas: {deck.canvasWidth} × {deck.canvasHeight}</div>
            </div>
          </Section>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ELEMENT SELECTED
  // =========================================================================
  const updateProp = (updates: Partial<SlideElement>) => {
    updateElement(selectedElement.id, updates);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: t.panelBg, borderLeft: `1px solid ${t.panelBorder}` }}>
      <PanelHeader t={t} title={getElementTitle(selectedElement)} subtitle={selectedElement.type} badge={selectedElement.locked ? '🔒' : undefined} />

      <div className="p-3 space-y-4 pb-20">
        {/* TEXT */}
        {selectedElement.type === 'text' && (
          <Section t={t} title="Typography">
            <select value={(selectedElement as TextElement).fontFamily} onChange={(e) => updateProp({ fontFamily: e.target.value } as any)} className="w-full px-2 py-1.5 text-xs rounded-md outline-none" style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText }}>
              {FONT_FAMILIES.map((f) => <option key={f} value={f} style={{ background: t.optionBg, color: t.optionText }}>{f}</option>)}
            </select>
            <div className="flex items-center gap-2 mt-2">
              <select value={(selectedElement as TextElement).fontSize} onChange={(e) => updateProp({ fontSize: parseInt(e.target.value) } as any)} className="flex-1 px-2 py-1.5 text-xs rounded-md outline-none" style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText }}>
                {FONT_SIZE_PRESETS.map(({ label, value }) => <option key={value} value={value} style={{ background: t.optionBg, color: t.optionText }}>{value}px — {label}</option>)}
              </select>
              <NumInput t={t} value={(selectedElement as TextElement).fontSize} onChange={(v) => updateProp({ fontSize: Math.max(8, v) } as any)} min={8} max={200} className="w-16" />
            </div>
            {/* Style toggles */}
            <div className="flex items-center gap-1 mt-2">
              <Tog t={t} icon={<Bold className="w-3.5 h-3.5" />} active={(selectedElement as TextElement).fontWeight === 'bold'} onClick={() => updateProp({ fontWeight: (selectedElement as TextElement).fontWeight === 'bold' ? 'normal' : 'bold' } as any)} title="Bold" />
              <Tog t={t} icon={<Italic className="w-3.5 h-3.5" />} active={(selectedElement as TextElement).fontStyle === 'italic'} onClick={() => updateProp({ fontStyle: (selectedElement as TextElement).fontStyle === 'italic' ? 'normal' : 'italic' } as any)} title="Italic" />
              <Tog t={t} icon={<Underline className="w-3.5 h-3.5" />} active={(selectedElement as TextElement).textDecoration === 'underline'} onClick={() => updateProp({ textDecoration: (selectedElement as TextElement).textDecoration === 'underline' ? 'none' : 'underline' } as any)} title="Underline" />
              <Tog t={t} icon={<Strikethrough className="w-3.5 h-3.5" />} active={(selectedElement as TextElement).textDecoration === 'line-through'} onClick={() => updateProp({ textDecoration: (selectedElement as TextElement).textDecoration === 'line-through' ? 'none' : 'line-through' } as any)} title="Strikethrough" />
              <div style={{ width: '1px', height: '20px', background: t.divider, margin: '0 4px' }} />
              <Tog t={t} icon={<AlignLeft className="w-3.5 h-3.5" />} active={(selectedElement as TextElement).textAlign === 'left'} onClick={() => updateProp({ textAlign: 'left' } as any)} title="Left" />
              <Tog t={t} icon={<AlignCenter className="w-3.5 h-3.5" />} active={(selectedElement as TextElement).textAlign === 'center'} onClick={() => updateProp({ textAlign: 'center' } as any)} title="Center" />
              <Tog t={t} icon={<AlignRight className="w-3.5 h-3.5" />} active={(selectedElement as TextElement).textAlign === 'right'} onClick={() => updateProp({ textAlign: 'right' } as any)} title="Right" />
            </div>
            <ColorRow t={t} label="Color" value={(selectedElement as TextElement).fill} onChange={(v) => updateProp({ fill: v } as any)} />
            <LabeledNum t={t} label="Line H" value={(selectedElement as TextElement).lineHeight} onChange={(v) => updateProp({ lineHeight: v } as any)} min={0.8} max={3} step={0.1} />
            <LabeledNum t={t} label="Spacing" value={(selectedElement as TextElement).letterSpacing} onChange={(v) => updateProp({ letterSpacing: v } as any)} min={-5} max={20} step={0.5} unit="px" />
          </Section>
        )}

        {/* IMAGE */}
        {selectedElement.type === 'image' && (
          <Section t={t} title="Image">
            <ReplaceBtn t={t} elementId={selectedElement.id} />
            <LabeledNum t={t} label="Radius" value={(selectedElement as ImageElement).cornerRadius} onChange={(v) => updateProp({ cornerRadius: v } as any)} min={0} max={100} unit="px" />
            <div className="flex items-center gap-2">
              <span className="text-xs w-12" style={{ color: t.textSecondary }}>Border</span>
              <input type="color" value={(selectedElement as ImageElement).borderColor} onChange={(e) => updateProp({ borderColor: e.target.value } as any)} className="w-7 h-7 rounded cursor-pointer" style={{ border: `1px solid ${t.inputBorder}` }} />
              <NumInput t={t} value={(selectedElement as ImageElement).borderWidth} onChange={(v) => updateProp({ borderWidth: Math.max(0, v) } as any)} min={0} max={20} className="w-16" />
            </div>
          </Section>
        )}

        {/* SHAPE */}
        {selectedElement.type === 'shape' && (
          <Section t={t} title="Shape">
            <div className="text-xs capitalize mb-2" style={{ color: t.textSecondary }}>{(selectedElement as ShapeElement).shapeType}</div>
            <ColorRow t={t} label="Fill" value={(selectedElement as ShapeElement).fill} onChange={(v) => updateProp({ fill: v } as any)} />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs w-12" style={{ color: t.textSecondary }}>Stroke</span>
              <input type="color" value={(selectedElement as ShapeElement).stroke || '#000000'} onChange={(e) => updateProp({ stroke: e.target.value } as any)} className="w-7 h-7 rounded cursor-pointer" style={{ border: `1px solid ${t.inputBorder}` }} />
              <NumInput t={t} value={(selectedElement as ShapeElement).strokeWidth} onChange={(v) => updateProp({ strokeWidth: Math.max(0, v) } as any)} min={0} max={20} className="w-16" />
            </div>
            {(selectedElement as ShapeElement).shapeType === 'rectangle' && (
              <LabeledNum t={t} label="Radius" value={(selectedElement as ShapeElement).cornerRadius} onChange={(v) => updateProp({ cornerRadius: v } as any)} min={0} max={100} unit="px" />
            )}
          </Section>
        )}

        {/* TRANSFORM */}
        <Section t={t} title="Transform">
          <div className="grid grid-cols-2 gap-2">
            <LabeledNum t={t} label="X" value={Math.round(selectedElement.x)} onChange={(v) => updateProp({ x: v })} />
            <LabeledNum t={t} label="Y" value={Math.round(selectedElement.y)} onChange={(v) => updateProp({ y: v })} />
            <LabeledNum t={t} label="W" value={Math.round(selectedElement.width)} onChange={(v) => updateProp({ width: Math.max(10, v) })} min={10} />
            <LabeledNum t={t} label="H" value={Math.round(selectedElement.height)} onChange={(v) => updateProp({ height: Math.max(5, v) })} min={5} />
          </div>
          <LabeledNum t={t} label="Rotate" value={Math.round(selectedElement.rotation)} onChange={(v) => updateProp({ rotation: v })} min={-360} max={360} unit="°" />
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs w-12" style={{ color: t.textSecondary }}>Opacity</span>
            <input type="range" value={selectedElement.opacity * 100} onChange={(e) => updateProp({ opacity: parseInt(e.target.value) / 100 })} min={0} max={100} className="flex-1 h-1.5 rounded-full accent-indigo-500" style={{ background: t.inputBg }} />
            <span className="text-xs w-10 text-right" style={{ color: t.textSecondary }}>{Math.round(selectedElement.opacity * 100)}%</span>
          </div>
        </Section>

        {/* LAYER */}
        <Section t={t} title="Layer">
          <div className="flex items-center gap-1">
            <LayerBtn t={t} icon={<ChevronsUp className="w-3.5 h-3.5" />} title="Bring to Front" onClick={() => bringToFront(selectedElement.id)} />
            <LayerBtn t={t} icon={<ArrowUp className="w-3.5 h-3.5" />} title="Bring Forward" onClick={() => bringForward(selectedElement.id)} />
            <LayerBtn t={t} icon={<ArrowDown className="w-3.5 h-3.5" />} title="Send Backward" onClick={() => sendBackward(selectedElement.id)} />
            <LayerBtn t={t} icon={<ChevronsDown className="w-3.5 h-3.5" />} title="Send to Back" onClick={() => sendToBack(selectedElement.id)} />
            <div className="flex-1" />
            <button onClick={() => updateProp({ locked: !selectedElement.locked })} className="p-1.5 rounded-md transition-colors text-xs" style={{ background: selectedElement.locked ? t.unsavedBg : t.inputBg, color: selectedElement.locked ? t.unsavedText : t.textSecondary }} title={selectedElement.locked ? 'Unlock' : 'Lock'}>
              {selectedElement.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
            <button onClick={() => updateProp({ visible: !selectedElement.visible })} className="p-1.5 rounded-md transition-colors text-xs" style={{ background: !selectedElement.visible ? t.btnHoverBg : t.inputBg, color: !selectedElement.visible ? t.textMuted : t.textSecondary }} title={selectedElement.visible ? 'Hide' : 'Show'}>
              {selectedElement.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>
        </Section>

        {/* ACTIONS */}
        <Section t={t} title="Actions">
          <div className="flex items-center gap-2">
            <button onClick={() => duplicateElement(selectedElement.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all" style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.textPrimary }}>
              <Copy className="w-3.5 h-3.5" /> Duplicate
            </button>
            <button onClick={() => deleteElement(selectedElement.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all" style={{ background: t.dangerBg, border: `1px solid ${t.dangerBorder}`, color: t.dangerText }}>
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}

// =============================================================================
// HELPERS
// =============================================================================

function PanelHeader({ t, title, subtitle, badge }: { t: EditorThemeTokens; title: string; subtitle?: string; badge?: string }) {
  return (
    <div className="px-3 py-2.5" style={{ borderBottom: `1px solid ${t.panelBorder}`, background: t.panelHeaderBg }}>
      <div className="flex items-center gap-2">
        <h3 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: t.textMuted }}>{title}</h3>
        {badge && <span className="text-xs">{badge}</span>}
      </div>
      {subtitle && <span className="text-[10px] capitalize" style={{ color: t.textMuted }}>{subtitle}</span>}
    </div>
  );
}

function Section({ t, title, children }: { t: EditorThemeTokens; title: string; children: React.ReactNode }) {
  return <div><h4 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: t.accent }}>{title}</h4>{children}</div>;
}

function LabeledNum({ t, label, value, onChange, min, max, step = 1, unit }: { t: EditorThemeTokens; label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; unit?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-12" style={{ color: t.textSecondary }}>{label}</span>
      <input type="number" value={value} onChange={(e) => { let v = parseFloat(e.target.value) || 0; if (min !== undefined) v = Math.max(min, v); if (max !== undefined) v = Math.min(max, v); onChange(v); }} min={min} max={max} step={step} className="flex-1 px-2 py-1 text-xs rounded outline-none transition-all" style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText }} onFocus={(e) => { e.currentTarget.style.borderColor = t.inputFocus; }} onBlur={(e) => { e.currentTarget.style.borderColor = t.inputBorder; }} />
      {unit && <span className="text-[10px] w-6" style={{ color: t.textMuted }}>{unit}</span>}
    </div>
  );
}

function NumInput({ t, value, onChange, min, max, className = '' }: { t: EditorThemeTokens; value: number; onChange: (v: number) => void; min?: number; max?: number; className?: string }) {
  return <input type="number" value={value} onChange={(e) => { let v = parseInt(e.target.value) || 0; if (min !== undefined) v = Math.max(min, v); if (max !== undefined) v = Math.min(max, v); onChange(v); }} min={min} max={max} className={`px-2 py-1 text-xs rounded outline-none transition-all ${className}`} style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText }} onFocus={(e) => { e.currentTarget.style.borderColor = t.inputFocus; }} onBlur={(e) => { e.currentTarget.style.borderColor = t.inputBorder; }} />;
}

function ColorRow({ t, label, value, onChange }: { t: EditorThemeTokens; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-xs w-12" style={{ color: t.textSecondary }}>{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-7 h-7 rounded cursor-pointer" style={{ border: `1px solid ${t.inputBorder}` }} />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 px-2 py-1 text-xs font-mono rounded outline-none transition-all" style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText }} onFocus={(e) => { e.currentTarget.style.borderColor = t.inputFocus; }} onBlur={(e) => { e.currentTarget.style.borderColor = t.inputBorder; }} />
    </div>
  );
}

function Tog({ t, icon, active, onClick, title }: { t: EditorThemeTokens; icon: React.ReactNode; active: boolean; onClick: () => void; title: string }) {
  return <button onClick={onClick} title={title} className="p-1.5 rounded-md transition-all" style={{ background: active ? t.toggleActiveBg : t.inputBg, color: active ? t.toggleActiveText : t.textSecondary, boxShadow: active ? t.toggleActiveShadow : 'none' }}>{icon}</button>;
}

function LayerBtn({ t, icon, title, onClick }: { t: EditorThemeTokens; icon: React.ReactNode; title: string; onClick: () => void }) {
  return <button onClick={onClick} title={title} className="p-1.5 rounded-md transition-colors" style={{ background: t.inputBg, color: t.textSecondary }} onMouseEnter={(e) => { e.currentTarget.style.background = t.btnHoverBg; }} onMouseLeave={(e) => { e.currentTarget.style.background = t.inputBg; }}>{icon}</button>;
}

function ReplaceBtn({ t, elementId }: { t: EditorThemeTokens; elementId: string }) {
  const { updateElement } = useDeckEditorStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const handleReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') updateElement(elementId, { src: reader.result } as any); };
    reader.readAsDataURL(file); e.target.value = '';
  };
  return (
    <>
      <button onClick={() => fileRef.current?.click()} className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all mb-2" style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.textPrimary }}>
        <ImagePlus className="w-3.5 h-3.5" /> Replace Image
      </button>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleReplace} className="hidden" />
    </>
  );
}

function getElementTitle(el: SlideElement): string {
  switch (el.type) {
    case 'text': return (el as TextElement).content.substring(0, 20) || 'Text';
    case 'image': return 'Image';
    case 'shape': return (el as ShapeElement).shapeType;
    default: return 'Element';
  }
}
