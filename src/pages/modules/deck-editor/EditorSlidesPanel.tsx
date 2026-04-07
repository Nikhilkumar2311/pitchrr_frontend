/**
 * EditorSlidesPanel — Slide Thumbnails Panel
 *
 * Features:
 * - Mini slide previews with element dots
 * - Active slide glow ring
 * - Hover actions (duplicate, delete)
 * - Context menu for reordering
 * - Light/Dark theme support
 */

import { useState } from 'react';
import { Plus, Copy, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useDeckEditorStore } from '@/store/useDeckEditorStore';
import { useEditorTheme } from './editorTheme';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/types/deck-editor.types';

export default function EditorSlidesPanel() {
  const t = useEditorTheme((s) => s.tokens);
  const {
    deck, activeSlideIndex, setActiveSlide, addSlide,
    duplicateSlide, deleteSlide, reorderSlides,
  } = useDeckEditorStore();

  const [contextMenu, setContextMenu] = useState<{ slideIndex: number; x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setContextMenu({ slideIndex: index, x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleMoveUp = (index: number) => { if (index > 0) reorderSlides(index, index - 1); closeContextMenu(); };
  const handleMoveDown = (index: number) => { if (index < deck.slides.length - 1) reorderSlides(index, index + 1); closeContextMenu(); };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: t.panelBg, borderRight: `1px solid ${t.panelBorder}` }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: `1px solid ${t.panelBorder}` }}>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: t.textMuted }}>Slides</span>
        <button
          onClick={() => addSlide()}
          className="p-1 rounded-md transition-all"
          style={{ color: t.textMuted }}
          onMouseEnter={(e) => { e.currentTarget.style.background = t.accentLight; e.currentTarget.style.color = t.accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.textMuted; }}
          title="Add Slide"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Slide List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-2">
        {deck.slides.map((slide, index) => {
          const isActive = index === activeSlideIndex;
          const isGradient = slide.background.includes('gradient');
          return (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(index)}
              onContextMenu={(e) => handleContextMenu(e, index)}
              className="group relative w-full rounded-lg overflow-hidden transition-all text-left"
              style={{
                boxShadow: isActive
                  ? `0 0 0 2px ${t.accent}, 0 0 12px ${t.accentGlow}`
                  : `0 0 0 1px ${t.panelBorder}`,
              }}
            >
              <div
                className="relative w-full"
                style={{
                  aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
                  background: isGradient ? slide.background : undefined,
                  backgroundColor: !isGradient ? slide.background : undefined,
                }}
              >
                {/* Element dots */}
                <div className="absolute inset-0 p-1.5">
                  {slide.elements.slice(0, 8).map((el) => (
                    <div
                      key={el.id}
                      className="absolute rounded-sm"
                      style={{
                        left: `${(el.x / CANVAS_WIDTH) * 100}%`,
                        top: `${(el.y / CANVAS_HEIGHT) * 100}%`,
                        width: `${Math.max(8, (el.width / CANVAS_WIDTH) * 100)}%`,
                        height: `${Math.max(4, (el.height / CANVAS_HEIGHT) * 100)}%`,
                        backgroundColor:
                          el.type === 'text' ? 'rgba(99,102,241,0.3)'
                          : el.type === 'shape' ? 'rgba(168,85,247,0.3)'
                          : 'rgba(234,179,8,0.3)',
                        border: '1px solid rgba(128,128,128,0.1)',
                      }}
                    />
                  ))}
                </div>

                {/* Slide number */}
                <div
                  className="absolute bottom-1 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{ background: 'rgba(0,0,0,0.45)', color: '#FFFFFF', backdropFilter: 'blur(4px)' }}
                >
                  {index + 1}
                </div>

                {/* Element count */}
                {slide.elements.length > 0 && (
                  <div className="absolute top-1 right-1.5 text-[8px] font-medium px-1 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)' }}>
                    {slide.elements.length} {slide.elements.length === 1 ? 'el' : 'els'}
                  </div>
                )}
              </div>

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-end justify-center opacity-0 group-hover:opacity-100 pb-2 gap-1">
                <ActionBtn icon={<Copy className="w-3 h-3" />} onClick={(e) => { e.stopPropagation(); duplicateSlide(index); }} title="Duplicate" />
                {deck.slides.length > 1 && (
                  <ActionBtn icon={<Trash2 className="w-3 h-3" />} onClick={(e) => { e.stopPropagation(); deleteSlide(index); }} title="Delete" variant="danger" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Add Slide */}
      <div className="px-2 py-2" style={{ borderTop: `1px solid ${t.panelBorder}` }}>
        <button
          onClick={() => addSlide()}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all"
          style={{ color: t.textMuted, border: `1px dashed ${t.panelBorder}` }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; e.currentTarget.style.background = t.accentLight; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.panelBorder; e.currentTarget.style.color = t.textMuted; e.currentTarget.style.background = 'transparent'; }}
        >
          <Plus className="w-3.5 h-3.5" /> Add Slide
        </button>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-50" onClick={closeContextMenu} />
          <div className="fixed z-50 rounded-xl py-1 min-w-[150px]" style={{ left: contextMenu.x, top: contextMenu.y, background: t.menuBg, border: `1px solid ${t.menuBorder}`, boxShadow: t.menuShadow }}>
            <CtxItem t={t} icon={<Copy className="w-3.5 h-3.5" />} label="Duplicate" onClick={() => { duplicateSlide(contextMenu.slideIndex); closeContextMenu(); }} />
            <CtxItem t={t} icon={<ChevronUp className="w-3.5 h-3.5" />} label="Move Up" onClick={() => handleMoveUp(contextMenu.slideIndex)} disabled={contextMenu.slideIndex === 0} />
            <CtxItem t={t} icon={<ChevronDown className="w-3.5 h-3.5" />} label="Move Down" onClick={() => handleMoveDown(contextMenu.slideIndex)} disabled={contextMenu.slideIndex === deck.slides.length - 1} />
            {deck.slides.length > 1 && (
              <>
                <div style={{ height: '1px', background: t.divider, margin: '4px 0' }} />
                <CtxItem t={t} icon={<Trash2 className="w-3.5 h-3.5" />} label="Delete" onClick={() => { deleteSlide(contextMenu.slideIndex); closeContextMenu(); }} variant="danger" />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ActionBtn({ icon, onClick, title, variant = 'default' }: { icon: React.ReactNode; onClick: (e: React.MouseEvent) => void; title: string; variant?: 'default' | 'danger' }) {
  return (
    <button onClick={onClick} title={title} className="p-1 rounded-md transition-all" style={{ background: variant === 'danger' ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.8)', color: variant === 'danger' ? '#FFF' : '#333', backdropFilter: 'blur(8px)' }}>
      {icon}
    </button>
  );
}

function CtxItem({ t, icon, label, onClick, disabled, variant = 'default' }: { t: any; icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; variant?: 'default' | 'danger' }) {
  const color = variant === 'danger' ? t.dangerText : t.textSecondary;
  return (
    <button
      onClick={onClick} disabled={disabled}
      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors"
      style={{ color, opacity: disabled ? 0.35 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = t.menuHoverBg; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      {icon} {label}
    </button>
  );
}
